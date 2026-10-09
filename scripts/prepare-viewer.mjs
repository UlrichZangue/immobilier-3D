import { mkdir, writeFile } from 'node:fs/promises';
import { css, js, renderViewerHtml } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const outputDirectory = new URL('../public/viewer/', import.meta.url);
const settings = defaultSettings('environment');

// Start on the terrace, centered in front of the living-room sliding doors,
// and look straight into the apartment. This reproduces the intended hero
// view with the lounge on the left and dining area on the right.
settings.cameras = [
  {
    initial: {
      position: [-3.3, -1.5, -9.2],
      target: [-3.3, -1.5, -3.8],
      fov: 85
    }
  }
];

const bridge = `
<script>
  window.firstFrame = () => window.parent.postMessage({ type: 'splat-ready' }, location.origin);
  window.addEventListener('error', (event) => {
    window.parent.postMessage({ type: 'splat-error', message: event.message }, location.origin);
  });
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || String(event.reason || 'Erreur de chargement');
    window.parent.postMessage({ type: 'splat-error', message }, location.origin);
  });
</script>`;

const html = renderViewerHtml({
  bootstrap: {
    settings,
    contentUrl: '../splat.ply',
    contentFilename: 'splat.ply'
  },
  baseHref: '/viewer/',
  backgroundColor: [0.035, 0.035, 0.04],
  headExtras: bridge
}).replace(
  'const viewer = await main(canvas, settingsJson, config);',
  `const viewer = await main(canvas, settingsJson, config);
                window.getCameraView = () => {
                    const camera = viewer.cameraManager?.camera;
                    if (!camera) return null;
                    const target = camera.position.clone();
                    camera.calcFocusPoint(target);
                    return {
                        position: [camera.position.x, camera.position.y, camera.position.z],
                        target: [target.x, target.y, target.z],
                        fov: camera.fov
                    };
                };`
);

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', outputDirectory), html),
  writeFile(new URL('index.css', outputDirectory), css),
  writeFile(new URL('index.js', outputDirectory), js)
]);

console.log('SuperSplat viewer assets generated.');
