# vue-electron-app-starter

## Features

### Vue
```bash
vue create .
```
```
? Check the features needed for your project: Choose Vue version, Babel, TS, Router, Vuex, CSS Pre-processors, Linter
? Choose a version of Vue.js that you want to start the project with 2.x
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) No
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Sass/SCSS (with node-sass)
? Pick a linter / formatter config: Standard
? Pick additional lint features: Lint on save
? Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) N
```
### Electron
```bash
vue add electron-builder
```

## Project command line
```
"serve": "vue-cli-service serve",
"build": "vue-cli-service build",
"lint": "vue-cli-service lint",
"electron:build": "vue-cli-service electron:build",
"electron:serve": "vue-cli-service electron:serve",
"postinstall": "electron-builder install-app-deps",
"postuninstall": "electron-builder install-app-deps"
```

## Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
