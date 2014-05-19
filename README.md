# Derby plugin to add Stylus support

## Usage

Right after creating your Derby app, add:

```js
// Add Stylus support
app.serverUse(module, 'derby-stylus');
```

Make sure this is before any calls to `app.loadViews()`.

After that you can use `*.styl` files instead of `*.css`