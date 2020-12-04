# vue cli
## vue create
```bash
vue create .
```
```
Vue CLI v4.5.9
? Please pick a preset: Manually select features
? Check the features needed for your project:
 (*) Choose Vue version
 (*) Babel
 (*) TypeScript
 ( ) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
>(*) CSS Pre-processors
 (*) Linter / Formatter
 ( ) Unit Testing
 ( ) E2E Testing
```
```
Vue CLI v4.5.9
? Please pick a preset: Manually select features
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
## Tune code formation
- code quality : ESLint
- code style : editorconfig or prettier

### Pick a linter / formatter config
```
? Pick a linter / formatter config: (Use arrow keys)
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
> ESLint + Prettier
  TSLint (deprecated)
```
- ESLint with error prevention only 
- ESLint + Airbnb config
  - use `.editorconfig` to format
  - `.eslintrc.js`
  ```js
  module.exports = {
    extends: [
      '@vue/airbnb'
    ]
  };
  ```
- ESLint + Standard config
  - use `.editorconfig` to format
  - `.eslintrc.js`
  ```js
  module.exports = {
    extends: [
      '@vue/standard'
    ],
  }
  ```
- ESLint + Prettier
  - No `.prettierrc.js` file generated, **you should create it manually**.
  ```js
  module.exports = {
    extends: [
      '@vue/prettier',
      '@vue/prettier/@typescript-eslint',
    ],
  }
  ```
- TSLint (deprecated)

> don't use both editorconfig and prettier same time. choose either one is enough.

### Re-state our goal
Make the formatting style of webstorm(your editor or IDE) and code formatter(editorconfig or prettier) consistent.

### Tune editorconfig if used[optional]
`.editorconfig`
```
[*.{js, jsx, ts, tsx, vue}]
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 160
```

### Tune prettier if used[optional]
`.prettierrc.js`
```js
// prettier.config.js or .prettierrc.js
// in webstorm:
// see https://prettier.io/docs/en/webstorm.html
// settings -> Prettier -> Run for files, add .vue, tick `On code format` and `On save`
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
}
```

### Increase webstorm line hard wrap value
> File > Settings... > Editor > Code Style > Hard wrap at

default is 120, change to 160

Maybe you should also set .editorconfig to the same value for visual guides.
```editorconfig
[*.{js, jsx, ts, tsx, vue}]
max_line_length = 160
```

## issues
- Blank screen on builds, but works fine on serve
> This issue is likely caused when Vue Router is operating in history mode. In Electron, it only works in hash mode.


