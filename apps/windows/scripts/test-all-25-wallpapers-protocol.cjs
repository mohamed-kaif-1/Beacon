const { app, protocol, net } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

protocol.registerSchemesAsPrivileged([
  { scheme: 'beacon-wallpaper', privileges: { secure: true, standard: true, supportFetchAPI: true } },
  { scheme: 'helm-wallpaper', privileges: { secure: true, standard: true, supportFetchAPI: true } }
]);



app.whenReady().then(async () => {
  const wpDir = path.resolve(__dirname, '../resources/wallpapers');
  console.log('Testing wallpapers dir:', wpDir);

  const getBuiltinWallpapersDir = () => {
    if (process.resourcesPath) {
      const p1 = path.join(process.resourcesPath, 'wallpapers');
      if (fs.existsSync(p1)) return p1;
      const p2 = path.join(process.resourcesPath, 'resources/wallpapers');
      if (fs.existsSync(p2)) return p2;
    }
    const devPath = path.join(__dirname, '../resources/wallpapers');
    return devPath;
  };

  protocol.handle('beacon-wallpaper', (request) => {
    const rawPath = request.url.replace(/^(?:beacon-wallpaper|helm-wallpaper):\/\//, '');
    let decodedPath = decodeURIComponent(rawPath);
    if (decodedPath.startsWith('builtin/') || decodedPath.startsWith('builtin:')) {
      const subPath = decodedPath.replace(/^builtin[\/:]/, '');
      decodedPath = path.join(getBuiltinWallpapersDir(), subPath);
    }
    if (!fs.existsSync(decodedPath)) {
      return new Response('File not found: ' + decodedPath, { status: 404 });
    }
    return net.fetch(pathToFileURL(decodedPath).toString());
  });

  const wallpapersTS = fs.readFileSync(path.resolve(__dirname, '../src/features/ambient/wallpapers.ts'), 'utf-8');
  // Extract all urls from wallpapers.ts
  const matches = [...wallpapersTS.matchAll(/url:\s*'([^']+)'/g)].map(m => m[1]);
  console.log(`Found ${matches.length} wallpaper URLs in wallpapers.ts`);

  let failures = 0;
  for (const url of matches) {
    try {
      const res = await net.fetch(url);
      if (res.status !== 200) {
        console.error(`FAIL: ${url} returned status ${res.status}`);
        failures++;
      } else {
        const buf = await res.arrayBuffer();
        if (buf.byteLength < 50000) {
          console.error(`FAIL: ${url} returned suspiciously small size ${buf.byteLength} bytes`);
          failures++;
        } else {
          console.log(`PASS: ${url} (${Math.round(buf.byteLength / 1024)} KB, 200 OK)`);
        }
      }
    } catch (err) {
      console.error(`FAIL: ${url} threw error: ${err.message}`);
      failures++;
    }
  }

  console.log(`\nTOTAL: ${matches.length} tested, ${failures} failures.`);
  if (failures > 0) {
    process.exit(1);
  } else {
    console.log('ALL 25 WALLPAPERS PASS PROTOCOL RESOLUTION!');
    app.quit();
  }
});
