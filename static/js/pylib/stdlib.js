list = function(x) {
    var item, result;
    result = [];
    var _$tmp1_data = _$pyva_iter(x);
    var _$tmp2_len = _$tmp1_data.length;
    for (var _$tmp3_index = 0; _$tmp3_index < _$tmp2_len; _$tmp3_index++) {
        item = _$tmp1_data[_$tmp3_index];

        result.append(item);
    }

    return result;
};

dict = function(x) {
    var key, result;
    result = {

    };
    var _$tmp4_data = _$pyva_iter(x);
    var _$tmp5_len = _$tmp4_data.length;
    for (var _$tmp6_index = 0; _$tmp6_index < _$tmp5_len; _$tmp6_index++) {
        key = _$tmp4_data[_$tmp6_index];

        result[key] = x[key];
    }

    return result;
};

_$pyva_int = function(x) {
    return parseInt(x);
};

_$pyva_float = function(x) {
    return parseFloat(x);
};

str = function(x) {
    return x.toString();
};

_print = function(x) {
    if ((console && console.log)) {
        console.log(x);
    }

};

print = function() {
    var arg;
    var _$tmp7_data = _$pyva_iter(arguments);
    var _$tmp8_len = _$tmp7_data.length;
    for (var _$tmp9_index = 0; _$tmp9_index < _$tmp8_len; _$tmp9_index++) {
        arg = _$tmp7_data[_$tmp9_index];

        _print(arg);
    }

};

_empty = function(obj) {
    switch (toString.call(obj)) {
        case '[object String]':
        case '[object Array]':
            return !obj.length;
        case '[object Number]':
            return isNaN(obj);
        case '[object Date]':
        case '[object Boolean]':
            return isNaN(+obj);
        default: //object
            for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
            return true;
    }
}

_false = function(x) {
    return (x === null || !x || _empty(x))
}

_true = function(x) {
    return !_false(x)
}

Array.prototype.append = (function(item) {
    this.push(item);
});
Array.prototype.insert = (function(index, item) {
    this.splice(index, 0, item);
});
Array.prototype.extend = (function(items) {
    var item;
    var _$tmp10_data = _$pyva_iter(items);
    var _$tmp11_len = _$tmp10_data.length;
    for (var _$tmp12_index = 0; _$tmp12_index < _$tmp11_len; _$tmp12_index++) {
        item = _$tmp10_data[_$tmp12_index];

        this.append(item);
    }

});
Array.prototype.index = Array.prototype.indexOf;
isinstance = function(item, cls) {
    var cls_item, isnumber;
    if (cls instanceof Array) {
        var _$tmp13_data = _$pyva_iter(cls);
        var _$tmp14_len = _$tmp13_data.length;
        for (var _$tmp15_index = 0; _$tmp15_index < _$tmp14_len; _$tmp15_index++) {
            cls_item = _$tmp13_data[_$tmp15_index];

            if (isinstance(item, cls_item)) {
                return true;
            }

        }

        return false;
    }

    if ((cls === list)) {
        cls = Array;
    } else if ((cls === dict)) {
        cls = Object;
    } else if ((cls === str)) {
        cls = String;
    } else if (((cls === _$pyva_int) || (cls === _$pyva_float))) {
        isnumber = (item.constructor === Number.prototype.constructor);
        return (isnumber && (cls(item) == item));
    } else {
        return item instanceof cls;
    }

    return (item.constructor === cls.prototype.constructor);
};

_$pyva_iter = function(iter_object) {
    if (typeof jQuery != "undefined" && iter_object instanceof jQuery) {
        return _.map(iter_object, jQuery);
    }
    var key_list;
    if (((iter_object.callee && (typeof iter_object['length'] != "undefined")) || isinstance(iter_object, list))) {
        return iter_object;
    }

    key_list = [];
    for (var key in iter_object)
        key_list.append(key);
    return key_list;
};

Function.prototype.bind = (function(owner) {
    var bound, func;
    func = this;
    bound = function() {
        return func.apply(owner, arguments);
    };

    return bound;
});