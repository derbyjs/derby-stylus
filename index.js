var stylus  = require('stylus');
var path    = require('path');
var fs      = require('fs');

module.exports = function(app, options = {}) {
  var { includes = [], plugins = [], ...opts } = options;
  
  var stylusRequirePath = require.resolve('stylus');
  var nodeModulesRoot = stylusRequirePath.substring(0, stylusRequirePath.indexOf('/stylus'));

  var includePaths = includes.reduce((acc, moduleId) => {
    var stylusModulePath = path.join(nodeModulesRoot, moduleId);
    return fs.existsSync(stylusModulePath)
      ? [...acc, stylusModulePath]
      : acc;
  }, []);

  function stylusCompiler(file, filename, options) {
    var options = { _imports: [], ...options, ...opts };
    var out = {};
    var compiler = stylus(file, options)
      .set('paths', includePaths)
      .set('filename', filename)
      .set('compress', options.compress)
      .set('include css', true)

    plugins.forEach(plugin => compiler.use(plugin()));
      
    compiler.render(function(err, value) {
        if (err) throw err;
        out.css = value;
      });

    out.files = options._imports.map(function(item) {
      return item.path;
    });
    out.files.push(filename);
    return out;
  }

  app.styleExtensions.push('.styl');
  app.compilers['.styl'] = stylusCompiler;
};
