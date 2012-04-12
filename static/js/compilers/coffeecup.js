var window = {};

var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

if (!process.env) process.env = {};
if (!process.argv) process.argv = [];

require.define("path", function (require, module, exports, __dirname, __filename) {
function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("/coffee-script.js", function (require, module, exports, __dirname, __filename) {
<html>
<head><title>404 Not Found</title></head>
<body bgcolor="white">
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>

});

require.define("/coffeecup.coffee", function (require, module, exports, __dirname, __filename) {
    (function() {
  var cache, coffee, coffeecup, coffeescript_helpers, elements, merge_elements, skeleton;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  coffee = require('./coffee-script');

  if (typeof window !== "undefined" && window !== null) {
    coffeecup = window.coffeecup = {};
  }

  coffeecup.version = '0.3.8';

  coffeecup.doctypes = {
    'default': '<!DOCTYPE html>',
    '5': '<!DOCTYPE html>',
    'xml': '<?xml version="1.0" encoding="utf-8" ?>',
    'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
    'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
    'ce': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd">'
  };

  coffeescript_helpers = "var __slice = Array.prototype.slice;\nvar __hasProp = Object.prototype.hasOwnProperty;\nvar __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\nvar __extends = function(child, parent) {\n  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype;\n  return child; };\nvar __indexOf = Array.prototype.indexOf || function(item) {\n  for (var i = 0, l = this.length; i < l; i++) {\n    if (this[i] === item) return i;\n  } return -1; };".replace(/\n/g, '');

  elements = {
    regular: 'a abbr address article aside audio b bdi bdo blockquote body button\
 canvas caption cite code colgroup datalist dd del details dfn div dl dt em\
 fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup\
 html i iframe ins kbd label legend li map mark menu meter nav noscript object\
 ol optgroup option output p pre progress q rp rt ruby s samp script section\
 select small span strong style sub summary sup table tbody td textarea tfoot\
 th thead time title tr u ul video',
    svg: 'a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion\
 animateTransform circle clipPath color-profile cursor defs desc ellipse\
 feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix\
 feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB\
 feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology\
 feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence\
 filter font font-face font-face-format font-face-name font-face-src\
 font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient\
 marker mask metadata missing-glyph mpath path pattern polygon polyline\
 radialGradient rect script set stop style svg switch symbol text textPath\
 title tref tspan use view vkern',
    "void": 'area base br col command embed hr img input keygen link meta param\
 source track wbr',
    obsolete: 'applet acronym bgsound dir frameset noframes isindex listing\
 nextid noembed plaintext rb strike xmp big blink center font marquee multicol\
 nobr spacer tt',
    obsolete_void: 'basefont frame'
  };

  merge_elements = function() {
    var a, args, element, result, _i, _j, _len, _len2, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    result = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      _ref = elements[a].split(' ');
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        element = _ref[_j];
        if (__indexOf.call(result, element) < 0) result.push(element);
      }
    }
    return result;
  };

  coffeecup.tags = merge_elements('regular', 'obsolete', 'void', 'obsolete_void', 'svg');

  coffeecup.self_closing = merge_elements('void', 'obsolete_void');

  skeleton = function(data) {
    var coffeescript, comment, doctype, h, ie, tag, text, yield, __cc, _ref, _ref2;
    if (data == null) data = {};
    if ((_ref = data.format) == null) data.format = false;
    if ((_ref2 = data.autoescape) == null) data.autoescape = false;
    __cc = {
      buffer: [],
      esc: function(txt) {
        if (data.autoescape) {
          return h(txt);
        } else {
          return txt.toString();
        }
      },
      tabs: 0,
      repeat: function(string, count) {
        return Array(count + 1).join(string);
      },
      indent: function() {
        if (data.format) return text(this.repeat('  ', this.tabs));
      },
      tag: function(name, args) {
        var combo, i, _i, _len;
        combo = [name];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          i = args[_i];
          combo.push(i);
        }
        return tag.apply(data, combo);
      },
      render_idclass: function(str) {
        var c, classes, i, id, _i, _j, _len, _len2, _ref3;
        classes = [];
        _ref3 = str.split('.');
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          i = _ref3[_i];
          if (__indexOf.call(i, '#') >= 0) {
            id = i.replace('#', '');
          } else {
            if (i !== '') classes.push(i);
          }
        }
        if (id) text(" id=\"" + id + "\"");
        if (classes.length > 0) {
          text(" class=\"");
          for (_j = 0, _len2 = classes.length; _j < _len2; _j++) {
            c = classes[_j];
            if (c !== classes[0]) text(' ');
            text(c);
          }
          return text('"');
        }
      },
      render_attrs: function(obj, prefix) {
        var k, v, _results;
        if (prefix == null) prefix = '';
        _results = [];
        for (k in obj) {
          v = obj[k];
          if (typeof v === 'boolean' && v) v = k;
          if (typeof v === 'function') v = "(" + v + ").call(this);";
          if (typeof v === 'object' && !(v instanceof Array)) {
            _results.push(this.render_attrs(v, prefix + k + '-'));
          } else if (v) {
            _results.push(text(" " + (prefix + k) + "=\"" + (this.esc(v)) + "\""));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      },
      render_contents: function(contents, safe) {
        var result;
        if (safe == null) safe = false;
        switch (typeof contents) {
          case 'string':
          case 'number':
          case 'boolean':
            return text(safe ? contents : this.esc(contents));
          case 'function':
            if (data.format) text('\n');
            this.tabs++;
            result = contents.call(data);
            if (typeof result === 'string') {
              this.indent();
              text(safe ? result : this.esc(result));
              if (data.format) text('\n');
            }
            this.tabs--;
            return this.indent();
        }
      },
      render_tag: function(name, idclass, attrs, contents) {
        this.indent();
        text("<" + name);
        if (idclass) this.render_idclass(idclass);
        if (attrs) this.render_attrs(attrs);
        if (__indexOf.call(this.self_closing, name) >= 0) {
          text(' />');
          if (data.format) text('\n');
        } else {
          text('>');
          this.render_contents(contents);
          text("</" + name + ">");
          if (data.format) text('\n');
        }
        return null;
      }
    };
    tag = function() {
      var a, args, attrs, contents, idclass, name, _i, _len;
      name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        a = args[_i];
        switch (typeof a) {
          case 'function':
            contents = a;
            break;
          case 'object':
            attrs = a;
            break;
          case 'number':
          case 'boolean':
            contents = a;
            break;
          case 'string':
            if (args.length === 1) {
              contents = a;
            } else {
              if (a === args[0]) {
                idclass = a;
              } else {
                contents = a;
              }
            }
        }
      }
      return __cc.render_tag(name, idclass, attrs, contents);
    };
    yield = function(f) {
      var old_buffer, temp_buffer;
      temp_buffer = [];
      old_buffer = __cc.buffer;
      __cc.buffer = temp_buffer;
      f();
      __cc.buffer = old_buffer;
      return temp_buffer.join('');
    };
    h = function(txt) {
      return txt.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    doctype = function(type) {
      if (type == null) type = 'default';
      text(__cc.doctypes[type]);
      if (data.format) return text('\n');
    };
    text = function(txt) {
      __cc.buffer.push(txt.toString());
      return null;
    };
    comment = function(cmt) {
      text("<!--" + cmt + "-->");
      if (data.format) return text('\n');
    };
    coffeescript = function(param) {
      switch (typeof param) {
        case 'function':
          return script("" + __cc.coffeescript_helpers + "(" + param + ").call(this);");
        case 'string':
          return script({
            type: 'text/coffeescript'
          }, function() {
            return param;
          });
        case 'object':
          param.type = 'text/coffeescript';
          return script(param);
      }
    };
    ie = function(condition, contents) {
      __cc.indent();
      text("<!--[if " + condition + "]>");
      __cc.render_contents(contents);
      text("<![endif]-->");
      if (data.format) return text('\n');
    };
    return null;
  };

  skeleton = skeleton.toString().replace(/function\s*\(.*\)\s*\{/, '').replace(/return null;\s*\}$/, '');

  skeleton = coffeescript_helpers + skeleton;

  coffeecup.compile = function(template, options) {
    var code, hardcoded_locals, k, t, tag_functions, tags_used, v, _i, _j, _len, _len2, _ref, _ref2;
    if (options == null) options = {};
    if (typeof template === 'function') {
      template = template.toString();
    } else if (typeof template === 'string' && (coffee != null)) {
      template = coffee.compile(template, {
        bare: true
      });
      template = "function(){" + template + "}";
    }
    hardcoded_locals = '';
    if (options.hardcode) {
      _ref = options.hardcode;
      for (k in _ref) {
        v = _ref[k];
        if (typeof v === 'function') {
          hardcoded_locals += "var " + k + " = function(){return (" + v + ").apply(data, arguments);};";
        } else {
          hardcoded_locals += "var " + k + " = " + (JSON.stringify(v)) + ";";
        }
      }
    }
    if (options.optimize && (typeof compiler !== "undefined" && compiler !== null)) {
      return compiler.compile(template, hardcoded_locals, options);
    }
    tag_functions = '';
    tags_used = [];
    _ref2 = coffeecup.tags;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      t = _ref2[_i];
      if (template.indexOf(t) > -1 || hardcoded_locals.indexOf(t) > -1) {
        tags_used.push(t);
      }
    }
    tag_functions += "var " + (tags_used.join(',')) + ";";
    for (_j = 0, _len2 = tags_used.length; _j < _len2; _j++) {
      t = tags_used[_j];
      tag_functions += "" + t + " = function(){return __cc.tag('" + t + "', arguments);};";
    }
    code = tag_functions + hardcoded_locals + skeleton;
    code += "__cc.doctypes = " + (JSON.stringify(coffeecup.doctypes)) + ";";
    code += "__cc.coffeescript_helpers = " + (JSON.stringify(coffeescript_helpers)) + ";";
    code += "__cc.self_closing = " + (JSON.stringify(coffeecup.self_closing)) + ";";
    if (options.locals) code += 'with(data.locals){';
    code += "(" + template + ").call(data);";
    if (options.locals) code += '}';
    code += "return __cc.buffer.join('');";
    return new Function('data', code);
  };

  cache = {};

  coffeecup.render = function(template, data, options) {
    var k, tpl, v, _ref;
    if (data == null) data = {};
    if (options == null) options = {};
    for (k in options) {
      v = options[k];
      data[k] = v;
    }
    if ((_ref = data.cache) == null) data.cache = false;
    if (data.optimize && !data.cache) data.optimize = false;
    if (data.cache && (cache[template] != null)) {
      tpl = cache[template];
    } else if (data.cache) {
      tpl = cache[template] = coffeecup.compile(template, data);
    } else {
      tpl = coffeecup.compile(template, data);
    }
    return tpl(data);
  };

  if (typeof window === "undefined" || window === null) {
    coffeecup.adapters = {
      simple: coffeecup.render,
      meryl: coffeecup.render,
      express: {
        TemplateError: (function() {

          __extends(_Class, Error);

          function _Class(message) {
            this.message = message;
            Error.call(this, this.message);
            Error.captureStackTrace(this, arguments.callee);
          }

          _Class.prototype.name = 'TemplateError';

          return _Class;

        })(),
        compile: function(template, data) {
          var TemplateError, tpl, _ref;
          if ((_ref = data.hardcode) == null) data.hardcode = {};
          data.hardcode.partial = function() {
            return text(this.partial.apply(this, arguments));
          };
          TemplateError = this.TemplateError;
          try {
            tpl = coffeecup.compile(template, data);
          } catch (e) {
            throw new TemplateError("Error compiling " + data.filename + ": " + e.message);
          }
          return function() {
            try {
              return tpl.apply(null, arguments);
            } catch (e) {
              throw new TemplateError("Error rendering " + data.filename + ": " + e.message);
            }
          };
        }
      }
    };
  }

}).call(this);

});
require("/coffeecup.coffee");

function sendResult(resultText) {
    if (typeof resultText === 'undefined' || resultText === null || !resultText.length) return;
    postMessage({
        'type': 'result',
        'resultText': resultText
    });
}
function sendError(errorText) {
    postMessage({
        'type': 'error',
        'errorText': errorText
    });
}
self.addEventListener('message', function(e) {
    try {
        html = coffecup.compile(e.data.code)(e.data.locals);
        sendResult(html);
    } catch (err) {
        sendError(err.message);
    }
}, false);