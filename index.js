var stylus  = require('stylus');
var path    = require('path');
var fs      = require('fs');

var stylusUtils = require('stylus/lib/utils');
var join = path.join;
var dirname = path.dirname;
var basename = path.basename;
var relative = path.relative;

var stylusLookupIndex = stylusUtils.lookupIndex;

stylusUtils.lookupIndex = function(name, paths, filename){
  var nodeModuleMatch = paths.find(includePath => includePath.endsWith(name));

  var found = stylusLookupIndex(name, paths, filename);
  
  // check for node_modules/<name>
  if (!found && nodeModuleMatch) {
    found = stylusLookupIndex(nodeModuleMatch, paths, filename);
  }
  return found;
};


module.exports = function(app, options = {}) {
  var { includes = [], plugins = [], ...opts } = options;
  
  var stylusRequirePath = require.resolve('stylus');
  var nodeModulesRoot = stylusRequirePath.substring(0, stylusRequirePath.indexOf('/stylus'));

  var includePaths = includes.reduce((acc, moduleId) => {
    var stylusModulePath = path.join(nodeModulesRoot, moduleId);
    if (fs.existsSync(stylusModulePath)) {
      acc.push(stylusModulePath);
    }
     return acc;
  }, []);

  function stylusCompiler(file, filename, options) {
    var options = { _imports: [], ...options, ...opts };
    var out = {};
    var compiler = stylus(file, options)
      .set('paths', includePaths)
      .set('filename', filename)
      .set('compress', options.compress)
      .set('include css', true)

    plugins.forEach(plugin => {
      var pluginFn = require(plugin);
      compiler.use(pluginFn());
    });
      
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
