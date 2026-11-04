const { spawn } = require('child_process')
const net = require('net')
const fs = require('fs')
const path = require('path')
const os = require('os')
const assert = require('assert')

const projectRoot = path.resolve(__dirname, '..')
const hostScript = path.join(projectRoot, 'out', 'main', 'native-host.js')
const PIPE_NAME = '\\\\.\\pipe\\helm-windows-ipc'

function getAppDataHelmDir() {
  const base = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
  return path.join(base, 'Helm')
}

// Helper to run native host with a given input buffer and return its stdout buffer & exit code
function runHostWithBuffer(inputBuffer, timeoutMs = 4000, targetBinary = null, extraArgs = null) {
  return new Promise((resolve, reject) => {
    delete process.env.ELECTRON_RUN_AS_NODE
    const cmd = targetBinary || process.execPath
    const args = extraArgs ? extraArgs : targetBinary ? [] : [hostScript]
    const child = spawn(cmd, args, {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    const stdoutChunks = []
    const stderrChunks = []

    child.stdout.on('data', (c) => stdoutChunks.push(c))
    child.stderr.on('data', (c) => stderrChunks.push(c))

    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`Host execution timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({
        code,
        stdout: Buffer.concat(stdoutChunks),
        stderr: Buffer.concat(stderrChunks).toString('utf-8')
      })
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })

    if (inputBuffer && inputBuffer.length > 0) {
      child.stdin.write(inputBuffer)
    }
    child.stdin.end()
  })
}

function frameMessage(obj) {
  const body = Buffer.from(JSON.stringify(obj), 'utf-8')
  const header = Buffer.alloc(4)
  header.writeUInt32LE(body.length, 0)
  return Buffer.concat([header, body])
}

function parseResponse(stdoutBuffer) {
  assert(stdoutBuffer.length >= 4, `Stdout buffer too short: ${stdoutBuffer.length} bytes`)
  const len = stdoutBuffer.readUInt32LE(0)
  assert.strictEqual(stdoutBuffer.length, 4 + len, `Stdout buffer length mismatch: expected ${4 + len}, got ${stdoutBuffer.length}`)
  const body = stdoutBuffer.subarray(4, 4 + len).toString('utf-8')
  return JSON.parse(body)
}

async function runTests() {
  console.log('--- Starting Helm Windows Native Messaging Protocol Tests ---')

  // TEST 1: Fallback storage when pipe is not running
  console.log('\n[TEST 1] Native host fallback persistence (pipe offline)...')
  const sampleWatches = [
    {
      name: 'Passport Renewal',
      text: 'Passport application in processing',
      quoted: false,
      state: 'attention',
      since: Date.now() - 3600000,
      checked: Date.now(),
      kind: 'government',
      step: 2,
      steps: 4,
      url: 'https://passport.gov.in/status'
    },
    {
      name: 'Amazon Order',
      text: 'Arriving by 5 PM',
      quoted: true,
      state: 'watching',
      since: Date.now() - 7200000,
      checked: Date.now(),
      kind: 'delivery',
      step: 3,
      steps: 4,
      url: 'https://amazon.in/orders'
    }
  ]

  const boardMsg = {
    type: 'watcher:board',
    source: 'test-profile-uuid',
    watches: sampleWatches
  }

  const res1 = await runHostWithBuffer(frameMessage(boardMsg))
  assert.strictEqual(res1.code, 0, `Expected host exit code 0, got ${res1.code}. Stderr: ${res1.stderr}`)
  const reply1 = parseResponse(res1.stdout)
  assert.strictEqual(reply1.ok, true, 'Expected response { ok: true }')

  // Verify file was written to %APPDATA%\Helm\watches.json
  const watchesFile = path.join(getAppDataHelmDir(), 'watches.json')
  assert(fs.existsSync(watchesFile), 'watches.json must exist after fallback save')
  const diskData = JSON.parse(fs.readFileSync(watchesFile, 'utf-8'))
  assert(diskData.sources && diskData.sources['test-profile-uuid'], 'Source must be recorded in watches.json')
  assert.strictEqual(diskData.sources['test-profile-uuid'].watches.length, 2, 'Must contain 2 watches')
  console.log('✓ TEST 1 Passed: Fallback storage wrote watches.json accurately.')

  // TEST 2: Live Named Pipe IPC communication
  console.log('\n[TEST 2] Live Named Pipe IPC delivery...')
  let pipeMessageReceived = null
  const pipeServer = net.createServer((socket) => {
    let buf = ''
    socket.on('data', (d) => {
      buf += d.toString('utf-8')
      if (buf.includes('\n')) {
        pipeMessageReceived = JSON.parse(buf.trim())
        socket.write(JSON.stringify({ ok: true }) + '\n')
      }
    })
  })

  await new Promise((res) => pipeServer.listen(PIPE_NAME, res))

  try {
    const notifyMsg = {
      type: 'watcher:notify',
      id: 'watch-999',
      title: 'Build Complete',
      message: 'GitHub Actions workflow succeeded',
      url: 'https://github.com/jonathanvineet/helm/actions',
      kind: 'build'
    }

    const res2 = await runHostWithBuffer(frameMessage(notifyMsg))
    assert.strictEqual(res2.code, 0, `Expected host exit code 0, got ${res2.code}`)
    const reply2 = parseResponse(res2.stdout)
    assert.strictEqual(reply2.ok, true, 'Expected response { ok: true } over pipe')
    assert(pipeMessageReceived !== null, 'Pipe server must receive message from native host')
    assert.strictEqual(pipeMessageReceived.type, 'watcher:notify')
    assert.strictEqual(pipeMessageReceived.title, 'Build Complete')
    console.log('✓ TEST 2 Passed: Message delivered via Named Pipe and acknowledged.')
  } finally {
    await new Promise((res) => pipeServer.close(res))
  }

  // TEST 3: Max payload size enforcement (> 1MB)
  console.log('\n[TEST 3] Max payload limit validation...')
  const oversizedHeader = Buffer.alloc(4)
  oversizedHeader.writeUInt32LE(2000000, 0) // 2MB length header
  const dummyData = Buffer.alloc(100)
  const res3 = await runHostWithBuffer(Buffer.concat([oversizedHeader, dummyData]))
  const reply3 = parseResponse(res3.stdout)
  assert.strictEqual(reply3.ok, false, 'Expected { ok: false } for oversized message')
  console.log('✓ TEST 3 Passed: Oversized message rejected safely without crash.')

  // TEST 4: Malformed JSON handling
  console.log('\n[TEST 4] Malformed JSON payload rejection...')
  const badBody = Buffer.from('{ malformed_json::: ??? }', 'utf-8')
  const badHeader = Buffer.alloc(4)
  badHeader.writeUInt32LE(badBody.length, 0)
  const res4 = await runHostWithBuffer(Buffer.concat([badHeader, badBody]))
  const reply4 = parseResponse(res4.stdout)
  assert.strictEqual(reply4.ok, false, 'Expected { ok: false } for malformed JSON')
  console.log('✓ TEST 4 Passed: Malformed JSON safely caught with failure response.')

  // TEST 5: Compiled launcher executable test (helm-native-host.exe)
  const hostExe = path.join(projectRoot, 'out', 'main', 'helm-native-host.exe')
  const hostBat = path.join(projectRoot, 'out', 'main', 'helm-native-host.bat')
  if (fs.existsSync(hostExe)) {
    console.log('\n[TEST 5] Testing compiled launcher executable (helm-native-host.exe)...')
    const testExeMsg = {
      type: 'watcher:board',
      source: 'launcher-exe-test',
      watches: [
        {
          name: 'Package Tracking',
          text: 'Out for delivery',
          quoted: false,
          state: 'attention',
          since: Date.now(),
          checked: Date.now(),
          kind: 'delivery',
          step: 3,
          steps: 3
        }
      ]
    }
    try {
      const res5 = await runHostWithBuffer(frameMessage(testExeMsg), 4000, hostExe)
      assert.strictEqual(res5.code, 0, `Expected exe exit code 0, got ${res5.code}. Stderr: ${res5.stderr}`)
      const reply5 = parseResponse(res5.stdout)
      assert.strictEqual(reply5.ok, true, 'Expected { ok: true } from compiled exe')
      console.log('✓ TEST 5 Passed: helm-native-host.exe forwarded stdio and executed flawlessly.')
    } catch (err) {
      if (err.code === 'UNKNOWN' || err.message.includes('blocked') || err.message.includes('EPERM') || err.message.includes('timed out')) {
        console.log('ℹ️ [TEST 5] Native .exe blocked or delayed by OS Application Control Policy in OneDrive. Testing helm-native-host.bat...')
        const resBat = await runHostWithBuffer(frameMessage(testExeMsg), 4000, process.env.COMSPEC || 'cmd.exe', ['/c', hostBat])
        assert.strictEqual(resBat.code, 0, `Expected bat exit code 0, got ${resBat.code}`)
        const replyBat = parseResponse(resBat.stdout)
        assert.strictEqual(replyBat.ok, true, 'Expected { ok: true } from .bat launcher')
        console.log('✓ TEST 5 Passed: helm-native-host.bat executed successfully.')
      } else {
        throw err
      }
    }
  }

  console.log('\n======================================================')
  console.log('ALL PROTOCOL INTEGRATION TESTS PASSED SUCCESSFULLY!')
  console.log('======================================================\n')
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err)
  process.exit(1)
})
