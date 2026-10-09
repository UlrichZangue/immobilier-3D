import { mkdir, writeFile } from 'node:fs/promises';
import { css, js, renderViewerHtml } from '@playcanvas/supersplat-viewer';
import { defaultSettings } from '@playcanvas/supersplat-viewer/settings';

const outputDirectory = new URL('../public/viewer/', import.meta.url);
const settings = defaultSettings('environment');

// Exact hero view captured interactively from the viewer.
settings.cameras = [
  {
    initial: {
      position: [2.904416938011165, 0.8492819439924082, -3.1626242931921484],
      target: [8.653873081385061, 0.21588273067333297, -3.257010849771017],
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
