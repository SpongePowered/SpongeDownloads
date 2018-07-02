# SpongeDownloads
The downloads page for the Sponge project, deployed at https://www.spongepowered.org/downloads/.

## Development
SpongeDownloads is a [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) built using
[Vue.js](https://vuejs.org). It consumes the [Downloads API](https://dl-api.spongepowered.org/v1/) provided by the
[DownloadIndexer](https://github.com/SpongePowered/DownloadIndexer).

### Building
SpongeDownloads is built with [vue-cli 3](https://github.com/vuejs/vue-cli). To build the production page to the `dist`
folder, run:

```
npm run build
```

### Testing locally
To start the development server at http://localhost:8080/downloads, run:

```
npm run serve
```

To check the code for errors using [ESLint](https://eslint.org), run:

```
npm run lint
```
