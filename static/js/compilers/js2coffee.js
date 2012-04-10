importScripts('coffeescript.base.js');

//     Underscore.js 1.3.1
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape || noMatch, function(match, code) {
           return "',_.escape(" + unescape(code) + "),'";
         })
         .replace(c.interpolate || noMatch, function(match, code) {
           return "'," + unescape(code) + ",'";
         })
         .replace(c.evaluate || noMatch, function(match, code) {
           return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

if (typeof module == 'undefined') {
    this.Narcissus = new Object;
}
(function () {
    var narcissus = {
        options: {
            version: 185,
        },
        hostGlobal: this
    };
    Narcissus = narcissus;
})();
Narcissus.definitions = (function () {
    var tokens = ["END", "\n", ";", ",", "=", "?", ":", "CONDITIONAL", "||", "&&", "|", "^", "&", "==", "!=", "===", "!==", "<", "<=", ">=", ">", "<<", ">>", ">>>", "+", "-", "*", "/", "%", "!", "~", "UNARY_PLUS", "UNARY_MINUS", "++", "--", ".", "[", "]", "{", "}", "(", ")", "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX", "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER", "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL", "IDENTIFIER", "NUMBER", "STRING", "REGEXP", "break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "false", "finally", "for", "function", "if", "in", "instanceof", "let", "new", "null", "return", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "yield", "while", "with", ];
    var statementStartTokens = ["break", "const", "continue", "debugger", "do", "for", "if", "return", "switch", "throw", "try", "var", "yield", "while", "with", ];
    var opTypeNames = {
        '\n': "NEWLINE",
        ';': "SEMICOLON",
        ',': "COMMA",
        '?': "HOOK",
        ':': "COLON",
        '||': "OR",
        '&&': "AND",
        '|': "BITWISE_OR",
        '^': "BITWISE_XOR",
        '&': "BITWISE_AND",
        '===': "STRICT_EQ",
        '==': "EQ",
        '=': "ASSIGN",
        '!==': "STRICT_NE",
        '!=': "NE",
        '<<': "LSH",
        '<=': "LE",
        '<': "LT",
        '>>>': "URSH",
        '>>': "RSH",
        '>=': "GE",
        '>': "GT",
        '++': "INCREMENT",
        '--': "DECREMENT",
        '+': "PLUS",
        '-': "MINUS",
        '*': "MUL",
        '/': "DIV",
        '%': "MOD",
        '!': "NOT",
        '~': "BITWISE_NOT",
        '.': "DOT",
        '[': "LEFT_BRACKET",
        ']': "RIGHT_BRACKET",
        '{': "LEFT_CURLY",
        '}': "RIGHT_CURLY",
        '(': "LEFT_PAREN",
        ')': "RIGHT_PAREN"
    };
    var keywords = {
        __proto__: null
    };
    var tokenIds = {};
    var consts = "const ";
    for (var i = 0, j = tokens.length; i < j; i++) {
        if (i > 0) consts += ", ";
        var t = tokens[i];
        var name;
        if (/^[a-z]/.test(t)) {
            name = t.toUpperCase();
            keywords[t] = i;
        } else {
            name = (/^\W/.test(t) ? opTypeNames[t] : t);
        }
        consts += name + " = " + i;
        tokenIds[name] = i;
        tokens[t] = i;
    }
    consts += ";";
    var isStatementStartCode = {
        __proto__: null
    };
    for (i = 0, j = statementStartTokens.length; i < j; i++)
    isStatementStartCode[keywords[statementStartTokens[i]]] = true;
    var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];
    for (i = 0, j = assignOps.length; i < j; i++) {
        t = assignOps[i];
        assignOps[t] = tokens[t];
    }

    function defineGetter(obj, prop, fn, dontDelete, dontEnum) {
        Object.defineProperty(obj, prop, {
            get: fn,
            configurable: !dontDelete,
            enumerable: !dontEnum
        });
    }

    function defineProperty(obj, prop, val, dontDelete, readOnly, dontEnum) {
        Object.defineProperty(obj, prop, {
            value: val,
            writable: !readOnly,
            configurable: !dontDelete,
            enumerable: !dontEnum
        });
    }

    function isNativeCode(fn) {
        return ((typeof fn) === "function") && fn.toString().match(/\[native code\]/);
    }

    function getPropertyDescriptor(obj, name) {
        while (obj) {
            if (({}).hasOwnProperty.call(obj, name)) return Object.getOwnPropertyDescriptor(obj, name);
            obj = Object.getPrototypeOf(obj);
        }
    }

    function getOwnProperties(obj) {
        var map = {};
        for (var name in Object.getOwnPropertyNames(obj))
        map[name] = Object.getOwnPropertyDescriptor(obj, name);
        return map;
    }

    function makePassthruHandler(obj) {
        return {
            getOwnPropertyDescriptor: function (name) {
                var desc = Object.getOwnPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getPropertyDescriptor: function (name) {
                var desc = getPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getOwnPropertyNames: function () {
                return Object.getOwnPropertyNames(obj);
            },
            defineProperty: function (name, desc) {
                Object.defineProperty(obj, name, desc);
            },
            "delete": function (name) {
                return delete obj[name];
            },
            fix: function () {
                if (Object.isFrozen(obj)) {
                    return getOwnProperties(obj);
                }
                return undefined;
            },
            has: function (name) {
                return name in obj;
            },
            hasOwn: function (name) {
                return ({}).hasOwnProperty.call(obj, name);
            },
            get: function (receiver, name) {
                return obj[name];
            },
            set: function (receiver, name, val) {
                obj[name] = val;
                return true;
            },
            enumerate: function () {
                var result = [];
                for (name in obj) {
                    result.push(name);
                };
                return result;
            },
            keys: function () {
                return Object.keys(obj);
            }
        };
    }

    function noPropFound() {
        return undefined;
    }
    var hasOwnProperty = ({}).hasOwnProperty;

    function StringMap() {
        this.table = Object.create(null, {});
        this.size = 0;
    }
    StringMap.prototype = {
        has: function (x) {
            return hasOwnProperty.call(this.table, x);
        },
        set: function (x, v) {
            if (!hasOwnProperty.call(this.table, x)) this.size++;
            this.table[x] = v;
        },
        get: function (x) {
            return this.table[x];
        },
        getDef: function (x, thunk) {
            if (!hasOwnProperty.call(this.table, x)) {
                this.size++;
                this.table[x] = thunk();
            }
            return this.table[x];
        },
        forEach: function (f) {
            var table = this.table;
            for (var key in table)
            f.call(this, key, table[key]);
        },
        toString: function () {
            return "[object StringMap]"
        }
    };

    function Stack(elts) {
        this.elts = elts || null;
    }
    Stack.prototype = {
        push: function (x) {
            return new Stack({
                top: x,
                rest: this.elts
            });
        },
        top: function () {
            if (!this.elts) throw new Error("empty stack");
            return this.elts.top;
        },
        isEmpty: function () {
            return this.top === null;
        },
        find: function (test) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                if (test(elts.top)) return elts.top;
            }
            return null;
        },
        has: function (x) {
            return Boolean(this.find(function (elt) {
                return elt === x
            }));
        },
        forEach: function (f) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                f(elts.top);
            }
        }
    };
    return {
        tokens: tokens,
        opTypeNames: opTypeNames,
        keywords: keywords,
        isStatementStartCode: isStatementStartCode,
        tokenIds: tokenIds,
        consts: consts,
        assignOps: assignOps,
        defineGetter: defineGetter,
        defineProperty: defineProperty,
        isNativeCode: isNativeCode,
        makePassthruHandler: makePassthruHandler,
        noPropFound: noPropFound,
        StringMap: StringMap,
        Stack: Stack
    };
}());
Narcissus.lexer = (function () {
    var definitions = Narcissus.definitions;
    eval(definitions.consts);
    var opTokens = {};
    for (var op in definitions.opTypeNames) {
        if (op === '\n' || op === '.') continue;
        var node = opTokens;
        for (var i = 0; i < op.length; i++) {
            var ch = op[i];
            if (!(ch in node)) node[ch] = {};
            node = node[ch];
            node.op = op;
        }
    }

    function Tokenizer(s, f, l) {
        this.cursor = 0;
        this.source = String(s);
        this.tokens = [];
        this.tokenIndex = 0;
        this.lookahead = 0;
        this.scanNewlines = false;
        this.unexpectedEOF = false;
        this.filename = f || "";
        this.lineno = l || 1;
    }
    Tokenizer.prototype = {
        get done() {
            return this.peek(true) === END;
        }, get token() {
            return this.tokens[this.tokenIndex];
        }, match: function (tt, scanOperand) {
            return this.get(scanOperand) === tt || this.unget();
        },
        mustMatch: function (tt) {
            if (!this.match(tt)) {
                throw this.newSyntaxError("Missing " + definitions.tokens[tt].toLowerCase());
            }
            return this.token;
        },
        peek: function (scanOperand) {
            var tt, next;
            if (this.lookahead) {
                next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
                tt = (this.scanNewlines && next.lineno !== this.lineno) ? NEWLINE : next.type;
            } else {
                tt = this.get(scanOperand);
                this.unget();
            }
            return tt;
        },
        peekOnSameLine: function (scanOperand) {
            this.scanNewlines = true;
            var tt = this.peek(scanOperand);
            this.scanNewlines = false;
            return tt;
        },
        skip: function () {
            var input = this.source;
            for (;;) {
                var ch = input[this.cursor++];
                var next = input[this.cursor];
                if (ch === '\n' && !this.scanNewlines) {
                    this.lineno++;
                } else if (ch === '/' && next === '*') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined) throw this.newSyntaxError("Unterminated comment");
                        if (ch === '*') {
                            next = input[this.cursor];
                            if (next === '/') {
                                this.cursor++;
                                break;
                            }
                        } else if (ch === '\n') {
                            this.lineno++;
                        }
                    }
                } else if (ch === '/' && next === '/') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined) return;
                        if (ch === '\n') {
                            this.lineno++;
                            break;
                        }
                    }
                } else if (ch !== ' ' && ch !== '\t') {
                    this.cursor--;
                    return;
                }
            }
        },
        lexExponent: function () {
            var input = this.source;
            var next = input[this.cursor];
            if (next === 'e' || next === 'E') {
                this.cursor++;
                ch = input[this.cursor++];
                if (ch === '+' || ch === '-') ch = input[this.cursor++];
                if (ch < '0' || ch > '9') throw this.newSyntaxError("Missing exponent");
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                return true;
            }
            return false;
        },
        lexZeroNumber: function (ch) {
            var token = this.token,
                input = this.source;
            token.type = NUMBER;
            ch = input[this.cursor++];
            if (ch === '.') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.value = parseFloat(token.start, this.cursor);
            } else if (ch === 'x' || ch === 'X') {
                do {
                    ch = input[this.cursor++];
                } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') || (ch >= 'A' && ch <= 'F'));
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else if (ch >= '0' && ch <= '7') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '7');
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else {
                this.cursor--;
                this.lexExponent();
                token.value = 0;
            }
        },
        lexNumber: function (ch) {
            var token = this.token,
                input = this.source;
            token.type = NUMBER;
            var floating = false;
            do {
                ch = input[this.cursor++];
                if (ch === '.' && !floating) {
                    floating = true;
                    ch = input[this.cursor++];
                }
            } while (ch >= '0' && ch <= '9');
            this.cursor--;
            var exponent = this.lexExponent();
            floating = floating || exponent;
            var str = input.substring(token.start, this.cursor);
            token.value = floating ? parseFloat(str) : parseInt(str);
        },
        lexDot: function (ch) {
            var token = this.token,
                input = this.source;
            var next = input[this.cursor];
            if (next >= '0' && next <= '9') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.type = NUMBER;
                token.value = parseFloat(token.start, this.cursor);
            } else {
                token.type = DOT;
                token.assignOp = null;
                token.value = '.';
            }
        },
        lexString: function (ch) {
            var token = this.token,
                input = this.source;
            token.type = STRING;
            var hasEscapes = false;
            var delim = ch;
            while ((ch = input[this.cursor++]) !== delim) {
                if (this.cursor >= input.length) throw this.newSyntaxError("Unterminated string literal");
                if (ch === '\\') {
                    hasEscapes = true;
                    if (++this.cursor == input.length) throw this.newSyntaxError("Unterminated string literal");
                }
            }
            token.value = hasEscapes ? eval(input.substring(token.start, this.cursor)) : input.substring(token.start + 1, this.cursor - 1);
        },
        lexRegExp: function (ch) {
            var token = this.token,
                input = this.source;
            token.type = REGEXP;
            do {
                ch = input[this.cursor++];
                if (ch === '\\') {
                    this.cursor++;
                } else if (ch === '[') {
                    do {
                        if (ch === undefined) throw this.newSyntaxError("Unterminated character class");
                        if (ch === '\\') this.cursor++;
                        ch = input[this.cursor++];
                    } while (ch !== ']');
                } else if (ch === undefined) {
                    throw this.newSyntaxError("Unterminated regex");
                }
            } while (ch !== '/');
            do {
                ch = input[this.cursor++];
            } while (ch >= 'a' && ch <= 'z');
            this.cursor--;
            token.value = eval(input.substring(token.start, this.cursor));
        },
        lexOp: function (ch) {
            var token = this.token,
                input = this.source;
            var node = opTokens[ch];
            var next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
                if (next in node) {
                    node = node[next];
                    this.cursor++;
                    next = input[this.cursor];
                }
            }
            var op = node.op;
            if (definitions.assignOps[op] && input[this.cursor] === '=') {
                this.cursor++;
                token.type = ASSIGN;
                token.assignOp = definitions.tokenIds[definitions.opTypeNames[op]];
                op += '=';
            } else {
                token.type = definitions.tokenIds[definitions.opTypeNames[op]];
                token.assignOp = null;
            }
            token.value = op;
        },
        lexIdent: function (ch) {
            var token = this.token,
                input = this.source;
            do {
                ch = input[this.cursor++];
            } while ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '$' || ch === '_');
            this.cursor--;
            var id = input.substring(token.start, this.cursor);
            token.type = definitions.keywords[id] || IDENTIFIER;
            token.value = id;
        },
        get: function (scanOperand) {
            var token;
            while (this.lookahead) {
                --this.lookahead;
                this.tokenIndex = (this.tokenIndex + 1) & 3;
                token = this.tokens[this.tokenIndex];
                if (token.type !== NEWLINE || this.scanNewlines) return token.type;
            }
            this.skip();
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[this.tokenIndex];
            if (!token) this.tokens[this.tokenIndex] = token = {};
            var input = this.source;
            if (this.cursor === input.length) return token.type = END;
            token.start = this.cursor;
            token.lineno = this.lineno;
            var ch = input[this.cursor++];
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_') {
                this.lexIdent(ch);
            } else if (scanOperand && ch === '/') {
                this.lexRegExp(ch);
            } else if (ch in opTokens) {
                this.lexOp(ch);
            } else if (ch === '.') {
                this.lexDot(ch);
            } else if (ch >= '1' && ch <= '9') {
                this.lexNumber(ch);
            } else if (ch === '0') {
                this.lexZeroNumber(ch);
            } else if (ch === '"' || ch === "'") {
                this.lexString(ch);
            } else if (this.scanNewlines && ch === '\n') {
                token.type = NEWLINE;
                token.value = '\n';
                this.lineno++;
            } else {
                throw this.newSyntaxError("Illegal token");
            }
            token.end = this.cursor;
            return token.type;
        },
        unget: function () {
            if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
            this.tokenIndex = (this.tokenIndex - 1) & 3;
        },
        newSyntaxError: function (m) {
            var e = new SyntaxError(m, this.filename, this.lineno);
            e.source = this.source;
            e.cursor = this.lookahead ? this.tokens[(this.tokenIndex + this.lookahead) & 3].start : this.cursor;
            return e;
        },
    };
    return {
        Tokenizer: Tokenizer
    };
}());
Narcissus.parser = (function () {
    var lexer = Narcissus.lexer;
    var definitions = Narcissus.definitions;
    const StringMap = definitions.StringMap;
    const Stack = definitions.Stack;
    eval(definitions.consts);

    function pushDestructuringVarDecls(n, s) {
        for (var i in n) {
            var sub = n[i];
            if (sub.type === IDENTIFIER) {
                s.varDecls.push(sub);
            } else {
                pushDestructuringVarDecls(sub, s);
            }
        }
    }
    const NESTING_TOP = 0, NESTING_SHALLOW = 1, NESTING_DEEP = 2;

    function StaticContext(parentScript, parentBlock, inFunction, inForLoopInit, nesting) {
        this.parentScript = parentScript;
        this.parentBlock = parentBlock;
        this.inFunction = inFunction;
        this.inForLoopInit = inForLoopInit;
        this.nesting = nesting;
        this.allLabels = new Stack();
        this.currentLabels = new Stack();
        this.labeledTargets = new Stack();
        this.defaultTarget = null;
        Narcissus.options.ecma3OnlyMode && (this.ecma3OnlyMode = true);
        Narcissus.options.parenFreeMode && (this.parenFreeMode = true);
    }
    StaticContext.prototype = {
        ecma3OnlyMode: false,
        parenFreeMode: false,
        update: function (ext) {
            var desc = {};
            for (var key in ext) {
                desc[key] = {
                    value: ext[key],
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            }
            return Object.create(this, desc);
        },
        pushLabel: function (label) {
            return this.update({
                currentLabels: this.currentLabels.push(label),
                allLabels: this.allLabels.push(label)
            });
        },
        pushTarget: function (target) {
            var isDefaultTarget = target.isLoop || target.type === SWITCH;
            if (this.currentLabels.isEmpty()) {
                return isDefaultTarget ? this.update({
                    defaultTarget: target
                }) : this;
            }
            target.labels = new StringMap();
            this.currentLabels.forEach(function (label) {
                target.labels.set(label, true);
            });
            return this.update({
                currentLabels: new Stack(),
                labeledTargets: this.labeledTargets.push(target),
                defaultTarget: isDefaultTarget ? target : this.defaultTarget
            });
        },
        nest: function (atLeast) {
            var nesting = Math.max(this.nesting, atLeast);
            return (nesting !== this.nesting) ? this.update({
                nesting: nesting
            }) : this;
        }
    };

    function Script(t, inFunction) {
        var n = new Node(t, scriptInit());
        var x = new StaticContext(n, n, inFunction, false, NESTING_TOP);
        Statements(t, x, n);
        return n;
    }
    definitions.defineProperty(Array.prototype, "top", function () {
        return this.length && this[this.length - 1];
    }, false, false, true);

    function Node(t, init) {
        var token = t.token;
        if (token) {
            this.type = token.type;
            this.value = token.value;
            this.lineno = token.lineno;
            this.start = token.start;
            this.end = token.end;
        } else {
            this.lineno = t.lineno;
        }
        this.tokenizer = t;
        this.children = [];
        for (var prop in init)
        this[prop] = init[prop];
    }
    var Np = Node.prototype = {};
    Np.constructor = Node;
    Np.toSource = Object.prototype.toSource;
    Np.push = function (kid) {
        if (kid !== null) {
            if (kid.start < this.start) this.start = kid.start;
            if (this.end < kid.end) this.end = kid.end;
        }
        return this.children.push(kid);
    }
    Node.indentLevel = 0;

    function tokenString(tt) {
        var t = definitions.tokens[tt];
        return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
    }
    Np.toString = function () {
        var a = [];
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'type' && i !== 'target') a.push({
                id: i,
                value: this[i]
            });
        }
        a.sort(function (a, b) {
            return (a.id < b.id) ? -1 : 1;
        });
        const INDENTATION = "    ";
        var n = ++Node.indentLevel;
        var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
        for (i = 0; i < a.length; i++)
        s += ",\n" + INDENTATION.repeat(n) + a[i].id + ": " + a[i].value;
        n = --Node.indentLevel;
        s += "\n" + INDENTATION.repeat(n) + "}";
        return s;
    }
    Np.getSource = function () {
        return this.tokenizer.source.slice(this.start, this.end);
    };
    const LOOP_INIT = {
        isLoop: true
    };

    function blockInit() {
        return {
            type: BLOCK,
            varDecls: []
        };
    }

    function scriptInit() {
        return {
            type: SCRIPT,
            funDecls: [],
            varDecls: [],
            modDecls: [],
            impDecls: [],
            expDecls: [],
            loadDeps: [],
            hasEmptyReturn: false,
            hasReturnWithValue: false,
            isGenerator: false
        };
    }
    definitions.defineGetter(Np, "filename", function () {
        return this.tokenizer.filename;
    });
    definitions.defineGetter(Np, "length", function () {
        throw new Error("Node.prototype.length is gone; " + "use n.children.length instead");
    });
    definitions.defineProperty(String.prototype, "repeat", function (n) {
        var s = "",
            t = this + s;
        while (--n >= 0)
        s += t;
        return s;
    }, false, false, true);

    function MaybeLeftParen(t, x) {
        if (x.parenFreeMode) return t.match(LEFT_PAREN) ? LEFT_PAREN : END;
        return t.mustMatch(LEFT_PAREN).type;
    }

    function MaybeRightParen(t, p) {
        if (p === LEFT_PAREN) t.mustMatch(RIGHT_PAREN);
    }

    function Statements(t, x, n) {
        try {
            while (!t.done && t.peek(true) !== RIGHT_CURLY) {
                n.push(Statement(t, x));
            }
        } catch (e) {
            if (t.done) {
                t.unexpectedEOF = true;
            }
            throw (e);
        }
    }

    function Block(t, x) {
        t.mustMatch(LEFT_CURLY);
        var n = new Node(t, blockInit());
        Statements(t, x.update({
            parentBlock: n
        }).pushTarget(n), n);
        t.mustMatch(RIGHT_CURLY);
        return n;
    }
    const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

    function Statement(t, x) {
        var i, label, n, n2, p, c, ss, tt = t.get(true),
            tt2, x2, x3;
        switch (tt) {
        case FUNCTION:
            return FunctionDefinition(t, x, true, (x.nesting !== NESTING_TOP) ? STATEMENT_FORM : DECLARED_FORM);
        case LEFT_CURLY:
            n = new Node(t, blockInit());
            Statements(t, x.update({
                parentBlock: n
            }).pushTarget(n).nest(NESTING_SHALLOW), n);
            t.mustMatch(RIGHT_CURLY);
            return n;
        case IF:
            n = new Node(t);
            n.condition = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            n.thenPart = Statement(t, x2);
            n.elsePart = t.match(
            ELSE) ? Statement(t, x2) : null;
            return n;
        case SWITCH:
            n = new Node(t, {
                cases: [],
                defaultIndex: -1
            });
            n.discriminant = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            t.mustMatch(LEFT_CURLY);
            while ((tt = t.get()) !== RIGHT_CURLY) {
                switch (tt) {
                case DEFAULT:
                    if (n.defaultIndex >= 0) throw t.newSyntaxError("More than one switch default");
                case CASE:
                    n2 = new Node(t);
                    if (tt === DEFAULT) n.defaultIndex = n.cases.length;
                    else n2.caseLabel = Expression(t, x2, COLON);
                    break;
                default:
                    throw t.newSyntaxError("Invalid switch case");
                }
                t.mustMatch(COLON);
                n2.statements = new Node(t, blockInit());
                while ((tt = t.peek(true)) !== CASE && tt !== DEFAULT && tt !== RIGHT_CURLY)
                n2.statements.push(Statement(t, x2));
                n.cases.push(n2);
            }
            return n;
        case FOR:
            n = new Node(t, LOOP_INIT);
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each") n.isEach = true;
                else t.unget();
            }
            if (!x.parenFreeMode) t.mustMatch(LEFT_PAREN);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            x3 = x.update({
                inForLoopInit: true
            });
            if ((tt = t.peek()) !== SEMICOLON) {
                if (tt === VAR || tt === CONST) {
                    t.get();
                    n2 = Variables(t, x3);
                } else if (tt === LET) {
                    t.get();
                    if (t.peek() === LEFT_PAREN) {
                        n2 = LetBlock(t, x3, false);
                    } else {
                        x3.parentBlock = n;
                        n.varDecls = [];
                        n2 = Variables(t, x3);
                    }
                } else {
                    n2 = Expression(t, x3);
                }
            }
            if (n2 && t.match(IN)) {
                n.type = FOR_IN;
                n.object = Expression(t, x3);
                if (n2.type === VAR || n2.type === LET) {
                    c = n2.children;
                    if (c.length !== 1 && n2.destructurings.length !== 1) {
                        throw new SyntaxError("Invalid for..in left-hand side", t.filename, n2.lineno);
                    }
                    if (n2.destructurings.length > 0) {
                        n.iterator = n2.destructurings[0];
                    } else {
                        n.iterator = c[0];
                    }
                    n.varDecl = n2;
                } else {
                    if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                        n2.destructuredNames = checkDestructuring(t, x3, n2);
                    }
                    n.iterator = n2;
                }
            } else {
                n.setup = n2;
                t.mustMatch(SEMICOLON);
                if (n.isEach) throw t.newSyntaxError("Invalid for each..in loop");
                n.condition = (t.peek() === SEMICOLON) ? null : Expression(t, x3);
                t.mustMatch(SEMICOLON);
                tt2 = t.peek();
                n.update = (x.parenFreeMode ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2] : tt2 === RIGHT_PAREN) ? null : Expression(t, x3);
            }
            if (!x.parenFreeMode) t.mustMatch(RIGHT_PAREN);
            n.body = Statement(t, x2);
            return n;
        case WHILE:
            n = new Node(t, {
                isLoop: true
            });
            n.condition = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            return n;
        case DO:
            n = new Node(t, {
                isLoop: true
            });
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            t.mustMatch(WHILE);
            n.condition = HeadExpression(t, x);
            if (!x.ecmaStrictMode) {
                t.match(SEMICOLON);
                return n;
            }
            break;
        case BREAK:
        case CONTINUE:
            n = new Node(t);
            x2 = x.pushTarget(n);
            if (t.peekOnSameLine() === IDENTIFIER) {
                t.get();
                n.label = t.token.value;
            }
            n.target = n.label ? x2.labeledTargets.find(function (target) {
                return target.labels.has(n.label)
            }) : x2.defaultTarget;
            if (!n.target) throw t.newSyntaxError("Invalid " + ((tt === BREAK) ? "break" : "continue"));
            if (!n.target.isLoop && tt === CONTINUE) throw t.newSyntaxError("Invalid continue");
            break;
        case TRY:
            n = new Node(t, {
                catchClauses: []
            });
            n.tryBlock = Block(t, x);
            while (t.match(
            CATCH)) {
                n2 = new Node(t);
                p = MaybeLeftParen(t, x);
                switch (t.get()) {
                case LEFT_BRACKET:
                case LEFT_CURLY:
                    t.unget();
                    n2.varName = DestructuringExpression(t, x, true);
                    break;
                case IDENTIFIER:
                    n2.varName = t.token.value;
                    break;
                default:
                    throw t.newSyntaxError("missing identifier in catch");
                    break;
                }
                if (t.match(IF)) {
                    if (x.ecma3OnlyMode) throw t.newSyntaxError("Illegal catch guard");
                    if (n.catchClauses.length && !n.catchClauses.top().guard) throw t.newSyntaxError("Guarded catch after unguarded");
                    n2.guard = Expression(t, x);
                }
                MaybeRightParen(t, p);
                n2.block = Block(t, x);
                n.catchClauses.push(n2);
            }
            if (t.match(
            FINALLY)) n.finallyBlock = Block(t, x);
            if (!n.catchClauses.length && !n.finallyBlock) throw t.newSyntaxError("Invalid try statement");
            return n;
        case
            CATCH:
        case
            FINALLY:
            throw t.newSyntaxError(definitions.tokens[tt] + " without preceding try");
        case THROW:
            n = new Node(t);
            n.exception = Expression(t, x);
            break;
        case RETURN:
            n = ReturnOrYield(t, x);
            break;
        case WITH:
            n = new Node(t);
            n.object = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            return n;
        case VAR:
        case CONST:
            n = Variables(t, x);
            break;
        case LET:
            if (t.peek() === LEFT_PAREN) n = LetBlock(t, x, true);
            else n = Variables(t, x);
            break;
        case DEBUGGER:
            n = new Node(t);
            break;
        case NEWLINE:
        case SEMICOLON:
            n = new Node(t, {
                type: SEMICOLON
            });
            n.expression = null;
            return n;
        default:
            if (tt === IDENTIFIER) {
                tt = t.peek();
                if (tt === COLON) {
                    label = t.token.value;
                    if (x.allLabels.has(label)) throw t.newSyntaxError("Duplicate label");
                    t.get();
                    n = new Node(t, {
                        type: LABEL,
                        label: label
                    });
                    n.statement = Statement(t, x.pushLabel(label).nest(NESTING_SHALLOW));
                    n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                    return n;
                }
            }
            n = new Node(t, {
                type: SEMICOLON
            });
            t.unget();
            n.expression = Expression(t, x);
            n.end = n.expression.end;
            break;
        }
        MagicalSemicolon(t);
        return n;
    }

    function MagicalSemicolon(t) {
        var tt;
        if (t.lineno === t.token.lineno) {
            tt = t.peekOnSameLine();
            if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY) throw t.newSyntaxError("missing ; before statement");
        }
        t.match(SEMICOLON);
    }

    function ReturnOrYield(t, x) {
        var n, b, tt = t.token.type,
            tt2;
        var parentScript = x.parentScript;
        if (tt === RETURN) {
            if (!x.inFunction) throw t.newSyntaxError("Return not in function");
        } else {
            if (!x.inFunction) throw t.newSyntaxError("Yield not in function");
            parentScript.isGenerator = true;
        }
        n = new Node(t, {
            value: undefined
        });
        tt2 = t.peek(true);
        if (tt2 !== END && tt2 !== NEWLINE && tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY && (tt !== YIELD || (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN && tt2 !== COLON && tt2 !== COMMA))) {
            if (tt === RETURN) {
                n.value = Expression(t, x);
                parentScript.hasReturnWithValue = true;
            } else {
                n.value = AssignExpression(t, x);
            }
        } else if (tt === RETURN) {
            parentScript.hasEmptyReturn = true;
        }
        if (parentScript.hasReturnWithValue && parentScript.isGenerator) throw t.newSyntaxError("Generator returns a value");
        return n;
    }

    function FunctionDefinition(t, x, requireName, functionForm) {
        var tt;
        var f = new Node(t, {
            params: []
        });
        if (f.type !== FUNCTION) f.type = (f.value === "get") ? GETTER : SETTER;
        if (t.match(IDENTIFIER)) f.name = t.token.value;
        else if (requireName) throw t.newSyntaxError("missing function identifier");
        var x2 = new StaticContext(null, null, true, false, NESTING_TOP);
        t.mustMatch(LEFT_PAREN);
        if (!t.match(RIGHT_PAREN)) {
            do {
                switch (t.get()) {
                case LEFT_BRACKET:
                case LEFT_CURLY:
                    t.unget();
                    f.params.push(DestructuringExpression(t, x2));
                    break;
                case IDENTIFIER:
                    f.params.push(t.token.value);
                    break;
                default:
                    throw t.newSyntaxError("missing formal parameter");
                    break;
                }
            } while (t.match(COMMA));
            t.mustMatch(RIGHT_PAREN);
        }
        tt = t.get();
        if (tt !== LEFT_CURLY) t.unget();
        if (tt !== LEFT_CURLY) {
            f.body = AssignExpression(t, x2);
            if (f.body.isGenerator) throw t.newSyntaxError("Generator returns a value");
        } else {
            f.body = Script(t, true);
        }
        if (tt === LEFT_CURLY) t.mustMatch(RIGHT_CURLY);
        f.end = t.token.end;
        f.functionForm = functionForm;
        if (functionForm === DECLARED_FORM) x.parentScript.funDecls.push(f);
        return f;
    }

    function Variables(t, x, letBlock) {
        var n, n2, ss, i, s, tt;
        tt = t.token.type;
        switch (tt) {
        case VAR:
        case CONST:
            s = x.parentScript;
            break;
        case LET:
            s = x.parentBlock;
            break;
        case LEFT_PAREN:
            tt = LET;
            s = letBlock;
            break;
        }
        n = new Node(t, {
            type: tt,
            destructurings: []
        });
        do {
            tt = t.get();
            if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
                t.unget();
                var dexp = DestructuringExpression(t, x, true);
                n2 = new Node(t, {
                    type: IDENTIFIER,
                    name: dexp,
                    readOnly: n.type === CONST
                });
                n.push(n2);
                pushDestructuringVarDecls(n2.name.destructuredNames, s);
                n.destructurings.push({
                    exp: dexp,
                    decl: n2
                });
                if (x.inForLoopInit && t.peek() === IN) {
                    continue;
                }
                t.mustMatch(ASSIGN);
                if (t.token.assignOp) throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
                continue;
            }
            if (tt !== IDENTIFIER) throw t.newSyntaxError("missing variable name");
            n2 = new Node(t, {
                type: IDENTIFIER,
                name: t.token.value,
                readOnly: n.type === CONST
            });
            n.push(n2);
            s.varDecls.push(n2);
            if (t.match(ASSIGN)) {
                if (t.token.assignOp) throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
            }
        } while (t.match(COMMA));
        return n;
    }

    function LetBlock(t, x, isStatement) {
        var n, n2;
        n = new Node(t, {
            type: LET_BLOCK,
            varDecls: []
        });
        t.mustMatch(LEFT_PAREN);
        n.variables = Variables(t, x, n);
        t.mustMatch(RIGHT_PAREN);
        if (isStatement && t.peek() !== LEFT_CURLY) {
            n2 = new Node(t, {
                type: SEMICOLON,
                expression: n
            });
            isStatement = false;
        }
        if (isStatement) n.block = Block(t, x);
        else n.expression = AssignExpression(t, x);
        return n;
    }

    function checkDestructuring(t, x, n, simpleNamesOnly) {
        if (n.type === ARRAY_COMP) throw t.newSyntaxError("Invalid array comprehension left-hand side");
        if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT) return;
        var lhss = {};
        var nn, n2, idx, sub, cc, c = n.children;
        for (var i = 0, j = c.length; i < j; i++) {
            if (!(nn = c[i])) continue;
            if (nn.type === PROPERTY_INIT) {
                cc = nn.children;
                sub = cc[1];
                idx = cc[0].value;
            } else if (n.type === OBJECT_INIT) {
                sub = nn;
                idx = nn.value;
            } else {
                sub = nn;
                idx = i;
            }
            if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
                lhss[idx] = checkDestructuring(t, x, sub, simpleNamesOnly);
            } else {
                if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                    throw t.newSyntaxError("missing name in pattern");
                }
                lhss[idx] = sub;
            }
        }
        return lhss;
    }

    function DestructuringExpression(t, x, simpleNamesOnly) {
        var n = PrimaryExpression(t, x);
        n.destructuredNames = checkDestructuring(t, x, n, simpleNamesOnly);
        return n;
    }

    function GeneratorExpression(t, x, e) {
        return new Node(t, {
            type: GENERATOR,
            expression: e,
            tail: ComprehensionTail(t, x)
        });
    }

    function ComprehensionTail(t, x) {
        var body, n, n2, n3, p;
        body = new Node(t, {
            type: COMP_TAIL
        });
        do {
            n = new Node(t, {
                type: FOR_IN,
                isLoop: true
            });
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each") n.isEach = true;
                else t.unget();
            }
            p = MaybeLeftParen(t, x);
            switch (t.get()) {
            case LEFT_BRACKET:
            case LEFT_CURLY:
                t.unget();
                n.iterator = DestructuringExpression(t, x);
                break;
            case IDENTIFIER:
                n.iterator = n3 = new Node(t, {
                    type: IDENTIFIER
                });
                n3.name = n3.value;
                n.varDecl = n2 = new Node(t, {
                    type: VAR
                });
                n2.push(n3);
                x.parentScript.varDecls.push(n3);
                break;
            default:
                throw t.newSyntaxError("missing identifier");
            }
            t.mustMatch(IN);
            n.object = Expression(t, x);
            MaybeRightParen(t, p);
            body.push(n);
        } while (t.match(FOR));
        if (t.match(IF)) body.guard = HeadExpression(t, x);
        return body;
    }

    function HeadExpression(t, x) {
        var p = MaybeLeftParen(t, x);
        var n = ParenExpression(t, x);
        MaybeRightParen(t, p);
        if (p === END && !n.parenthesized) {
            var tt = t.peek();
            if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt]) throw t.newSyntaxError("Unparenthesized head followed by unbraced body");
        }
        return n;
    }

    function ParenExpression(t, x) {
        var n = Expression(t, x.update({
            inForLoopInit: x.inForLoopInit && (t.token.type === LEFT_PAREN)
        }));
        if (t.match(FOR)) {
            if (n.type === YIELD && !n.parenthesized) throw t.newSyntaxError("Yield expression must be parenthesized");
            if (n.type === COMMA && !n.parenthesized) throw t.newSyntaxError("Generator expression must be parenthesized");
            n = GeneratorExpression(t, x, n);
        }
        return n;
    }

    function Expression(t, x) {
        var n, n2;
        n = AssignExpression(t, x);
        if (t.match(COMMA)) {
            n2 = new Node(t, {
                type: COMMA
            });
            n2.push(n);
            n = n2;
            do {
                n2 = n.children[n.children.length - 1];
                if (n2.type === YIELD && !n2.parenthesized) throw t.newSyntaxError("Yield expression must be parenthesized");
                n.push(AssignExpression(t, x));
            } while (t.match(COMMA));
        }
        return n;
    }

    function AssignExpression(t, x) {
        var n, lhs;
        if (t.match(YIELD, true)) return ReturnOrYield(t, x);
        n = new Node(t, {
            type: ASSIGN
        });
        lhs = ConditionalExpression(t, x);
        if (!t.match(ASSIGN)) {
            return lhs;
        }
        switch (lhs.type) {
        case OBJECT_INIT:
        case ARRAY_INIT:
            lhs.destructuredNames = checkDestructuring(t, x, lhs);
        case IDENTIFIER:
        case DOT:
        case INDEX:
        case CALL:
            break;
        default:
            throw t.newSyntaxError("Bad left-hand side of assignment");
            break;
        }
        n.assignOp = t.token.assignOp;
        n.push(lhs);
        n.push(AssignExpression(t, x));
        return n;
    }

    function ConditionalExpression(t, x) {
        var n, n2;
        n = OrExpression(t, x);
        if (t.match(HOOK)) {
            n2 = n;
            n = new Node(t, {
                type: HOOK
            });
            n.push(n2);
            n.push(AssignExpression(t, x.update({
                inForLoopInit: false
            })));
            if (!t.match(COLON)) throw t.newSyntaxError("missing : after ?");
            n.push(AssignExpression(t, x));
        }
        return n;
    }

    function OrExpression(t, x) {
        var n, n2;
        n = AndExpression(t, x);
        while (t.match(OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AndExpression(t, x));
            n = n2;
        }
        return n;
    }

    function AndExpression(t, x) {
        var n, n2;
        n = BitwiseOrExpression(t, x);
        while (t.match(AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseOrExpression(t, x));
            n = n2;
        }
        return n;
    }

    function BitwiseOrExpression(t, x) {
        var n, n2;
        n = BitwiseXorExpression(t, x);
        while (t.match(BITWISE_OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseXorExpression(t, x));
            n = n2;
        }
        return n;
    }

    function BitwiseXorExpression(t, x) {
        var n, n2;
        n = BitwiseAndExpression(t, x);
        while (t.match(BITWISE_XOR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseAndExpression(t, x));
            n = n2;
        }
        return n;
    }

    function BitwiseAndExpression(t, x) {
        var n, n2;
        n = EqualityExpression(t, x);
        while (t.match(BITWISE_AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(EqualityExpression(t, x));
            n = n2;
        }
        return n;
    }

    function EqualityExpression(t, x) {
        var n, n2;
        n = RelationalExpression(t, x);
        while (t.match(EQ) || t.match(NE) || t.match(STRICT_EQ) || t.match(STRICT_NE)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(RelationalExpression(t, x));
            n = n2;
        }
        return n;
    }

    function RelationalExpression(t, x) {
        var n, n2;
        var x2 = x.update({
            inForLoopInit: false
        });
        n = ShiftExpression(t, x2);
        while ((t.match(LT) || t.match(LE) || t.match(GE) || t.match(GT) || (!x.inForLoopInit && t.match(IN)) || t.match(INSTANCEOF))) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(ShiftExpression(t, x2));
            n = n2;
        }
        return n;
    }

    function ShiftExpression(t, x) {
        var n, n2;
        n = AddExpression(t, x);
        while (t.match(LSH) || t.match(RSH) || t.match(URSH)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AddExpression(t, x));
            n = n2;
        }
        return n;
    }

    function AddExpression(t, x) {
        var n, n2;
        n = MultiplyExpression(t, x);
        while (t.match(PLUS) || t.match(MINUS)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(MultiplyExpression(t, x));
            n = n2;
        }
        return n;
    }

    function MultiplyExpression(t, x) {
        var n, n2;
        n = UnaryExpression(t, x);
        while (t.match(MUL) || t.match(DIV) || t.match(MOD)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(UnaryExpression(t, x));
            n = n2;
        }
        return n;
    }

    function UnaryExpression(t, x) {
        var n, n2, tt;
        switch (tt = t.get(true)) {
        case DELETE:
        case VOID:
        case TYPEOF:
        case NOT:
        case BITWISE_NOT:
        case PLUS:
        case MINUS:
            if (tt === PLUS) n = new Node(t, {
                type: UNARY_PLUS
            });
            else if (tt === MINUS) n = new Node(t, {
                type: UNARY_MINUS
            });
            else n = new Node(t);
            n.push(UnaryExpression(t, x));
            break;
        case INCREMENT:
        case DECREMENT:
            n = new Node(t);
            n.push(MemberExpression(t, x, true));
            break;
        default:
            t.unget();
            n = MemberExpression(t, x, true);
            if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno === t.lineno) {
                if (t.match(INCREMENT) || t.match(DECREMENT)) {
                    n2 = new Node(t, {
                        postfix: true
                    });
                    n2.push(n);
                    n = n2;
                }
            }
            break;
        }
        return n;
    }

    function MemberExpression(t, x, allowCallSyntax) {
        var n, n2, name, tt;
        if (t.match(NEW)) {
            n = new Node(t);
            n.push(MemberExpression(t, x, false));
            if (t.match(LEFT_PAREN)) {
                n.type = NEW_WITH_ARGS;
                n.push(ArgumentList(t, x));
            }
        } else {
            n = PrimaryExpression(t, x);
        }
        while ((tt = t.get()) !== END) {
            switch (tt) {
            case DOT:
                n2 = new Node(t);
                n2.push(n);
                t.mustMatch(IDENTIFIER);
                n2.push(new Node(t));
                break;
            case LEFT_BRACKET:
                n2 = new Node(t, {
                    type: INDEX
                });
                n2.push(n);
                n2.push(Expression(t, x));
                t.mustMatch(RIGHT_BRACKET);
                break;
            case LEFT_PAREN:
                if (allowCallSyntax) {
                    n2 = new Node(t, {
                        type: CALL
                    });
                    n2.push(n);
                    n2.push(ArgumentList(t, x));
                    break;
                }
            default:
                t.unget();
                return n;
            }
            n = n2;
        }
        return n;
    }

    function ArgumentList(t, x) {
        var n, n2;
        n = new Node(t, {
            type: LIST
        });
        if (t.match(RIGHT_PAREN, true)) return n;
        do {
            n2 = AssignExpression(t, x);
            if (n2.type === YIELD && !n2.parenthesized && t.peek() === COMMA) throw t.newSyntaxError("Yield expression must be parenthesized");
            if (t.match(FOR)) {
                n2 = GeneratorExpression(t, x, n2);
                if (n.children.length > 1 || t.peek(true) === COMMA) throw t.newSyntaxError("Generator expression must be parenthesized");
            }
            n.push(n2);
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_PAREN);
        return n;
    }

    function PrimaryExpression(t, x) {
        var n, n2, tt = t.get(true);
        switch (tt) {
        case FUNCTION:
            n = FunctionDefinition(t, x, false, EXPRESSED_FORM);
            break;
        case LEFT_BRACKET:
            n = new Node(t, {
                type: ARRAY_INIT
            });
            while ((tt = t.peek(true)) !== RIGHT_BRACKET) {
                if (tt === COMMA) {
                    t.get();
                    n.push(null);
                    continue;
                }
                n.push(AssignExpression(t, x));
                if (tt !== COMMA && !t.match(COMMA)) break;
            }
            if (n.children.length === 1 && t.match(FOR)) {
                n2 = new Node(t, {
                    type: ARRAY_COMP,
                    expression: n.children[0],
                    tail: ComprehensionTail(t, x)
                });
                n = n2;
            }
            t.mustMatch(RIGHT_BRACKET);
            break;
        case LEFT_CURLY:
            var id, fd;
            n = new Node(t, {
                type: OBJECT_INIT
            });
            object_init: if (!t.match(RIGHT_CURLY)) {
                do {
                    tt = t.get();
                    if ((t.token.value === "get" || t.token.value === "set") && t.peek() === IDENTIFIER) {
                        if (x.ecma3OnlyMode) throw t.newSyntaxError("Illegal property accessor");
                        n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                    } else {
                        switch (tt) {
                        case IDENTIFIER:
                        case NUMBER:
                        case STRING:
                            id = new Node(t, {
                                type: IDENTIFIER
                            });
                            break;
                        case RIGHT_CURLY:
                            if (x.ecma3OnlyMode) throw t.newSyntaxError("Illegal trailing ,");
                            break object_init;
                        default:
                            if (t.token.value in definitions.keywords) {
                                id = new Node(t, {
                                    type: IDENTIFIER
                                });
                                break;
                            }
                            throw t.newSyntaxError("Invalid property name");
                        }
                        if (t.match(COLON)) {
                            n2 = new Node(t, {
                                type: PROPERTY_INIT
                            });
                            n2.push(id);
                            n2.push(AssignExpression(t, x));
                            n.push(n2);
                        } else {
                            if (t.peek() !== COMMA && t.peek() !== RIGHT_CURLY) throw t.newSyntaxError("missing : after property");
                            n.push(id);
                        }
                    }
                } while (t.match(COMMA));
                t.mustMatch(RIGHT_CURLY);
            }
            break;
        case LEFT_PAREN:
            n = ParenExpression(t, x);
            t.mustMatch(RIGHT_PAREN);
            n.parenthesized = true;
            break;
        case LET:
            n = LetBlock(t, x, false);
            break;
        case NULL:
        case THIS:
        case TRUE:
        case FALSE:
        case IDENTIFIER:
        case NUMBER:
        case STRING:
        case REGEXP:
            n = new Node(t);
            break;
        default:
            throw t.newSyntaxError("missing operand");
            break;
        }
        return n;
    }

    function parse(s, f, l) {
        var t = new lexer.Tokenizer(s, f, l);
        var n = Script(t, false);
        if (!t.done) throw t.newSyntaxError("Syntax error");
        return n;
    }

    function parseStdin(s, ln) {
        for (;;) {
            try {
                var t = new lexer.Tokenizer(s, "stdin", ln.value);
                var n = Script(t, false);
                ln.value = t.lineno;
                return n;
            } catch (e) {
                if (!t.unexpectedEOF) throw e;
                var more = readline();
                if (!more) throw e;
                s += "\n" + more;
            }
        }
    }
    return {
        parse: parse,
        parseStdin: parseStdin,
        Node: Node,
        DECLARED_FORM: DECLARED_FORM,
        EXPRESSED_FORM: EXPRESSED_FORM,
        STATEMENT_FORM: STATEMENT_FORM,
        Tokenizer: lexer.Tokenizer,
        FunctionDefinition: FunctionDefinition
    };
}());
var exports = {
    definitions: Narcissus.definitions,
    lexer: Narcissus.lexer,
    parser: Narcissus.parser
};
if (typeof module != 'undefined') {
    module.exports = exports;
};
(function () {
    var Node, Typenames, Types, exports, narcissus, parser, tokens, _;
    var __slice = Array.prototype.slice,
        __indexOf = Array.prototype.indexOf ||
    function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] === item) return i;
        }
        return -1;
    };
    narcissus = this.Narcissus || require('./narcissus_packed');
    _ = this._ || require('underscore');
    tokens = narcissus.definitions.tokens;
    parser = narcissus.parser;
    Node = parser.Node;
    Node.prototype.left = function () {
        return this.children[0];
    };
    Node.prototype.right = function () {
        return this.children[1];
    };
    Node.prototype.last = function () {
        return this.children[this.children.length - 1];
    };
    Node.prototype.walk = function (options, fn, parent, list) {
        if (parent == null) {
            parent = null;
        }
        if (list == null) {
            list = null;
        }
        if (parent) {
            fn(parent, this, list);
        }
        if (options.last) {
            if (this.last() != null) {
                this.last().walk(options, fn, this);
            }
        }
        if (this.thenPart != null) {
            this.thenPart.walk(options, fn, this, 'thenPart');
        }
        if (this.elsePart != null) {
            this.elsePart.walk(options, fn, this, 'elsePart');
        }
        if (this.cases) {
            return _.each(this.cases, function (item) {
                return item.statements.walk(options, fn, item, 'cases');
            });
        }
    };
    Node.prototype.clone = function (hash) {
        var i, _ref;
        for (i in this) {
            if (i === 'tokenizer' || i === 'length' || i === 'filename') {
                continue;
            }
            if ((_ref = hash[i]) != null) {
                _ref;
            } else {
                hash[i] = this[i];
            };
        }
        return new Node(this.tokenizer, hash);
    };
    Node.prototype.toHash = function () {
        var hash, i, toHash;
        hash = {};
        toHash = function (what) {
            if (!what) {
                return null;
            }
            if (what.toHash) {
                return what.toHash();
            } else {
                return what;
            }
        };
        hash.type = this.typeName();
        hash.src = this.src();
        for (i in this) {
            if (i === 'filename' || i === 'length' || i === 'type' || i === 'start' || i === 'end' || i === 'tokenizer' || i === 'lineno') {
                continue;
            }
            if (typeof this[i] === 'function') {
                continue;
            }
            if (!this[i]) {
                continue;
            }
            if (this[i].constructor === Array) {
                hash[i] = _.map(this[i], function (item) {
                    return toHash(item);
                });
            } else {
                hash[i] = toHash(this[i]);
            }
        }
        return hash;
    };
    Node.prototype.inspect = function () {
        return JSON.stringify(this.toHash(), null, '  ');
    };
    Node.prototype.src = function () {
        return this.tokenizer.source.substr(this.start, this.end - this.start);
    };
    Node.prototype.typeName = function () {
        return Types[this.type];
    };
    Node.prototype.isA = function () {
        var what, _ref;
        what = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _ref = Types[this.type], __indexOf.call(what, _ref) >= 0;
    };
    Types = (function () {
        var dict, i, last;
        dict = {};
        last = 0;
        for (i in tokens) {
            if (typeof tokens[i] === 'number') {
                dict[tokens[i]] = i.toLowerCase();
                last = tokens[i];
            }
        }
        dict[++last] = 'call_statement';
        dict[++last] = 'existence_check';
        return dict;
    })();
    Typenames = (function () {
        var dict, i;
        dict = {};
        for (i in Types) {
            dict[Types[i]] = i;
        }
        return dict;
    })();
    this.NodeExt = exports = {
        Types: Types,
        Typenames: Typenames,
        Node: Node
    };
    if (typeof module !== "undefined" && module !== null) {
        module.exports = exports;
    }
}).call(this);
(function () {
    var Code, CoffeeScript, blockTrim, coffeescript_reserved, exports, isSingleLine, ltrim, p, paren, rtrim, strEscape, strRepeat, trim, truthy, unreserve, unshift, word;
    var __indexOf = Array.prototype.indexOf ||
    function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] === item) return i;
        }
        return -1;
    };
    CoffeeScript = this.CoffeeScript;
    Code = (function () {
        function Code() {
            this.code = '';
        }
        Code.prototype.add = function (str) {
            this.code += str.toString();
            return this;
        };
        Code.prototype.scope = function (str, level) {
            var indent;
            if (level == null) {
                level = 1;
            }
            indent = strRepeat("  ", level);
            this.code = rtrim(this.code) + "\n";
            this.code += indent + rtrim(str).replace(/\n/g, "\n" + indent) + "\n";
            return this;
        };
        Code.prototype.toString = function () {
            return this.code;
        };
        return Code;
    })();
    paren = function (string) {
        var str;
        str = string.toString();
        if (str.substr(0, 1) === '(' && str.substr(-1, 1) === ')') {
            return str;
        } else {
            return "(" + str + ")";
        }
    };
    strRepeat = function (str, times) {
        var i;
        return ((function () {
            var _results;
            _results = [];
            for (i = 0; 0 <= times ? i < times : i > times; 0 <= times ? i++ : i--) {
                _results.push(str);
            }
            return _results;
        })()).join('');
    };
    ltrim = function (str) {
        return ("" + str).replace(/^\s*/g, '');
    };
    rtrim = function (str) {
        return ("" + str).replace(/\s*$/g, '');
    };
    blockTrim = function (str) {
        return ("" + str).replace(/^\s*\n|\s*$/g, '');
    };
    trim = function (str) {
        return ("" + str).replace(/^\s*|\s*$/g, '');
    };
    isSingleLine = function (str) {
        return trim(str).indexOf("\n") === -1;
    };
    unshift = function (str) {
        var m1, m2, _results;
        str = "" + str;
        _results = [];
        while (true) {
            m1 = str.match(/^/gm);
            m2 = str.match(/^ /gm);
            if (!m1 || !m2 || m1.length !== m2.length) {
                return str;
            }
            _results.push(str = str.replace(/^ /gm, ''));
        }
        return _results;
    };
    truthy = function (n) {
        return n.isA('true') || (n.isA('number') && parseFloat(n.src()) !== 0.0);
    };
    strEscape = function (str) {
        return JSON.stringify("" + str);
    };
    p = function (str) {
        if (str.constructor === String) {
            console.log(JSON.stringify(str));
        } else {
            console.log(str);
        }
        return '';
    };
    coffeescript_reserved = (function () {
        var _i, _len, _ref, _results;
        _ref = CoffeeScript.RESERVED;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            word = _ref[_i];
            if (word !== 'undefined') {
                _results.push(word);
            }
        }
        return _results;
    })();
    unreserve = function (str) {
        var _ref;
        if (_ref = "" + str, __indexOf.call(coffeescript_reserved, _ref) >= 0) {
            return "" + str + "_";
        } else {
            return "" + str;
        }
    };
    this.Js2coffeeHelpers = exports = {
        Code: Code,
        p: p,
        strEscape: strEscape,
        unreserve: unreserve,
        unshift: unshift,
        isSingleLine: isSingleLine,
        trim: trim,
        blockTrim: blockTrim,
        ltrim: ltrim,
        rtrim: rtrim,
        strRepeat: strRepeat,
        paren: paren,
        truthy: truthy
    };
    if (typeof module !== "undefined" && module !== null) {
        module.exports = exports;
    }
}).call(this);
(function () {
    var Builder, Code, Node, Transformer, Typenames, Types, UnsupportedError, blockTrim, buildCoffee, exports, isSingleLine, ltrim, p, paren, parser, rtrim, strEscape, strRepeat, trim, truthy, unreserve, unshift, _, _ref, _ref2;
    var __slice = Array.prototype.slice,
        __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        },
        __hasProp = Object.prototype.hasOwnProperty;
    parser = (this.Narcissus || require('./narcissus_packed')).parser;
    _ = this._ || require('underscore');
    _ref = this.NodeExt || require('./node_ext'), Types = _ref.Types, Typenames = _ref.Typenames, Node = _ref.Node;
    _ref2 = this.Js2coffeeHelpers || require('./helpers'), Code = _ref2.Code, p = _ref2.p, strEscape = _ref2.strEscape, unreserve = _ref2.unreserve, unshift = _ref2.unshift, isSingleLine = _ref2.isSingleLine, trim = _ref2.trim, blockTrim = _ref2.blockTrim, ltrim = _ref2.ltrim, rtrim = _ref2.rtrim, strRepeat = _ref2.strRepeat, paren = _ref2.paren, truthy = _ref2.truthy;
    buildCoffee = function (str) {
        var builder, line, output, scriptNode;
        str = str.replace(/\r/g, '');
        str += "\n";
        builder = new Builder;
        scriptNode = parser.parse(str);
        output = trim(builder.build(scriptNode));
        return ((function () {
            var _i, _len, _ref3, _results;
            _ref3 = output.split('\n');
            _results = [];
            for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
                line = _ref3[_i];
                _results.push(rtrim(line));
            }
            return _results;
        })()).join('\n');
    };
    Builder = (function () {
        function Builder() {
            this.transformer = new Transformer;
        }
        Builder.prototype.build = function () {
            var args, fn, name, node, out;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            node = args[0];
            this.transform(node);
            name = 'other';
            if (node !== void 0 && node.typeName) {
                name = node.typeName();
            }
            fn = this[name] || this.other;
            out = fn.apply(this, args);
            if (node.parenthesized) {
                return paren(out);
            } else {
                return out;
            }
        };
        Builder.prototype.transform = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.transformer.transform.apply(this.transformer, args);
        };
        Builder.prototype.body = function (node, opts) {
            var str;
            if (opts == null) {
                opts = {};
            }
            str = this.build(node, opts);
            str = blockTrim(str);
            str = unshift(str);
            if (str.length > 0) {
                return str;
            } else {
                return "";
            }
        };
        Builder.prototype['script'] = function (n, opts) {
            var c;
            if (opts == null) {
                opts = {};
            }
            c = new Code;
            _.each(n.functions, __bind(function (item) {
                return c.add(this.build(item));
            }, this));
            _.each(n.nonfunctions, __bind(function (item) {
                return c.add(this.build(item));
            }, this));
            return c.toString();
        };
        Builder.prototype['property_identifier'] = function (n) {
            var str;
            str = n.value.toString();
            if (str.match(/^([_\$a-z][_\$a-z0-9]*)$/i) || str.match(/^[0-9]+$/i)) {
                return str;
            } else {
                return strEscape(str);
            }
        };
        Builder.prototype['identifier'] = function (n) {
            if (n.value === 'undefined') {
                return '`undefined`';
            } else if (n.property_accessor) {
                return n.value.toString();
            } else {
                return unreserve(n.value.toString());
            }
        };
        Builder.prototype['number'] = function (n) {
            return "" + (n.src());
        };
        Builder.prototype['id'] = function (n) {
            if (n.property_accessor) {
                return n;
            } else {
                return unreserve(n);
            }
        };
        Builder.prototype['id_param'] = function (n) {
            var _ref3;
            if ((_ref3 = n.toString()) === 'undefined') {
                return "" + n + "_";
            } else {
                return this.id(n);
            }
        };
        Builder.prototype['return'] = function (n) {
            if (!(n.value != null)) {
                return "return\n";
            } else {
                return "return " + (this.build(n.value)) + "\n";
            }
        };
        Builder.prototype[';'] = function (n) {
            var src;
            if (n.expression == null) {
                return "";
            } else if (n.expression.typeName() === 'object_init') {
                src = this.object_init(n.expression);
                if (n.parenthesized) {
                    return src;
                } else {
                    return "" + (unshift(blockTrim(src))) + "\n";
                }
            } else {
                return this.build(n.expression) + "\n";
            }
        };
        Builder.prototype['new'] = function (n) {
            return "new " + (this.build(n.left()));
        };
        Builder.prototype['new_with_args'] = function (n) {
            return "new " + (this.build(n.left())) + "(" + (this.build(n.right())) + ")";
        };
        Builder.prototype['unary_plus'] = function (n) {
            return "+" + (this.build(n.left()));
        };
        Builder.prototype['unary_minus'] = function (n) {
            return "-" + (this.build(n.left()));
        };
        Builder.prototype['this'] = function (n) {
            return 'this';
        };
        Builder.prototype['null'] = function (n) {
            return 'null';
        };
        Builder.prototype['true'] = function (n) {
            return 'true';
        };
        Builder.prototype['false'] = function (n) {
            return 'false';
        };
        Builder.prototype['void'] = function (n) {
            return 'undefined';
        };
        Builder.prototype['debugger'] = function (n) {
            return "debugger\n";
        };
        Builder.prototype['break'] = function (n) {
            return "break\n";
        };
        Builder.prototype['continue'] = function (n) {
            return "continue\n";
        };
        Builder.prototype['~'] = function (n) {
            return "~" + (this.build(n.left()));
        };
        Builder.prototype['typeof'] = function (n) {
            return "typeof " + (this.build(n.left()));
        };
        Builder.prototype['index'] = function (n) {
            var right;
            right = this.build(n.right());
            if (_.any(n.children, function (child) {
                return child.typeName() === 'object_init' && child.children.length > 1;
            })) {
                right = "{" + right + "}";
            }
            return "" + (this.build(n.left())) + "[" + right + "]";
        };
        Builder.prototype['throw'] = function (n) {
            return "throw " + (this.build(n.exception));
        };
        Builder.prototype['!'] = function (n) {
            var negations, target;
            target = n.left();
            negations = 1;
            while ((target.isA('!')) && (target = target.left())) {
                ++negations;
            }
            if ((negations & 1) && target.isA('==', '!=', '===', '!==', 'in', 'instanceof')) {
                target.negated = !target.negated;
                return this.build(target);
            }
            return "" + (negations & 1 ? 'not ' : '!!') + (this.build(target));
        };
        Builder.prototype["in"] = function (n) {
            return this.binary_operator(n, 'of');
        };
        Builder.prototype['+'] = function (n) {
            return this.binary_operator(n, '+');
        };
        Builder.prototype['-'] = function (n) {
            return this.binary_operator(n, '-');
        };
        Builder.prototype['*'] = function (n) {
            return this.binary_operator(n, '*');
        };
        Builder.prototype['/'] = function (n) {
            return this.binary_operator(n, '/');
        };
        Builder.prototype['%'] = function (n) {
            return this.binary_operator(n, '%');
        };
        Builder.prototype['>'] = function (n) {
            return this.binary_operator(n, '>');
        };
        Builder.prototype['<'] = function (n) {
            return this.binary_operator(n, '<');
        };
        Builder.prototype['&'] = function (n) {
            return this.binary_operator(n, '&');
        };
        Builder.prototype['|'] = function (n) {
            return this.binary_operator(n, '|');
        };
        Builder.prototype['^'] = function (n) {
            return this.binary_operator(n, '^');
        };
        Builder.prototype['&&'] = function (n) {
            return this.binary_operator(n, 'and');
        };
        Builder.prototype['||'] = function (n) {
            return this.binary_operator(n, 'or');
        };
        Builder.prototype['<<'] = function (n) {
            return this.binary_operator(n, '<<');
        };
        Builder.prototype['<='] = function (n) {
            return this.binary_operator(n, '<=');
        };
        Builder.prototype['>>'] = function (n) {
            return this.binary_operator(n, '>>');
        };
        Builder.prototype['>='] = function (n) {
            return this.binary_operator(n, '>=');
        };
        Builder.prototype['==='] = function (n) {
            return this.binary_operator(n, 'is');
        };
        Builder.prototype['!=='] = function (n) {
            return this.binary_operator(n, 'isnt');
        };
        Builder.prototype['>>>'] = function (n) {
            return this.binary_operator(n, '>>>');
        };
        Builder.prototype["instanceof"] = function (n) {
            return this.binary_operator(n, 'instanceof');
        };
        Builder.prototype['=='] = function (n) {
            return this.binary_operator(n, 'is');
        };
        Builder.prototype['!='] = function (n) {
            return this.binary_operator(n, 'isnt');
        };
        Builder.prototype['binary_operator'] = (function () {
            var INVERSIONS, k, v;
            INVERSIONS = {
                is: 'isnt',
                "in": 'not in',
                of: 'not of',
                "instanceof": 'not instanceof'
            };
            for (k in INVERSIONS) {
                if (!__hasProp.call(INVERSIONS, k)) continue;
                v = INVERSIONS[k];
                INVERSIONS[v] = k;
            }
            return function (n, sign) {
                if (n.negated) {
                    sign = INVERSIONS[sign];
                }
                return "" + (this.build(n.left())) + " " + sign + " " + (this.build(n.right()));
            };
        })();
        Builder.prototype['--'] = function (n) {
            return this.increment_decrement(n, '--');
        };
        Builder.prototype['++'] = function (n) {
            return this.increment_decrement(n, '++');
        };
        Builder.prototype['increment_decrement'] = function (n, sign) {
            if (n.postfix) {
                return "" + (this.build(n.left())) + sign;
            } else {
                return "" + sign + (this.build(n.left()));
            }
        };
        Builder.prototype['='] = function (n) {
            var sign;
            sign = n.assignOp != null ? Types[n.assignOp] + '=' : '=';
            return "" + (this.build(n.left())) + " " + sign + " " + (this.build(n.right()));
        };
        Builder.prototype[','] = function (n) {
            var list;
            list = _.map(n.children, __bind(function (item) {
                return this.build(item) + "\n";
            }, this));
            return list.join('');
        };
        Builder.prototype['regexp'] = function (n) {
            var begins_with, flag, m, value;
            m = n.value.toString().match(/^\/(.*)\/([a-z]?)/);
            value = m[1];
            flag = m[2];
            begins_with = value[0];
            if (begins_with === ' ' || begins_with === '=') {
                if (flag.length > 0) {
                    return "RegExp(" + (strEscape(value)) + ", \"" + flag + "\")";
                } else {
                    return "RegExp(" + (strEscape(value)) + ")";
                }
            } else {
                return "/" + value + "/" + flag;
            }
        };
        Builder.prototype['string'] = function (n) {
            return strEscape(n.value);
        };
        Builder.prototype['call'] = function (n) {
            if (n.right().children.length === 0) {
                return "" + (this.build(n.left())) + "()";
            } else {
                return "" + (this.build(n.left())) + "(" + (this.build(n.right())) + ")";
            }
        };
        Builder.prototype['call_statement'] = function (n) {
            var left;
            left = this.build(n.left());
            if (n.left().isA('function')) {
                left = paren(left);
            }
            if (n.right().children.length === 0) {
                return "" + left + "()";
            } else {
                return "" + left + " " + (this.build(n.right()));
            }
        };
        Builder.prototype['list'] = function (n) {
            var list;
            list = _.map(n.children, __bind(function (item) {
                if (n.children.length > 1) {
                    item.is_list_element = true;
                }
                return this.build(item);
            }, this));
            return list.join(", ");
        };
        Builder.prototype['delete'] = function (n) {
            var ids;
            ids = _.map(n.children, __bind(function (el) {
                return this.build(el);
            }, this));
            ids = ids.join(', ');
            return "delete " + ids + "\n";
        };
        Builder.prototype['.'] = function (n) {
            var left, right, right_obj;
            left = this.build(n.left());
            right_obj = n.right();
            right_obj.property_accessor = true;
            right = this.build(right_obj);
            if (n.isThis && n.isPrototype) {
                return "@::";
            } else if (n.isThis) {
                return "@" + right;
            } else if (n.isPrototype) {
                return "" + left + "::";
            } else if (n.left().isPrototype) {
                return "" + left + right;
            } else {
                return "" + left + "." + right;
            }
        };
        Builder.prototype['try'] = function (n) {
            var c;
            c = new Code;
            c.add('try');
            c.scope(this.body(n.tryBlock));
            _.each(n.catchClauses, __bind(function (clause) {
                return c.add(this.build(clause));
            }, this));
            if (n.finallyBlock != null) {
                c.add("finally");
                c.scope(this.body(n.finallyBlock));
            }
            return c;
        };
        Builder.prototype['catch'] = function (n) {
            var body_, c;
            body_ = this.body(n.block);
            if (trim(body_).length === 0) {
                return '';
            }
            c = new Code;
            if (n.varName != null) {
                c.add("catch " + n.varName);
            } else {
                c.add('catch');
            }
            c.scope(this.body(n.block));
            return c;
        };
        Builder.prototype['?'] = function (n) {
            return "(if " + (this.build(n.left())) + " then " + (this.build(n.children[1])) + " else " + (this.build(n.children[2])) + ")";
        };
        Builder.prototype['for'] = function (n) {
            var c;
            c = new Code;
            if (n.setup != null) {
                c.add("" + (this.build(n.setup)) + "\n");
            }
            if (n.condition != null) {
                c.add("while " + (this.build(n.condition)) + "\n");
            } else {
                c.add("loop");
            }
            c.scope(this.body(n.body));
            if (n.update != null) {
                c.scope(this.body(n.update));
            }
            return c;
        };
        Builder.prototype['for_in'] = function (n) {
            var c;
            c = new Code;
            c.add("for " + (this.build(n.iterator)) + " of " + (this.build(n.object)));
            c.scope(this.body(n.body));
            return c;
        };
        Builder.prototype['while'] = function (n) {
            var body_, c, keyword, statement;
            c = new Code;
            keyword = n.positive ? "while" : "until";
            body_ = this.body(n.body);
            if (truthy(n.condition)) {
                statement = "loop";
            } else {
                statement = "" + keyword + " " + (this.build(n.condition));
            }
            if (isSingleLine(body_) && statement !== "loop") {
                c.add("" + (trim(body_)) + "  " + statement + "\n");
            } else {
                c.add(statement);
                c.scope(body_);
            }
            return c;
        };
        Builder.prototype['do'] = function (n) {
            var c;
            c = new Code;
            c.add("loop");
            c.scope(this.body(n.body));
            if (n.condition != null) {
                c.scope("break unless " + (this.build(n.condition)));
            }
            return c;
        };
        Builder.prototype['if'] = function (n) {
            var body_, c, keyword;
            c = new Code;
            keyword = n.positive ? "if" : "unless";
            body_ = this.body(n.thenPart);
            n.condition.parenthesized = false;
            if (n.thenPart.isA('block') && n.thenPart.children.length === 0 && !(n.elsePart != null)) {
                console.log(n.thenPart);
                c.add("" + (this.build(n.condition)) + "\n");
            } else if (isSingleLine(body_) && !(n.elsePart != null)) {
                c.add("" + (trim(body_)) + "  " + keyword + " " + (this.build(n.condition)) + "\n");
            } else {
                c.add("" + keyword + " " + (this.build(n.condition)));
                c.scope(this.body(n.thenPart));
                if (n.elsePart != null) {
                    if (n.elsePart.typeName() === 'if') {
                        c.add("else " + (this.build(n.elsePart).toString()));
                    } else {
                        c.add("else\n");
                        c.scope(this.body(n.elsePart));
                    }
                }
            }
            return c;
        };
        Builder.prototype['switch'] = function (n) {
            var c, fall_through;
            c = new Code;
            c.add("switch " + (this.build(n.discriminant)) + "\n");
            fall_through = false;
            _.each(n.cases, __bind(function (item) {
                var first;
                if (item.value === 'default') {
                    c.scope("else");
                } else {
                    if (fall_through === true) {
                        c.add(", " + (this.build(item.caseLabel)) + "\n");
                    } else {
                        c.add("  when " + (this.build(item.caseLabel)));
                    }
                }
                if (this.body(item.statements).length === 0) {
                    fall_through = true;
                } else {
                    fall_through = false;
                    c.add("\n");
                    c.scope(this.body(item.statements), 2);
                }
                return first = false;
            }, this));
            return c;
        };
        Builder.prototype['existence_check'] = function (n) {
            return "" + (this.build(n.left())) + "?";
        };
        Builder.prototype['array_init'] = function (n) {
            if (n.children.length === 0) {
                return "[]";
            } else {
                return "[ " + (this.list(n)) + " ]";
            }
        };
        Builder.prototype['property_init'] = function (n) {
            var left, right;
            left = n.left();
            right = n.right();
            right.is_property_value = true;
            return "" + (this.property_identifier(left)) + ": " + (this.build(right));
        };
        Builder.prototype['object_init'] = function (n, options) {
            var c, list;
            if (options == null) {
                options = {};
            }
            if (n.children.length === 0) {
                return "{}";
            } else if (n.children.length === 1 && !(n.is_property_value || n.is_list_element)) {
                return this.build(n.children[0]);
            } else {
                list = _.map(n.children, __bind(function (item) {
                    return this.build(item);
                }, this));
                c = new Code;
                c.scope(list.join("\n"));
                if (options.brackets != null) {
                    c = "{" + c + "}";
                }
                return c;
            }
        };
        Builder.prototype['function'] = function (n) {
            var body, c, params;
            c = new Code;
            params = _.map(n.params, __bind(function (str) {
                if (str.constructor === String) {
                    return this.id_param(str);
                } else {
                    return this.build(str);
                }
            }, this));
            if (n.name) {
                c.add("" + n.name + " = ");
            }
            if (n.params.length > 0) {
                c.add("(" + (params.join(', ')) + ") ->");
            } else {
                c.add("->");
            }
            body = this.body(n.body);
            if (trim(body).length > 0) {
                c.scope(body);
            } else {
                c.add("\n");
            }
            return c;
        };
        Builder.prototype['var'] = function (n) {
            var list;
            list = _.map(n.children, __bind(function (item) {
                return "" + (unreserve(item.value)) + " = " + (item.initializer != null ? this.build(item.initializer) : 'undefined');
            }, this));
            return _.compact(list).join("\n") + "\n";
        };
        Builder.prototype['other'] = function (n) {
            return this.unsupported(n, "" + (n.typeName()) + " is not supported yet");
        };
        Builder.prototype['getter'] = function (n) {
            return this.unsupported(n, "getter syntax is not supported; use __defineGetter__");
        };
        Builder.prototype['setter'] = function (n) {
            return this.unsupported(n, "setter syntax is not supported; use __defineSetter__");
        };
        Builder.prototype['label'] = function (n) {
            return this.unsupported(n, "labels are not supported by CoffeeScript");
        };
        Builder.prototype['const'] = function (n) {
            return this.unsupported(n, "consts are not supported by CoffeeScript");
        };
        Builder.prototype['block'] = function () {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return this.script.apply(this, args);
        };
        Builder.prototype['unsupported'] = function (node, message) {
            throw new UnsupportedError("Unsupported: " + message, node);
        };
        return Builder;
    })();
    Transformer = (function () {
        function Transformer() {}
        Transformer.prototype.transform = function () {
            var args, fn, node, type;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            node = args[0];
            if (node.transformed != null) {
                return;
            }
            type = node.typeName();
            fn = this[type];
            if (fn) {
                fn.apply(this, args);
                return node.transformed = true;
            }
        };
        Transformer.prototype['script'] = function (n) {
            var last;
            n.functions = [];
            n.nonfunctions = [];
            _.each(n.children, __bind(function (item) {
                if (item.isA('function')) {
                    return n.functions.push(item);
                } else {
                    return n.nonfunctions.push(item);
                }
            }, this));
            last = null;
            return _.each(n.nonfunctions, __bind(function (item) {
                var expr;
                if (item.expression != null) {
                    expr = item.expression;
                    if ((last != null ? last.isA('object_init') : void 0) && expr.isA('object_init')) {
                        item.parenthesized = true;
                    } else {
                        item.parenthesized = false;
                    }
                    return last = expr;
                }
            }, this));
        };
        Transformer.prototype['.'] = function (n) {
            n.isThis = n.left().isA('this');
            return n.isPrototype = n.right().isA('identifier') && n.right().value === 'prototype';
        };
        Transformer.prototype[';'] = function (n) {
            if (n.expression != null) {
                n.expression.parenthesized = false;
                if (n.expression.isA('call')) {
                    n.expression.type = Typenames['call_statement'];
                    return this.call_statement(n);
                }
            }
        };
        Transformer.prototype['function'] = function (n) {
            return n.body.walk({
                last: true
            }, function (parent, node, list) {
                var lastNode;
                if (node.isA('return') && node.value) {
                    lastNode = list ? parent[list] : parent.children[parent.children.length - 1];
                    if (lastNode) {
                        lastNode.type = Typenames[';'];
                        return lastNode.expression = lastNode.value;
                    }
                }
            });
        };
        Transformer.prototype['switch'] = function (n) {
            return _.each(n.cases, __bind(function (item) {
                var block, ch, _ref3;
                block = item.statements;
                ch = block.children;
                if ((_ref3 = block.last()) != null ? _ref3.isA('break') : void 0) {
                    return delete ch[ch.length - 1];
                }
            }, this));
        };
        Transformer.prototype['call_statement'] = function (n) {
            if (n.children[1]) {
                return _.each(n.children[1].children, function (child, i) {
                    if (child.isA('function') && i !== n.children[1].children.length - 1) {
                        return child.parenthesized = true;
                    }
                });
            }
        };
        Transformer.prototype['return'] = function (n) {
            if (n.value && n.value.isA('object_init') && n.value.children.length > 1) {
                return n.value.parenthesized = true;
            }
        };
        Transformer.prototype['block'] = function (n) {
            return this.script(n);
        };
        Transformer.prototype['if'] = function (n) {
            var _ref3;
            if (n.thenPart.children.length === 0 && ((_ref3 = n.elsePart) != null ? _ref3.children.length : void 0) > 0) {
                n.positive = false;
                n.thenPart = n.elsePart;
                delete n.elsePart;
            }
            return this.inversible(n);
        };
        Transformer.prototype['while'] = function (n) {
            if (n.body.children.length === 0) {
                n.body.children.push(n.clone({
                    type: Typenames['continue'],
                    value: 'continue',
                    children: []
                }));
            }
            return this.inversible(n);
        };
        Transformer.prototype['inversible'] = function (n) {
            var positive;
            this.transform(n.condition);
            positive = n.positive != null ? n.positive : true;
            if (n.condition.isA('!=')) {
                n.condition.type = Typenames['=='];
                return n.positive = !positive;
            } else if (n.condition.isA('!')) {
                n.condition = n.condition.left();
                return n.positive = !positive;
            } else {
                return n.positive = positive;
            }
        };
        Transformer.prototype['=='] = function (n) {
            if (n.right().isA('null', 'void')) {
                n.type = Typenames['!'];
                return n.children = [
                n.clone({
                    type: Typenames['existence_check'],
                    children: [n.left()]
                })];
            }
        };
        Transformer.prototype['!='] = function (n) {
            if (n.right().isA('null', 'void')) {
                n.type = Typenames['existence_check'];
                return n.children = [n.left()];
            }
        };
        return Transformer;
    })();
    UnsupportedError = (function () {
        function UnsupportedError(str, src) {
            this.message = str;
            this.cursor = src.start;
            this.line = src.lineno;
            this.source = src.tokenizer.source;
        }
        UnsupportedError.prototype.toString = function () {
            return this.message;
        };
        return UnsupportedError;
    })();
    this.Js2coffee = exports = {
        version: '0.1.2',
        build: buildCoffee,
        UnsupportedError: UnsupportedError
    };
    if (typeof module !== "undefined" && module !== null) {
        module.exports = exports;
    }
}).call(this);

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
        sendResult(Js2coffee.build(e.data));
    } catch (err) {
		sendError(err.message);
    }
}, false);
