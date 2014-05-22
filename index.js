var nib     = require('nib');
var stylus  = require('stylus');

module.exports = function(app) {
  app.styleExtensions.push('.styl');
  app.compilers['.styl'] = stylusCompiler;
};

function stylusCompiler(file, filename, options) {
  var css;
  var options = {_imports: []};
  var out = {};
  stylus(file, options)
    .use(nib())
    .set('filename', filename)
    .set('compress', options.compress)
    .set('include css', true)
    .render(function(err, value) {
      if (err) throw err;
      out.css = value;
    });
  out.files = options._imports.map(function(item) {
    return item.path;
  });
  out.files.push(filename);
  return out;
}