# Viewer Gaussian Splat

Viewer statique basé sur le paquet officiel `@playcanvas/supersplat-viewer`.

## Développement

Prérequis : Node.js 20.19 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrir ensuite l’adresse affichée par Vite.

## Production

```bash
npm run build
npm run preview
```

Le dossier `dist/` contient uniquement des fichiers statiques et peut être déployé sur Vercel.

## Passer au format SOG

1. Placer le fichier, par exemple `public/splat.sog`.
2. Dans `scripts/prepare-viewer.mjs`, remplacer `../splat.ply` par `../splat.sog` et `splat.ply` par `splat.sog`.
3. Relancer `npm run build`.

Le PLY et le SOG sont tous deux rendus par le moteur Gaussian Splat de PlayCanvas.
