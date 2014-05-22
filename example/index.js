var derby = require('derby');
var app = module.exports = derby.createApp('stylus-example', __filename);

app.serverUse(module, 'derby-jade');
app.serverUse(module, 'derby-stylus');

app.loadViews(__dirname);
app.loadStyles(__dirname);

app.get('/', function(page, model) {
  page.render();
});