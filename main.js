const shell = document.querySelector('#viewerShell');
const viewer = document.querySelector('#splatViewer');
const startup = document.querySelector('#startup');
const statusText = document.querySelector('#statusText');
const errorPanel = document.querySelector('#errorPanel');
const errorMessage = document.querySelector('#errorMessage');
const retryButton = document.querySelector('#retryButton');
const fullscreenButton = document.querySelector('#fullscreenButton');

const showError = (message) => {
  startup.classList.add('is-hidden');
  errorMessage.textContent = message || 'Vérifiez que le fichier splat.ply est disponible puis réessayez.';
  errorPanel.hidden = false;
  statusText.textContent = 'Erreur de chargement';
};

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin || event.source !== viewer.contentWindow) return;

  if (event.data?.type === 'splat-ready') {
    startup.classList.add('is-hidden');
    errorPanel.hidden = true;
    statusText.textContent = 'Reconstruction chargée';
  }

  if (event.data?.type === 'splat-error') {
    showError(event.data.message);
  }

  if (event.data === 'requestFullscreen') {
    shell.requestFullscreen?.();
  }

  if (event.data === 'exitFullscreen' && document.fullscreenElement) {
    document.exitFullscreen();
  }
});

viewer.addEventListener('load', () => startup.classList.add('is-hidden'));
viewer.addEventListener('error', () => showError('Le viewer 3D n’a pas pu démarrer.'));

retryButton.addEventListener('click', () => {
  errorPanel.hidden = true;
  startup.classList.remove('is-hidden');
  statusText.textContent = 'Chargement de la reconstruction...';
  viewer.src = viewer.src;
});

fullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await shell.requestFullscreen();
    }
  } catch {
    showError('Le plein écran n’est pas disponible dans ce navigateur.');
  }
});

document.addEventListener('fullscreenchange', () => {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Quitter le plein écran' : 'Afficher en plein écran');
  fullscreenButton.querySelector('.button-label').textContent = isFullscreen ? 'Quitter' : 'Plein écran';
});
