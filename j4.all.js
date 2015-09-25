// ***************************************************************
// j4 javascript common library
// Browser compatibility: Chrome  Firefox1.8+ IE9+
// author:  bomee  
// date:  2015-07-31
// version: 1.2
// ***************************************************************
var j4 = {};
(function (ns, window, document) {
  var repeatCount = function (str, pos, char) {
    var length = str.length, offset = pos + 1;
    while ((offset < length) && (str.charAt(offset) == char)) {
      offset++;
    }
    return (offset - pos);
  };

  var _toString = Object.prototype.toString, 
      _hasOwnProperty = Object.prototype.hasOwnProperty;

// ***************************************************************
// util
// ***************************************************************
  ns.isArray = function(obj) {
    return _toString.call(obj) === '[object Array]';
  };

  ns.isString = function (obj) {
    return _toString.call(obj) === '[object String]';
  };

  ns.isFunction = function (obj) {
    return _toString.call(obj) === '[object Function]';
  };

  ns.isNumber = function (obj) {
    return _toString.call(obj) === '[object Number]';
  };
  
  ns.isObject = function (obj) {
    return _toString.call(obj) === '[object Object]';
  };

  ns.has = function(obj, key) {
    return _hasOwnProperty.call(obj, key);
  };

  ns.isEmpty = function(obj) {
    if (obj == null) return true;
    if (ns.isArray(obj) || ns.isString(obj)) return obj.length === 0;
    for (var key in obj) if (ns.has(obj, key)) return false;
      return true;
  };

  ns.trimLeft = function (str) {
    return str.trimLeft();
  };

  ns.trimRight = function (str) {
    return str.trimRight();
  };

  ns.trim = function (str) {
    return str.trim();
  };

  ns.padLeft = function (obj, width, padChar) {
    return obj.toString().padLeft(width, padChar);
  };

  ns.padRight = function (obj, width, padChar) {
    return obj.toString().padRight(width, padChar);
  };

  ns.isBlank = function (str) {
    return str == null || str == "";
  };

  /**
   * format('{index[.property][:conversion[precision]]}', args);
   */
  ns.format = function () {
    var args, template, pattern;

    if (arguments.length < 2)
      return arguments[0] || '';

    if (arguments.length == 2 && arguments[1] instanceof Array) {
      args = [0].concat(arguments[1]);
    } else {
      args = arguments;
    }
    template = arguments[0];
    pattern = /\{(\w+(?:\.\w+)*)(?::([FfPpDdCc]{1})(\d?))?\}/g;
    return template.replace(pattern, function (match, propChain, specifier, accuracy) {
      var props = propChain.split('.'),
          index = isNaN(props[0]) ? 0 : +props.shift(),
          value = args[index + 1],
          prop;
      while((prop = props.shift()) && (value = value[prop]));
      if(value == null) return '';
      if (specifier != null) {
        switch (specifier) {
        case "f":
        case "F":
          value = (+value).toFixed(accuracy);
          break;
        case "d":
        case "D":
          value = (+value).toFixed(0);
          break;
        case "p":
        case "P":
          value = (value * 100.0).toFixed(accuracy) + '%';
          break;
        case "c":
        case "C":
          var negative = +value < 0, offset1, offset2, tmp = [];
          value = Math.abs(+value).toFixed(accuracy);
          offset2 = value.length;
          offset1 = ((offset1 = value.indexOf('.')) < 0 ? offset2 : offset1) - 3;
          offset1 < 0 && (offset1 = 0);
          do {
            tmp.unshift(value.slice(offset1, offset2));
            offset2 = offset1;
            offset1 -= 3;
            offset1 < 0 && (offset1 = 0);
          } while(offset2 - offset1 > 0);
          value = (negative ? '-': '') + tmp.join(',');
          break;
        }
      }
      return value;
    });
  };

  /**
   * 精简JS模板引擎，思路来源：John Resig's Micro-Templating，Undersource
   * directive:<%%>, interpolation:<%=%>
   * ns.template('').render(data); 避免undefined属性 
   */
  ns.template = (function(){
    function Template(source){
      var src = ['var out = []; with(arg || {}){'], index = 0;

      var appendString = function(string){
        src.push('out.push(\'');
        src.push(string.replace(/\\/g, '\\\\'));
        src.push('\');');
      };

      source.replace(/<%([\s\S]+?)%>/g, function(match, exp, offset){
        appendString(source.slice(index, offset));
        index = offset + match.length;
        if (exp[0] === '=') {
          src.push('out.push(');
          src.push(exp.slice(1));
          src.push(');');
        } else {
          src.push(exp);
        }
        return match;
      });
      appendString(source.slice(index, source.length));
      src.push('} return out.join("");');

      var fn = new Function('arg', src.join(''));
      this.render = function(data){
        return fn.call(this, data);
      };
    }

    return function(source){
      return source instanceof Template ? source : new Template(source);
    };
  })();
  
  ns.url = {
    param: function(name){
      var m = new RegExp("\\W" + name + "=([^&]+)").exec(location.search);
      return m ? m[1] : '';
    },
    paramMap: function(){
      if(!location.search) return {};
      var map = {};
      for(var i = 0, kv, items = location.search.slice(1).split('&'); items[i] && (kv = items[i].split('=')); i++){
        map[kv[0]] = decodeURIComponent(kv[1]);
      }
      return map;
    }
  };


  var OBJECT_PREFIX = '[Object]',
    encodeValue = function(value){
      return ns.isObject(value) ? OBJECT_PREFIX + JSON.stringify(value) : String(value);
    },
    decodeValue = function(value){
      return value.indexOf(OBJECT_PREFIX) === 0 ? JSON.parse(value.slice(OBJECT_PREFIX.length)) : value;
    };
  
  // ***************************************************************
  // cookie
  // ***************************************************************
  ns.cookie = function(){
    return {
      set: function(key, value, options){
        if(ns.isNumber(options)){
          options = {expires : options};
        }
        options = options || {};
        var t;
        return (document.cookie = [
          key, '=', encodeValue(value),
          options.expires ? '; expires=' + (t = new Date(), t.setTime(+t + options.expires * 1000), t).toUTCString() : '',
          options.path    ? '; path=' + options.path : '',
          options.domain  ? '; domain=' + options.domain : '',
          options.secure  ? '; secure' : ''
        ].join(''));
      },
      get: function(key){
        var cookies = document.cookie ? document.cookie.split('; ') : [];      
        for (var i = 0, l = cookies.length; i < l; i++) {
          var parts = cookies[i].split('=');
          if (parts.shift() === key) {
            return decodeValue(parts.join('='));
          }
        }
        return null;
      },
      remove: function(key){
        this.set(key, null, -1);
      }
    };
  }();
  
  // ***************************************************************
  // localStorage, sessionStorage 扩展支持JSON对象的存储
  // ***************************************************************
  ['localStorage', 'sessionStorage'].forEach(function(name){
    var storage = window[name];
    ns[name] = {
      getItem: function(key){
        return decodeValue(storage.getItem(key));
      },
      setItem: function(key, value){
        return storage.setItem(key, encodeValue(value));
      },
      removeItem: function(key){
        return storage.removeItem(key);
      },
      clear: function(){
       return storage.clear();
      }
    };
  });    


  // ***************************************************************
  // String prototype extend
  // ***************************************************************
  String.prototype.trimLeft = function () {
    return this.replace(/^\s+/g, '');
  };
  
  String.prototype.trimRight = function () {
    return this.replace(/\s+$/g, '');
  };
  
  String.prototype.trim = function () {
    return this.trimLeft().trimRight();
  };
  
  String.prototype.padLeft = function (width, padChar) {
    var str = this;
    padChar = padChar == null ? ' ' : padChar.charAt(0);
    while (str.length < width) {
      str = padChar + str;
    }
    return str;
  };
  
  String.prototype.padRight = function (width, padChar) {
    var str = this;
    padChar = padChar == null ? ' ' : padChar.charAt(0);
    while (str.length < width) {
      str += padChar;
    }
    return str;
  };
  
  String.prototype.parse = function(){
    return JSON.parse(this);
  };
  
  Object.prototype.stringify = function(){
    return JSON.stringify(this);
  };

  // ***************************************************************
  // Date prototype extend
  // ***************************************************************
  Date.prototype.toString = function (format) {
    return this.toFormatString(format || 'yyyy-MM-dd hh:mm:ss');
  };

  Date.prototype.toFormatString = function (format) {
    var tmp = [], preChar = null, i = 0, len = format.length, current, value, repeat;
    while (i < len) {
      current = format.charAt(i);
      switch (current) {
      case 'y':
        value = this.getFullYear().toString();
        repeat = repeatCount(format, i, current);
        tmp.push(repeat == 2 ? value.slice(repeat) : value);
        i += repeat;
        break;
      case 'M':
        value = (this.getMonth() + 1).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 'Q':
        value = (this.getQuarter()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 'd':
        value = (this.getDate()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 'h':
        value = (this.getHours()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 'm':
        value = (this.getMinutes()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 's':
        value = (this.getSeconds()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      case 'f':
        value = (this.getMilliseconds()).toString();
        repeat = repeatCount(format, i, current);
        tmp.push(value.padLeft(repeat, '0'));
        i += repeat;
        break;
      default:
        tmp.push(current);
        i++;
        break;
      }
    }
    return tmp.join('');
  };

  Date.prototype.getQuarter = function () {
    return Math.floor(this.getMonth() / 3) + 1;
  };

  Date.prototype.addMilliseconds = function (value) {
    var d = this;
    d.setTime(this.getTime() + value);
    return d;
  };

  Date.prototype.addSeconds = function (value) {
    return this.addMilliseconds(value * 0x3e8);
  };

  Date.prototype.addMinutes = function (value) {
    return this.addMilliseconds(value * 0xea60);
  };

  Date.prototype.addHours = function (value) {
    return this.addMilliseconds(value * 0x36ee80);
  };

  Date.prototype.addDays = function (value) {
    return this.addMilliseconds(value * 0x5265c00);
  };

  Date.prototype.addMonths = function (value) {
    var d = this;
    value += this.getMonth();
    if (value < 0) {
      d.setFullYear(this.getFullYear() + value / 12, value % 12 + 12, this.getDate());
    } else {
      d.setFullYear(this.getFullYear() + value / 12, value % 12, this.getDate());
    }
    return d;
  };

  Date.prototype.addYears = function (value) {
    return this.addMonths(value * 12);
  };

  Date.prototype.weekFirstDay = function () {
    return this.addDays(1 - this.getDay() || 7);
  };

  Date.prototype.weekLastDay = function () {
    return this.weekFirstDay().addDays(6);
  };

  Date.prototype.monthFirstDay = function () {
    var d = this;
    d.setDate(1);
    return d;
  };

  Date.prototype.monthLastDay = function () {
    return this.addMonths(1).monthFirstDay().addDays(-1);
  };

  Date.now = function () {
    return new Date();
  };

  Date.parse = function (dateStr) {
    var d = null;
    var matches = /^\s*([12]\d{3}|\d{2})[-\/\u5E74](1[0-2]|0?[1-9])[-\/\u6708]([12]\d|3[01]|0?[1-9])\u65E5?(?: (1\d|2[0-3]|0?[0-9])[:\u65F6]([1-5]\d|0?\d)[:\u5206]?([1-5]\d|0?\d)?)?/.exec(dateStr);
    if (matches == null) {
      throw new Error("\u65E0\u6548\u7684\u65E5\u671F\u683C\u5F0F");
    }
    d = new Date(matches[1], Number(matches[2]) - 1, matches[3]);
    if(matches[4] != null) {
      d.setHours(+matches[4]);
    } 
    if(matches[5] != null) {
      d.setMinutes(+matches[5]);
    }
    if(matches[6] != null) {
      d.setSeconds(+matches[6]);
    }
    return d;
  };
  // ***************************************************************
  // Array prototype extend
  // ***************************************************************  
  Array.prototype.remove = function(item) {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
        return true;
    }
    return false;
  };
})(j4, window, document);