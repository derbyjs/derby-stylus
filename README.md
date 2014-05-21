# Derby plugin to add Stylus support

## Usage

Right after creating your Derby app, add:

```js
// Add Stylus support
app.serverUse(module, 'derby-stylus');
```

Make sure this is before any calls to `app.loadViews()`.

After that you can use `*.styl` files instead of `*.css`


## Example

index.js
```js
var derby = require('derby');
var app = module.exports = derby.createApp('example', __filename);

// Add Stylus support (before loadStyles)
app.serverUse(module, 'derby-stylus');

app.loadViews (__dirname);
app.loadStyles(__dirname);

app.get('/', function(page, model) {
  page.render();
});
```

index.html
```html
<Body:>
  <h1>Hello world</h1>
```

index.styl
```stylus
body
  padding 0
  margin 0
```
