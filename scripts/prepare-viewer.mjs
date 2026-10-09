import { mkdir, writeFile } from 'node:fs/promises';
import { css, js, renderViewerHtml } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const outputDirectory = new URL('../public/viewer/', import.meta.url);
const settings = defaultSettings('environment');

// Start the visit from inside the apartment instead of the scan origin,
// which sits near its outer edge. Keep the target at eye level so the first
// view looks across the room rather than toward the floor or ceiling.
settings.cameras = [
  {
    initial: {
      position: [-7, -1.3, -4.7],
      target: [-5, -1.3, -4.7],
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
});

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', outputDirectory), html),
  writeFile(new URL('index.css', outputDirectory), css),
  writeFile(new URL('index.js', outputDirectory), js)
]);

console.log('SuperSplat viewer assets generated.');
