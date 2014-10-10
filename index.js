var CleanCSS = require('clean-css');
var autoprefixer = require('autoprefixer');
var stylus  = require('stylus');
var findup = require('findup-sync');
var path = require('path');

module.exports = function(app) {
  app.styleExtensions.push('.styl');
  app.compilers['.styl'] = getStylusCompiler(app);
};

function getStylusCompiler(app) {

  var includeComponentStyles = function (s){
    for (var viewName in app.views.nameMap){

      var view = app.views.nameMap[viewName];
      if (!view.componentFactory) continue;

      var style = view.componentFactory.constructor.prototype.style;
      if (style) s.import(style);

    }
  };

  return function(file, filename, options) {
    options || (options = {});

    // Default browsers for autoprefixer
    options.browsers || (options.browsers = ['last 2 version', '> 1%', 'ie 9', 'android 4']);

    options._imports || (options._imports = []);
    var out = {};

    // 'file' is not actually being used. We need to alter the order component
    // styles are plugged in so we import the specified file before
    // importing the components' styles
    var s = stylus('', options)
      .set('filename', filename)
      .set('include css', true);

    // Add data-uri() function to embed images and fonts as Data URIs.
    // Find and add nearest 'public' folder to paths.
    options.paths || (options.paths = []);
    var assetsDir = findup('public', { cwd: path.dirname(filename) });
    if (assetsDir) options.paths.push(assetsDir);
    s.set('paths', options.paths);
    s.define('data-uri', stylus.url({ paths: options.paths }));

    // Add actual specified stylesheets file
    s.import(filename);

    // Plug in styles from components while keeping the ability to
    // use global variables/helpers/etc defined in the main stylesheet
    s.use(includeComponentStyles);

    s.render(function(err, value) {
      if (err) throw err;
      out.css = value;
    });

    // Get all compiled files to watch for their changes
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
}