var CleanCSS = require('clean-css');
var autoprefixer = require('autoprefixer');
var stylus  = require('stylus');
var findup = require('findup-sync');
var path = require('path');

module.exports = function(app) {
  app.styleExtensions.push('.styl');
  app.compilers['.styl'] = stylusCompiler;
};

function stylusCompiler(file, filename, options) {
  options || (options = {});
  options.browsers || (options.browsers = ['last 2 version', '> 1%', 'ie 9', 'android 4']);
  options._imports || (options._imports = []);
  var out = {};
  var s = stylus(file, options)
    .set('filename', filename)
    .set('include css', true);

  // Add data-uri() function to embed images and fonts as Data URIs.
  // It finds nearest 'public' folder unless specified.
  if (!options.paths || options.paths.length === 0) {
    var assetsDir = findup('public', { cwd: path.dirname(filename) });
    if (assetsDir) options.paths = [assetsDir]
  }
  if (options.paths) {
    s.set('paths', options.paths);
    s.define('data-uri', stylus.url({ paths: options.paths }));
  }

  s.render(function(err, value) {
    if (err) throw err;
    out.css = value;
  });
  out.files = options._imports.map(function(item) {
    return item.path;
  });
  out.files.push(filename);
  // Add vendor prefixes
  out.css = autoprefixer(options.browsers).process(out.css).css;
  // Minify
  if (options.compress) {
    out.css = new CleanCSS().minify(out.css);
  }
  return out;
}
