# SpongeDownloads
The downloads page for the Sponge project, using [System Of A Download](https://github.com/SpongePowered/SystemOfADownload.git) as the data source for the download lists.

## Development

SpongeDownloads is a [single-page application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) built using
[Vue.js](https://vuejs.org), currently version 2.6. 

To set up your workspace, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/) version 16 (at the time of writing, v16.13.0 was in use); and
* [npm](https://www.npmjs.com/) v8.1 or later.

Clone this repository, navigate to the root directory in your favourite shell and run `npm i`.

### Building

SpongeDownloads is built with [vue-cli 4](https://github.com/vuejs/vue-cli). To build the production page to the `dist`
folder, run:

```
npm run build
```

This will produce a production version of SpongeDownloads, which by default, will point at the SOAD staging server and assumes a public path of `/downloads`. You can set the following environment variables in your shell prior to building to change these values:

* `VUE_APP_PUBLIC_PATH`: set the public path
* `VUE_APP_API_URL`: set the API URL to point to

### Testing locally

To start the development server at http://localhost:8080/downloads, run:

```
npm run serve
```

To check the code for errors using [ESLint](https://eslint.org), run:

```
npm run lint
```
