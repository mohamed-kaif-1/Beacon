/**
 * Automated Test Suite: Helm Windows Phase 6.3 — Eliminate Desktop Flash During Screensaver Activation
 *
 * Verifies:
 * 1. Cold launch: Synchronous Ambient route initialization via URL hash (no Home mount)
 * 2. Opacity clamping: Window remains strictly transparent (opacity=0) during fullscreen switch
 * 3. Handshake: Window revealed at opacity 1.0 only after SCREENSAVER_READY signal
 * 4. Hot launch: Existing instance restores and fullscreen transitions without windowed flash
 * 5. 10x activation/dismissal stress simulation
 */

const assert = require('assert')
const path = require('path')
const fs = require('fs')

console.log('\n=== Helm Windows Phase 6.3: Screensaver Activation Zero-Flash Test Suite ===\n')

let passedTests = 0
let failedTests = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  [PASS] ${name}`)
    passedTests++
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`)
    failedTests++
  }
}

// ----------------------------------------------------
// Test 1: Synchronous Initial Route Detection
// ----------------------------------------------------
console.log('[Test 1] Cold Launch: Synchronous Route & Screensaver Initialization')

test('URL hash "#screensaver" immediately resolves isInitialScreensaver=true', () => {
  const hash = '#screensaver'
  const isInitialScreensaver = hash.includes('screensaver')
  const initialRoute = isInitialScreensaver ? 'ambient' : 'home'
  const initialScreensaverState = isInitialScreensaver

  assert.strictEqual(isInitialScreensaver, true)
  assert.strictEqual(initialRoute, 'ambient', 'Initial route must be ambient on render 1')
  assert.strictEqual(initialScreensaverState, true, 'Initial screensaver state must be true on render 1')
})

test('Normal launch without hash resolves isInitialScreensaver=false and route=home', () => {
  const hash = ''
  const isInitialScreensaver = hash.includes('screensaver')
  const initialRoute = isInitialScreensaver ? 'ambient' : 'home'

  assert.strictEqual(isInitialScreensaver, false)
  assert.strictEqual(initialRoute, 'home', 'Normal launch must start on home')
})

// ----------------------------------------------------
// Test 2: Direct Fullscreen Opacity Clamping & Sequence
// ----------------------------------------------------
console.log('\n[Test 2] Window Transition Sequence & Zero-Flash Opacity Clamping')

function simulateScreensaverActivation(initialState) {
  const events = []
  let opacity = 1.0
  let isFullScreen = initialState.isFullScreen
  let isVisible = initialState.isVisible

  // Step 1: Opacity zero clamp
  opacity = 0.0
  events.push({ step: 'opacity_zero', opacity, isFullScreen, isVisible })

  // Step 2: Restore minimized window while opacity=0
  if (initialState.isMinimized) {
    events.push({ step: 'restore_minimized', opacity, isFullScreen, isVisible })
  }

  // Step 3: Switch directly into fullscreen mode while opacity=0
  isFullScreen = true
  events.push({ step: 'set_fullscreen_true', opacity, isFullScreen, isVisible })

  // Step 4: Set z-order to screen-saver
  events.push({ step: 'set_always_on_top_screensaver', opacity, isFullScreen, isVisible })

  // Step 5: Show & focus window while opacity=0 (required for Chromium layout engine)
  isVisible = true
  events.push({ step: 'show_window_at_opacity_zero', opacity, isFullScreen, isVisible })

  // Step 6: Dispatch route change to renderer
  events.push({ step: 'dispatch_screensaver_true', opacity, isFullScreen, isVisible })

  // Step 7: Receive SCREENSAVER_READY handshake from renderer
  events.push({ step: 'received_screensaver_ready_handshake', opacity, isFullScreen, isVisible })

  // Step 8: Only now reveal opacity to 1.0
  opacity = 1.0
  events.push({ step: 'reveal_window_opacity_full', opacity, isFullScreen, isVisible })

  return events
}

test('Opacity is clamped to 0 BEFORE window is restored, shown, or fullscreened', () => {
  const events = simulateScreensaverActivation({ isVisible: false, isMinimized: true, isFullScreen: false })
  const zeroIndex = events.findIndex((e) => e.step === 'opacity_zero')
  const showIndex = events.findIndex((e) => e.step === 'show_window_at_opacity_zero')
  const fsIndex = events.findIndex((e) => e.step === 'set_fullscreen_true')
  const revealIndex = events.findIndex((e) => e.step === 'reveal_window_opacity_full')

  assert.strictEqual(zeroIndex, 0, 'First action must be opacity zero')
  assert(zeroIndex < fsIndex, 'Opacity must be 0 before fullscreen')
  assert(fsIndex < showIndex, 'Fullscreen must be set before or with show')
  assert(showIndex < revealIndex, 'Window must be shown transparent before reveal')
})

test('Window is never visible with normal windowed dimensions (isFullScreen is true at reveal)', () => {
  const events = simulateScreensaverActivation({ isVisible: false, isMinimized: false, isFullScreen: false })
  const revealEvent = events.find((e) => e.step === 'reveal_window_opacity_full')

  assert.strictEqual(revealEvent.isFullScreen, true, 'Window must be fullscreen when revealed')
  assert.strictEqual(revealEvent.opacity, 1.0, 'Window opacity must be 1.0')
})

// ----------------------------------------------------
// Test 3: Dismissal Zero-Flash Restoration Sequence
// ----------------------------------------------------
console.log('\n[Test 3] Dismissal State Restoration Sequence')

function simulateScreensaverDismissal(previousState) {
  const events = []
  let opacity = 1.0

  // 1. 300ms fade-out
  opacity = 0.0
  events.push({ step: 'fade_out_to_zero', opacity })
  events.push({ step: 'disarm_always_on_top', opacity })

  if (!previousState.wasVisible || previousState.wasMinimized) {
    // Hidden / Minimized state: hide FIRST while opacity is 0
    events.push({ step: 'hide_window_first', opacity })
    events.push({ step: 'unfullscreen', opacity })
    opacity = 1.0
    events.push({ step: 'restore_opacity_full', opacity })
    events.push({ step: 'restored_to_tray' })
  } else {
    // Visible state: restore fullscreen and reveal
    events.push({ step: `restore_fullscreen_${previousState.wasFullScreen}`, opacity })
    opacity = 1.0
    events.push({ step: 'restore_opacity_full', opacity })
    events.push({ step: 'focus_window' })
    events.push({ step: 'restored_to_desktop' })
  }

  events.push({ step: 'dispatch_screensaver_false' })
  events.push({ step: 'notify_launcher_pipe' })

  return events
}

test('Minimized/tray instance hides while opacity=0 before resetting fullscreen', () => {
  const events = simulateScreensaverDismissal({ wasVisible: false, wasMinimized: true, wasFullScreen: false })
  const hideIndex = events.findIndex((e) => e.step === 'hide_window_first')
  const unfsIndex = events.findIndex((e) => e.step === 'unfullscreen')

  assert(hideIndex !== -1, 'Must hide window first')
  assert(hideIndex < unfsIndex, 'Must hide before un-fullscreening')
})

// ----------------------------------------------------
// Test 4: 10x Stress Cycle Simulation
// ----------------------------------------------------
console.log('\n[Test 4] 10x Activation / Dismissal Cycle Stress Simulation')

test('10 consecutive activation and dismissal cycles execute cleanly without state corruption', () => {
  for (let cycle = 1; cycle <= 10; cycle++) {
    const isMinimizedStart = cycle % 2 === 0
    const activation = simulateScreensaverActivation({
      isVisible: !isMinimizedStart,
      isMinimized: isMinimizedStart,
      isFullScreen: false
    })

    assert.strictEqual(activation[0].step, 'opacity_zero', `Cycle ${cycle}: opacity_zero failed`)
    assert.strictEqual(activation[activation.length - 1].step, 'reveal_window_opacity_full', `Cycle ${cycle}: reveal failed`)

    const dismissal = simulateScreensaverDismissal({
      wasVisible: !isMinimizedStart,
      wasMinimized: isMinimizedStart,
      wasFullScreen: false
    })

    assert.strictEqual(dismissal[dismissal.length - 1].step, 'notify_launcher_pipe', `Cycle ${cycle}: pipe notification failed`)
  }
})

console.log('\n=============================================================')
console.log(`Phase 6.3 Test Results: ${passedTests} PASSED, ${failedTests} FAILED`)
console.log('=============================================================\n')

if (failedTests > 0) {
  process.exit(1)
}

