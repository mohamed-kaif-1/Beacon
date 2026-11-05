function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReact_production_min;
function requireReact_production_min() {
  if (hasRequiredReact_production_min) return react_production_min;
  hasRequiredReact_production_min = 1;
  var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
  function A(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z && a[z] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C = Object.assign, D = {};
  function E(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  E.prototype.isReactComponent = {};
  E.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b, "setState");
  };
  E.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  F.prototype = E.prototype;
  function G(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  var H = G.prototype = new F();
  H.constructor = G;
  C(H, E.prototype);
  H.isPureReactComponent = true;
  var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = { current: null }, L = { key: true, ref: true, __self: true, __source: true };
  function M(a, b, e) {
    var d, c = {}, k = null, h = null;
    if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
    var g = arguments.length - 2;
    if (1 === g) c.children = e;
    else if (1 < g) {
      for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
      c.children = f;
    }
    if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
    return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K.current };
  }
  function N(a, b) {
    return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
  }
  function escape(a) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b[a2];
    });
  }
  var P = /\/+/g;
  function Q(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
  }
  function R(a, b, e, d, c) {
    var k = typeof a;
    if ("undefined" === k || "boolean" === k) a = null;
    var h = false;
    if (null === a) h = true;
    else switch (k) {
      case "string":
      case "number":
        h = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l:
          case n:
            h = true;
        }
    }
    if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
      return a2;
    })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
    h = 0;
    d = "" === d ? "." : d + ":";
    if (I(a)) for (var g = 0; g < a.length; g++) {
      k = a[g];
      var f = d + Q(k, g);
      h += R(k, b, e, f, c);
    }
    else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
    else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return h;
  }
  function S(a, b, e) {
    if (null == a) return a;
    var d = [], c = 0;
    R(a, d, "", "", function(a2) {
      return b.call(e, a2, c++);
    });
    return d;
  }
  function T(a) {
    if (-1 === a._status) {
      var b = a._result;
      b = b();
      b.then(function(b2) {
        if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
      }, function(b2) {
        if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
      });
      -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
  }
  var U = { current: null }, V = { transition: null }, W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
  function X2() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S, forEach: function(a, b, e) {
    S(a, function() {
      b.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b = 0;
    S(a, function() {
      b++;
    });
    return b;
  }, toArray: function(a) {
    return S(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E;
  react_production_min.Fragment = p;
  react_production_min.Profiler = r;
  react_production_min.PureComponent = G;
  react_production_min.StrictMode = q;
  react_production_min.Suspense = w;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
  react_production_min.act = X2;
  react_production_min.cloneElement = function(a, b, e) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
    if (null != b) {
      void 0 !== b.ref && (k = b.ref, h = K.current);
      void 0 !== b.key && (c = "" + b.key);
      if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
      for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
    }
    var f = arguments.length - 2;
    if (1 === f) d.children = e;
    else if (1 < f) {
      g = Array(f);
      for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
      d.children = g;
    }
    return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M;
  react_production_min.createFactory = function(a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v, render: a };
  };
  react_production_min.isValidElement = O;
  react_production_min.lazy = function(a) {
    return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
  };
  react_production_min.memo = function(a, b) {
    return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
  };
  react_production_min.startTransition = function(a) {
    var b = V.transition;
    V.transition = {};
    try {
      a();
    } finally {
      V.transition = b;
    }
  };
  react_production_min.unstable_act = X2;
  react_production_min.useCallback = function(a, b) {
    return U.current.useCallback(a, b);
  };
  react_production_min.useContext = function(a) {
    return U.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b) {
    return U.current.useEffect(a, b);
  };
  react_production_min.useId = function() {
    return U.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b, e) {
    return U.current.useImperativeHandle(a, b, e);
  };
  react_production_min.useInsertionEffect = function(a, b) {
    return U.current.useInsertionEffect(a, b);
  };
  react_production_min.useLayoutEffect = function(a, b) {
    return U.current.useLayoutEffect(a, b);
  };
  react_production_min.useMemo = function(a, b) {
    return U.current.useMemo(a, b);
  };
  react_production_min.useReducer = function(a, b, e) {
    return U.current.useReducer(a, b, e);
  };
  react_production_min.useRef = function(a) {
    return U.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b, e) {
    return U.current.useSyncExternalStore(a, b, e);
  };
  react_production_min.useTransition = function() {
    return U.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  return react_production_min;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production_min();
  }
  return react.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = requireReact(), k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var reactExports = requireReact();
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredScheduler_production_min;
function requireScheduler_production_min() {
  if (hasRequiredScheduler_production_min) return scheduler_production_min;
  hasRequiredScheduler_production_min = 1;
  (function(exports) {
    function f(a, b) {
      var c = a.length;
      a.push(b);
      a: for (; 0 < c; ) {
        var d = c - 1 >>> 1, e = a[d];
        if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
        else break a;
      }
    }
    function h(a) {
      return 0 === a.length ? null : a[0];
    }
    function k(a) {
      if (0 === a.length) return null;
      var b = a[0], c = a.pop();
      if (c !== b) {
        a[0] = c;
        a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
          var m = 2 * (d + 1) - 1, C = a[m], n = m + 1, x = a[n];
          if (0 > g(C, c)) n < e && 0 > g(x, C) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C, a[m] = c, d = m);
          else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
          else break a;
        }
      }
      return b;
    }
    function g(a, b) {
      var c = a.sortIndex - b.sortIndex;
      return 0 !== c ? c : a.id - b.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var l = performance;
      exports.unstable_now = function() {
        return l.now();
      };
    } else {
      var p = Date, q = p.now();
      exports.unstable_now = function() {
        return p.now() - q;
      };
    }
    var r = [], t = [], u = 1, v = null, y = 3, z = false, A = false, B = false, D = "function" === typeof setTimeout ? setTimeout : null, E = "function" === typeof clearTimeout ? clearTimeout : null, F = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G(a) {
      for (var b = h(t); null !== b; ) {
        if (null === b.callback) k(t);
        else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
        else break;
        b = h(t);
      }
    }
    function H(a) {
      B = false;
      G(a);
      if (!A) if (null !== h(r)) A = true, I(J);
      else {
        var b = h(t);
        null !== b && K(H, b.startTime - a);
      }
    }
    function J(a, b) {
      A = false;
      B && (B = false, E(L), L = -1);
      z = true;
      var c = y;
      try {
        G(b);
        for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
          var d = v.callback;
          if ("function" === typeof d) {
            v.callback = null;
            y = v.priorityLevel;
            var e = d(v.expirationTime <= b);
            b = exports.unstable_now();
            "function" === typeof e ? v.callback = e : v === h(r) && k(r);
            G(b);
          } else k(r);
          v = h(r);
        }
        if (null !== v) var w = true;
        else {
          var m = h(t);
          null !== m && K(H, m.startTime - b);
          w = false;
        }
        return w;
      } finally {
        v = null, y = c, z = false;
      }
    }
    var N = false, O = null, L = -1, P = 5, Q = -1;
    function M() {
      return exports.unstable_now() - Q < P ? false : true;
    }
    function R() {
      if (null !== O) {
        var a = exports.unstable_now();
        Q = a;
        var b = true;
        try {
          b = O(true, a);
        } finally {
          b ? S() : (N = false, O = null);
        }
      } else N = false;
    }
    var S;
    if ("function" === typeof F) S = function() {
      F(R);
    };
    else if ("undefined" !== typeof MessageChannel) {
      var T = new MessageChannel(), U = T.port2;
      T.port1.onmessage = R;
      S = function() {
        U.postMessage(null);
      };
    } else S = function() {
      D(R, 0);
    };
    function I(a) {
      O = a;
      N || (N = true, S());
    }
    function K(a, b) {
      L = D(function() {
        a(exports.unstable_now());
      }, b);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A || z || (A = true, I(J));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h(r);
    };
    exports.unstable_next = function(a) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var b = 3;
          break;
        default:
          b = y;
      }
      var c = y;
      y = b;
      try {
        return a();
      } finally {
        y = c;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c = y;
      y = a;
      try {
        return b();
      } finally {
        y = c;
      }
    };
    exports.unstable_scheduleCallback = function(a, b, c) {
      var d = exports.unstable_now();
      "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
      switch (a) {
        case 1:
          var e = -1;
          break;
        case 2:
          e = 250;
          break;
        case 5:
          e = 1073741823;
          break;
        case 4:
          e = 1e4;
          break;
        default:
          e = 5e3;
      }
      e = c + e;
      a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
      c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B ? (E(L), L = -1) : B = true, K(H, c - d))) : (a.sortIndex = e, f(r, a), A || z || (A = true, I(J)));
      return a;
    };
    exports.unstable_shouldYield = M;
    exports.unstable_wrapCallback = function(a) {
      var b = y;
      return function() {
        var c = y;
        y = b;
        try {
          return a.apply(this, arguments);
        } finally {
          y = c;
        }
      };
    };
  })(scheduler_production_min);
  return scheduler_production_min;
}
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler) return scheduler.exports;
  hasRequiredScheduler = 1;
  {
    scheduler.exports = requireScheduler_production_min();
  }
  return scheduler.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_production_min;
function requireReactDom_production_min() {
  if (hasRequiredReactDom_production_min) return reactDom_production_min;
  hasRequiredReactDom_production_min = 1;
  var aa = requireReact(), ca = requireScheduler();
  function p(a) {
    for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
    return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a, b) {
    ha(a, b);
    ha(a + "Capture", b);
  }
  function ha(a, b) {
    ea[a] = b;
    for (a = 0; a < b.length; a++) da.add(b[a]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a) {
    if (ja.call(ma, a)) return true;
    if (ja.call(la, a)) return false;
    if (ka.test(a)) return ma[a] = true;
    la[a] = true;
    return false;
  }
  function pa(a, b, c, d) {
    if (null !== c && 0 === c.type) return false;
    switch (typeof b) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d) return false;
        if (null !== c) return !c.acceptsBooleans;
        a = a.toLowerCase().slice(0, 5);
        return "data-" !== a && "aria-" !== a;
      default:
        return false;
    }
  }
  function qa(a, b, c, d) {
    if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
    if (d) return false;
    if (null !== c) switch (c.type) {
      case 3:
        return !b;
      case 4:
        return false === b;
      case 5:
        return isNaN(b);
      case 6:
        return isNaN(b) || 1 > b;
    }
    return false;
  }
  function v(a, b, c, d, e, f, g) {
    this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
    this.attributeName = d;
    this.attributeNamespace = e;
    this.mustUseProperty = c;
    this.propertyName = a;
    this.type = b;
    this.sanitizeURL = f;
    this.removeEmptyString = g;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z[a] = new v(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b = a[0];
    z[b] = new v(b, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z[a] = new v(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z[a] = new v(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z[a] = new v(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z[a] = new v(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ra = /[\-:]([a-z])/g;
  function sa(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b = a.replace(
      ra,
      sa
    );
    z[b] = new v(b, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b = a.replace(ra, sa);
    z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b = a.replace(ra, sa);
    z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
  });
  function ta(a, b, c, d) {
    var e = z.hasOwnProperty(b) ? z[b] : null;
    if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a) {
    if (null === a || "object" !== typeof a) return null;
    a = Ja && a[Ja] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var A = Object.assign, La;
  function Ma(a) {
    if (void 0 === La) try {
      throw Error();
    } catch (c) {
      var b = c.stack.trim().match(/\n( *(at )?)/);
      La = b && b[1] || "";
    }
    return "\n" + La + a;
  }
  var Na = false;
  function Oa(a, b) {
    if (!a || Na) return "";
    Na = true;
    var c = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b) if (b = function() {
        throw Error();
      }, Object.defineProperty(b.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b, []);
        } catch (l) {
          var d = l;
        }
        Reflect.construct(a, [], b);
      } else {
        try {
          b.call();
        } catch (l) {
          d = l;
        }
        a.call(b.prototype);
      }
      else {
        try {
          throw Error();
        } catch (l) {
          d = l;
        }
        a();
      }
    } catch (l) {
      if (l && d && "string" === typeof l.stack) {
        for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
        for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
          if (1 !== g || 1 !== h) {
            do
              if (g--, h--, 0 > h || e[g] !== f[h]) {
                var k = "\n" + e[g].replace(" at new ", " at ");
                a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                return k;
              }
            while (1 <= g && 0 <= h);
          }
          break;
        }
      }
    } finally {
      Na = false, Error.prepareStackTrace = c;
    }
    return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
  }
  function Pa(a) {
    switch (a.tag) {
      case 5:
        return Ma(a.type);
      case 16:
        return Ma("Lazy");
      case 13:
        return Ma("Suspense");
      case 19:
        return Ma("SuspenseList");
      case 0:
      case 2:
      case 15:
        return a = Oa(a.type, false), a;
      case 11:
        return a = Oa(a.type.render, false), a;
      case 1:
        return a = Oa(a.type, true), a;
      default:
        return "";
    }
  }
  function Qa(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case ya:
        return "Fragment";
      case wa:
        return "Portal";
      case Aa:
        return "Profiler";
      case za:
        return "StrictMode";
      case Ea:
        return "Suspense";
      case Fa:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
      case Ha:
        b = a._payload;
        a = a._init;
        try {
          return Qa(a(b));
        } catch (c) {
        }
    }
    return null;
  }
  function Ra(a) {
    var b = a.type;
    switch (a.tag) {
      case 24:
        return "Cache";
      case 9:
        return (b.displayName || "Context") + ".Consumer";
      case 10:
        return (b._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return b;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Qa(b);
      case 8:
        return b === za ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof b) return b.displayName || b.name || null;
        if ("string" === typeof b) return b;
    }
    return null;
  }
  function Sa(a) {
    switch (typeof a) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a;
      case "object":
        return a;
      default:
        return "";
    }
  }
  function Ta(a) {
    var b = a.type;
    return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
  }
  function Ua(a) {
    var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
    if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
      var e = c.get, f = c.set;
      Object.defineProperty(a, b, { configurable: true, get: function() {
        return e.call(this);
      }, set: function(a2) {
        d = "" + a2;
        f.call(this, a2);
      } });
      Object.defineProperty(a, b, { enumerable: c.enumerable });
      return { getValue: function() {
        return d;
      }, setValue: function(a2) {
        d = "" + a2;
      }, stopTracking: function() {
        a._valueTracker = null;
        delete a[b];
      } };
    }
  }
  function Va(a) {
    a._valueTracker || (a._valueTracker = Ua(a));
  }
  function Wa(a) {
    if (!a) return false;
    var b = a._valueTracker;
    if (!b) return true;
    var c = b.getValue();
    var d = "";
    a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
    a = d;
    return a !== c ? (b.setValue(a), true) : false;
  }
  function Xa(a) {
    a = a || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a) return null;
    try {
      return a.activeElement || a.body;
    } catch (b) {
      return a.body;
    }
  }
  function Ya(a, b) {
    var c = b.checked;
    return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
  }
  function Za(a, b) {
    var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
    c = Sa(null != b.value ? b.value : c);
    a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
  }
  function ab(a, b) {
    b = b.checked;
    null != b && ta(a, "checked", b, false);
  }
  function bb(a, b) {
    ab(a, b);
    var c = Sa(b.value), d = b.type;
    if (null != c) if ("number" === d) {
      if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
    } else a.value !== "" + c && (a.value = "" + c);
    else if ("submit" === d || "reset" === d) {
      a.removeAttribute("value");
      return;
    }
    b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
    null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
  }
  function db(a, b, c) {
    if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
      var d = b.type;
      if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
      b = "" + a._wrapperState.initialValue;
      c || b === a.value || (a.value = b);
      a.defaultValue = b;
    }
    c = a.name;
    "" !== c && (a.name = "");
    a.defaultChecked = !!a._wrapperState.initialChecked;
    "" !== c && (a.name = c);
  }
  function cb(a, b, c) {
    if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
  }
  var eb = Array.isArray;
  function fb(a, b, c, d) {
    a = a.options;
    if (b) {
      b = {};
      for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
      for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
    } else {
      c = "" + Sa(c);
      b = null;
      for (e = 0; e < a.length; e++) {
        if (a[e].value === c) {
          a[e].selected = true;
          d && (a[e].defaultSelected = true);
          return;
        }
        null !== b || a[e].disabled || (b = a[e]);
      }
      null !== b && (b.selected = true);
    }
  }
  function gb(a, b) {
    if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
    return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
  }
  function hb(a, b) {
    var c = b.value;
    if (null == c) {
      c = b.children;
      b = b.defaultValue;
      if (null != c) {
        if (null != b) throw Error(p(92));
        if (eb(c)) {
          if (1 < c.length) throw Error(p(93));
          c = c[0];
        }
        b = c;
      }
      null == b && (b = "");
      c = b;
    }
    a._wrapperState = { initialValue: Sa(c) };
  }
  function ib(a, b) {
    var c = Sa(b.value), d = Sa(b.defaultValue);
    null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
    null != d && (a.defaultValue = "" + d);
  }
  function jb(a) {
    var b = a.textContent;
    b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
  }
  function kb(a) {
    switch (a) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function lb(a, b) {
    return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
  }
  var mb, nb = (function(a) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
      MSApp.execUnsafeLocalFunction(function() {
        return a(b, c, d, e);
      });
    } : a;
  })(function(a, b) {
    if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
      for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
      for (; b.firstChild; ) a.appendChild(b.firstChild);
    }
  });
  function ob(a, b) {
    if (b) {
      var c = a.firstChild;
      if (c && c === a.lastChild && 3 === c.nodeType) {
        c.nodeValue = b;
        return;
      }
    }
    a.textContent = b;
  }
  var pb = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, qb = ["Webkit", "ms", "Moz", "O"];
  Object.keys(pb).forEach(function(a) {
    qb.forEach(function(b) {
      b = b + a.charAt(0).toUpperCase() + a.substring(1);
      pb[b] = pb[a];
    });
  });
  function rb(a, b, c) {
    return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
  }
  function sb(a, b) {
    a = a.style;
    for (var c in b) if (b.hasOwnProperty(c)) {
      var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
      "float" === c && (c = "cssFloat");
      d ? a.setProperty(c, e) : a[c] = e;
    }
  }
  var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a, b) {
    if (b) {
      if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
      if (null != b.dangerouslySetInnerHTML) {
        if (null != b.children) throw Error(p(60));
        if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
      }
      if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
    }
  }
  function vb(a, b) {
    if (-1 === a.indexOf("-")) return "string" === typeof b.is;
    switch (a) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var wb = null;
  function xb(a) {
    a = a.target || a.srcElement || window;
    a.correspondingUseElement && (a = a.correspondingUseElement);
    return 3 === a.nodeType ? a.parentNode : a;
  }
  var yb = null, zb = null, Ab = null;
  function Bb(a) {
    if (a = Cb(a)) {
      if ("function" !== typeof yb) throw Error(p(280));
      var b = a.stateNode;
      b && (b = Db(b), yb(a.stateNode, a.type, b));
    }
  }
  function Eb(a) {
    zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
  }
  function Fb() {
    if (zb) {
      var a = zb, b = Ab;
      Ab = zb = null;
      Bb(a);
      if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
    }
  }
  function Gb(a, b) {
    return a(b);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a, b, c) {
    if (Ib) return a(b, c);
    Ib = true;
    try {
      return Gb(a, b, c);
    } finally {
      if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
    }
  }
  function Kb(a, b) {
    var c = a.stateNode;
    if (null === c) return null;
    var d = Db(c);
    if (null === d) return null;
    c = d[b];
    a: switch (b) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d;
        break a;
      default:
        a = false;
    }
    if (a) return null;
    if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
    return c;
  }
  var Lb = false;
  if (ia) try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
  function Nb(a, b, c, d, e, f, g, h, k) {
    var l = Array.prototype.slice.call(arguments, 3);
    try {
      b.apply(c, l);
    } catch (m) {
      this.onError(m);
    }
  }
  var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
    Ob = true;
    Pb = a;
  } };
  function Tb(a, b, c, d, e, f, g, h, k) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a, b, c, d, e, f, g, h, k) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l = Pb;
        Ob = false;
        Pb = null;
      } else throw Error(p(198));
      Qb || (Qb = true, Rb = l);
    }
  }
  function Vb(a) {
    var b = a, c = a;
    if (a.alternate) for (; b.return; ) b = b.return;
    else {
      a = b;
      do
        b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
      while (a);
    }
    return 3 === b.tag ? c : null;
  }
  function Wb(a) {
    if (13 === a.tag) {
      var b = a.memoizedState;
      null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
      if (null !== b) return b.dehydrated;
    }
    return null;
  }
  function Xb(a) {
    if (Vb(a) !== a) throw Error(p(188));
  }
  function Yb(a) {
    var b = a.alternate;
    if (!b) {
      b = Vb(a);
      if (null === b) throw Error(p(188));
      return b !== a ? null : a;
    }
    for (var c = a, d = b; ; ) {
      var e = c.return;
      if (null === e) break;
      var f = e.alternate;
      if (null === f) {
        d = e.return;
        if (null !== d) {
          c = d;
          continue;
        }
        break;
      }
      if (e.child === f.child) {
        for (f = e.child; f; ) {
          if (f === c) return Xb(e), a;
          if (f === d) return Xb(e), b;
          f = f.sibling;
        }
        throw Error(p(188));
      }
      if (c.return !== d.return) c = e, d = f;
      else {
        for (var g = false, h = e.child; h; ) {
          if (h === c) {
            g = true;
            c = e;
            d = f;
            break;
          }
          if (h === d) {
            g = true;
            d = e;
            c = f;
            break;
          }
          h = h.sibling;
        }
        if (!g) {
          for (h = f.child; h; ) {
            if (h === c) {
              g = true;
              c = f;
              d = e;
              break;
            }
            if (h === d) {
              g = true;
              d = f;
              c = e;
              break;
            }
            h = h.sibling;
          }
          if (!g) throw Error(p(189));
        }
      }
      if (c.alternate !== d) throw Error(p(190));
    }
    if (3 !== c.tag) throw Error(p(188));
    return c.stateNode.current === c ? a : b;
  }
  function Zb(a) {
    a = Yb(a);
    return null !== a ? $b(a) : null;
  }
  function $b(a) {
    if (5 === a.tag || 6 === a.tag) return a;
    for (a = a.child; null !== a; ) {
      var b = $b(a);
      if (null !== b) return b;
      a = a.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a) {
    if (lc && "function" === typeof lc.onCommitFiberRoot) try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b) {
    }
  }
  var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
  function nc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
  }
  var rc = 64, sc = 4194304;
  function tc(a) {
    switch (a & -a) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return a & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return a;
    }
  }
  function uc(a, b) {
    var c = a.pendingLanes;
    if (0 === c) return 0;
    var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
    if (0 !== g) {
      var h = g & ~e;
      0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
    } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
    if (0 === d) return 0;
    if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
    0 !== (d & 4) && (d |= c & 16);
    b = a.entangledLanes;
    if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
    return d;
  }
  function vc(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 4:
        return b + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return b + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function wc(a, b) {
    for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
      var g = 31 - oc(f), h = 1 << g, k = e[g];
      if (-1 === k) {
        if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
      } else k <= b && (a.expiredLanes |= h);
      f &= ~h;
    }
  }
  function xc(a) {
    a = a.pendingLanes & -1073741825;
    return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
  }
  function yc() {
    var a = rc;
    rc <<= 1;
    0 === (rc & 4194240) && (rc = 64);
    return a;
  }
  function zc(a) {
    for (var b = [], c = 0; 31 > c; c++) b.push(a);
    return b;
  }
  function Ac(a, b, c) {
    a.pendingLanes |= b;
    536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
    a = a.eventTimes;
    b = 31 - oc(b);
    a[b] = c;
  }
  function Bc(a, b) {
    var c = a.pendingLanes & ~b;
    a.pendingLanes = b;
    a.suspendedLanes = 0;
    a.pingedLanes = 0;
    a.expiredLanes &= b;
    a.mutableReadLanes &= b;
    a.entangledLanes &= b;
    b = a.entanglements;
    var d = a.eventTimes;
    for (a = a.expirationTimes; 0 < c; ) {
      var e = 31 - oc(c), f = 1 << e;
      b[e] = 0;
      d[e] = -1;
      a[e] = -1;
      c &= ~f;
    }
  }
  function Cc(a, b) {
    var c = a.entangledLanes |= b;
    for (a = a.entanglements; c; ) {
      var d = 31 - oc(c), e = 1 << d;
      e & b | a[d] & b && (a[d] |= b);
      c &= ~e;
    }
  }
  var C = 0;
  function Dc(a) {
    a &= -a;
    return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
  }
  var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Sc(a, b) {
    switch (a) {
      case "focusin":
      case "focusout":
        Lc = null;
        break;
      case "dragenter":
      case "dragleave":
        Mc = null;
        break;
      case "mouseover":
      case "mouseout":
        Nc = null;
        break;
      case "pointerover":
      case "pointerout":
        Oc.delete(b.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pc.delete(b.pointerId);
    }
  }
  function Tc(a, b, c, d, e, f) {
    if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
    a.eventSystemFlags |= d;
    b = a.targetContainers;
    null !== e && -1 === b.indexOf(e) && b.push(e);
    return a;
  }
  function Uc(a, b, c, d, e) {
    switch (b) {
      case "focusin":
        return Lc = Tc(Lc, a, b, c, d, e), true;
      case "dragenter":
        return Mc = Tc(Mc, a, b, c, d, e), true;
      case "mouseover":
        return Nc = Tc(Nc, a, b, c, d, e), true;
      case "pointerover":
        var f = e.pointerId;
        Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
        return true;
      case "gotpointercapture":
        return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
    }
    return false;
  }
  function Vc(a) {
    var b = Wc(a.target);
    if (null !== b) {
      var c = Vb(b);
      if (null !== c) {
        if (b = c.tag, 13 === b) {
          if (b = Wb(c), null !== b) {
            a.blockedOn = b;
            Ic(a.priority, function() {
              Gc(c);
            });
            return;
          }
        } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
          a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a.blockedOn = null;
  }
  function Xc(a) {
    if (null !== a.blockedOn) return false;
    for (var b = a.targetContainers; 0 < b.length; ) {
      var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
      if (null === c) {
        c = a.nativeEvent;
        var d = new c.constructor(c.type, c);
        wb = d;
        c.target.dispatchEvent(d);
        wb = null;
      } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
      b.shift();
    }
    return true;
  }
  function Zc(a, b, c) {
    Xc(a) && c.delete(b);
  }
  function $c() {
    Jc = false;
    null !== Lc && Xc(Lc) && (Lc = null);
    null !== Mc && Xc(Mc) && (Mc = null);
    null !== Nc && Xc(Nc) && (Nc = null);
    Oc.forEach(Zc);
    Pc.forEach(Zc);
  }
  function ad(a, b) {
    a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
  }
  function bd(a) {
    function b(b2) {
      return ad(b2, a);
    }
    if (0 < Kc.length) {
      ad(Kc[0], a);
      for (var c = 1; c < Kc.length; c++) {
        var d = Kc[c];
        d.blockedOn === a && (d.blockedOn = null);
      }
    }
    null !== Lc && ad(Lc, a);
    null !== Mc && ad(Mc, a);
    null !== Nc && ad(Nc, a);
    Oc.forEach(b);
    Pc.forEach(b);
    for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
    for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a, b, c, d) {
    var e = C, f = cd.transition;
    cd.transition = null;
    try {
      C = 1, fd(a, b, c, d);
    } finally {
      C = e, cd.transition = f;
    }
  }
  function gd(a, b, c, d) {
    var e = C, f = cd.transition;
    cd.transition = null;
    try {
      C = 4, fd(a, b, c, d);
    } finally {
      C = e, cd.transition = f;
    }
  }
  function fd(a, b, c, d) {
    if (dd) {
      var e = Yc(a, b, c, d);
      if (null === e) hd(a, b, d, id, c), Sc(a, d);
      else if (Uc(e, a, b, c, d)) d.stopPropagation();
      else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
        for (; null !== e; ) {
          var f = Cb(e);
          null !== f && Ec(f);
          f = Yc(a, b, c, d);
          null === f && hd(a, b, d, id, c);
          if (f === e) break;
          e = f;
        }
        null !== e && d.stopPropagation();
      } else hd(a, b, d, null, c);
    }
  }
  var id = null;
  function Yc(a, b, c, d) {
    id = null;
    a = xb(d);
    a = Wc(a);
    if (null !== a) if (b = Vb(a), null === b) a = null;
    else if (c = b.tag, 13 === c) {
      a = Wb(b);
      if (null !== a) return a;
      a = null;
    } else if (3 === c) {
      if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
      a = null;
    } else b !== a && (a = null);
    id = a;
    return null;
  }
  function jd(a) {
    switch (a) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ec()) {
          case fc:
            return 1;
          case gc:
            return 4;
          case hc:
          case ic:
            return 16;
          case jc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kd = null, ld = null, md = null;
  function nd() {
    if (md) return md;
    var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
    for (a = 0; a < c && b[a] === e[a]; a++) ;
    var g = c - a;
    for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
    return md = e.slice(a, 1 < d ? 1 - d : void 0);
  }
  function od(a) {
    var b = a.keyCode;
    "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
    10 === a && (a = 13);
    return 32 <= a || 13 === a ? a : 0;
  }
  function pd() {
    return true;
  }
  function qd() {
    return false;
  }
  function rd(a) {
    function b(b2, d, e, f, g) {
      this._reactName = b2;
      this._targetInst = e;
      this.type = d;
      this.nativeEvent = f;
      this.target = g;
      this.currentTarget = null;
      for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
      this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
      this.isPropagationStopped = qd;
      return this;
    }
    A(b.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var a2 = this.nativeEvent;
      a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
    }, stopPropagation: function() {
      var a2 = this.nativeEvent;
      a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
    }, persist: function() {
    }, isPersistent: pd });
    return b;
  }
  var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
    return a.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
    return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
  }, movementX: function(a) {
    if ("movementX" in a) return a.movementX;
    a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
    return wd;
  }, movementY: function(a) {
    return "movementY" in a ? a.movementY : xd;
  } }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
    return "clipboardData" in a ? a.clipboardData : window.clipboardData;
  } }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Pd(a) {
    var b = this.nativeEvent;
    return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
  }
  function zd() {
    return Pd;
  }
  var Qd = A({}, ud, { key: function(a) {
    if (a.key) {
      var b = Md[a.key] || a.key;
      if ("Unidentified" !== b) return b;
    }
    return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
    return "keypress" === a.type ? od(a) : 0;
  }, keyCode: function(a) {
    return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  }, which: function(a) {
    return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  } }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
    deltaX: function(a) {
      return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
    },
    deltaY: function(a) {
      return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
  ia && "documentMode" in document && (be = document.documentMode);
  var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
  function ge(a, b) {
    switch (a) {
      case "keyup":
        return -1 !== $d.indexOf(b.keyCode);
      case "keydown":
        return 229 !== b.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function he(a) {
    a = a.detail;
    return "object" === typeof a && "data" in a ? a.data : null;
  }
  var ie = false;
  function je(a, b) {
    switch (a) {
      case "compositionend":
        return he(b);
      case "keypress":
        if (32 !== b.which) return null;
        fe = true;
        return ee;
      case "textInput":
        return a = b.data, a === ee && fe ? null : a;
      default:
        return null;
    }
  }
  function ke(a, b) {
    if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
          if (b.char && 1 < b.char.length) return b.char;
          if (b.which) return String.fromCharCode(b.which);
        }
        return null;
      case "compositionend":
        return de && "ko" !== b.locale ? null : b.data;
      default:
        return null;
    }
  }
  var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function me(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase();
    return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
  }
  function ne(a, b, c, d) {
    Eb(d);
    b = oe(b, "onChange");
    0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
  }
  var pe = null, qe = null;
  function re(a) {
    se(a, 0);
  }
  function te(a) {
    var b = ue(a);
    if (Wa(b)) return a;
  }
  function ve(a, b) {
    if ("change" === a) return b;
  }
  var we = false;
  if (ia) {
    var xe;
    if (ia) {
      var ye = "oninput" in document;
      if (!ye) {
        var ze = document.createElement("div");
        ze.setAttribute("oninput", "return;");
        ye = "function" === typeof ze.oninput;
      }
      xe = ye;
    } else xe = false;
    we = xe && (!document.documentMode || 9 < document.documentMode);
  }
  function Ae() {
    pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
  }
  function Be(a) {
    if ("value" === a.propertyName && te(qe)) {
      var b = [];
      ne(b, qe, a, xb(a));
      Jb(re, b);
    }
  }
  function Ce(a, b, c) {
    "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
  }
  function De(a) {
    if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
  }
  function Ee(a, b) {
    if ("click" === a) return te(b);
  }
  function Fe(a, b) {
    if ("input" === a || "change" === a) return te(b);
  }
  function Ge(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  var He = "function" === typeof Object.is ? Object.is : Ge;
  function Ie(a, b) {
    if (He(a, b)) return true;
    if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
    var c = Object.keys(a), d = Object.keys(b);
    if (c.length !== d.length) return false;
    for (d = 0; d < c.length; d++) {
      var e = c[d];
      if (!ja.call(b, e) || !He(a[e], b[e])) return false;
    }
    return true;
  }
  function Je(a) {
    for (; a && a.firstChild; ) a = a.firstChild;
    return a;
  }
  function Ke(a, b) {
    var c = Je(a);
    a = 0;
    for (var d; c; ) {
      if (3 === c.nodeType) {
        d = a + c.textContent.length;
        if (a <= b && d >= b) return { node: c, offset: b - a };
        a = d;
      }
      a: {
        for (; c; ) {
          if (c.nextSibling) {
            c = c.nextSibling;
            break a;
          }
          c = c.parentNode;
        }
        c = void 0;
      }
      c = Je(c);
    }
  }
  function Le(a, b) {
    return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
  }
  function Me() {
    for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
      try {
        var c = "string" === typeof b.contentWindow.location.href;
      } catch (d) {
        c = false;
      }
      if (c) a = b.contentWindow;
      else break;
      b = Xa(a.document);
    }
    return b;
  }
  function Ne(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase();
    return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
  }
  function Oe(a) {
    var b = Me(), c = a.focusedElem, d = a.selectionRange;
    if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
      if (null !== d && Ne(c)) {
        if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
        else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var e = c.textContent.length, f = Math.min(d.start, e);
          d = void 0 === d.end ? f : Math.min(d.end, e);
          !a.extend && f > d && (e = d, d = f, f = e);
          e = Ke(c, f);
          var g = Ke(
            c,
            d
          );
          e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
        }
      }
      b = [];
      for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
      "function" === typeof c.focus && c.focus();
      for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
    }
  }
  var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
  function Ue(a, b, c) {
    var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
    Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
  }
  function Ve(a, b) {
    var c = {};
    c[a.toLowerCase()] = b.toLowerCase();
    c["Webkit" + a] = "webkit" + b;
    c["Moz" + a] = "moz" + b;
    return c;
  }
  var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
  ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
  function Ze(a) {
    if (Xe[a]) return Xe[a];
    if (!We[a]) return a;
    var b = We[a], c;
    for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
    return a;
  }
  var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ff(a, b) {
    df.set(a, b);
    fa(b, [a]);
  }
  for (var gf = 0; gf < ef.length; gf++) {
    var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
    ff(jf, "on" + kf);
  }
  ff($e, "onAnimationEnd");
  ff(af, "onAnimationIteration");
  ff(bf, "onAnimationStart");
  ff("dblclick", "onDoubleClick");
  ff("focusin", "onFocus");
  ff("focusout", "onBlur");
  ff(cf, "onTransitionEnd");
  ha("onMouseEnter", ["mouseout", "mouseover"]);
  ha("onMouseLeave", ["mouseout", "mouseover"]);
  ha("onPointerEnter", ["pointerout", "pointerover"]);
  ha("onPointerLeave", ["pointerout", "pointerover"]);
  fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
  function nf(a, b, c) {
    var d = a.type || "unknown-event";
    a.currentTarget = c;
    Ub(d, b, void 0, a);
    a.currentTarget = null;
  }
  function se(a, b) {
    b = 0 !== (b & 4);
    for (var c = 0; c < a.length; c++) {
      var d = a[c], e = d.event;
      d = d.listeners;
      a: {
        var f = void 0;
        if (b) for (var g = d.length - 1; 0 <= g; g--) {
          var h = d[g], k = h.instance, l = h.currentTarget;
          h = h.listener;
          if (k !== f && e.isPropagationStopped()) break a;
          nf(e, h, l);
          f = k;
        }
        else for (g = 0; g < d.length; g++) {
          h = d[g];
          k = h.instance;
          l = h.currentTarget;
          h = h.listener;
          if (k !== f && e.isPropagationStopped()) break a;
          nf(e, h, l);
          f = k;
        }
      }
    }
    if (Qb) throw a = Rb, Qb = false, Rb = null, a;
  }
  function D(a, b) {
    var c = b[of];
    void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
    var d = a + "__bubble";
    c.has(d) || (pf(b, a, 2, false), c.add(d));
  }
  function qf(a, b, c) {
    var d = 0;
    b && (d |= 4);
    pf(c, a, d, b);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(a) {
    if (!a[rf]) {
      a[rf] = true;
      da.forEach(function(b2) {
        "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
      });
      var b = 9 === a.nodeType ? a : a.ownerDocument;
      null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
    }
  }
  function pf(a, b, c, d) {
    switch (jd(b)) {
      case 1:
        var e = ed;
        break;
      case 4:
        e = gd;
        break;
      default:
        e = fd;
    }
    c = e.bind(null, b, c, a);
    e = void 0;
    !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
    d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
  }
  function hd(a, b, c, d, e) {
    var f = d;
    if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
      if (null === d) return;
      var g = d.tag;
      if (3 === g || 4 === g) {
        var h = d.stateNode.containerInfo;
        if (h === e || 8 === h.nodeType && h.parentNode === e) break;
        if (4 === g) for (g = d.return; null !== g; ) {
          var k = g.tag;
          if (3 === k || 4 === k) {
            if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
          }
          g = g.return;
        }
        for (; null !== h; ) {
          g = Wc(h);
          if (null === g) return;
          k = g.tag;
          if (5 === k || 6 === k) {
            d = f = g;
            continue a;
          }
          h = h.parentNode;
        }
      }
      d = d.return;
    }
    Jb(function() {
      var d2 = f, e2 = xb(c), g2 = [];
      a: {
        var h2 = df.get(a);
        if (void 0 !== h2) {
          var k2 = td, n = a;
          switch (a) {
            case "keypress":
              if (0 === od(c)) break a;
            case "keydown":
            case "keyup":
              k2 = Rd;
              break;
            case "focusin":
              n = "focus";
              k2 = Fd;
              break;
            case "focusout":
              n = "blur";
              k2 = Fd;
              break;
            case "beforeblur":
            case "afterblur":
              k2 = Fd;
              break;
            case "click":
              if (2 === c.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k2 = Bd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k2 = Dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k2 = Vd;
              break;
            case $e:
            case af:
            case bf:
              k2 = Hd;
              break;
            case cf:
              k2 = Xd;
              break;
            case "scroll":
              k2 = vd;
              break;
            case "wheel":
              k2 = Zd;
              break;
            case "copy":
            case "cut":
            case "paste":
              k2 = Jd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k2 = Td;
          }
          var t = 0 !== (b & 4), J = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
          t = [];
          for (var w = d2, u; null !== w; ) {
            u = w;
            var F = u.stateNode;
            5 === u.tag && null !== F && (u = F, null !== x && (F = Kb(w, x), null != F && t.push(tf(w, F, u))));
            if (J) break;
            w = w.return;
          }
          0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
        }
      }
      if (0 === (b & 7)) {
        a: {
          h2 = "mouseover" === a || "pointerover" === a;
          k2 = "mouseout" === a || "pointerout" === a;
          if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
          if (k2 || h2) {
            h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
            if (k2) {
              if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J = Vb(n), n !== J || 5 !== n.tag && 6 !== n.tag)) n = null;
            } else k2 = null, n = d2;
            if (k2 !== n) {
              t = Bd;
              F = "onMouseLeave";
              x = "onMouseEnter";
              w = "mouse";
              if ("pointerout" === a || "pointerover" === a) t = Td, F = "onPointerLeave", x = "onPointerEnter", w = "pointer";
              J = null == k2 ? h2 : ue(k2);
              u = null == n ? h2 : ue(n);
              h2 = new t(F, w + "leave", k2, c, e2);
              h2.target = J;
              h2.relatedTarget = u;
              F = null;
              Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J, F = t);
              J = F;
              if (k2 && n) b: {
                t = k2;
                x = n;
                w = 0;
                for (u = t; u; u = vf(u)) w++;
                u = 0;
                for (F = x; F; F = vf(F)) u++;
                for (; 0 < w - u; ) t = vf(t), w--;
                for (; 0 < u - w; ) x = vf(x), u--;
                for (; w--; ) {
                  if (t === x || null !== x && t === x.alternate) break b;
                  t = vf(t);
                  x = vf(x);
                }
                t = null;
              }
              else t = null;
              null !== k2 && wf(g2, h2, k2, t, false);
              null !== n && null !== J && wf(g2, J, n, t, true);
            }
          }
        }
        a: {
          h2 = d2 ? ue(d2) : window;
          k2 = h2.nodeName && h2.nodeName.toLowerCase();
          if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve;
          else if (me(h2)) if (we) na = Fe;
          else {
            na = De;
            var xa = Ce;
          }
          else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
          if (na && (na = na(a, d2))) {
            ne(g2, na, c, e2);
            break a;
          }
          xa && xa(a, h2, d2);
          "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
        }
        xa = d2 ? ue(d2) : window;
        switch (a) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
            break;
          case "focusout":
            Se = Re = Qe = null;
            break;
          case "mousedown":
            Te = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Te = false;
            Ue(g2, c, e2);
            break;
          case "selectionchange":
            if (Pe) break;
          case "keydown":
          case "keyup":
            Ue(g2, c, e2);
        }
        var $a;
        if (ae) b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
        else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
        ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
        if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
      }
      se(g2, b);
    });
  }
  function tf(a, b, c) {
    return { instance: a, listener: b, currentTarget: c };
  }
  function oe(a, b) {
    for (var c = b + "Capture", d = []; null !== a; ) {
      var e = a, f = e.stateNode;
      5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
      a = a.return;
    }
    return d;
  }
  function vf(a) {
    if (null === a) return null;
    do
      a = a.return;
    while (a && 5 !== a.tag);
    return a ? a : null;
  }
  function wf(a, b, c, d, e) {
    for (var f = b._reactName, g = []; null !== c && c !== d; ) {
      var h = c, k = h.alternate, l = h.stateNode;
      if (null !== k && k === d) break;
      5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
      c = c.return;
    }
    0 !== g.length && a.push({ event: b, listeners: g });
  }
  var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
  function zf(a) {
    return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
  }
  function Af(a, b, c) {
    b = zf(b);
    if (zf(a) !== b && c) throw Error(p(425));
  }
  function Bf() {
  }
  var Cf = null, Df = null;
  function Ef(a, b) {
    return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
  }
  var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
    return Hf.resolve(null).then(a).catch(If);
  } : Ff;
  function If(a) {
    setTimeout(function() {
      throw a;
    });
  }
  function Kf(a, b) {
    var c = b, d = 0;
    do {
      var e = c.nextSibling;
      a.removeChild(c);
      if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
        if (0 === d) {
          a.removeChild(e);
          bd(b);
          return;
        }
        d--;
      } else "$" !== c && "$?" !== c && "$!" !== c || d++;
      c = e;
    } while (c);
    bd(b);
  }
  function Lf(a) {
    for (; null != a; a = a.nextSibling) {
      var b = a.nodeType;
      if (1 === b || 3 === b) break;
      if (8 === b) {
        b = a.data;
        if ("$" === b || "$!" === b || "$?" === b) break;
        if ("/$" === b) return null;
      }
    }
    return a;
  }
  function Mf(a) {
    a = a.previousSibling;
    for (var b = 0; a; ) {
      if (8 === a.nodeType) {
        var c = a.data;
        if ("$" === c || "$!" === c || "$?" === c) {
          if (0 === b) return a;
          b--;
        } else "/$" === c && b++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a) {
    var b = a[Of];
    if (b) return b;
    for (var c = a.parentNode; c; ) {
      if (b = c[uf] || c[Of]) {
        c = b.alternate;
        if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
          if (c = a[Of]) return c;
          a = Mf(a);
        }
        return b;
      }
      a = c;
      c = a.parentNode;
    }
    return null;
  }
  function Cb(a) {
    a = a[Of] || a[uf];
    return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
  }
  function ue(a) {
    if (5 === a.tag || 6 === a.tag) return a.stateNode;
    throw Error(p(33));
  }
  function Db(a) {
    return a[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a) {
    return { current: a };
  }
  function E(a) {
    0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G(a, b) {
    Tf++;
    Sf[Tf] = a.current;
    a.current = b;
  }
  var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a, b) {
    var c = a.type.contextTypes;
    if (!c) return Vf;
    var d = a.stateNode;
    if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
    var e = {}, f;
    for (f in c) e[f] = b[f];
    d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
    return e;
  }
  function Zf(a) {
    a = a.childContextTypes;
    return null !== a && void 0 !== a;
  }
  function $f() {
    E(Wf);
    E(H);
  }
  function ag(a, b, c) {
    if (H.current !== Vf) throw Error(p(168));
    G(H, b);
    G(Wf, c);
  }
  function bg(a, b, c) {
    var d = a.stateNode;
    b = b.childContextTypes;
    if ("function" !== typeof d.getChildContext) return c;
    d = d.getChildContext();
    for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
    return A({}, c, d);
  }
  function cg(a) {
    a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H.current;
    G(H, a);
    G(Wf, Wf.current);
    return true;
  }
  function dg(a, b, c) {
    var d = a.stateNode;
    if (!d) throw Error(p(169));
    c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
    G(Wf, c);
  }
  var eg = null, fg = false, gg = false;
  function hg(a) {
    null === eg ? eg = [a] : eg.push(a);
  }
  function ig(a) {
    fg = true;
    hg(a);
  }
  function jg() {
    if (!gg && null !== eg) {
      gg = true;
      var a = 0, b = C;
      try {
        var c = eg;
        for (C = 1; a < c.length; a++) {
          var d = c[a];
          do
            d = d(true);
          while (null !== d);
        }
        eg = null;
        fg = false;
      } catch (e) {
        throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
      } finally {
        C = b, gg = false;
      }
    }
    return null;
  }
  var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
  function tg(a, b) {
    kg[lg++] = ng;
    kg[lg++] = mg;
    mg = a;
    ng = b;
  }
  function ug(a, b, c) {
    og[pg++] = rg;
    og[pg++] = sg;
    og[pg++] = qg;
    qg = a;
    var d = rg;
    a = sg;
    var e = 32 - oc(d) - 1;
    d &= ~(1 << e);
    c += 1;
    var f = 32 - oc(b) + e;
    if (30 < f) {
      var g = e - e % 5;
      f = (d & (1 << g) - 1).toString(32);
      d >>= g;
      e -= g;
      rg = 1 << 32 - oc(b) + e | c << e | d;
      sg = f + a;
    } else rg = 1 << f | c << e | d, sg = a;
  }
  function vg(a) {
    null !== a.return && (tg(a, 1), ug(a, 1, 0));
  }
  function wg(a) {
    for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I = false, zg = null;
  function Ag(a, b) {
    var c = Bg(5, null, null, 0);
    c.elementType = "DELETED";
    c.stateNode = b;
    c.return = a;
    b = a.deletions;
    null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
  }
  function Cg(a, b) {
    switch (a.tag) {
      case 5:
        var c = a.type;
        b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
        return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
      case 6:
        return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
      case 13:
        return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
      default:
        return false;
    }
  }
  function Dg(a) {
    return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
  }
  function Eg(a) {
    if (I) {
      var b = yg;
      if (b) {
        var c = b;
        if (!Cg(a, b)) {
          if (Dg(a)) throw Error(p(418));
          b = Lf(c.nextSibling);
          var d = xg;
          b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
        }
      } else {
        if (Dg(a)) throw Error(p(418));
        a.flags = a.flags & -4097 | 2;
        I = false;
        xg = a;
      }
    }
  }
  function Fg(a) {
    for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
    xg = a;
  }
  function Gg(a) {
    if (a !== xg) return false;
    if (!I) return Fg(a), I = true, false;
    var b;
    (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
    if (b && (b = yg)) {
      if (Dg(a)) throw Hg(), Error(p(418));
      for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
    }
    Fg(a);
    if (13 === a.tag) {
      a = a.memoizedState;
      a = null !== a ? a.dehydrated : null;
      if (!a) throw Error(p(317));
      a: {
        a = a.nextSibling;
        for (b = 0; a; ) {
          if (8 === a.nodeType) {
            var c = a.data;
            if ("/$" === c) {
              if (0 === b) {
                yg = Lf(a.nextSibling);
                break a;
              }
              b--;
            } else "$" !== c && "$!" !== c && "$?" !== c || b++;
          }
          a = a.nextSibling;
        }
        yg = null;
      }
    } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a = yg; a; ) a = Lf(a.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I = false;
  }
  function Jg(a) {
    null === zg ? zg = [a] : zg.push(a);
  }
  var Kg = ua.ReactCurrentBatchConfig;
  function Lg(a, b, c) {
    a = c.ref;
    if (null !== a && "function" !== typeof a && "object" !== typeof a) {
      if (c._owner) {
        c = c._owner;
        if (c) {
          if (1 !== c.tag) throw Error(p(309));
          var d = c.stateNode;
        }
        if (!d) throw Error(p(147, a));
        var e = d, f = "" + a;
        if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
        b = function(a2) {
          var b2 = e.refs;
          null === a2 ? delete b2[f] : b2[f] = a2;
        };
        b._stringRef = f;
        return b;
      }
      if ("string" !== typeof a) throw Error(p(284));
      if (!c._owner) throw Error(p(290, a));
    }
    return a;
  }
  function Mg(a, b) {
    a = Object.prototype.toString.call(b);
    throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
  }
  function Ng(a) {
    var b = a._init;
    return b(a._payload);
  }
  function Og(a) {
    function b(b2, c2) {
      if (a) {
        var d2 = b2.deletions;
        null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
      }
    }
    function c(c2, d2) {
      if (!a) return null;
      for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
      return null;
    }
    function d(a2, b2) {
      for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
      return a2;
    }
    function e(a2, b2) {
      a2 = Pg(a2, b2);
      a2.index = 0;
      a2.sibling = null;
      return a2;
    }
    function f(b2, c2, d2) {
      b2.index = d2;
      if (!a) return b2.flags |= 1048576, c2;
      d2 = b2.alternate;
      if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
      b2.flags |= 2;
      return c2;
    }
    function g(b2) {
      a && null === b2.alternate && (b2.flags |= 2);
      return b2;
    }
    function h(a2, b2, c2, d2) {
      if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
      b2 = e(b2, c2);
      b2.return = a2;
      return b2;
    }
    function k(a2, b2, c2, d2) {
      var f2 = c2.type;
      if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
      if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
      d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
      d2.ref = Lg(a2, b2, c2);
      d2.return = a2;
      return d2;
    }
    function l(a2, b2, c2, d2) {
      if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
      b2 = e(b2, c2.children || []);
      b2.return = a2;
      return b2;
    }
    function m(a2, b2, c2, d2, f2) {
      if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
      b2 = e(b2, c2);
      b2.return = a2;
      return b2;
    }
    function q(a2, b2, c2) {
      if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
      if ("object" === typeof b2 && null !== b2) {
        switch (b2.$$typeof) {
          case va:
            return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
          case wa:
            return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
          case Ha:
            var d2 = b2._init;
            return q(a2, d2(b2._payload), c2);
        }
        if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
        Mg(a2, b2);
      }
      return null;
    }
    function r(a2, b2, c2, d2) {
      var e2 = null !== b2 ? b2.key : null;
      if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
      if ("object" === typeof c2 && null !== c2) {
        switch (c2.$$typeof) {
          case va:
            return c2.key === e2 ? k(a2, b2, c2, d2) : null;
          case wa:
            return c2.key === e2 ? l(a2, b2, c2, d2) : null;
          case Ha:
            return e2 = c2._init, r(
              a2,
              b2,
              e2(c2._payload),
              d2
            );
        }
        if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
        Mg(a2, c2);
      }
      return null;
    }
    function y(a2, b2, c2, d2, e2) {
      if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
      if ("object" === typeof d2 && null !== d2) {
        switch (d2.$$typeof) {
          case va:
            return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
          case wa:
            return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
          case Ha:
            var f2 = d2._init;
            return y(a2, b2, c2, f2(d2._payload), e2);
        }
        if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
        Mg(b2, d2);
      }
      return null;
    }
    function n(e2, g2, h2, k2) {
      for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
        u.index > w ? (x = u, u = null) : x = u.sibling;
        var n2 = r(e2, u, h2[w], k2);
        if (null === n2) {
          null === u && (u = x);
          break;
        }
        a && u && null === n2.alternate && b(e2, u);
        g2 = f(n2, g2, w);
        null === m2 ? l2 = n2 : m2.sibling = n2;
        m2 = n2;
        u = x;
      }
      if (w === h2.length) return c(e2, u), I && tg(e2, w), l2;
      if (null === u) {
        for (; w < h2.length; w++) u = q(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
        I && tg(e2, w);
        return l2;
      }
      for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
      a && u.forEach(function(a2) {
        return b(e2, a2);
      });
      I && tg(e2, w);
      return l2;
    }
    function t(e2, g2, h2, k2) {
      var l2 = Ka(h2);
      if ("function" !== typeof l2) throw Error(p(150));
      h2 = l2.call(h2);
      if (null == h2) throw Error(p(151));
      for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
        m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
        var t2 = r(e2, m2, n2.value, k2);
        if (null === t2) {
          null === m2 && (m2 = x);
          break;
        }
        a && m2 && null === t2.alternate && b(e2, m2);
        g2 = f(t2, g2, w);
        null === u ? l2 = t2 : u.sibling = t2;
        u = t2;
        m2 = x;
      }
      if (n2.done) return c(
        e2,
        m2
      ), I && tg(e2, w), l2;
      if (null === m2) {
        for (; !n2.done; w++, n2 = h2.next()) n2 = q(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
        I && tg(e2, w);
        return l2;
      }
      for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
      a && m2.forEach(function(a2) {
        return b(e2, a2);
      });
      I && tg(e2, w);
      return l2;
    }
    function J(a2, d2, f2, h2) {
      "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
      if ("object" === typeof f2 && null !== f2) {
        switch (f2.$$typeof) {
          case va:
            a: {
              for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                if (l2.key === k2) {
                  k2 = f2.type;
                  if (k2 === ya) {
                    if (7 === l2.tag) {
                      c(a2, l2.sibling);
                      d2 = e(l2, f2.props.children);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                  } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                    c(a2, l2.sibling);
                    d2 = e(l2, f2.props);
                    d2.ref = Lg(a2, l2, f2);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                  c(a2, l2);
                  break;
                } else b(a2, l2);
                l2 = l2.sibling;
              }
              f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
            }
            return g(a2);
          case wa:
            a: {
              for (l2 = f2.key; null !== d2; ) {
                if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                  c(a2, d2.sibling);
                  d2 = e(d2, f2.children || []);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                } else {
                  c(a2, d2);
                  break;
                }
                else b(a2, d2);
                d2 = d2.sibling;
              }
              d2 = Sg(f2, a2.mode, h2);
              d2.return = a2;
              a2 = d2;
            }
            return g(a2);
          case Ha:
            return l2 = f2._init, J(a2, d2, l2(f2._payload), h2);
        }
        if (eb(f2)) return n(a2, d2, f2, h2);
        if (Ka(f2)) return t(a2, d2, f2, h2);
        Mg(a2, f2);
      }
      return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
    }
    return J;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a) {
    var b = Wg.current;
    E(Wg);
    a._currentValue = b;
  }
  function bh(a, b, c) {
    for (; null !== a; ) {
      var d = a.alternate;
      (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
      if (a === c) break;
      a = a.return;
    }
  }
  function ch(a, b) {
    Xg = a;
    Zg = Yg = null;
    a = a.dependencies;
    null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
  }
  function eh(a) {
    var b = a._currentValue;
    if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
      if (null === Xg) throw Error(p(308));
      Yg = a;
      Xg.dependencies = { lanes: 0, firstContext: a };
    } else Yg = Yg.next = a;
    return b;
  }
  var fh = null;
  function gh(a) {
    null === fh ? fh = [a] : fh.push(a);
  }
  function hh(a, b, c, d) {
    var e = b.interleaved;
    null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
    b.interleaved = c;
    return ih(a, d);
  }
  function ih(a, b) {
    a.lanes |= b;
    var c = a.alternate;
    null !== c && (c.lanes |= b);
    c = a;
    for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
    return 3 === c.tag ? c.stateNode : null;
  }
  var jh = false;
  function kh(a) {
    a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lh(a, b) {
    a = a.updateQueue;
    b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
  }
  function mh(a, b) {
    return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
  }
  function nh(a, b, c) {
    var d = a.updateQueue;
    if (null === d) return null;
    d = d.shared;
    if (0 !== (K & 2)) {
      var e = d.pending;
      null === e ? b.next = b : (b.next = e.next, e.next = b);
      d.pending = b;
      return ih(a, c);
    }
    e = d.interleaved;
    null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
    d.interleaved = b;
    return ih(a, c);
  }
  function oh(a, b, c) {
    b = b.updateQueue;
    if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
      var d = b.lanes;
      d &= a.pendingLanes;
      c |= d;
      b.lanes = c;
      Cc(a, c);
    }
  }
  function ph(a, b) {
    var c = a.updateQueue, d = a.alternate;
    if (null !== d && (d = d.updateQueue, c === d)) {
      var e = null, f = null;
      c = c.firstBaseUpdate;
      if (null !== c) {
        do {
          var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
          null === f ? e = f = g : f = f.next = g;
          c = c.next;
        } while (null !== c);
        null === f ? e = f = b : f = f.next = b;
      } else e = f = b;
      c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
      a.updateQueue = c;
      return;
    }
    a = c.lastBaseUpdate;
    null === a ? c.firstBaseUpdate = b : a.next = b;
    c.lastBaseUpdate = b;
  }
  function qh(a, b, c, d) {
    var e = a.updateQueue;
    jh = false;
    var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
    if (null !== h) {
      e.shared.pending = null;
      var k = h, l = k.next;
      k.next = null;
      null === g ? f = l : g.next = l;
      g = k;
      var m = a.alternate;
      null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
    }
    if (null !== f) {
      var q = e.baseState;
      g = 0;
      m = l = k = null;
      h = f;
      do {
        var r = h.lane, y = h.eventTime;
        if ((d & r) === r) {
          null !== m && (m = m.next = {
            eventTime: y,
            lane: 0,
            tag: h.tag,
            payload: h.payload,
            callback: h.callback,
            next: null
          });
          a: {
            var n = a, t = h;
            r = b;
            y = c;
            switch (t.tag) {
              case 1:
                n = t.payload;
                if ("function" === typeof n) {
                  q = n.call(y, q, r);
                  break a;
                }
                q = n;
                break a;
              case 3:
                n.flags = n.flags & -65537 | 128;
              case 0:
                n = t.payload;
                r = "function" === typeof n ? n.call(y, q, r) : n;
                if (null === r || void 0 === r) break a;
                q = A({}, q, r);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
        } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q) : m = m.next = y, g |= r;
        h = h.next;
        if (null === h) if (h = e.shared.pending, null === h) break;
        else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
      } while (1);
      null === m && (k = q);
      e.baseState = k;
      e.firstBaseUpdate = l;
      e.lastBaseUpdate = m;
      b = e.shared.interleaved;
      if (null !== b) {
        e = b;
        do
          g |= e.lane, e = e.next;
        while (e !== b);
      } else null === f && (e.shared.lanes = 0);
      rh |= g;
      a.lanes = g;
      a.memoizedState = q;
    }
  }
  function sh(a, b, c) {
    a = b.effects;
    b.effects = null;
    if (null !== a) for (b = 0; b < a.length; b++) {
      var d = a[b], e = d.callback;
      if (null !== e) {
        d.callback = null;
        d = c;
        if ("function" !== typeof e) throw Error(p(191, e));
        e.call(d);
      }
    }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a) {
    if (a === th) throw Error(p(174));
    return a;
  }
  function yh(a, b) {
    G(wh, b);
    G(vh, a);
    G(uh, th);
    a = b.nodeType;
    switch (a) {
      case 9:
      case 11:
        b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
        break;
      default:
        a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
    }
    E(uh);
    G(uh, b);
  }
  function zh() {
    E(uh);
    E(vh);
    E(wh);
  }
  function Ah(a) {
    xh(wh.current);
    var b = xh(uh.current);
    var c = lb(b, a.type);
    b !== c && (G(vh, a), G(uh, c));
  }
  function Bh(a) {
    vh.current === a && (E(uh), E(vh));
  }
  var L = Uf(0);
  function Ch(a) {
    for (var b = a; null !== b; ) {
      if (13 === b.tag) {
        var c = b.memoizedState;
        if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
      } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
        if (0 !== (b.flags & 128)) return b;
      } else if (null !== b.child) {
        b.child.return = b;
        b = b.child;
        continue;
      }
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return null;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P() {
    throw Error(p(321));
  }
  function Mh(a, b) {
    if (null === b) return false;
    for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
    return true;
  }
  function Nh(a, b, c, d, e, f) {
    Hh = f;
    M = b;
    b.memoizedState = null;
    b.updateQueue = null;
    b.lanes = 0;
    Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
    a = c(d, e);
    if (Jh) {
      f = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f) throw Error(p(301));
        f += 1;
        O = N = null;
        b.updateQueue = null;
        Fh.current = Qh;
        a = c(d, e);
      } while (Jh);
    }
    Fh.current = Rh;
    b = null !== N && null !== N.next;
    Hh = 0;
    O = N = M = null;
    Ih = false;
    if (b) throw Error(p(300));
    return a;
  }
  function Sh() {
    var a = 0 !== Kh;
    Kh = 0;
    return a;
  }
  function Th() {
    var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
    return O;
  }
  function Uh() {
    if (null === N) {
      var a = M.alternate;
      a = null !== a ? a.memoizedState : null;
    } else a = N.next;
    var b = null === O ? M.memoizedState : O.next;
    if (null !== b) O = b, N = a;
    else {
      if (null === a) throw Error(p(310));
      N = a;
      a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
    }
    return O;
  }
  function Vh(a, b) {
    return "function" === typeof b ? b(a) : b;
  }
  function Wh(a) {
    var b = Uh(), c = b.queue;
    if (null === c) throw Error(p(311));
    c.lastRenderedReducer = a;
    var d = N, e = d.baseQueue, f = c.pending;
    if (null !== f) {
      if (null !== e) {
        var g = e.next;
        e.next = f.next;
        f.next = g;
      }
      d.baseQueue = e = f;
      c.pending = null;
    }
    if (null !== e) {
      f = e.next;
      d = d.baseState;
      var h = g = null, k = null, l = f;
      do {
        var m = l.lane;
        if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
        else {
          var q = {
            lane: m,
            action: l.action,
            hasEagerState: l.hasEagerState,
            eagerState: l.eagerState,
            next: null
          };
          null === k ? (h = k = q, g = d) : k = k.next = q;
          M.lanes |= m;
          rh |= m;
        }
        l = l.next;
      } while (null !== l && l !== f);
      null === k ? g = d : k.next = h;
      He(d, b.memoizedState) || (dh = true);
      b.memoizedState = d;
      b.baseState = g;
      b.baseQueue = k;
      c.lastRenderedState = d;
    }
    a = c.interleaved;
    if (null !== a) {
      e = a;
      do
        f = e.lane, M.lanes |= f, rh |= f, e = e.next;
      while (e !== a);
    } else null === e && (c.lanes = 0);
    return [b.memoizedState, c.dispatch];
  }
  function Xh(a) {
    var b = Uh(), c = b.queue;
    if (null === c) throw Error(p(311));
    c.lastRenderedReducer = a;
    var d = c.dispatch, e = c.pending, f = b.memoizedState;
    if (null !== e) {
      c.pending = null;
      var g = e = e.next;
      do
        f = a(f, g.action), g = g.next;
      while (g !== e);
      He(f, b.memoizedState) || (dh = true);
      b.memoizedState = f;
      null === b.baseQueue && (b.baseState = f);
      c.lastRenderedState = f;
    }
    return [f, d];
  }
  function Yh() {
  }
  function Zh(a, b) {
    var c = M, d = Uh(), e = b(), f = !He(d.memoizedState, e);
    f && (d.memoizedState = e, dh = true);
    d = d.queue;
    $h(ai.bind(null, c, d, a), [a]);
    if (d.getSnapshot !== b || f || null !== O && O.memoizedState.tag & 1) {
      c.flags |= 2048;
      bi(9, ci.bind(null, c, d, e, b), void 0, null);
      if (null === Q) throw Error(p(349));
      0 !== (Hh & 30) || di(c, b, e);
    }
    return e;
  }
  function di(a, b, c) {
    a.flags |= 16384;
    a = { getSnapshot: b, value: c };
    b = M.updateQueue;
    null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
  }
  function ci(a, b, c, d) {
    b.value = c;
    b.getSnapshot = d;
    ei(b) && fi(a);
  }
  function ai(a, b, c) {
    return c(function() {
      ei(b) && fi(a);
    });
  }
  function ei(a) {
    var b = a.getSnapshot;
    a = a.value;
    try {
      var c = b();
      return !He(a, c);
    } catch (d) {
      return true;
    }
  }
  function fi(a) {
    var b = ih(a, 1);
    null !== b && gi(b, a, 1, -1);
  }
  function hi(a) {
    var b = Th();
    "function" === typeof a && (a = a());
    b.memoizedState = b.baseState = a;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
    b.queue = a;
    a = a.dispatch = ii.bind(null, M, a);
    return [b.memoizedState, a];
  }
  function bi(a, b, c, d) {
    a = { tag: a, create: b, destroy: c, deps: d, next: null };
    b = M.updateQueue;
    null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
    return a;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a, b, c, d) {
    var e = Th();
    M.flags |= a;
    e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
  }
  function li(a, b, c, d) {
    var e = Uh();
    d = void 0 === d ? null : d;
    var f = void 0;
    if (null !== N) {
      var g = N.memoizedState;
      f = g.destroy;
      if (null !== d && Mh(d, g.deps)) {
        e.memoizedState = bi(b, c, f, d);
        return;
      }
    }
    M.flags |= a;
    e.memoizedState = bi(1 | b, c, f, d);
  }
  function mi(a, b) {
    return ki(8390656, 8, a, b);
  }
  function $h(a, b) {
    return li(2048, 8, a, b);
  }
  function ni(a, b) {
    return li(4, 2, a, b);
  }
  function oi(a, b) {
    return li(4, 4, a, b);
  }
  function pi(a, b) {
    if ("function" === typeof b) return a = a(), b(a), function() {
      b(null);
    };
    if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
      b.current = null;
    };
  }
  function qi(a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null;
    return li(4, 4, pi.bind(null, b, a), c);
  }
  function ri() {
  }
  function si(a, b) {
    var c = Uh();
    b = void 0 === b ? null : b;
    var d = c.memoizedState;
    if (null !== d && null !== b && Mh(b, d[1])) return d[0];
    c.memoizedState = [a, b];
    return a;
  }
  function ti(a, b) {
    var c = Uh();
    b = void 0 === b ? null : b;
    var d = c.memoizedState;
    if (null !== d && null !== b && Mh(b, d[1])) return d[0];
    a = a();
    c.memoizedState = [a, b];
    return a;
  }
  function ui(a, b, c) {
    if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
    He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
    return b;
  }
  function vi(a, b) {
    var c = C;
    C = 0 !== c && 4 > c ? c : 4;
    a(true);
    var d = Gh.transition;
    Gh.transition = {};
    try {
      a(false), b();
    } finally {
      C = c, Gh.transition = d;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a, b, c) {
    var d = yi(a);
    c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b, c);
    else if (c = hh(a, b, c, d), null !== c) {
      var e = R();
      gi(c, a, d, e);
      Bi(c, b, d);
    }
  }
  function ii(a, b, c) {
    var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b, e);
    else {
      var f = a.alternate;
      if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
        var g = b.lastRenderedState, h = f(g, c);
        e.hasEagerState = true;
        e.eagerState = h;
        if (He(h, g)) {
          var k = b.interleaved;
          null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
          b.interleaved = e;
          return;
        }
      } catch (l) {
      } finally {
      }
      c = hh(a, b, e, d);
      null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
    }
  }
  function zi(a) {
    var b = a.alternate;
    return a === M || null !== b && b === M;
  }
  function Ai(a, b) {
    Jh = Ih = true;
    var c = a.pending;
    null === c ? b.next = b : (b.next = c.next, c.next = b);
    a.pending = b;
  }
  function Bi(a, b, c) {
    if (0 !== (c & 4194240)) {
      var d = b.lanes;
      d &= a.pendingLanes;
      c |= d;
      b.lanes = c;
      Cc(a, c);
    }
  }
  var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
    Th().memoizedState = [a, void 0 === b ? null : b];
    return a;
  }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null;
    return ki(
      4194308,
      4,
      pi.bind(null, b, a),
      c
    );
  }, useLayoutEffect: function(a, b) {
    return ki(4194308, 4, a, b);
  }, useInsertionEffect: function(a, b) {
    return ki(4, 2, a, b);
  }, useMemo: function(a, b) {
    var c = Th();
    b = void 0 === b ? null : b;
    a = a();
    c.memoizedState = [a, b];
    return a;
  }, useReducer: function(a, b, c) {
    var d = Th();
    b = void 0 !== c ? c(b) : b;
    d.memoizedState = d.baseState = b;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
    d.queue = a;
    a = a.dispatch = xi.bind(null, M, a);
    return [d.memoizedState, a];
  }, useRef: function(a) {
    var b = Th();
    a = { current: a };
    return b.memoizedState = a;
  }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
    return Th().memoizedState = a;
  }, useTransition: function() {
    var a = hi(false), b = a[0];
    a = vi.bind(null, a[1]);
    Th().memoizedState = a;
    return [b, a];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(a, b, c) {
    var d = M, e = Th();
    if (I) {
      if (void 0 === c) throw Error(p(407));
      c = c();
    } else {
      c = b();
      if (null === Q) throw Error(p(349));
      0 !== (Hh & 30) || di(d, b, c);
    }
    e.memoizedState = c;
    var f = { value: c, getSnapshot: b };
    e.queue = f;
    mi(ai.bind(
      null,
      d,
      f,
      a
    ), [a]);
    d.flags |= 2048;
    bi(9, ci.bind(null, d, f, c, b), void 0, null);
    return c;
  }, useId: function() {
    var a = Th(), b = Q.identifierPrefix;
    if (I) {
      var c = sg;
      var d = rg;
      c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
      b = ":" + b + "R" + c;
      c = Kh++;
      0 < c && (b += "H" + c.toString(32));
      b += ":";
    } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
    return a.memoizedState = b;
  }, unstable_isNewReconciler: false }, Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function() {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function(a) {
      var b = Uh();
      return ui(b, N.memoizedState, a);
    },
    useTransition: function() {
      var a = Wh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: false
  }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
    return Xh(Vh);
  }, useDebugValue: ri, useDeferredValue: function(a) {
    var b = Uh();
    return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
  }, useTransition: function() {
    var a = Xh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a, b) {
    if (a && a.defaultProps) {
      b = A({}, b);
      a = a.defaultProps;
      for (var c in a) void 0 === b[c] && (b[c] = a[c]);
      return b;
    }
    return b;
  }
  function Di(a, b, c, d) {
    b = a.memoizedState;
    c = c(d, b);
    c = null === c || void 0 === c ? b : A({}, b, c);
    a.memoizedState = c;
    0 === a.lanes && (a.updateQueue.baseState = c);
  }
  var Ei = { isMounted: function(a) {
    return (a = a._reactInternals) ? Vb(a) === a : false;
  }, enqueueSetState: function(a, b, c) {
    a = a._reactInternals;
    var d = R(), e = yi(a), f = mh(d, e);
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    b = nh(a, f, e);
    null !== b && (gi(b, a, e, d), oh(b, a, e));
  }, enqueueReplaceState: function(a, b, c) {
    a = a._reactInternals;
    var d = R(), e = yi(a), f = mh(d, e);
    f.tag = 1;
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    b = nh(a, f, e);
    null !== b && (gi(b, a, e, d), oh(b, a, e));
  }, enqueueForceUpdate: function(a, b) {
    a = a._reactInternals;
    var c = R(), d = yi(a), e = mh(c, d);
    e.tag = 2;
    void 0 !== b && null !== b && (e.callback = b);
    b = nh(a, e, d);
    null !== b && (gi(b, a, d, c), oh(b, a, d));
  } };
  function Fi(a, b, c, d, e, f, g) {
    a = a.stateNode;
    return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f) : true;
  }
  function Gi(a, b, c) {
    var d = false, e = Vf;
    var f = b.contextType;
    "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
    b = new b(c, f);
    a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
    b.updater = Ei;
    a.stateNode = b;
    b._reactInternals = a;
    d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
    return b;
  }
  function Hi(a, b, c, d) {
    a = b.state;
    "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
    "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
    b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
  }
  function Ii(a, b, c, d) {
    var e = a.stateNode;
    e.props = c;
    e.state = a.memoizedState;
    e.refs = {};
    kh(a);
    var f = b.contextType;
    "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H.current, e.context = Yf(a, f));
    e.state = a.memoizedState;
    f = b.getDerivedStateFromProps;
    "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
    "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
    "function" === typeof e.componentDidMount && (a.flags |= 4194308);
  }
  function Ji(a, b) {
    try {
      var c = "", d = b;
      do
        c += Pa(d), d = d.return;
      while (d);
      var e = c;
    } catch (f) {
      e = "\nError generating stack: " + f.message + "\n" + f.stack;
    }
    return { value: a, source: b, stack: e, digest: null };
  }
  function Ki(a, b, c) {
    return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
  }
  function Li(a, b) {
    try {
      console.error(b.value);
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  var Mi = "function" === typeof WeakMap ? WeakMap : Map;
  function Ni(a, b, c) {
    c = mh(-1, c);
    c.tag = 3;
    c.payload = { element: null };
    var d = b.value;
    c.callback = function() {
      Oi || (Oi = true, Pi = d);
      Li(a, b);
    };
    return c;
  }
  function Qi(a, b, c) {
    c = mh(-1, c);
    c.tag = 3;
    var d = a.type.getDerivedStateFromError;
    if ("function" === typeof d) {
      var e = b.value;
      c.payload = function() {
        return d(e);
      };
      c.callback = function() {
        Li(a, b);
      };
    }
    var f = a.stateNode;
    null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
      Li(a, b);
      "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
      var c2 = b.stack;
      this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
    });
    return c;
  }
  function Si(a, b, c) {
    var d = a.pingCache;
    if (null === d) {
      d = a.pingCache = new Mi();
      var e = /* @__PURE__ */ new Set();
      d.set(b, e);
    } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
    e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
  }
  function Ui(a) {
    do {
      var b;
      if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
      if (b) return a;
      a = a.return;
    } while (null !== a);
    return null;
  }
  function Vi(a, b, c, d, e) {
    if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
    a.flags |= 65536;
    a.lanes = e;
    return a;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a, b, c, d) {
    b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
  }
  function Yi(a, b, c, d, e) {
    c = c.render;
    var f = b.ref;
    ch(b, e);
    d = Nh(a, b, c, d, f, e);
    c = Sh();
    if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
    I && c && vg(b);
    b.flags |= 1;
    Xi(a, b, d, e);
    return b.child;
  }
  function $i(a, b, c, d, e) {
    if (null === a) {
      var f = c.type;
      if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
      a = Rg(c.type, null, d, b, b.mode, e);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    f = a.child;
    if (0 === (a.lanes & e)) {
      var g = f.memoizedProps;
      c = c.compare;
      c = null !== c ? c : Ie;
      if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
    }
    b.flags |= 1;
    a = Pg(f, d);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  function bj(a, b, c, d, e) {
    if (null !== a) {
      var f = a.memoizedProps;
      if (Ie(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
      else return b.lanes = a.lanes, Zi(a, b, e);
    }
    return cj(a, b, c, d, e);
  }
  function dj(a, b, c) {
    var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
    if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
    else {
      if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d = null !== f ? f.baseLanes : c;
      G(ej, fj);
      fj |= d;
    }
    else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
    Xi(a, b, e, c);
    return b.child;
  }
  function gj(a, b) {
    var c = b.ref;
    if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
  }
  function cj(a, b, c, d, e) {
    var f = Zf(c) ? Xf : H.current;
    f = Yf(b, f);
    ch(b, e);
    c = Nh(a, b, c, d, f, e);
    d = Sh();
    if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
    I && d && vg(b);
    b.flags |= 1;
    Xi(a, b, c, e);
    return b.child;
  }
  function hj(a, b, c, d, e) {
    if (Zf(c)) {
      var f = true;
      cg(b);
    } else f = false;
    ch(b, e);
    if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
    else if (null === a) {
      var g = b.stateNode, h = b.memoizedProps;
      g.props = h;
      var k = g.context, l = c.contextType;
      "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H.current, l = Yf(b, l));
      var m = c.getDerivedStateFromProps, q = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
      q || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
      jh = false;
      var r = b.memoizedState;
      g.state = r;
      qh(b, d, g, e);
      k = b.memoizedState;
      h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
    } else {
      g = b.stateNode;
      lh(a, b);
      h = b.memoizedProps;
      l = b.type === b.elementType ? h : Ci(b.type, h);
      g.props = l;
      q = b.pendingProps;
      r = g.context;
      k = c.contextType;
      "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H.current, k = Yf(b, k));
      var y = c.getDerivedStateFromProps;
      (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q || r !== k) && Hi(b, g, d, k);
      jh = false;
      r = b.memoizedState;
      g.state = r;
      qh(b, d, g, e);
      var n = b.memoizedState;
      h !== q || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
    }
    return jj(a, b, c, d, f, e);
  }
  function jj(a, b, c, d, e, f) {
    gj(a, b);
    var g = 0 !== (b.flags & 128);
    if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
    d = b.stateNode;
    Wi.current = b;
    var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
    b.flags |= 1;
    null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
    b.memoizedState = d.state;
    e && dg(b, c, true);
    return b.child;
  }
  function kj(a) {
    var b = a.stateNode;
    b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
    yh(a, b.containerInfo);
  }
  function lj(a, b, c, d, e) {
    Ig();
    Jg(e);
    b.flags |= 256;
    Xi(a, b, c, d);
    return b.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a) {
    return { baseLanes: a, cachePool: null, transitions: null };
  }
  function oj(a, b, c) {
    var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
    (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
    if (h) f = true, b.flags &= -129;
    else if (null === a || null !== a.memoizedState) e |= 1;
    G(L, e & 1);
    if (null === a) {
      Eg(b);
      a = b.memoizedState;
      if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
      g = d.children;
      a = d.fallback;
      return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
    }
    e = a.memoizedState;
    if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
    if (f) {
      f = d.fallback;
      g = b.mode;
      e = a.child;
      h = e.sibling;
      var k = { mode: "hidden", children: d.children };
      0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
      null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
      f.return = b;
      d.return = b;
      d.sibling = f;
      b.child = d;
      d = f;
      f = b.child;
      g = a.child.memoizedState;
      g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
      f.memoizedState = g;
      f.childLanes = a.childLanes & ~c;
      b.memoizedState = mj;
      return d;
    }
    f = a.child;
    a = f.sibling;
    d = Pg(f, { mode: "visible", children: d.children });
    0 === (b.mode & 1) && (d.lanes = c);
    d.return = b;
    d.sibling = null;
    null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
    b.child = d;
    b.memoizedState = null;
    return d;
  }
  function qj(a, b) {
    b = pj({ mode: "visible", children: b }, a.mode, 0, null);
    b.return = a;
    return a.child = b;
  }
  function sj(a, b, c, d) {
    null !== d && Jg(d);
    Ug(b, a.child, null, c);
    a = qj(b, b.pendingProps.children);
    a.flags |= 2;
    b.memoizedState = null;
    return a;
  }
  function rj(a, b, c, d, e, f, g) {
    if (c) {
      if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
      if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
      f = d.fallback;
      e = b.mode;
      d = pj({ mode: "visible", children: d.children }, e, 0, null);
      f = Tg(f, e, g, null);
      f.flags |= 2;
      d.return = b;
      f.return = b;
      d.sibling = f;
      b.child = d;
      0 !== (b.mode & 1) && Ug(b, a.child, null, g);
      b.child.memoizedState = nj(g);
      b.memoizedState = mj;
      return f;
    }
    if (0 === (b.mode & 1)) return sj(a, b, g, null);
    if ("$!" === e.data) {
      d = e.nextSibling && e.nextSibling.dataset;
      if (d) var h = d.dgst;
      d = h;
      f = Error(p(419));
      d = Ki(f, d, void 0);
      return sj(a, b, g, d);
    }
    h = 0 !== (g & a.childLanes);
    if (dh || h) {
      d = Q;
      if (null !== d) {
        switch (g & -g) {
          case 4:
            e = 2;
            break;
          case 16:
            e = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            e = 32;
            break;
          case 536870912:
            e = 268435456;
            break;
          default:
            e = 0;
        }
        e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
        0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
      }
      tj();
      d = Ki(Error(p(421)));
      return sj(a, b, g, d);
    }
    if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
    a = f.treeContext;
    yg = Lf(e.nextSibling);
    xg = b;
    I = true;
    zg = null;
    null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
    b = qj(b, d.children);
    b.flags |= 4096;
    return b;
  }
  function vj(a, b, c) {
    a.lanes |= b;
    var d = a.alternate;
    null !== d && (d.lanes |= b);
    bh(a.return, b, c);
  }
  function wj(a, b, c, d, e) {
    var f = a.memoizedState;
    null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
  }
  function xj(a, b, c) {
    var d = b.pendingProps, e = d.revealOrder, f = d.tail;
    Xi(a, b, d.children, c);
    d = L.current;
    if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
    else {
      if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
        if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
        else if (19 === a.tag) vj(a, c, b);
        else if (null !== a.child) {
          a.child.return = a;
          a = a.child;
          continue;
        }
        if (a === b) break a;
        for (; null === a.sibling; ) {
          if (null === a.return || a.return === b) break a;
          a = a.return;
        }
        a.sibling.return = a.return;
        a = a.sibling;
      }
      d &= 1;
    }
    G(L, d);
    if (0 === (b.mode & 1)) b.memoizedState = null;
    else switch (e) {
      case "forwards":
        c = b.child;
        for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
        c = e;
        null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
        wj(b, false, e, c, f);
        break;
      case "backwards":
        c = null;
        e = b.child;
        for (b.child = null; null !== e; ) {
          a = e.alternate;
          if (null !== a && null === Ch(a)) {
            b.child = e;
            break;
          }
          a = e.sibling;
          e.sibling = c;
          c = e;
          e = a;
        }
        wj(b, true, c, null, f);
        break;
      case "together":
        wj(b, false, null, null, void 0);
        break;
      default:
        b.memoizedState = null;
    }
    return b.child;
  }
  function ij(a, b) {
    0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
  }
  function Zi(a, b, c) {
    null !== a && (b.dependencies = a.dependencies);
    rh |= b.lanes;
    if (0 === (c & b.childLanes)) return null;
    if (null !== a && b.child !== a.child) throw Error(p(153));
    if (null !== b.child) {
      a = b.child;
      c = Pg(a, a.pendingProps);
      b.child = c;
      for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
      c.sibling = null;
    }
    return b.child;
  }
  function yj(a, b, c) {
    switch (b.tag) {
      case 3:
        kj(b);
        Ig();
        break;
      case 5:
        Ah(b);
        break;
      case 1:
        Zf(b.type) && cg(b);
        break;
      case 4:
        yh(b, b.stateNode.containerInfo);
        break;
      case 10:
        var d = b.type._context, e = b.memoizedProps.value;
        G(Wg, d._currentValue);
        d._currentValue = e;
        break;
      case 13:
        d = b.memoizedState;
        if (null !== d) {
          if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
          if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
          G(L, L.current & 1);
          a = Zi(a, b, c);
          return null !== a ? a.sibling : null;
        }
        G(L, L.current & 1);
        break;
      case 19:
        d = 0 !== (c & b.childLanes);
        if (0 !== (a.flags & 128)) {
          if (d) return xj(a, b, c);
          b.flags |= 128;
        }
        e = b.memoizedState;
        null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
        G(L, L.current);
        if (d) break;
        else return null;
      case 22:
      case 23:
        return b.lanes = 0, dj(a, b, c);
    }
    return Zi(a, b, c);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a, b) {
    for (var c = b.child; null !== c; ) {
      if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
      else if (4 !== c.tag && null !== c.child) {
        c.child.return = c;
        c = c.child;
        continue;
      }
      if (c === b) break;
      for (; null === c.sibling; ) {
        if (null === c.return || c.return === b) return;
        c = c.return;
      }
      c.sibling.return = c.return;
      c = c.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a, b, c, d) {
    var e = a.memoizedProps;
    if (e !== d) {
      a = b.stateNode;
      xh(uh.current);
      var f = null;
      switch (c) {
        case "input":
          e = Ya(a, e);
          d = Ya(a, d);
          f = [];
          break;
        case "select":
          e = A({}, e, { value: void 0 });
          d = A({}, d, { value: void 0 });
          f = [];
          break;
        case "textarea":
          e = gb(a, e);
          d = gb(a, d);
          f = [];
          break;
        default:
          "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
      }
      ub(c, d);
      var g;
      c = null;
      for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
        var h = e[l];
        for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
      } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
      for (l in d) {
        var k = d[l];
        h = null != e ? e[l] : void 0;
        if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
          for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
          for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
        } else c || (f || (f = []), f.push(
          l,
          c
        )), c = k;
        else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
      }
      c && (f = f || []).push("style", c);
      var l = f;
      if (b.updateQueue = l) b.flags |= 4;
    }
  };
  Cj = function(a, b, c, d) {
    c !== d && (b.flags |= 4);
  };
  function Dj(a, b) {
    if (!I) switch (a.tailMode) {
      case "hidden":
        b = a.tail;
        for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
        null === c ? a.tail = null : c.sibling = null;
        break;
      case "collapsed":
        c = a.tail;
        for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
        null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
    }
  }
  function S(a) {
    var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
    if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
    else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
    a.subtreeFlags |= d;
    a.childLanes = c;
    return b;
  }
  function Ej(a, b, c) {
    var d = b.pendingProps;
    wg(b);
    switch (b.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return S(b), null;
      case 1:
        return Zf(b.type) && $f(), S(b), null;
      case 3:
        d = b.stateNode;
        zh();
        E(Wf);
        E(H);
        Eh();
        d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
        if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a, b);
        S(b);
        return null;
      case 5:
        Bh(b);
        var e = xh(wh.current);
        c = b.type;
        if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
        else {
          if (!d) {
            if (null === b.stateNode) throw Error(p(166));
            S(b);
            return null;
          }
          a = xh(uh.current);
          if (Gg(b)) {
            d = b.stateNode;
            c = b.type;
            var f = b.memoizedProps;
            d[Of] = b;
            d[Pf] = f;
            a = 0 !== (b.mode & 1);
            switch (c) {
              case "dialog":
                D("cancel", d);
                D("close", d);
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", d);
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], d);
                break;
              case "source":
                D("error", d);
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  d
                );
                D("load", d);
                break;
              case "details":
                D("toggle", d);
                break;
              case "input":
                Za(d, f);
                D("invalid", d);
                break;
              case "select":
                d._wrapperState = { wasMultiple: !!f.multiple };
                D("invalid", d);
                break;
              case "textarea":
                hb(d, f), D("invalid", d);
            }
            ub(c, f);
            e = null;
            for (var g in f) if (f.hasOwnProperty(g)) {
              var h = f[g];
              "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                d.textContent,
                h,
                a
              ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
            }
            switch (c) {
              case "input":
                Va(d);
                db(d, f, true);
                break;
              case "textarea":
                Va(d);
                jb(d);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof f.onClick && (d.onclick = Bf);
            }
            d = e;
            b.updateQueue = d;
            null !== d && (b.flags |= 4);
          } else {
            g = 9 === e.nodeType ? e : e.ownerDocument;
            "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
            "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
            a[Of] = b;
            a[Pf] = d;
            zj(a, b, false, false);
            b.stateNode = a;
            a: {
              g = vb(c, d);
              switch (c) {
                case "dialog":
                  D("cancel", a);
                  D("close", a);
                  e = d;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", a);
                  e = d;
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D(lf[e], a);
                  e = d;
                  break;
                case "source":
                  D("error", a);
                  e = d;
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    a
                  );
                  D("load", a);
                  e = d;
                  break;
                case "details":
                  D("toggle", a);
                  e = d;
                  break;
                case "input":
                  Za(a, d);
                  e = Ya(a, d);
                  D("invalid", a);
                  break;
                case "option":
                  e = d;
                  break;
                case "select":
                  a._wrapperState = { wasMultiple: !!d.multiple };
                  e = A({}, d, { value: void 0 });
                  D("invalid", a);
                  break;
                case "textarea":
                  hb(a, d);
                  e = gb(a, d);
                  D("invalid", a);
                  break;
                default:
                  e = d;
              }
              ub(c, e);
              h = e;
              for (f in h) if (h.hasOwnProperty(f)) {
                var k = h[f];
                "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D("scroll", a) : null != k && ta(a, f, k, g));
              }
              switch (c) {
                case "input":
                  Va(a);
                  db(a, d, false);
                  break;
                case "textarea":
                  Va(a);
                  jb(a);
                  break;
                case "option":
                  null != d.value && a.setAttribute("value", "" + Sa(d.value));
                  break;
                case "select":
                  a.multiple = !!d.multiple;
                  f = d.value;
                  null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                    a,
                    !!d.multiple,
                    d.defaultValue,
                    true
                  );
                  break;
                default:
                  "function" === typeof e.onClick && (a.onclick = Bf);
              }
              switch (c) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d = !!d.autoFocus;
                  break a;
                case "img":
                  d = true;
                  break a;
                default:
                  d = false;
              }
            }
            d && (b.flags |= 4);
          }
          null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
        }
        S(b);
        return null;
      case 6:
        if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
        else {
          if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
          c = xh(wh.current);
          xh(uh.current);
          if (Gg(b)) {
            d = b.stateNode;
            c = b.memoizedProps;
            d[Of] = b;
            if (f = d.nodeValue !== c) {
              if (a = xg, null !== a) switch (a.tag) {
                case 3:
                  Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
              }
            }
            f && (b.flags |= 4);
          } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
        }
        S(b);
        return null;
      case 13:
        E(L);
        d = b.memoizedState;
        if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
          if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
          else if (f = Gg(b), null !== d && null !== d.dehydrated) {
            if (null === a) {
              if (!f) throw Error(p(318));
              f = b.memoizedState;
              f = null !== f ? f.dehydrated : null;
              if (!f) throw Error(p(317));
              f[Of] = b;
            } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
            S(b);
            f = false;
          } else null !== zg && (Fj(zg), zg = null), f = true;
          if (!f) return b.flags & 65536 ? b : null;
        }
        if (0 !== (b.flags & 128)) return b.lanes = c, b;
        d = null !== d;
        d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
        null !== b.updateQueue && (b.flags |= 4);
        S(b);
        return null;
      case 4:
        return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
      case 10:
        return ah(b.type._context), S(b), null;
      case 17:
        return Zf(b.type) && $f(), S(b), null;
      case 19:
        E(L);
        f = b.memoizedState;
        if (null === f) return S(b), null;
        d = 0 !== (b.flags & 128);
        g = f.rendering;
        if (null === g) if (d) Dj(f, false);
        else {
          if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
            g = Ch(a);
            if (null !== g) {
              b.flags |= 128;
              Dj(f, false);
              d = g.updateQueue;
              null !== d && (b.updateQueue = d, b.flags |= 4);
              b.subtreeFlags = 0;
              d = c;
              for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
              G(L, L.current & 1 | 2);
              return b.child;
            }
            a = a.sibling;
          }
          null !== f.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
        }
        else {
          if (!d) if (a = Ch(g), null !== a) {
            if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I) return S(b), null;
          } else 2 * B() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
          f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
        }
        if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
        S(b);
        return null;
      case 22:
      case 23:
        return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p(156, b.tag));
  }
  function Ij(a, b) {
    wg(b);
    switch (b.tag) {
      case 1:
        return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
      case 3:
        return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
      case 5:
        return Bh(b), null;
      case 13:
        E(L);
        a = b.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          if (null === b.alternate) throw Error(p(340));
          Ig();
        }
        a = b.flags;
        return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
      case 19:
        return E(L), null;
      case 4:
        return zh(), null;
      case 10:
        return ah(b.type._context), null;
      case 22:
      case 23:
        return Hj(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
  function Lj(a, b) {
    var c = a.ref;
    if (null !== c) if ("function" === typeof c) try {
      c(null);
    } catch (d) {
      W(a, b, d);
    }
    else c.current = null;
  }
  function Mj(a, b, c) {
    try {
      c();
    } catch (d) {
      W(a, b, d);
    }
  }
  var Nj = false;
  function Oj(a, b) {
    Cf = dd;
    a = Me();
    if (Ne(a)) {
      if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
      else a: {
        c = (c = a.ownerDocument) && c.defaultView || window;
        var d = c.getSelection && c.getSelection();
        if (d && 0 !== d.rangeCount) {
          c = d.anchorNode;
          var e = d.anchorOffset, f = d.focusNode;
          d = d.focusOffset;
          try {
            c.nodeType, f.nodeType;
          } catch (F) {
            c = null;
            break a;
          }
          var g = 0, h = -1, k = -1, l = 0, m = 0, q = a, r = null;
          b: for (; ; ) {
            for (var y; ; ) {
              q !== c || 0 !== e && 3 !== q.nodeType || (h = g + e);
              q !== f || 0 !== d && 3 !== q.nodeType || (k = g + d);
              3 === q.nodeType && (g += q.nodeValue.length);
              if (null === (y = q.firstChild)) break;
              r = q;
              q = y;
            }
            for (; ; ) {
              if (q === a) break b;
              r === c && ++l === e && (h = g);
              r === f && ++m === d && (k = g);
              if (null !== (y = q.nextSibling)) break;
              q = r;
              r = q.parentNode;
            }
            q = y;
          }
          c = -1 === h || -1 === k ? null : { start: h, end: k };
        } else c = null;
      }
      c = c || { start: 0, end: 0 };
    } else c = null;
    Df = { focusedElem: a, selectionRange: c };
    dd = false;
    for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
    else for (; null !== V; ) {
      b = V;
      try {
        var n = b.alternate;
        if (0 !== (b.flags & 1024)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== n) {
              var t = n.memoizedProps, J = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J);
              x.__reactInternalSnapshotBeforeUpdate = w;
            }
            break;
          case 3:
            var u = b.stateNode.containerInfo;
            1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(p(163));
        }
      } catch (F) {
        W(b, b.return, F);
      }
      a = b.sibling;
      if (null !== a) {
        a.return = b.return;
        V = a;
        break;
      }
      V = b.return;
    }
    n = Nj;
    Nj = false;
    return n;
  }
  function Pj(a, b, c) {
    var d = b.updateQueue;
    d = null !== d ? d.lastEffect : null;
    if (null !== d) {
      var e = d = d.next;
      do {
        if ((e.tag & a) === a) {
          var f = e.destroy;
          e.destroy = void 0;
          void 0 !== f && Mj(b, c, f);
        }
        e = e.next;
      } while (e !== d);
    }
  }
  function Qj(a, b) {
    b = b.updateQueue;
    b = null !== b ? b.lastEffect : null;
    if (null !== b) {
      var c = b = b.next;
      do {
        if ((c.tag & a) === a) {
          var d = c.create;
          c.destroy = d();
        }
        c = c.next;
      } while (c !== b);
    }
  }
  function Rj(a) {
    var b = a.ref;
    if (null !== b) {
      var c = a.stateNode;
      switch (a.tag) {
        case 5:
          a = c;
          break;
        default:
          a = c;
      }
      "function" === typeof b ? b(a) : b.current = a;
    }
  }
  function Sj(a) {
    var b = a.alternate;
    null !== b && (a.alternate = null, Sj(b));
    a.child = null;
    a.deletions = null;
    a.sibling = null;
    5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
    a.stateNode = null;
    a.return = null;
    a.dependencies = null;
    a.memoizedProps = null;
    a.memoizedState = null;
    a.pendingProps = null;
    a.stateNode = null;
    a.updateQueue = null;
  }
  function Tj(a) {
    return 5 === a.tag || 3 === a.tag || 4 === a.tag;
  }
  function Uj(a) {
    a: for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Tj(a.return)) return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2) continue a;
        if (null === a.child || 4 === a.tag) continue a;
        else a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2)) return a.stateNode;
    }
  }
  function Vj(a, b, c) {
    var d = a.tag;
    if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
    else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
  }
  function Wj(a, b, c) {
    var d = a.tag;
    if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
    else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
  }
  var X2 = null, Xj = false;
  function Yj(a, b, c) {
    for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
  }
  function Zj(a, b, c) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
      lc.onCommitFiberUnmount(kc, c);
    } catch (h) {
    }
    switch (c.tag) {
      case 5:
        U || Lj(c, b);
      case 6:
        var d = X2, e = Xj;
        X2 = null;
        Yj(a, b, c);
        X2 = d;
        Xj = e;
        null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X2.removeChild(c.stateNode));
        break;
      case 18:
        null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X2, c.stateNode));
        break;
      case 4:
        d = X2;
        e = Xj;
        X2 = c.stateNode.containerInfo;
        Xj = true;
        Yj(a, b, c);
        X2 = d;
        Xj = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
          e = d = d.next;
          do {
            var f = e, g = f.destroy;
            f = f.tag;
            void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
            e = e.next;
          } while (e !== d);
        }
        Yj(a, b, c);
        break;
      case 1:
        if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
          d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
        } catch (h) {
          W(c, b, h);
        }
        Yj(a, b, c);
        break;
      case 21:
        Yj(a, b, c);
        break;
      case 22:
        c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
        break;
      default:
        Yj(a, b, c);
    }
  }
  function ak(a) {
    var b = a.updateQueue;
    if (null !== b) {
      a.updateQueue = null;
      var c = a.stateNode;
      null === c && (c = a.stateNode = new Kj());
      b.forEach(function(b2) {
        var d = bk.bind(null, a, b2);
        c.has(b2) || (c.add(b2), b2.then(d, d));
      });
    }
  }
  function ck(a, b) {
    var c = b.deletions;
    if (null !== c) for (var d = 0; d < c.length; d++) {
      var e = c[d];
      try {
        var f = a, g = b, h = g;
        a: for (; null !== h; ) {
          switch (h.tag) {
            case 5:
              X2 = h.stateNode;
              Xj = false;
              break a;
            case 3:
              X2 = h.stateNode.containerInfo;
              Xj = true;
              break a;
            case 4:
              X2 = h.stateNode.containerInfo;
              Xj = true;
              break a;
          }
          h = h.return;
        }
        if (null === X2) throw Error(p(160));
        Zj(f, g, e);
        X2 = null;
        Xj = false;
        var k = e.alternate;
        null !== k && (k.return = null);
        e.return = null;
      } catch (l) {
        W(e, b, l);
      }
    }
    if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
  }
  function dk(a, b) {
    var c = a.alternate, d = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ck(b, a);
        ek(a);
        if (d & 4) {
          try {
            Pj(3, a, a.return), Qj(3, a);
          } catch (t) {
            W(a, a.return, t);
          }
          try {
            Pj(5, a, a.return);
          } catch (t) {
            W(a, a.return, t);
          }
        }
        break;
      case 1:
        ck(b, a);
        ek(a);
        d & 512 && null !== c && Lj(c, c.return);
        break;
      case 5:
        ck(b, a);
        ek(a);
        d & 512 && null !== c && Lj(c, c.return);
        if (a.flags & 32) {
          var e = a.stateNode;
          try {
            ob(e, "");
          } catch (t) {
            W(a, a.return, t);
          }
        }
        if (d & 4 && (e = a.stateNode, null != e)) {
          var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
          a.updateQueue = null;
          if (null !== k) try {
            "input" === h && "radio" === f.type && null != f.name && ab(e, f);
            vb(h, g);
            var l = vb(h, f);
            for (g = 0; g < k.length; g += 2) {
              var m = k[g], q = k[g + 1];
              "style" === m ? sb(e, q) : "dangerouslySetInnerHTML" === m ? nb(e, q) : "children" === m ? ob(e, q) : ta(e, m, q, l);
            }
            switch (h) {
              case "input":
                bb(e, f);
                break;
              case "textarea":
                ib(e, f);
                break;
              case "select":
                var r = e._wrapperState.wasMultiple;
                e._wrapperState.wasMultiple = !!f.multiple;
                var y = f.value;
                null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                  e,
                  !!f.multiple,
                  f.defaultValue,
                  true
                ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
            }
            e[Pf] = f;
          } catch (t) {
            W(a, a.return, t);
          }
        }
        break;
      case 6:
        ck(b, a);
        ek(a);
        if (d & 4) {
          if (null === a.stateNode) throw Error(p(162));
          e = a.stateNode;
          f = a.memoizedProps;
          try {
            e.nodeValue = f;
          } catch (t) {
            W(a, a.return, t);
          }
        }
        break;
      case 3:
        ck(b, a);
        ek(a);
        if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
          bd(b.containerInfo);
        } catch (t) {
          W(a, a.return, t);
        }
        break;
      case 4:
        ck(b, a);
        ek(a);
        break;
      case 13:
        ck(b, a);
        ek(a);
        e = a.child;
        e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
        d & 4 && ak(a);
        break;
      case 22:
        m = null !== c && null !== c.memoizedState;
        a.mode & 1 ? (U = (l = U) || m, ck(b, a), U = l) : ck(b, a);
        ek(a);
        if (d & 8192) {
          l = null !== a.memoizedState;
          if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
            for (q = V = m; null !== V; ) {
              r = V;
              y = r.child;
              switch (r.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r, r.return);
                  break;
                case 1:
                  Lj(r, r.return);
                  var n = r.stateNode;
                  if ("function" === typeof n.componentWillUnmount) {
                    d = r;
                    c = r.return;
                    try {
                      b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                    } catch (t) {
                      W(d, c, t);
                    }
                  }
                  break;
                case 5:
                  Lj(r, r.return);
                  break;
                case 22:
                  if (null !== r.memoizedState) {
                    gk(q);
                    continue;
                  }
              }
              null !== y ? (y.return = r, V = y) : gk(q);
            }
            m = m.sibling;
          }
          a: for (m = null, q = a; ; ) {
            if (5 === q.tag) {
              if (null === m) {
                m = q;
                try {
                  e = q.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q.stateNode, k = q.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                } catch (t) {
                  W(a, a.return, t);
                }
              }
            } else if (6 === q.tag) {
              if (null === m) try {
                q.stateNode.nodeValue = l ? "" : q.memoizedProps;
              } catch (t) {
                W(a, a.return, t);
              }
            } else if ((22 !== q.tag && 23 !== q.tag || null === q.memoizedState || q === a) && null !== q.child) {
              q.child.return = q;
              q = q.child;
              continue;
            }
            if (q === a) break a;
            for (; null === q.sibling; ) {
              if (null === q.return || q.return === a) break a;
              m === q && (m = null);
              q = q.return;
            }
            m === q && (m = null);
            q.sibling.return = q.return;
            q = q.sibling;
          }
        }
        break;
      case 19:
        ck(b, a);
        ek(a);
        d & 4 && ak(a);
        break;
      case 21:
        break;
      default:
        ck(
          b,
          a
        ), ek(a);
    }
  }
  function ek(a) {
    var b = a.flags;
    if (b & 2) {
      try {
        a: {
          for (var c = a.return; null !== c; ) {
            if (Tj(c)) {
              var d = c;
              break a;
            }
            c = c.return;
          }
          throw Error(p(160));
        }
        switch (d.tag) {
          case 5:
            var e = d.stateNode;
            d.flags & 32 && (ob(e, ""), d.flags &= -33);
            var f = Uj(a);
            Wj(a, f, e);
            break;
          case 3:
          case 4:
            var g = d.stateNode.containerInfo, h = Uj(a);
            Vj(a, h, g);
            break;
          default:
            throw Error(p(161));
        }
      } catch (k) {
        W(a, a.return, k);
      }
      a.flags &= -3;
    }
    b & 4096 && (a.flags &= -4097);
  }
  function hk(a, b, c) {
    V = a;
    ik(a);
  }
  function ik(a, b, c) {
    for (var d = 0 !== (a.mode & 1); null !== V; ) {
      var e = V, f = e.child;
      if (22 === e.tag && d) {
        var g = null !== e.memoizedState || Jj;
        if (!g) {
          var h = e.alternate, k = null !== h && null !== h.memoizedState || U;
          h = Jj;
          var l = U;
          Jj = g;
          if ((U = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
          for (; null !== f; ) V = f, ik(f), f = f.sibling;
          V = e;
          Jj = h;
          U = l;
        }
        kk(a);
      } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a);
    }
  }
  function kk(a) {
    for (; null !== V; ) {
      var b = V;
      if (0 !== (b.flags & 8772)) {
        var c = b.alternate;
        try {
          if (0 !== (b.flags & 8772)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              U || Qj(5, b);
              break;
            case 1:
              var d = b.stateNode;
              if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
              else {
                var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
              }
              var f = b.updateQueue;
              null !== f && sh(b, f, d);
              break;
            case 3:
              var g = b.updateQueue;
              if (null !== g) {
                c = null;
                if (null !== b.child) switch (b.child.tag) {
                  case 5:
                    c = b.child.stateNode;
                    break;
                  case 1:
                    c = b.child.stateNode;
                }
                sh(b, g, c);
              }
              break;
            case 5:
              var h = b.stateNode;
              if (null === c && b.flags & 4) {
                c = h;
                var k = b.memoizedProps;
                switch (b.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && c.focus();
                    break;
                  case "img":
                    k.src && (c.src = k.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b.memoizedState) {
                var l = b.alternate;
                if (null !== l) {
                  var m = l.memoizedState;
                  if (null !== m) {
                    var q = m.dehydrated;
                    null !== q && bd(q);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p(163));
          }
          U || b.flags & 512 && Rj(b);
        } catch (r) {
          W(b, b.return, r);
        }
      }
      if (b === a) {
        V = null;
        break;
      }
      c = b.sibling;
      if (null !== c) {
        c.return = b.return;
        V = c;
        break;
      }
      V = b.return;
    }
  }
  function gk(a) {
    for (; null !== V; ) {
      var b = V;
      if (b === a) {
        V = null;
        break;
      }
      var c = b.sibling;
      if (null !== c) {
        c.return = b.return;
        V = c;
        break;
      }
      V = b.return;
    }
  }
  function jk(a) {
    for (; null !== V; ) {
      var b = V;
      try {
        switch (b.tag) {
          case 0:
          case 11:
          case 15:
            var c = b.return;
            try {
              Qj(4, b);
            } catch (k) {
              W(b, c, k);
            }
            break;
          case 1:
            var d = b.stateNode;
            if ("function" === typeof d.componentDidMount) {
              var e = b.return;
              try {
                d.componentDidMount();
              } catch (k) {
                W(b, e, k);
              }
            }
            var f = b.return;
            try {
              Rj(b);
            } catch (k) {
              W(b, f, k);
            }
            break;
          case 5:
            var g = b.return;
            try {
              Rj(b);
            } catch (k) {
              W(b, g, k);
            }
        }
      } catch (k) {
        W(b, b.return, k);
      }
      if (b === a) {
        V = null;
        break;
      }
      var h = b.sibling;
      if (null !== h) {
        h.return = b.return;
        V = h;
        break;
      }
      V = b.return;
    }
  }
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R() {
    return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
  }
  function yi(a) {
    if (0 === (a.mode & 1)) return 1;
    if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
    if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
    a = C;
    if (0 !== a) return a;
    a = window.event;
    a = void 0 === a ? 16 : jd(a.type);
    return a;
  }
  function gi(a, b, c, d) {
    if (50 < yk) throw yk = 0, zk = null, Error(p(185));
    Ac(a, c, d);
    if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
  }
  function Dk(a, b) {
    var c = a.callbackNode;
    wc(a, b);
    var d = uc(a, a === Q ? Z : 0);
    if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
    else if (b = d & -d, a.callbackPriority !== b) {
      null != c && bc(c);
      if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
        0 === (K & 6) && jg();
      }), c = null;
      else {
        switch (Dc(d)) {
          case 1:
            c = fc;
            break;
          case 4:
            c = gc;
            break;
          case 16:
            c = hc;
            break;
          case 536870912:
            c = jc;
            break;
          default:
            c = hc;
        }
        c = Fk(c, Gk.bind(null, a));
      }
      a.callbackPriority = b;
      a.callbackNode = c;
    }
  }
  function Gk(a, b) {
    Ak = -1;
    Bk = 0;
    if (0 !== (K & 6)) throw Error(p(327));
    var c = a.callbackNode;
    if (Hk() && a.callbackNode !== c) return null;
    var d = uc(a, a === Q ? Z : 0);
    if (0 === d) return null;
    if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
    else {
      b = d;
      var e = K;
      K |= 2;
      var f = Jk();
      if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
      do
        try {
          Lk();
          break;
        } catch (h) {
          Mk(a, h);
        }
      while (1);
      $g();
      mk.current = f;
      K = e;
      null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
    }
    if (0 !== b) {
      2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
      if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      if (6 === b) Ck(a, d);
      else {
        e = a.current.alternate;
        if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
        a.finishedWork = e;
        a.finishedLanes = d;
        switch (b) {
          case 0:
          case 1:
            throw Error(p(345));
          case 2:
            Pk(a, tk, uk);
            break;
          case 3:
            Ck(a, d);
            if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
              if (0 !== uc(a, 0)) break;
              e = a.suspendedLanes;
              if ((e & d) !== d) {
                R();
                a.pingedLanes |= a.suspendedLanes & e;
                break;
              }
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 4:
            Ck(a, d);
            if ((d & 4194240) === d) break;
            b = a.eventTimes;
            for (e = -1; 0 < d; ) {
              var g = 31 - oc(d);
              f = 1 << g;
              g = b[g];
              g > e && (e = g);
              d &= ~f;
            }
            d = e;
            d = B() - d;
            d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
            if (10 < d) {
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 5:
            Pk(a, tk, uk);
            break;
          default:
            throw Error(p(329));
        }
      }
    }
    Dk(a, B());
    return a.callbackNode === c ? Gk.bind(null, a) : null;
  }
  function Nk(a, b) {
    var c = sk;
    a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
    a = Ik(a, b);
    2 !== a && (b = tk, tk = c, null !== b && Fj(b));
    return a;
  }
  function Fj(a) {
    null === tk ? tk = a : tk.push.apply(tk, a);
  }
  function Ok(a) {
    for (var b = a; ; ) {
      if (b.flags & 16384) {
        var c = b.updateQueue;
        if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
          var e = c[d], f = e.getSnapshot;
          e = e.value;
          try {
            if (!He(f(), e)) return false;
          } catch (g) {
            return false;
          }
        }
      }
      c = b.child;
      if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
      else {
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return true;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
    }
    return true;
  }
  function Ck(a, b) {
    b &= ~rk;
    b &= ~qk;
    a.suspendedLanes |= b;
    a.pingedLanes &= ~b;
    for (a = a.expirationTimes; 0 < b; ) {
      var c = 31 - oc(b), d = 1 << c;
      a[c] = -1;
      b &= ~d;
    }
  }
  function Ek(a) {
    if (0 !== (K & 6)) throw Error(p(327));
    Hk();
    var b = uc(a, 0);
    if (0 === (b & 1)) return Dk(a, B()), null;
    var c = Ik(a, b);
    if (0 !== a.tag && 2 === c) {
      var d = xc(a);
      0 !== d && (b = d, c = Nk(a, d));
    }
    if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
    if (6 === c) throw Error(p(345));
    a.finishedWork = a.current.alternate;
    a.finishedLanes = b;
    Pk(a, tk, uk);
    Dk(a, B());
    return null;
  }
  function Qk(a, b) {
    var c = K;
    K |= 1;
    try {
      return a(b);
    } finally {
      K = c, 0 === K && (Gj = B() + 500, fg && jg());
    }
  }
  function Rk(a) {
    null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
    var b = K;
    K |= 1;
    var c = ok.transition, d = C;
    try {
      if (ok.transition = null, C = 1, a) return a();
    } finally {
      C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E(ej);
  }
  function Kk(a, b) {
    a.finishedWork = null;
    a.finishedLanes = 0;
    var c = a.timeoutHandle;
    -1 !== c && (a.timeoutHandle = -1, Gf(c));
    if (null !== Y) for (c = Y.return; null !== c; ) {
      var d = c;
      wg(d);
      switch (d.tag) {
        case 1:
          d = d.type.childContextTypes;
          null !== d && void 0 !== d && $f();
          break;
        case 3:
          zh();
          E(Wf);
          E(H);
          Eh();
          break;
        case 5:
          Bh(d);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(d.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c = c.return;
    }
    Q = a;
    Y = a = Pg(a.current, null);
    Z = fj = b;
    T = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
        c.interleaved = null;
        var e = d.next, f = c.pending;
        if (null !== f) {
          var g = f.next;
          f.next = e;
          d.next = g;
        }
        c.pending = d;
      }
      fh = null;
    }
    return a;
  }
  function Mk(a, b) {
    do {
      var c = Y;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d = M.memoizedState; null !== d; ) {
            var e = d.queue;
            null !== e && (e.pending = null);
            d = d.next;
          }
          Ih = false;
        }
        Hh = 0;
        O = N = M = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c || null === c.return) {
          T = 1;
          pk = b;
          Y = null;
          break;
        }
        a: {
          var f = a, g = c.return, h = c, k = b;
          b = Z;
          h.flags |= 32768;
          if (null !== k && "object" === typeof k && "function" === typeof k.then) {
            var l = k, m = h, q = m.tag;
            if (0 === (m.mode & 1) && (0 === q || 11 === q || 15 === q)) {
              var r = m.alternate;
              r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
            }
            var y = Ui(g);
            if (null !== y) {
              y.flags &= -257;
              Vi(y, g, h, f, b);
              y.mode & 1 && Si(f, l, b);
              b = y;
              k = l;
              var n = b.updateQueue;
              if (null === n) {
                var t = /* @__PURE__ */ new Set();
                t.add(k);
                b.updateQueue = t;
              } else n.add(k);
              break a;
            } else {
              if (0 === (b & 1)) {
                Si(f, l, b);
                tj();
                break a;
              }
              k = Error(p(426));
            }
          } else if (I && h.mode & 1) {
            var J = Ui(g);
            if (null !== J) {
              0 === (J.flags & 65536) && (J.flags |= 256);
              Vi(J, g, h, f, b);
              Jg(Ji(k, h));
              break a;
            }
          }
          f = k = Ji(k, h);
          4 !== T && (T = 2);
          null === sk ? sk = [f] : sk.push(f);
          f = g;
          do {
            switch (f.tag) {
              case 3:
                f.flags |= 65536;
                b &= -b;
                f.lanes |= b;
                var x = Ni(f, k, b);
                ph(f, x);
                break a;
              case 1:
                h = k;
                var w = f.type, u = f.stateNode;
                if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                  f.flags |= 65536;
                  b &= -b;
                  f.lanes |= b;
                  var F = Qi(f, h, b);
                  ph(f, F);
                  break a;
                }
            }
            f = f.return;
          } while (null !== f);
        }
        Sk(c);
      } catch (na) {
        b = na;
        Y === c && null !== c && (Y = c = c.return);
        continue;
      }
      break;
    } while (1);
  }
  function Jk() {
    var a = mk.current;
    mk.current = Rh;
    return null === a ? Rh : a;
  }
  function tj() {
    if (0 === T || 3 === T || 2 === T) T = 4;
    null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
  }
  function Ik(a, b) {
    var c = K;
    K |= 2;
    var d = Jk();
    if (Q !== a || Z !== b) uk = null, Kk(a, b);
    do
      try {
        Tk();
        break;
      } catch (e) {
        Mk(a, e);
      }
    while (1);
    $g();
    K = c;
    mk.current = d;
    if (null !== Y) throw Error(p(261));
    Q = null;
    Z = 0;
    return T;
  }
  function Tk() {
    for (; null !== Y; ) Uk(Y);
  }
  function Lk() {
    for (; null !== Y && !cc(); ) Uk(Y);
  }
  function Uk(a) {
    var b = Vk(a.alternate, a, fj);
    a.memoizedProps = a.pendingProps;
    null === b ? Sk(a) : Y = b;
    nk.current = null;
  }
  function Sk(a) {
    var b = a;
    do {
      var c = b.alternate;
      a = b.return;
      if (0 === (b.flags & 32768)) {
        if (c = Ej(c, b, fj), null !== c) {
          Y = c;
          return;
        }
      } else {
        c = Ij(c, b);
        if (null !== c) {
          c.flags &= 32767;
          Y = c;
          return;
        }
        if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
        else {
          T = 6;
          Y = null;
          return;
        }
      }
      b = b.sibling;
      if (null !== b) {
        Y = b;
        return;
      }
      Y = b = a;
    } while (null !== b);
    0 === T && (T = 5);
  }
  function Pk(a, b, c) {
    var d = C, e = ok.transition;
    try {
      ok.transition = null, C = 1, Wk(a, b, c, d);
    } finally {
      ok.transition = e, C = d;
    }
    return null;
  }
  function Wk(a, b, c, d) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K & 6)) throw Error(p(327));
    c = a.finishedWork;
    var e = a.finishedLanes;
    if (null === c) return null;
    a.finishedWork = null;
    a.finishedLanes = 0;
    if (c === a.current) throw Error(p(177));
    a.callbackNode = null;
    a.callbackPriority = 0;
    var f = c.lanes | c.childLanes;
    Bc(a, f);
    a === Q && (Y = Q = null, Z = 0);
    0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f = 0 !== (c.flags & 15990);
    if (0 !== (c.subtreeFlags & 15990) || f) {
      f = ok.transition;
      ok.transition = null;
      var g = C;
      C = 1;
      var h = K;
      K |= 4;
      nk.current = null;
      Oj(a, c);
      dk(c, a);
      Oe(Df);
      dd = !!Cf;
      Df = Cf = null;
      a.current = c;
      hk(c);
      dc();
      K = h;
      C = g;
      ok.transition = f;
    } else a.current = c;
    vk && (vk = false, wk = a, xk = e);
    f = a.pendingLanes;
    0 === f && (Ri = null);
    mc(c.stateNode);
    Dk(a, B());
    if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
    if (Oi) throw Oi = false, a = Pi, Pi = null, a;
    0 !== (xk & 1) && 0 !== a.tag && Hk();
    f = a.pendingLanes;
    0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a = Dc(xk), b = ok.transition, c = C;
      try {
        ok.transition = null;
        C = 16 > a ? 16 : a;
        if (null === wk) var d = false;
        else {
          a = wk;
          wk = null;
          xk = 0;
          if (0 !== (K & 6)) throw Error(p(331));
          var e = K;
          K |= 4;
          for (V = a.current; null !== V; ) {
            var f = V, g = f.child;
            if (0 !== (V.flags & 16)) {
              var h = f.deletions;
              if (null !== h) {
                for (var k = 0; k < h.length; k++) {
                  var l = h[k];
                  for (V = l; null !== V; ) {
                    var m = V;
                    switch (m.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pj(8, m, f);
                    }
                    var q = m.child;
                    if (null !== q) q.return = m, V = q;
                    else for (; null !== V; ) {
                      m = V;
                      var r = m.sibling, y = m.return;
                      Sj(m);
                      if (m === l) {
                        V = null;
                        break;
                      }
                      if (null !== r) {
                        r.return = y;
                        V = r;
                        break;
                      }
                      V = y;
                    }
                  }
                }
                var n = f.alternate;
                if (null !== n) {
                  var t = n.child;
                  if (null !== t) {
                    n.child = null;
                    do {
                      var J = t.sibling;
                      t.sibling = null;
                      t = J;
                    } while (null !== t);
                  }
                }
                V = f;
              }
            }
            if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
            else b: for (; null !== V; ) {
              f = V;
              if (0 !== (f.flags & 2048)) switch (f.tag) {
                case 0:
                case 11:
                case 15:
                  Pj(9, f, f.return);
              }
              var x = f.sibling;
              if (null !== x) {
                x.return = f.return;
                V = x;
                break b;
              }
              V = f.return;
            }
          }
          var w = a.current;
          for (V = w; null !== V; ) {
            g = V;
            var u = g.child;
            if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
            else b: for (g = w; null !== V; ) {
              h = V;
              if (0 !== (h.flags & 2048)) try {
                switch (h.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qj(9, h);
                }
              } catch (na) {
                W(h, h.return, na);
              }
              if (h === g) {
                V = null;
                break b;
              }
              var F = h.sibling;
              if (null !== F) {
                F.return = h.return;
                V = F;
                break b;
              }
              V = h.return;
            }
          }
          K = e;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
          d = true;
        }
        return d;
      } finally {
        C = c, ok.transition = b;
      }
    }
    return false;
  }
  function Xk(a, b, c) {
    b = Ji(c, b);
    b = Ni(a, b, 1);
    a = nh(a, b, 1);
    b = R();
    null !== a && (Ac(a, 1, b), Dk(a, b));
  }
  function W(a, b, c) {
    if (3 === a.tag) Xk(a, a, c);
    else for (; null !== b; ) {
      if (3 === b.tag) {
        Xk(b, a, c);
        break;
      } else if (1 === b.tag) {
        var d = b.stateNode;
        if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
          a = Ji(c, a);
          a = Qi(b, a, 1);
          b = nh(b, a, 1);
          a = R();
          null !== b && (Ac(b, 1, a), Dk(b, a));
          break;
        }
      }
      b = b.return;
    }
  }
  function Ti(a, b, c) {
    var d = a.pingCache;
    null !== d && d.delete(b);
    b = R();
    a.pingedLanes |= a.suspendedLanes & c;
    Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
    Dk(a, b);
  }
  function Yk(a, b) {
    0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c = R();
    a = ih(a, b);
    null !== a && (Ac(a, b, c), Dk(a, c));
  }
  function uj(a) {
    var b = a.memoizedState, c = 0;
    null !== b && (c = b.retryLane);
    Yk(a, c);
  }
  function bk(a, b) {
    var c = 0;
    switch (a.tag) {
      case 13:
        var d = a.stateNode;
        var e = a.memoizedState;
        null !== e && (c = e.retryLane);
        break;
      case 19:
        d = a.stateNode;
        break;
      default:
        throw Error(p(314));
    }
    null !== d && d.delete(b);
    Yk(a, c);
  }
  var Vk;
  Vk = function(a, b, c) {
    if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
    else {
      if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
      dh = 0 !== (a.flags & 131072) ? true : false;
    }
    else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
    b.lanes = 0;
    switch (b.tag) {
      case 2:
        var d = b.type;
        ij(a, b);
        a = b.pendingProps;
        var e = Yf(b, H.current);
        ch(b, c);
        e = Nh(null, b, d, a, e, c);
        var f = Sh();
        b.flags |= 1;
        "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I && f && vg(b), Xi(null, b, e, c), b = b.child);
        return b;
      case 16:
        d = b.elementType;
        a: {
          ij(a, b);
          a = b.pendingProps;
          e = d._init;
          d = e(d._payload);
          b.type = d;
          e = b.tag = Zk(d);
          a = Ci(d, a);
          switch (e) {
            case 0:
              b = cj(null, b, d, a, c);
              break a;
            case 1:
              b = hj(null, b, d, a, c);
              break a;
            case 11:
              b = Yi(null, b, d, a, c);
              break a;
            case 14:
              b = $i(null, b, d, Ci(d.type, a), c);
              break a;
          }
          throw Error(p(
            306,
            d,
            ""
          ));
        }
        return b;
      case 0:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
      case 1:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
      case 3:
        a: {
          kj(b);
          if (null === a) throw Error(p(387));
          d = b.pendingProps;
          f = b.memoizedState;
          e = f.element;
          lh(a, b);
          qh(b, d, null, c);
          var g = b.memoizedState;
          d = g.element;
          if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
            e = Ji(Error(p(423)), b);
            b = lj(a, b, d, c, e);
            break a;
          } else if (d !== e) {
            e = Ji(Error(p(424)), b);
            b = lj(a, b, d, c, e);
            break a;
          } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
          else {
            Ig();
            if (d === e) {
              b = Zi(a, b, c);
              break a;
            }
            Xi(a, b, d, c);
          }
          b = b.child;
        }
        return b;
      case 5:
        return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
      case 6:
        return null === a && Eg(b), null;
      case 13:
        return oj(a, b, c);
      case 4:
        return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
      case 11:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
      case 7:
        return Xi(a, b, b.pendingProps, c), b.child;
      case 8:
        return Xi(a, b, b.pendingProps.children, c), b.child;
      case 12:
        return Xi(a, b, b.pendingProps.children, c), b.child;
      case 10:
        a: {
          d = b.type._context;
          e = b.pendingProps;
          f = b.memoizedProps;
          g = e.value;
          G(Wg, d._currentValue);
          d._currentValue = g;
          if (null !== f) if (He(f.value, g)) {
            if (f.children === e.children && !Wf.current) {
              b = Zi(a, b, c);
              break a;
            }
          } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
            var h = f.dependencies;
            if (null !== h) {
              g = f.child;
              for (var k = h.firstContext; null !== k; ) {
                if (k.context === d) {
                  if (1 === f.tag) {
                    k = mh(-1, c & -c);
                    k.tag = 2;
                    var l = f.updateQueue;
                    if (null !== l) {
                      l = l.shared;
                      var m = l.pending;
                      null === m ? k.next = k : (k.next = m.next, m.next = k);
                      l.pending = k;
                    }
                  }
                  f.lanes |= c;
                  k = f.alternate;
                  null !== k && (k.lanes |= c);
                  bh(
                    f.return,
                    c,
                    b
                  );
                  h.lanes |= c;
                  break;
                }
                k = k.next;
              }
            } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
            else if (18 === f.tag) {
              g = f.return;
              if (null === g) throw Error(p(341));
              g.lanes |= c;
              h = g.alternate;
              null !== h && (h.lanes |= c);
              bh(g, c, b);
              g = f.sibling;
            } else g = f.child;
            if (null !== g) g.return = f;
            else for (g = f; null !== g; ) {
              if (g === b) {
                g = null;
                break;
              }
              f = g.sibling;
              if (null !== f) {
                f.return = g.return;
                g = f;
                break;
              }
              g = g.return;
            }
            f = g;
          }
          Xi(a, b, e.children, c);
          b = b.child;
        }
        return b;
      case 9:
        return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
      case 14:
        return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
      case 15:
        return bj(a, b, b.type, b.pendingProps, c);
      case 17:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
      case 19:
        return xj(a, b, c);
      case 22:
        return dj(a, b, c);
    }
    throw Error(p(156, b.tag));
  };
  function Fk(a, b) {
    return ac(a, b);
  }
  function $k(a, b, c, d) {
    this.tag = a;
    this.key = c;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = b;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = d;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function Bg(a, b, c, d) {
    return new $k(a, b, c, d);
  }
  function aj(a) {
    a = a.prototype;
    return !(!a || !a.isReactComponent);
  }
  function Zk(a) {
    if ("function" === typeof a) return aj(a) ? 1 : 0;
    if (void 0 !== a && null !== a) {
      a = a.$$typeof;
      if (a === Da) return 11;
      if (a === Ga) return 14;
    }
    return 2;
  }
  function Pg(a, b) {
    var c = a.alternate;
    null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
    c.flags = a.flags & 14680064;
    c.childLanes = a.childLanes;
    c.lanes = a.lanes;
    c.child = a.child;
    c.memoizedProps = a.memoizedProps;
    c.memoizedState = a.memoizedState;
    c.updateQueue = a.updateQueue;
    b = a.dependencies;
    c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
    c.sibling = a.sibling;
    c.index = a.index;
    c.ref = a.ref;
    return c;
  }
  function Rg(a, b, c, d, e, f) {
    var g = 2;
    d = a;
    if ("function" === typeof a) aj(a) && (g = 1);
    else if ("string" === typeof a) g = 5;
    else a: switch (a) {
      case ya:
        return Tg(c.children, e, f, b);
      case za:
        g = 8;
        e |= 8;
        break;
      case Aa:
        return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
      case Ea:
        return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
      case Fa:
        return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
      case Ia:
        return pj(c, e, f, b);
      default:
        if ("object" === typeof a && null !== a) switch (a.$$typeof) {
          case Ba:
            g = 10;
            break a;
          case Ca:
            g = 9;
            break a;
          case Da:
            g = 11;
            break a;
          case Ga:
            g = 14;
            break a;
          case Ha:
            g = 16;
            d = null;
            break a;
        }
        throw Error(p(130, null == a ? a : typeof a, ""));
    }
    b = Bg(g, c, b, e);
    b.elementType = a;
    b.type = d;
    b.lanes = f;
    return b;
  }
  function Tg(a, b, c, d) {
    a = Bg(7, a, d, b);
    a.lanes = c;
    return a;
  }
  function pj(a, b, c, d) {
    a = Bg(22, a, d, b);
    a.elementType = Ia;
    a.lanes = c;
    a.stateNode = { isHidden: false };
    return a;
  }
  function Qg(a, b, c) {
    a = Bg(6, a, null, b);
    a.lanes = c;
    return a;
  }
  function Sg(a, b, c) {
    b = Bg(4, null !== a.children ? a.children : [], a.key, b);
    b.lanes = c;
    b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
    return b;
  }
  function al(a, b, c, d, e) {
    this.tag = b;
    this.containerInfo = a;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = zc(0);
    this.expirationTimes = zc(-1);
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = zc(0);
    this.identifierPrefix = d;
    this.onRecoverableError = e;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a, b, c, d, e, f, g, h, k) {
    a = new al(a, b, c, h, k);
    1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
    f = Bg(3, null, null, b);
    a.current = f;
    f.stateNode = a;
    f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
    kh(f);
    return a;
  }
  function cl(a, b, c) {
    var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
  }
  function dl(a) {
    if (!a) return Vf;
    a = a._reactInternals;
    a: {
      if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
      var b = a;
      do {
        switch (b.tag) {
          case 3:
            b = b.stateNode.context;
            break a;
          case 1:
            if (Zf(b.type)) {
              b = b.stateNode.__reactInternalMemoizedMergedChildContext;
              break a;
            }
        }
        b = b.return;
      } while (null !== b);
      throw Error(p(171));
    }
    if (1 === a.tag) {
      var c = a.type;
      if (Zf(c)) return bg(a, c, b);
    }
    return b;
  }
  function el(a, b, c, d, e, f, g, h, k) {
    a = bl(c, d, true, a, e, f, g, h, k);
    a.context = dl(null);
    c = a.current;
    d = R();
    e = yi(c);
    f = mh(d, e);
    f.callback = void 0 !== b && null !== b ? b : null;
    nh(c, f, e);
    a.current.lanes = e;
    Ac(a, e, d);
    Dk(a, d);
    return a;
  }
  function fl(a, b, c, d) {
    var e = b.current, f = R(), g = yi(e);
    c = dl(c);
    null === b.context ? b.context = c : b.pendingContext = c;
    b = mh(f, g);
    b.payload = { element: a };
    d = void 0 === d ? null : d;
    null !== d && (b.callback = d);
    a = nh(e, b, g);
    null !== a && (gi(a, e, g, f), oh(a, e, g));
    return g;
  }
  function gl(a) {
    a = a.current;
    if (!a.child) return null;
    switch (a.child.tag) {
      case 5:
        return a.child.stateNode;
      default:
        return a.child.stateNode;
    }
  }
  function hl(a, b) {
    a = a.memoizedState;
    if (null !== a && null !== a.dehydrated) {
      var c = a.retryLane;
      a.retryLane = 0 !== c && c < b ? c : b;
    }
  }
  function il(a, b) {
    hl(a, b);
    (a = a.alternate) && hl(a, b);
  }
  function jl() {
    return null;
  }
  var kl = "function" === typeof reportError ? reportError : function(a) {
    console.error(a);
  };
  function ll(a) {
    this._internalRoot = a;
  }
  ml.prototype.render = ll.prototype.render = function(a) {
    var b = this._internalRoot;
    if (null === b) throw Error(p(409));
    fl(a, b, null, null);
  };
  ml.prototype.unmount = ll.prototype.unmount = function() {
    var a = this._internalRoot;
    if (null !== a) {
      this._internalRoot = null;
      var b = a.containerInfo;
      Rk(function() {
        fl(null, a, null, null);
      });
      b[uf] = null;
    }
  };
  function ml(a) {
    this._internalRoot = a;
  }
  ml.prototype.unstable_scheduleHydration = function(a) {
    if (a) {
      var b = Hc();
      a = { blockedOn: null, target: a, priority: b };
      for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
      Qc.splice(c, 0, a);
      0 === c && Vc(a);
    }
  };
  function nl(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
  }
  function ol(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
  }
  function pl() {
  }
  function ql(a, b, c, d, e) {
    if (e) {
      if ("function" === typeof d) {
        var f = d;
        d = function() {
          var a2 = gl(g);
          f.call(a2);
        };
      }
      var g = el(b, d, a, 0, null, false, false, "", pl);
      a._reactRootContainer = g;
      a[uf] = g.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk();
      return g;
    }
    for (; e = a.lastChild; ) a.removeChild(e);
    if ("function" === typeof d) {
      var h = d;
      d = function() {
        var a2 = gl(k);
        h.call(a2);
      };
    }
    var k = bl(a, 0, false, null, null, false, false, "", pl);
    a._reactRootContainer = k;
    a[uf] = k.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk(function() {
      fl(b, k, c, d);
    });
    return k;
  }
  function rl(a, b, c, d, e) {
    var f = c._reactRootContainer;
    if (f) {
      var g = f;
      if ("function" === typeof e) {
        var h = e;
        e = function() {
          var a2 = gl(g);
          h.call(a2);
        };
      }
      fl(b, g, a, e);
    } else g = ql(c, b, a, e, d);
    return gl(g);
  }
  Ec = function(a) {
    switch (a.tag) {
      case 3:
        var b = a.stateNode;
        if (b.current.memoizedState.isDehydrated) {
          var c = tc(b.pendingLanes);
          0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b2 = ih(a, 1);
          if (null !== b2) {
            var c2 = R();
            gi(b2, a, 1, c2);
          }
        }), il(a, 1);
    }
  };
  Fc = function(a) {
    if (13 === a.tag) {
      var b = ih(a, 134217728);
      if (null !== b) {
        var c = R();
        gi(b, a, 134217728, c);
      }
      il(a, 134217728);
    }
  };
  Gc = function(a) {
    if (13 === a.tag) {
      var b = yi(a), c = ih(a, b);
      if (null !== c) {
        var d = R();
        gi(c, a, b, d);
      }
      il(a, b);
    }
  };
  Hc = function() {
    return C;
  };
  Ic = function(a, b) {
    var c = C;
    try {
      return C = a, b();
    } finally {
      C = c;
    }
  };
  yb = function(a, b, c) {
    switch (b) {
      case "input":
        bb(a, c);
        b = c.name;
        if ("radio" === c.type && null != b) {
          for (c = a; c.parentNode; ) c = c.parentNode;
          c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
          for (b = 0; b < c.length; b++) {
            var d = c[b];
            if (d !== a && d.form === a.form) {
              var e = Db(d);
              if (!e) throw Error(p(90));
              Wa(d);
              bb(d, e);
            }
          }
        }
        break;
      case "textarea":
        ib(a, c);
        break;
      case "select":
        b = c.value, null != b && fb(a, !!c.multiple, b, false);
    }
  };
  Gb = Qk;
  Hb = Rk;
  var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
  var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
    a = Zb(a);
    return null === a ? null : a.stateNode;
  }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vl.isDisabled && vl.supportsFiber) try {
      kc = vl.inject(ul), lc = vl;
    } catch (a) {
    }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
  reactDom_production_min.createPortal = function(a, b) {
    var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl(b)) throw Error(p(200));
    return cl(a, b, null, c);
  };
  reactDom_production_min.createRoot = function(a, b) {
    if (!nl(a)) throw Error(p(299));
    var c = false, d = "", e = kl;
    null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
    b = bl(a, 1, false, null, null, c, false, d, e);
    a[uf] = b.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    return new ll(b);
  };
  reactDom_production_min.findDOMNode = function(a) {
    if (null == a) return null;
    if (1 === a.nodeType) return a;
    var b = a._reactInternals;
    if (void 0 === b) {
      if ("function" === typeof a.render) throw Error(p(188));
      a = Object.keys(a).join(",");
      throw Error(p(268, a));
    }
    a = Zb(b);
    a = null === a ? null : a.stateNode;
    return a;
  };
  reactDom_production_min.flushSync = function(a) {
    return Rk(a);
  };
  reactDom_production_min.hydrate = function(a, b, c) {
    if (!ol(b)) throw Error(p(200));
    return rl(null, a, b, true, c);
  };
  reactDom_production_min.hydrateRoot = function(a, b, c) {
    if (!nl(a)) throw Error(p(405));
    var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
    null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
    b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
    a[uf] = b.current;
    sf(a);
    if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
      c,
      e
    );
    return new ml(b);
  };
  reactDom_production_min.render = function(a, b, c) {
    if (!ol(b)) throw Error(p(200));
    return rl(null, a, b, false, c);
  };
  reactDom_production_min.unmountComponentAtNode = function(a) {
    if (!ol(a)) throw Error(p(40));
    return a._reactRootContainer ? (Rk(function() {
      rl(null, null, a, false, function() {
        a._reactRootContainer = null;
        a[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
    if (!ol(c)) throw Error(p(200));
    if (null == a || void 0 === a._reactInternals) throw Error(p(38));
    return rl(a, b, c, false, d);
  };
  reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
  return reactDom_production_min;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production_min();
  }
  return reactDom.exports;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var m = requireReactDom();
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  return client;
}
var clientExports = requireClient();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$$ = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("Activity", __iconNode$$);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$_ = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("ArrowLeft", __iconNode$_);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$Z = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("ArrowRight", __iconNode$Z);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$Y = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("Bell", __iconNode$Y);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$X = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("Calendar", __iconNode$X);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$W = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("Check", __iconNode$W);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$V = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("ChevronDown", __iconNode$V);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$U = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("ChevronLeft", __iconNode$U);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$T = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("ChevronRight", __iconNode$T);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$S = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("ChevronUp", __iconNode$S);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$R = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("CircleAlert", __iconNode$R);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$Q = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("CircleCheckBig", __iconNode$Q);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$P = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("CircleCheck", __iconNode$P);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$O = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("CircleHelp", __iconNode$O);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$N = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("CirclePlay", __iconNode$N);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$M = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("Clock", __iconNode$M);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$L = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "M16 17H7", key: "pygtm1" }],
  ["path", { d: "M17 21H9", key: "1u2q02" }]
];
const CloudFog = createLucideIcon("CloudFog", __iconNode$L);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$K = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "M16 14v6", key: "1j4efv" }],
  ["path", { d: "M8 14v6", key: "17c4r9" }],
  ["path", { d: "M12 16v6", key: "c8a4gj" }]
];
const CloudRain = createLucideIcon("CloudRain", __iconNode$K);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$J = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("Cloud", __iconNode$J);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$I = [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
];
const Download = createLucideIcon("Download", __iconNode$I);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$H = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("ExternalLink", __iconNode$H);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$G = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("Eye", __iconNode$G);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$F = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m5 12-3 3 3 3", key: "oke12k" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
];
const FileCode2 = createLucideIcon("FileCode2", __iconNode$F);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$E = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("FileText", __iconNode$E);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$D = [
  ["polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3", key: "1yg77f" }]
];
const Filter = createLucideIcon("Filter", __iconNode$D);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$C = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("Flag", __iconNode$C);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$B = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("FolderOpen", __iconNode$B);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$A = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("Globe", __iconNode$A);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$z = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("HardDrive", __iconNode$z);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$y = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("House", __iconNode$y);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$x = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image$1 = createLucideIcon("Image", __iconNode$x);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$w = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("Info", __iconNode$w);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$v = [
  [
    "path",
    {
      d: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16",
      key: "tarvll"
    }
  ]
];
const Laptop = createLucideIcon("Laptop", __iconNode$v);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$u = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("Layers", __iconNode$u);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$t = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("LoaderCircle", __iconNode$t);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$s = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("MapPin", __iconNode$s);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$r = [
  ["polyline", { points: "15 3 21 3 21 9", key: "mznyad" }],
  ["polyline", { points: "9 21 3 21 3 15", key: "1avn1i" }],
  ["line", { x1: "21", x2: "14", y1: "3", y2: "10", key: "ota7mn" }],
  ["line", { x1: "3", x2: "10", y1: "21", y2: "14", key: "1atl0r" }]
];
const Maximize2 = createLucideIcon("Maximize2", __iconNode$r);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$q = [
  ["polyline", { points: "4 14 10 14 10 20", key: "11kfnr" }],
  ["polyline", { points: "20 10 14 10 14 4", key: "rlmsce" }],
  ["line", { x1: "14", x2: "21", y1: "10", y2: "3", key: "o5lafz" }],
  ["line", { x1: "3", x2: "10", y1: "21", y2: "14", key: "1atl0r" }]
];
const Minimize2 = createLucideIcon("Minimize2", __iconNode$q);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$p = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("Monitor", __iconNode$p);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
];
const Moon = createLucideIcon("Moon", __iconNode$o);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("Pause", __iconNode$n);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("Pencil", __iconNode$m);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
];
const Pin = createLucideIcon("Pin", __iconNode$l);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("Play", __iconNode$k);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("Plus", __iconNode$j);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
];
const Power = createLucideIcon("Power", __iconNode$i);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("Radio", __iconNode$h);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("RefreshCw", __iconNode$g);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("RotateCcw", __iconNode$f);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
];
const Search = createLucideIcon("Search", __iconNode$e);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("Settings", __iconNode$d);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("ShieldCheck", __iconNode$c);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14", key: "1p332r" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3", key: "gb41h5" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12", key: "hf2csr" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3", key: "1kfi7u" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16", key: "1lhrwl" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3", key: "16vvfq" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14", key: "1uebub" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8", key: "1yglbp" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16", key: "1jxqpz" }]
];
const SlidersVertical = createLucideIcon("SlidersVertical", __iconNode$b);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "m10 20-1.25-2.5L6 18", key: "18frcb" }],
  ["path", { d: "M10 4 8.75 6.5 6 6", key: "7mghy3" }],
  ["path", { d: "m14 20 1.25-2.5L18 18", key: "1chtki" }],
  ["path", { d: "m14 4 1.25 2.5L18 6", key: "1b4wsy" }],
  ["path", { d: "m17 21-3-6h-4", key: "15hhxa" }],
  ["path", { d: "m17 3-3 6 1.5 3", key: "11697g" }],
  ["path", { d: "M2 12h6.5L10 9", key: "kv9z4n" }],
  ["path", { d: "m20 10-1.5 2 1.5 2", key: "1swlpi" }],
  ["path", { d: "M22 12h-6.5L14 15", key: "1mxi28" }],
  ["path", { d: "m4 10 1.5 2L4 14", key: "k9enpj" }],
  ["path", { d: "m7 21 3-6-1.5-3", key: "j8hb9u" }],
  ["path", { d: "m7 3 3 6h4", key: "1otusx" }]
];
const Snowflake = createLucideIcon("Snowflake", __iconNode$a);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("Sparkles", __iconNode$9);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5", key: "1uzm8b" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const SquareCheckBig = createLucideIcon("SquareCheckBig", __iconNode$8);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("Sun", __iconNode$7);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("Trash2", __iconNode$6);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("TriangleAlert", __iconNode$5);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("Volume2", __iconNode$4);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("VolumeX", __iconNode$3);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
];
const Wind = createLucideIcon("Wind", __iconNode$2);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("X", __iconNode$1);
/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("Zap", __iconNode);
const WING_PATH = "M 295.8 269.3 C 293.6 269.3, 281.8 270.0, 278.1 269.3 C 274.4 268.5, 286.2 265.6, 273.7 264.8 C 261.2 264.1, 215.5 264.1, 203.0 264.8 C 190.5 265.6, 204.4 267.8, 198.6 269.3 C 192.7 270.7, 173.5 272.2, 167.6 273.7 C 161.7 275.1, 169.1 275.1, 163.2 278.1 C 157.3 281.0, 138.9 287.7, 132.3 291.3 C 125.7 295.0, 125.7 298.7, 123.4 300.2 C 121.2 301.7, 121.2 298.7, 119.0 300.2 C 116.8 301.7, 112.4 307.6, 110.2 309.0 C 108.0 310.5, 113.1 302.4, 105.8 309.0 C 98.4 315.7, 70.4 340.0, 66.0 348.8 C 61.6 357.6, 76.3 359.8, 79.3 362.0 C 82.2 364.3, 82.2 361.3, 83.7 362.0 C 85.1 362.8, 85.9 365.7, 88.1 366.5 C 90.3 367.2, 94.7 365.7, 96.9 366.5 C 99.1 367.2, 97.7 370.1, 101.3 370.9 C 105.0 371.6, 115.3 371.6, 119.0 370.9 C 122.7 370.1, 121.2 367.2, 123.4 366.5 C 125.7 365.7, 130.1 367.2, 132.3 366.5 C 134.5 365.7, 135.2 362.8, 136.7 362.0 C 138.2 361.3, 138.2 364.3, 141.1 362.0 C 144.1 359.8, 151.4 351.0, 154.4 348.8 C 157.3 346.6, 152.2 354.7, 158.8 348.8 C 165.4 342.9, 187.5 319.3, 194.1 313.4 C 200.8 307.6, 194.1 316.4, 198.6 313.4 C 203.0 310.5, 216.2 298.7, 220.7 295.8 C 225.1 292.8, 220.7 298.0, 225.1 295.8 C 229.5 293.6, 242.0 284.7, 247.2 282.5 C 252.3 280.3, 253.8 283.2, 256.0 282.5 C 258.2 281.8, 258.2 278.8, 260.4 278.1 C 262.6 277.4, 267.0 278.8, 269.3 278.1 C 271.5 277.4, 270.7 274.4, 273.7 273.7 C 276.6 272.9, 284.0 274.4, 286.9 273.7 C 289.9 272.9, 289.9 270.0, 291.3 269.3 C 292.8 268.5, 298.0 269.3, 295.8 269.3 Z";
const ARCH_PATH = "M 154.4 256.0 C 148.5 267.8, 182.4 229.5, 194.1 220.7 C 205.9 211.8, 216.2 206.7, 225.1 203.0 C 233.9 199.3, 239.8 198.6, 247.2 198.6 C 254.5 198.6, 257.5 197.1, 269.3 203.0 C 281.0 208.9, 300.9 219.9, 317.9 233.9 C 334.8 247.9, 360.6 274.4, 370.9 286.9 C 381.2 299.4, 381.9 301.7, 379.7 309.0 C 377.5 316.4, 372.4 327.4, 357.6 331.1 C 342.9 334.8, 310.5 332.6, 291.3 331.1 C 272.2 329.6, 238.3 317.9, 242.7 322.3 C 247.2 326.7, 296.5 349.5, 317.9 357.6 C 339.2 365.7, 354.7 369.4, 370.9 370.9 C 387.1 372.4, 403.3 371.6, 415.1 366.5 C 426.9 361.3, 437.2 350.3, 441.6 340.0 C 446.0 329.6, 446.0 317.1, 441.6 304.6 C 437.2 292.1, 436.4 289.1, 415.1 264.8 C 393.7 240.5, 337.0 180.1, 313.4 158.8 C 289.9 137.4, 283.2 140.4, 273.7 136.7 C 264.1 133.0, 263.4 134.5, 256.0 136.7 C 248.6 138.9, 246.4 130.1, 229.5 150.0 C 212.6 169.8, 160.3 244.2, 154.4 256.0 Z";
const BeaconSymbol = ({
  size = 24,
  className = "",
  variant = "color",
  idPrefix = "bcn"
}) => {
  const wingGradId = `${idPrefix}-wing`;
  const archGradId = `${idPrefix}-arch`;
  if (variant === "white") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "60 130 390 250",
        width: size,
        height: size * (250 / 390),
        className: `inline-block shrink-0 select-none ${className}`,
        fill: "#FFFFFF",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: ARCH_PATH }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: WING_PATH })
        ]
      }
    );
  }
  if (variant === "dark") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "60 130 390 250",
        width: size,
        height: size * (250 / 390),
        className: `inline-block shrink-0 select-none ${className}`,
        fill: "#0F172A",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: ARCH_PATH }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: WING_PATH })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "60 130 390 250",
      width: size,
      height: size * (250 / 390),
      className: `inline-block shrink-0 select-none ${className}`,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: wingGradId, x1: "0%", y1: "100%", x2: "100%", y2: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#38BDF8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "35%", stopColor: "#4F8CFF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "75%", stopColor: "#6366F1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#8B5CF6" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: archGradId, x1: "15%", y1: "80%", x2: "85%", y2: "15%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#4F46E5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: "#6366F1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#8B5CF6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "85%", stopColor: "#A855F7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#7C3AED" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: ARCH_PATH, fill: `url(#${archGradId})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: WING_PATH, fill: `url(#${wingGradId})` })
      ]
    }
  );
};
const Sidebar = ({ currentRoute, onRouteChange }) => {
  const navItems = [
    { id: "home", label: "Home", icon: House },
    { id: "ambient", label: "Ambient", icon: Monitor, badge: "Live" },
    { id: "notes", label: "Notes", icon: FileText, badge: "Live" },
    { id: "tasks", label: "Tasks", icon: SquareCheckBig, badge: "Live" },
    { id: "settings", label: "Settings", icon: Settings }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 flex flex-col h-full bg-slate-100/80 dark:bg-helm-surface border-r border-slate-200 dark:border-helm-border/80 select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-5 border-b border-slate-200/60 dark:border-helm-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-9 h-9 rounded-xl bg-[#0e0f22] border border-indigo-500/30 shadow-sm p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BeaconSymbol, { size: 26 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-bold tracking-[0.22em] text-slate-900 dark:text-slate-100 uppercase", children: "BEACON" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium tracking-wider text-indigo-500 dark:text-indigo-400", children: "Find Your Focus" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Main Navigation", className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-helm-muted/70 uppercase", children: "Navigation" }),
      navItems.map((item) => {
        const Icon2 = item.icon;
        const isActive = currentRoute === item.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onRouteChange(item.id),
            "aria-current": isActive ? "page" : void 0,
            className: `flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${isActive ? "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-helm-cardHover hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon2,
                  {
                    "aria-hidden": "true",
                    className: `w-4 h-4 ${isActive ? "text-emerald-500" : "text-slate-400 dark:text-helm-muted"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
              ] }),
              item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700/60", children: item.badge })
            ]
          },
          item.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-slate-200/60 dark:border-helm-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 rounded-lg bg-slate-200/50 dark:bg-helm-card border border-slate-300/40 dark:border-helm-border/40 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-600 dark:text-slate-300", children: "Tray Resident" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 dark:text-helm-muted font-mono", children: "v0.1.0" })
    ] }) })
  ] });
};
const AppLayout = ({
  currentRoute,
  onRouteChange,
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-helm-dark text-slate-800 dark:text-slate-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#main-content", className: "skip-link", children: "Skip to main content" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { currentRoute, onRouteChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { id: "main-content", tabIndex: -1, className: "flex-1 flex flex-col h-full overflow-y-auto focus:outline-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-8 max-w-5xl w-full mx-auto", children }) })
  ] });
};
const Card = ({
  children,
  className = "",
  title,
  description,
  action
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 shadow-sm transition-all duration-200 ${className}`,
      children: [
        (title || description || action) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 dark:border-helm-border/50 px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100", children: title }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-slate-500 dark:text-helm-muted", children: description })
          ] }),
          action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: action })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children })
      ]
    }
  );
};
const Button = ({
  variant = "secondary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-4 py-2.5 gap-2.5"
  }[size];
  const variantStyles = {
    primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm",
    secondary: "bg-slate-200 dark:bg-helm-card hover:bg-slate-300 dark:hover:bg-helm-cardHover text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-helm-border",
    outline: "border border-slate-300 dark:border-helm-border hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300",
    ghost: "hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
  }[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type, className: `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`, ...props, children });
};
const StatusIndicator = ({
  label,
  statusText,
  variant = "active",
  pulse = false,
  className = ""
}) => {
  const dotColors = {
    active: "bg-emerald-500",
    warning: "bg-rose-500",
    pending: "bg-amber-500",
    inactive: "bg-slate-400 dark:bg-slate-500",
    info: "bg-sky-500"
  }[variant];
  const pulseColors = {
    active: "bg-emerald-400",
    warning: "bg-rose-400",
    pending: "bg-amber-400",
    inactive: "bg-slate-300",
    info: "bg-sky-400"
  }[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/50 ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700 dark:text-slate-300", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
        pulse && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative inline-flex rounded-full h-2 w-2 ${dotColors}` })
      ] }),
      statusText && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-slate-500 dark:text-helm-muted", children: statusText })
    ] })
  ] });
};
const Badge = ({
  children,
  variant = "default",
  className = ""
}) => {
  const variantStyles = {
    default: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    neutral: "bg-slate-200/60 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600/40"
  }[variant];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${variantStyles} ${className}`,
      children
    }
  );
};
const KIND_EMOJIS$1 = {
  delivery: "📦",
  appReview: "📱",
  access: "🔑",
  government: "🛂",
  job: "💼",
  results: "🎓",
  booking: "🎫",
  refund: "💸",
  ticket: "🎟️",
  build: "🛠️",
  product: "🏷️"
};
const WatchCard = ({ watch }) => {
  const emoji = KIND_EMOJIS$1[watch.kind] || "👀";
  const handleOpenUrl = () => {
    if (!watch.url) return;
    if (window.beacon?.openExternal) {
      window.beacon.openExternal(watch.url).catch(console.error);
    } else {
      window.open(watch.url, "_blank");
    }
  };
  const formatChecked = (checkedMs) => {
    if (!checkedMs) return "Recently";
    const seconds = Math.floor((Date.now() - checkedMs) / 1e3);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  const getStatusBadge = () => {
    switch (watch.state) {
      case "attention":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "danger", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
          "Attention"
        ] });
      case "pending":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "warning", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
          "Pending"
        ] });
      case "done":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "neutral", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
          "Done"
        ] });
      case "watching":
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "success", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
          "Watching"
        ] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-helm-surface border border-slate-200/80 dark:border-helm-border/50 hover:border-slate-300 dark:hover:border-helm-border transition-all flex flex-col justify-between space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", role: "img", "aria-label": watch.kind, children: emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 dark:text-slate-100 truncate", children: watch.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-slate-400 dark:text-helm-muted", children: [
            "Checked ",
            formatChecked(watch.checked)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: getStatusBadge() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal bg-white/60 dark:bg-black/20 p-2.5 rounded-lg border border-slate-200/50 dark:border-helm-border/30", children: watch.quoted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "italic", children: [
      "“",
      watch.text,
      "”"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: watch.text || "Monitoring page for changes" }) }),
    watch.steps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-slate-500 dark:text-helm-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Stage ",
          watch.step,
          " of ",
          watch.steps
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          role: "progressbar",
          "aria-valuenow": watch.step,
          "aria-valuemin": 0,
          "aria-valuemax": watch.steps,
          "aria-label": `Progress stage ${watch.step} of ${watch.steps}`,
          className: "w-full h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden flex gap-0.5",
          children: Array.from({ length: watch.steps }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full flex-1 transition-all ${i < watch.step ? watch.state === "attention" ? "bg-rose-500" : "bg-emerald-500" : "bg-slate-300 dark:bg-slate-800"}`
            },
            i
          ))
        }
      )
    ] }),
    watch.url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: handleOpenUrl,
        "aria-label": `Open ${watch.name} in browser`,
        className: "text-[11px] py-1 px-2.5 h-auto flex items-center gap-1.5 text-slate-600 dark:text-slate-300",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open in Browser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3", "aria-hidden": "true" })
        ]
      }
    ) })
  ] });
};
function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1e3);
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const d = new Date(timestamp);
  return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
}
function formatDateTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function formatDueDate(timestamp) {
  if (!timestamp) {
    return { label: "", isOverdue: false, isToday: false, isUpcoming: false };
  }
  const now = /* @__PURE__ */ new Date();
  const target = new Date(timestamp);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const endOfTomorrow = endOfToday + 24 * 60 * 60 * 1e3;
  const isOverdue = timestamp < startOfToday;
  const isToday = timestamp >= startOfToday && timestamp <= endOfToday;
  const isTomorrow = timestamp > endOfToday && timestamp <= endOfTomorrow;
  const timeStr = target.toLocaleTimeString(void 0, { hour: "numeric", minute: "2-digit" });
  if (isOverdue) {
    const daysOverdue = Math.max(1, Math.floor((startOfToday - timestamp) / (24 * 60 * 60 * 1e3)));
    return {
      label: daysOverdue === 1 ? `Overdue by 1 day (${timeStr})` : `Overdue (${daysOverdue}d ago)`,
      isOverdue: true,
      isToday: false,
      isUpcoming: false
    };
  }
  if (isToday) {
    return {
      label: `Today at ${timeStr}`,
      isOverdue: false,
      isToday: true,
      isUpcoming: false
    };
  }
  if (isTomorrow) {
    return {
      label: `Tomorrow at ${timeStr}`,
      isOverdue: false,
      isToday: false,
      isUpcoming: true
    };
  }
  return {
    label: target.toLocaleDateString(void 0, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }),
    isOverdue: false,
    isToday: false,
    isUpcoming: true
  };
}
function toInputDateTimeString(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const pad = (num) => String(num).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
function fromInputDateTimeString(dateStr) {
  if (!dateStr || dateStr.trim() === "") return void 0;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? void 0 : parsed.getTime();
}
const HomePage = ({ onNavigate }) => {
  const [watches, setWatches] = reactExports.useState([]);
  const [browserStatus, setBrowserStatus] = reactExports.useState(null);
  const [summary, setSummary] = reactExports.useState(null);
  const loadData = async () => {
    try {
      if (window.beacon?.getWatches) {
        const w = await window.beacon.getWatches();
        setWatches(w);
      }
      if (window.beacon?.getBrowserStatus) {
        const s = await window.beacon.getBrowserStatus();
        setBrowserStatus(s);
      }
      if (window.beacon?.getProductivitySummary) {
        const prod = await window.beacon.getProductivitySummary();
        setSummary(prod);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };
  reactExports.useEffect(() => {
    loadData();
    const unsubscribeWatches = window.beacon?.onWatchesUpdate?.((updatedWatches) => {
      setWatches(updatedWatches);
    });
    const unsubscribeStatus = window.beacon?.onBrowserStatusUpdate?.((updatedStatus) => {
      setBrowserStatus(updatedStatus);
    });
    return () => {
      if (unsubscribeWatches) unsubscribeWatches();
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, []);
  const handleOpenGitHub = () => {
    if (window.beacon?.openExternal) {
      window.beacon.openExternal("https://github.com/jonathanvineet/helm");
    } else {
      window.open("https://github.com/jonathanvineet/helm", "_blank");
    }
  };
  const attentionCount = watches.filter((w) => w.state === "attention").length;
  const activeCount = watches.filter((w) => w.state !== "done").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-fadeIn select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "success", children: "Windows Port · Phase 4 Live" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-helm-muted", children: "Notes & Tasks with Local SQLite Store" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BeaconSymbol, { size: 32 }),
          "BEACON for Windows"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600 dark:text-helm-muted max-w-xl leading-relaxed", children: "Ambient productivity and live web awareness. BEACON connects seamlessly with your Chromium browser extension and stores your notes and daily tasks locally in a fast SQLite database." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => onNavigate("notes", "new-note"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 text-emerald-500" }),
          "New Note"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => onNavigate("tasks", "new-task"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 text-emerald-500" }),
          "New Task"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => onNavigate("ambient"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-500" }),
          "Ambient Board"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", size: "sm", onClick: handleOpenGitHub, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
          "GitHub"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate("tasks"),
          "aria-label": `Pending tasks: ${summary?.pendingTasks ?? 0}`,
          className: "p-4 rounded-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-left hover:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all shadow-sm group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 dark:text-helm-muted mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Pending Tasks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 dark:text-slate-100", children: summary?.pendingTasks ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 dark:text-helm-muted mt-1 flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "In-progress: ",
              summary?.inProgressTasks ?? 0
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate("tasks"),
          "aria-label": `Tasks due today: ${summary?.tasksDueToday ?? 0}`,
          className: `p-4 rounded-2xl border text-left transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${(summary?.tasksDueToday ?? 0) > 0 ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50" : "bg-white dark:bg-helm-card border-slate-200 dark:border-helm-border/80 hover:border-emerald-500/40"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-500 dark:text-helm-muted", children: "Due Today" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 dark:text-slate-100", children: summary?.tasksDueToday ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 dark:text-helm-muted mt-1", children: (summary?.tasksDueToday ?? 0) > 0 ? "Action required today" : "No deadlines today" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate("tasks"),
          "aria-label": `Overdue tasks: ${summary?.overdueTasks ?? 0}`,
          className: `p-4 rounded-2xl border text-left transition-all shadow-sm group focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${(summary?.overdueTasks ?? 0) > 0 ? "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50" : "bg-white dark:bg-helm-card border-slate-200 dark:border-helm-border/80 hover:border-emerald-500/40"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-500 dark:text-helm-muted", children: "Overdue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 dark:text-slate-100", children: summary?.overdueTasks ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 dark:text-helm-muted mt-1", children: (summary?.overdueTasks ?? 0) > 0 ? "Past deadline" : "Zero overdue items" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate("notes"),
          "aria-label": `Total notes saved: ${summary?.totalNotes ?? 0}`,
          className: "p-4 rounded-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-left hover:border-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-all shadow-sm group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-slate-500 dark:text-helm-muted mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Notes Saved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform", "aria-hidden": "true" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 dark:text-slate-100", children: summary?.totalNotes ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 dark:text-helm-muted mt-1", children: "Stored in `%APPDATA%\\Helm\\helm.db`" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl bg-white dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/80 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-slate-100", children: "Today's Focus & Tasks" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onNavigate("tasks"),
              className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1",
              children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
              ]
            }
          )
        ] }),
        summary && summary.todayTasks.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: summary.todayTasks.slice(0, 3).map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate("tasks"),
            "aria-label": `View task: ${task.title}`,
            className: "flex items-center justify-between w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-helm-card hover:bg-slate-100 dark:hover:bg-helm-cardHover border border-slate-200/60 dark:border-helm-border/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1 pr-2", children: task.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold ${task.priority === "high" ? "bg-rose-500/10 text-rose-600 border border-rose-500/25" : task.priority === "medium" ? "bg-amber-500/10 text-amber-600 border border-amber-500/25" : "bg-sky-500/10 text-sky-600 border border-sky-500/25"}`,
                  children: task.priority
                }
              )
            ]
          },
          task.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 text-center text-slate-400 dark:text-helm-muted space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No tasks due today." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onNavigate("tasks", "new-task"),
              className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
              children: "+ Schedule a task for today"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl bg-white dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/80 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-emerald-500", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-slate-100", children: "Recent Notes" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onNavigate("notes"),
              className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
              children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3", "aria-hidden": "true" })
              ]
            }
          )
        ] }),
        summary && summary.recentNotes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: summary.recentNotes.slice(0, 3).map((note) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate("notes"),
            "aria-label": `View note: ${note.title.trim() || "Untitled Note"}`,
            className: "flex items-center justify-between w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-helm-card hover:bg-slate-100 dark:hover:bg-helm-cardHover border border-slate-200/60 dark:border-helm-border/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-800 dark:text-slate-200 truncate flex-1 pr-2", children: note.title.trim() || "Untitled Note" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400 dark:text-helm-muted", children: formatRelativeTime(note.updatedAt) })
            ]
          },
          note.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-6 text-center text-slate-400 dark:text-helm-muted space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "No notes captured yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => onNavigate("notes", "new-note"),
              className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline",
              children: "+ Create your first note"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          title: "Runtime & Service Health",
          description: "Verified local subsystem states on this Windows host",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "Desktop Core (Electron 34)",
                statusText: "Running",
                variant: "active",
                pulse: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "SQLite Database (`beacon.db`)",
                statusText: "Active (Pure WASM/WAL Mode)",
                variant: "active"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "Windows System Tray",
                statusText: "Active",
                variant: "active"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "Browser Extension Connection",
                statusText: browserStatus?.state === "connected" ? `Connected (${browserStatus.browserType && browserStatus.browserType !== "unknown" ? browserStatus.browserType : "Active"})` : browserStatus?.state === "connecting" ? "Connecting..." : browserStatus?.state === "error" ? "Connection Error" : "Disconnected",
                variant: browserStatus?.state === "connected" ? "active" : browserStatus?.state === "connecting" ? "pending" : browserStatus?.state === "error" ? "warning" : "inactive",
                pulse: browserStatus?.state === "connected" || browserStatus?.state === "connecting"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "Watched Pages Tracked",
                statusText: `${activeCount} active${attentionCount > 0 ? ` (${attentionCount} need attention)` : ""}`,
                variant: attentionCount > 0 ? "warning" : activeCount > 0 ? "active" : "inactive"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatusIndicator,
              {
                label: "Ambient Screen Board",
                statusText: "Live (Ken Burns & Slideshow)",
                variant: "active",
                pulse: true
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          title: "Local-First Architecture",
          description: "Security and operational boundaries established in Phases 1, 2, 3 & 4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3.5 text-xs text-slate-600 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold text-slate-800 dark:text-slate-200", children: "SQLite Persistence in %APPDATA%:" }),
                " ",
                "All notes and tasks are strictly stored in `%APPDATA%\\Helm\\helm.db`. Zero cloud syncing, zero remote tracking, and instant sub-millisecond retrieval."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold text-slate-800 dark:text-slate-200", children: "Secure Stdio & Named Pipe:" }),
                " ",
                "Zero HTTP/TCP server ports opened. Chromium extensions talk strictly over standard input/output frames to our host binary and a local Windows Named Pipe (`\\\\.\\pipe\\helm-windows-ipc`)."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold text-slate-800 dark:text-slate-200", children: "System Tray Integration:" }),
                " ",
                "The system tray displays real-time badges, quick shortcuts for New Note and New Task, and background watch syncing."
              ] })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-slate-900 dark:text-slate-100", children: "Live Watched Pages & Insights" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: watches.length > 0 ? "default" : "neutral", children: [
            watches.length,
            " ",
            watches.length === 1 ? "Page" : "Pages"
          ] })
        ] }),
        attentionCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "danger", children: [
          attentionCount,
          " ",
          attentionCount === 1 ? "requires attention" : "require attention"
        ] })
      ] }),
      watches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-dashed border-slate-300 dark:border-helm-border/70 text-center space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-9 h-9 text-slate-400 mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 dark:text-slate-200", children: "No watched pages received yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-helm-muted max-w-md mx-auto leading-relaxed", children: "When you add watched pages (e.g., packages, visa applications, job submissions) in the BEACON browser extension in Chrome, Edge, or Brave, they will synchronize here via Windows Native Messaging." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => onNavigate("settings"), children: "View Native Messaging Setup" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: watches.map((watch, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(WatchCard, { watch }, `${watch.name}-${watch.url || index}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Port Milestones & Progress",
        description: "Foundational capabilities designed for seamless integration into this core",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "success", children: "Phase 2 Done" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Browser Extension" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed", children: "Native messaging host on Windows stdio and Named Pipe syncing watches with Chrome, Edge, and Brave." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "success", children: "Phase 3 Done" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Ambient Screen Board" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed", children: "Fullscreen ambient board with Ken Burns photo slideshow, frosted glass panels & weather." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "success", children: "Phase 4 Done" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Notes & Tasks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed", children: "Local SQLite database (`helm.db`) with full Notes editor, Tasks queue, and metrics." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-lg bg-slate-50 dark:bg-helm-surface border border-slate-200/70 dark:border-helm-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-purple-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "neutral", children: "Phase 5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "3D Print OCR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-slate-500 dark:text-helm-muted leading-relaxed", children: "Packaged Python & Tesseract engine calculating INR quotations from Creality Print slicer estimates." })
          ] })
        ] })
      }
    )
  ] });
};
const THEME_STORAGE_KEY = "beacon_theme_preference";
const LEGACY_THEME_STORAGE_KEY = "helm_theme_preference";
function getStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "dark";
}
function applyTheme(theme) {
  const root = document.documentElement;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  const isDark = theme === "dark" || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  if (window.beacon?.setTheme) {
    window.beacon.setTheme(theme).catch((err) => {
      console.warn("Failed to sync theme with Electron main:", err);
    });
  }
}
function applyReducedMotion(reduced) {
  const root = document.documentElement;
  if (reduced) {
    root.classList.add("reduced-motion");
  } else {
    root.classList.remove("reduced-motion");
  }
}
function initTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
  if (window.beacon?.getSettings) {
    window.beacon.getSettings().then((settings) => {
      if (settings?.appearance) {
        applyTheme(settings.appearance.theme);
        applyReducedMotion(settings.appearance.reducedMotion);
      }
    }).catch(console.error);
  }
  const unsubSettings = window.beacon?.onSettingsChange?.((settings) => {
    if (settings?.appearance) {
      applyTheme(settings.appearance.theme);
      applyReducedMotion(settings.appearance.reducedMotion);
    }
  });
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    if (getStoredTheme() === "system") {
      applyTheme("system");
    }
  };
  mediaQuery.addEventListener("change", listener);
  return () => {
    mediaQuery.removeEventListener("change", listener);
    if (unsubSettings) unsubSettings();
  };
}
const ToggleSwitch = ({ checked, onChange, disabled, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "button",
  {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    "aria-label": label,
    disabled,
    onClick: () => !disabled && onChange(!checked),
    className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4" : "translate-x-0"}`
      }
    )
  }
);
const SettingsPage = ({ onOpenOnboarding }) => {
  const [settings, setSettings] = reactExports.useState(null);
  const [theme, setThemeState] = reactExports.useState(getStoredTheme());
  const [appVersion, setAppVersion] = reactExports.useState("0.1.0");
  const [platform, setPlatform] = reactExports.useState("win32");
  const [browserStatus, setBrowserStatus] = reactExports.useState(null);
  const [isRetrying, setIsRetrying] = reactExports.useState(false);
  const [cooldownRemaining, setCooldownRemaining] = reactExports.useState(0);
  const [health, setHealth] = reactExports.useState(null);
  const [logs, setLogs] = reactExports.useState([]);
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const [exportMessage, setExportMessage] = reactExports.useState(null);
  const [showClearConfirm, setShowClearConfirm] = reactExports.useState(false);
  const [showLogViewer, setShowLogViewer] = reactExports.useState(false);
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const [resetOnboardingChecked, setResetOnboardingChecked] = reactExports.useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = reactExports.useState(null);
  const [weatherLocInput, setWeatherLocInput] = reactExports.useState("");
  const [weatherSaveSuccess, setWeatherSaveSuccess] = reactExports.useState(false);
  const [screensaverStatus, setScreensaverStatus] = reactExports.useState(null);
  const [isRegisteringScr, setIsRegisteringScr] = reactExports.useState(false);
  const [scrActionFeedback, setScrActionFeedback] = reactExports.useState(null);
  const refreshScreensaverStatus = reactExports.useCallback(async () => {
    if (window.beacon?.getScreensaverStatus) {
      try {
        const status = await window.beacon.getScreensaverStatus();
        setScreensaverStatus(status);
      } catch (err) {
        console.error("Failed to get screensaver status:", err);
      }
    }
  }, []);
  const loadDiagnostics = reactExports.useCallback(async () => {
    if (window.beacon?.getSystemHealth) {
      try {
        const h = await window.beacon.getSystemHealth();
        setHealth(h);
      } catch (err) {
        console.error("Failed to load system health summary:", err);
      }
    }
    if (window.beacon?.getRecentLogs) {
      try {
        const l = await window.beacon.getRecentLogs(30);
        setLogs(l);
      } catch (err) {
        console.error("Failed to load recent logs:", err);
      }
    }
  }, []);
  reactExports.useEffect(() => {
    if (window.beacon?.getAppVersion) {
      window.beacon.getAppVersion().then(setAppVersion).catch(console.error);
    }
    if (window.beacon?.getPlatform) {
      window.beacon.getPlatform().then(setPlatform).catch(console.error);
    }
    if (window.beacon?.getBrowserStatus) {
      window.beacon.getBrowserStatus().then(setBrowserStatus).catch(console.error);
    }
    if (window.beacon?.getSettings) {
      window.beacon.getSettings().then((s) => {
        setSettings(s);
        if (s?.appearance) {
          setThemeState(s.appearance.theme);
          applyTheme(s.appearance.theme);
          applyReducedMotion(s.appearance.reducedMotion);
        }
        if (s?.ambient?.weatherLocation) {
          setWeatherLocInput(s.ambient.weatherLocation);
        }
      }).catch(console.error);
    }
    loadDiagnostics();
    refreshScreensaverStatus();
    const unsubBrowser = window.beacon?.onBrowserStatusUpdate?.((status) => {
      setBrowserStatus(status);
      if (status.retryStatus?.inProgress !== void 0) {
        setIsRetrying(status.retryStatus.inProgress);
      }
      loadDiagnostics();
    });
    const unsubSettings = window.beacon?.onSettingsChange?.((newSettings) => {
      setSettings(newSettings);
      if (newSettings?.appearance) {
        setThemeState(newSettings.appearance.theme);
        applyTheme(newSettings.appearance.theme);
        applyReducedMotion(newSettings.appearance.reducedMotion);
      }
    });
    return () => {
      if (unsubBrowser) unsubBrowser();
      if (unsubSettings) unsubSettings();
    };
  }, [loadDiagnostics]);
  reactExports.useEffect(() => {
    if (!browserStatus?.retryStatus?.cooldownUntil) {
      setCooldownRemaining(0);
      return;
    }
    const checkCooldown = () => {
      const until = browserStatus.retryStatus?.cooldownUntil || 0;
      const diff = Math.max(0, Math.ceil((until - Date.now()) / 1e3));
      setCooldownRemaining(diff);
    };
    checkCooldown();
    const timer = setInterval(checkCooldown, 500);
    return () => clearInterval(timer);
  }, [browserStatus?.retryStatus?.cooldownUntil]);
  const handleUpdateSettings = async (partial) => {
    if (window.beacon?.updateSettings) {
      try {
        const updated = await window.beacon.updateSettings(partial);
        setSettings(updated);
        if (partial.appearance?.theme) {
          setThemeState(partial.appearance.theme);
          applyTheme(partial.appearance.theme);
        }
        if (partial.appearance?.reducedMotion !== void 0) {
          applyReducedMotion(partial.appearance.reducedMotion);
        }
      } catch (err) {
        console.error("Failed to update settings:", err);
      }
    }
  };
  const handleResetSettings = async () => {
    if (window.beacon?.resetSettings) {
      try {
        const reset = await window.beacon.resetSettings({ resetOnboarding: resetOnboardingChecked });
        setSettings(reset);
        setThemeState(reset.appearance.theme);
        applyTheme(reset.appearance.theme);
        applyReducedMotion(reset.appearance.reducedMotion);
        setShowResetConfirm(false);
        setResetSuccessMessage("Settings have been successfully restored to defaults.");
        setTimeout(() => setResetSuccessMessage(null), 5e3);
      } catch (err) {
        console.error("Failed to reset settings:", err);
      }
    }
  };
  const handleRetryConnection = reactExports.useCallback(async () => {
    if (isRetrying || cooldownRemaining > 0) return;
    setIsRetrying(true);
    try {
      if (window.beacon?.retryBrowserConnection) {
        const res = await window.beacon.retryBrowserConnection();
        setBrowserStatus(res);
      }
    } catch (err) {
      console.error("[Settings] Retry connection failed:", err);
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, cooldownRemaining]);
  const handleExportDiagnostics = async () => {
    setIsExporting(true);
    setExportMessage(null);
    try {
      if (window.beacon?.exportDiagnostics) {
        const res = await window.beacon.exportDiagnostics();
        if (res.success && res.filePath) {
          setExportMessage({ text: `Diagnostics bundle exported: ${res.filePath}` });
        } else {
          setExportMessage({ text: res.error || "Failed to export diagnostics", error: true });
        }
      }
    } catch (err) {
      console.error("Failed to export diagnostics:", err);
      setExportMessage({ text: "Error executing diagnostics export", error: true });
    } finally {
      setIsExporting(false);
    }
  };
  const handleClearLogs = async () => {
    try {
      if (window.beacon?.clearLogs) {
        await window.beacon.clearLogs();
        setLogs([]);
        setShowClearConfirm(false);
        await loadDiagnostics();
      }
    } catch (err) {
      console.error("Failed to clear logs:", err);
    }
  };
  const handleOpenLogsDir = async () => {
    try {
      if (window.beacon?.openLogsDirectory) {
        await window.beacon.openLogsDirectory();
      }
    } catch (err) {
      console.error("Failed to open logs folder:", err);
    }
  };
  const handleThemeChange = (newTheme) => {
    handleUpdateSettings({ appearance: { theme: newTheme } });
  };
  const handleSaveWeatherLocation = async (locationOverride) => {
    const loc = (locationOverride !== void 0 ? locationOverride : weatherLocInput).trim();
    if (!loc) {
      console.warn("[Diagnostic:Settings] Save Weather clicked but location is empty");
      return;
    }
    console.log("[Diagnostic:Settings] Save Weather Location clicked:", loc);
    setWeatherLocInput(loc);
    try {
      await handleUpdateSettings({
        ambient: {
          weatherLocation: loc
        }
      });
      console.log("[Diagnostic:Settings] handleUpdateSettings completed successfully for:", loc);
      setWeatherSaveSuccess(true);
      setTimeout(() => setWeatherSaveSuccess(false), 2500);
      if (window.beacon?.getWeather) {
        console.log("[Diagnostic:Settings] Pre-warming weather cache for:", loc);
        window.beacon.getWeather(loc).then((res) => {
          console.log("[Diagnostic:Settings] Pre-warm result:", res);
        }).catch((err) => {
          console.error("[Diagnostic:Settings] Pre-warm error:", err);
        });
      }
    } catch (err) {
      console.error("[Diagnostic:Settings] Failed to save weather location:", err);
    }
  };
  const handleToggleScreensaverActive = async (active) => {
    setIsRegisteringScr(true);
    try {
      if (window.beacon?.setScreensaverActive) {
        await window.beacon.setScreensaverActive(active);
        await refreshScreensaverStatus();
        setScrActionFeedback(
          active ? "BEACON has been registered as your active Windows screensaver!" : "BEACON has been unregistered as Windows screensaver."
        );
        setTimeout(() => setScrActionFeedback(null), 4e3);
      }
    } catch (err) {
      console.error("Failed to set screensaver active:", err);
    } finally {
      setIsRegisteringScr(false);
    }
  };
  const handleOpenWindowsScreensaverDialog = async () => {
    if (window.beacon?.openWindowsScreensaverSettings) {
      await window.beacon.openWindowsScreensaverSettings();
    }
  };
  const handleTestScreensaver = async () => {
    if (window.beacon?.previewScreensaver) {
      await window.beacon.previewScreensaver();
    }
  };
  const getBrowserLabel = (type) => {
    switch (type) {
      case "chrome":
        return "Google Chrome";
      case "edge":
        return "Microsoft Edge";
      case "brave":
        return "Brave Browser";
      case "chromium":
        return "Chromium Browser";
      default:
        return "Waiting for Handshake";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-3xl animate-fadeIn pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500 dark:text-helm-muted", children: "Configure application preferences, theme, notifications, and browser extension connectivity" })
    ] }),
    resetSuccessMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: resetSuccessMessage })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "General & Lifecycle",
        description: "Configure desktop runtime startup, tray minimization, and closing behavior",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Launch at Windows Startup"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Automatically start BEACON in background when you sign in to Windows." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: settings?.general?.launchAtStartup ? "success" : "neutral", children: settings?.general?.launchAtStartup ? "Enabled" : "Disabled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleSwitch,
                {
                  checked: Boolean(settings?.general?.launchAtStartup),
                  onChange: (checked) => handleUpdateSettings({ general: { launchAtStartup: checked } })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Start Minimized in System Tray"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Launch quietly into the notification area without opening the main window." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: Boolean(settings?.general?.startMinimized),
                onChange: (checked) => handleUpdateSettings({ general: { startMinimized: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Minimize to System Tray"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Clicking minimize hides the window to the tray instead of keeping it in the Windows taskbar." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: Boolean(settings?.general?.minimizeToTray),
                onChange: (checked) => handleUpdateSettings({ general: { minimizeToTray: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Window Close Behavior" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Choose what happens when you click the window close button." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-black/30 rounded-lg border border-slate-200/80 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleUpdateSettings({ general: { closeBehavior: "tray" } }),
                  className: `px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${settings?.general?.closeBehavior !== "quit" ? "bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white"}`,
                  children: "Hide to Tray"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleUpdateSettings({ general: { closeBehavior: "quit" } }),
                  className: `px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${settings?.general?.closeBehavior === "quit" ? "bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white"}`,
                  children: "Exit Application"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Appearance",
        description: "Choose visual presentation, themes, and motion accessibility preferences",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200 mb-2", children: "Color Theme" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleThemeChange("system"),
                  className: `flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${theme === "system" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "System Default" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleThemeChange("dark"),
                  className: `flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${theme === "dark" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dark (Ambient)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleThemeChange("light"),
                  className: `flex flex-col items-center gap-2 p-3.5 rounded-lg border text-xs font-medium transition-all ${theme === "light" ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Light" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-t border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Reduced Motion"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Minimizes animations, transitions, and Ambient Ken Burns pan-and-zoom effects." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: Boolean(settings?.appearance?.reducedMotion),
                onChange: (checked) => handleUpdateSettings({ appearance: { reducedMotion: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40 text-[11px] flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Ambient Screen Board Shortcuts" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500 dark:text-helm-muted mt-0.5", children: [
                "Press ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]", children: "F11" }),
                " for Fullscreen, ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]", children: "Space" }),
                " to Pause, ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1 py-0.5 bg-slate-200 dark:bg-black/50 rounded font-mono text-[10px]", children: "Esc" }),
                " to Exit."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "neutral", className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3 h-3 text-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cinematic Mode" })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Ambient Weather & Atmosphere",
        description: "Configure live weather conditions, location, and temperature units for the Ambient Screen Board",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Live Weather Display"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Show real-time temperature, atmospheric conditions, and weather icon on the Ambient Screen Board." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: settings?.ambient?.showWeather !== false,
                onChange: (checked) => handleUpdateSettings({ ambient: { showWeather: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Temperature Units"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Choose between Celsius (°C) and Fahrenheit (°F) display." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-slate-100 dark:bg-black/30 p-1 rounded-lg border border-slate-200 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleUpdateSettings({ ambient: { temperatureUnit: "C" } }),
                  className: `px-3 py-1 rounded text-xs font-semibold transition-all ${settings?.ambient?.temperatureUnit !== "F" ? "bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white"}`,
                  children: "°C (Celsius)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleUpdateSettings({ ambient: { temperatureUnit: "F" } }),
                  className: `px-3 py-1 rounded text-xs font-semibold transition-all ${settings?.ambient?.temperatureUnit === "F" ? "bg-white dark:bg-helm-surface text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-600 dark:text-helm-muted hover:text-slate-900 dark:hover:text-white"}`,
                  children: "°F (Fahrenheit)"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "weather-location-input", className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Weather Location"
              ] }),
              weatherSaveSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                "Saved & updated!"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Enter city name, region, or country (e.g., Chennai, Tamil Nadu, India)." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: (e) => {
                  e.preventDefault();
                  handleSaveWeatherLocation();
                },
                className: "flex gap-2 pt-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "weather-location-input",
                      type: "text",
                      value: weatherLocInput,
                      onChange: (e) => setWeatherLocInput(e.target.value),
                      placeholder: "e.g. Chennai, Tamil Nadu, India",
                      className: "flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "submit",
                      variant: "primary",
                      size: "sm",
                      className: "flex items-center gap-1.5 shrink-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Save Location" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2 border-t border-slate-100 dark:border-helm-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Quick Presets:" }),
                [
                  "Chennai, Tamil Nadu, India",
                  "London, UK",
                  "Tokyo, Japan",
                  "New York, NY"
                ].map((city) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSaveWeatherLocation(city),
                    className: "text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-helm-border/40 transition-colors",
                    children: city
                  },
                  city
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-400 dark:text-helm-muted pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Weather data by Open-Meteo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-refreshes every 15 minutes" })
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Windows Screensaver Integration",
        description: "Run BEACON Ambient Screen Board as your native Windows screensaver when your workstation is idle",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-2.5 h-2.5 rounded-full shrink-0 ${screensaverStatus?.isRegistered ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Windows Status:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: screensaverStatus?.isRegistered ? "success" : "neutral", children: screensaverStatus?.isRegistered ? "BEACON is Active Screensaver" : "Not Active Screensaver" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: screensaverStatus?.isRegistered ? `Windows idle timeout: ${Math.round(
                  (screensaverStatus?.timeoutSeconds || 600) / 60
                )} minutes (${screensaverStatus?.timeoutSeconds || 600}s)` : "Select BEACON in Windows Screen Saver Settings or register directly below" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: screensaverStatus?.isRegistered ? "secondary" : "primary",
                  size: "sm",
                  disabled: isRegisteringScr,
                  onClick: () => handleToggleScreensaverActive(!screensaverStatus?.isRegistered),
                  children: screensaverStatus?.isRegistered ? "Remove Screensaver" : "Set as Active Screensaver"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleOpenWindowsScreensaverDialog,
                  children: "Windows Screen Saver Settings"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleTestScreensaver,
                  children: "Test Screensaver"
                }
              )
            ] })
          ] }),
          scrActionFeedback && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-2 animate-fadeIn", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scrActionFeedback })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1", children: "Screensaver Content & Privacy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-helm-muted mb-3", children: "Configure what is displayed while your workstation is idle. Personal notes, tasks, and browser watches are hidden by default for office privacy." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Show Digital Clock & Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display current time with smooth typography during screensaver." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: settings?.screensaver?.showClock !== false,
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showClock: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Show Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display full weekday and calendar date." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: settings?.screensaver?.showDate !== false,
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showDate: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Show Live Weather" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display local temperature and atmospheric conditions." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: settings?.screensaver?.showWeather !== false,
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showWeather: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Show Daily Quote" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display rotating mindful philosophical quotes." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: settings?.screensaver?.showQuote !== false,
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showQuote: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show Pending Tasks" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal", children: "Privacy-sensitive" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display incomplete task titles on the screensaver (max 3–5, prioritized by urgency and due date). Task descriptions and notes are strictly omitted. Note: Task titles may be visible to anyone near your workstation." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: Boolean(settings?.screensaver?.showTasks),
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showTasks: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show Browser Watch Feed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-normal", children: "Privacy-sensitive" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display monitored browser tabs on the screensaver (disabled by default for office privacy)." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: Boolean(settings?.screensaver?.showWatches),
                    onChange: (checked) => handleUpdateSettings({ screensaver: { showWatches: checked } })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Exit on Mouse Movement" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Automatically dismiss screensaver when mouse is moved (uses an 800ms grace period and distance threshold to prevent accidental dismissal)." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: settings?.screensaver?.exitOnMouseMove !== false,
                    onChange: (checked) => handleUpdateSettings({ screensaver: { exitOnMouseMove: checked } })
                  }
                )
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Notifications",
        description: "Configure desktop notification banners and alert chimes for browser updates",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Desktop Notifications"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Display native Windows notifications when web monitor stages or attention states trigger." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: settings?.notifications?.enabled !== false,
                onChange: (checked) => handleUpdateSettings({ notifications: { enabled: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                settings?.notifications?.sound !== false ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Notification Sound"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Play default Windows chime sound when displaying a notification alert." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ToggleSwitch,
              {
                checked: settings?.notifications?.sound !== false,
                disabled: settings?.notifications?.enabled === false,
                onChange: (checked) => handleUpdateSettings({ notifications: { sound: checked } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Windows Notification System Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "success", className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
              "Supported on Windows 10 & 11"
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Chromium Extension Integration",
        description: "Windows Native Messaging Host configuration and live connection status for Chrome, Edge, and Brave",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/50 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-3 h-3 rounded-full transition-all ${browserStatus?.state === "connected" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" : browserStatus?.state === "connecting" ? "bg-amber-500 animate-spin" : browserStatus?.state === "error" ? "bg-rose-500" : "bg-slate-400 dark:bg-slate-600"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: browserStatus?.state === "connected" ? "Connected to Browser" : browserStatus?.state === "connecting" ? "Connecting & Verifying..." : browserStatus?.state === "error" ? "Connection Error" : "Extension Disconnected" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: browserStatus?.state === "connected" ? "success" : browserStatus?.state === "connecting" ? "warning" : browserStatus?.state === "error" ? "danger" : "neutral",
                        children: browserStatus?.state?.toUpperCase() || "DISCONNECTED"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: browserStatus?.state === "connected" ? `Active handshake with ${getBrowserLabel(browserStatus.browserType)}` : browserStatus?.errorReason || "No communication received. Open Chrome, Edge, or Brave with the BEACON extension active." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleRetryConnection,
                  disabled: isRetrying || cooldownRemaining > 0,
                  className: "text-xs gap-1.5",
                  title: "Test and re-verify connection to the browser extension",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        className: `w-3.5 h-3.5 text-emerald-500 ${isRetrying ? "animate-spin" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isRetrying ? "Checking..." : cooldownRemaining > 0 ? `Retry in ${cooldownRemaining}s` : "Retry Connection" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/60 dark:border-helm-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider", children: "Detected Browser" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-0.5 truncate", children: getBrowserLabel(browserStatus?.browserType) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider", children: "Last Handshake" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-0.5", children: browserStatus?.lastSyncTime ? formatRelativeTime(browserStatus.lastSyncTime) : "Never" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-white dark:bg-black/25 border border-slate-200/50 dark:border-helm-border/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider", children: "Active Watches" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-0.5", children: [
                  browserStatus?.activeWatchCount || 0,
                  " tracked"
                ] })
              ] })
            ] }),
            (browserStatus?.state === "disconnected" || browserStatus?.state === "error") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 dark:text-amber-200 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Troubleshooting Connection" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal list-inside space-y-0.5 text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Open Google Chrome, Microsoft Edge, or Brave." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Ensure the BEACON extension is installed and enabled in your browser." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "If recently installed, run the Native Messaging registration script below." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5 text-emerald-500" }),
                "Native Messaging Registration"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Registry entries in HKCU\\Software\\[Browser]\\NativeMessagingHosts" })
            ] }),
            browserStatus?.manifestInstalled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "success", className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
              "Registered"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "warning", className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
              "Pending Registration"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-b border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3.5 h-3.5 text-sky-500" }),
                "Local Named Pipe Channel"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Fast, zero-network interprocess communication" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-slate-600 dark:text-slate-300", children: "\\\\.\\pipe\\helm-windows-ipc" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-slate-100/70 dark:bg-helm-surface/80 border border-slate-200 dark:border-helm-border/50 text-[11px] space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { className: "w-3.5 h-3.5 text-emerald-500" }),
              "Registration Script"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-white dark:bg-black/40 p-2 rounded border border-slate-200/60 dark:border-helm-border/40 select-all", children: "powershell -ExecutionPolicy Bypass -File scripts\\register-native-host.ps1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-helm-muted", children: "Registers the host manifest into current user registry for all installed Chromium browsers." })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Data, Storage & Privacy",
        description: "Local storage health, diagnostic logging controls, and configuration management",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3 h-3 text-emerald-500" }),
                "SQLite WASM DB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 inline-block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: health?.databaseHealth?.status === "healthy" ? "Healthy" : "Corrupted / Init" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 dark:text-helm-muted mt-0.5", children: [
                Math.round((health?.databaseHealth?.sizeBytes || 0) / 1024),
                " KB (v",
                health?.databaseHealth?.version || 1,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { className: "w-3 h-3 text-sky-500" }),
                "Settings Store"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 inline-block" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: health?.settingsHealth?.status === "healthy" ? "Healthy" : "Missing" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 dark:text-helm-muted mt-0.5", children: [
                health?.settingsHealth?.sizeBytes || 0,
                " bytes"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3 text-purple-500" }),
                "Heap Memory"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-1", children: [
                health?.memoryUsageMb || 0,
                " MB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 dark:text-helm-muted mt-0.5", children: [
                health?.arch || "x64",
                " runtime"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 dark:bg-helm-surface/80 border border-slate-200/80 dark:border-helm-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 dark:text-helm-muted uppercase tracking-wider flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3 h-3 text-amber-500" }),
                "Extension Pipe"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200 mt-1 capitalize truncate", children: health?.extensionHealth?.state || "Disconnected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 dark:text-helm-muted mt-0.5", children: health?.extensionHealth?.pipeAvailable ? "Named Pipe Active" : "Offline" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-slate-100/80 dark:bg-black/30 border border-slate-200/60 dark:border-helm-border/30 text-[11px] flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-600 dark:text-helm-muted leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Zero Content Logging:" }),
              " Diagnostic logs and exports strictly exclude note text, task details, webpage contents, cookies, tokens, and Windows usernames. Only sanitized environment and error metrics are recorded locally."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "secondary",
                  size: "sm",
                  onClick: handleExportDiagnostics,
                  disabled: isExporting,
                  className: "text-xs gap-1.5",
                  title: "Export privacy-safe diagnostics bundle to %APPDATA%\\Beacon\\diagnostics",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: `w-3.5 h-3.5 text-sky-500 ${isExporting ? "animate-bounce" : ""}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isExporting ? "Exporting..." : "Export Diagnostics" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleOpenLogsDir,
                  className: "text-xs gap-1.5",
                  title: "Open local logs folder in Windows Explorer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Logs Folder" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: showClearConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 animate-fadeIn", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-rose-500 font-medium", children: "Clear all logs?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleClearLogs,
                  className: "px-2 py-1 text-[11px] font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors",
                  children: "Confirm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowClearConfirm(false),
                  className: "px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded transition-colors",
                  children: "Cancel"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setShowClearConfirm(true),
                className: "text-xs gap-1.5 text-slate-500 hover:text-rose-500 dark:text-helm-muted",
                title: "Clear diagnostic log files and in-memory buffer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clear Logs" })
                ]
              }
            ) })
          ] }),
          exportMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              role: "status",
              "aria-live": "polite",
              className: `p-2.5 rounded-lg text-[11px] font-medium border select-all animate-fadeIn ${exportMessage.error ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`,
              children: exportMessage.text
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "aria-expanded": showLogViewer,
                "aria-controls": "recent-logs-list",
                onClick: () => setShowLogViewer(!showLogViewer),
                className: "flex items-center justify-between w-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded py-1 px-0.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { className: "w-3.5 h-3.5 text-slate-400", "aria-hidden": "true" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Recent Diagnostics Logs (",
                      logs.length,
                      ")"
                    ] })
                  ] }),
                  showLogViewer ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                ]
              }
            ),
            showLogViewer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "recent-logs-list", className: "mt-2.5 p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[10px] space-y-1.5 max-h-48 overflow-y-auto border border-slate-800 animate-fadeIn", children: logs.length > 0 ? logs.map((log, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 shrink-0", children: new Date(log.timestamp).toLocaleTimeString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-semibold shrink-0 uppercase text-[9px] px-1 rounded ${log.level === "error" ? "bg-rose-900/60 text-rose-300" : log.level === "warn" ? "bg-amber-900/60 text-amber-300" : "bg-slate-800 text-slate-300"}`,
                  children: log.level
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 shrink-0", children: [
                "[",
                log.component,
                "]"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200 break-words flex-1", children: log.message })
            ] }, idx)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 italic py-2 text-center", children: "No recent events or warnings recorded in memory." }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-slate-200/80 dark:border-helm-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5 text-slate-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reset Settings to Defaults" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Restores General, Appearance, Notifications, and Ambient preferences. Notes, Tasks, and Watches are never deleted." })
              ] }),
              !showResetConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowResetConfirm(true),
                  className: "text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reset Preferences" })
                  ]
                }
              ) : null
            ] }),
            showResetConfirm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-3 animate-fadeIn", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-rose-800 dark:text-rose-200 font-medium", children: "Confirm Resetting All Application Preferences?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed", children: "This will reset window lifecycle, color theme, notification toggles, and ambient board settings to their defaults. Your SQLite database (Notes & Tasks) and tracked Web Watches will remain completely intact." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    id: "reset-onboarding-cb",
                    checked: resetOnboardingChecked,
                    onChange: (e) => setResetOnboardingChecked(e.target.checked),
                    className: "rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reset-onboarding-cb", className: "cursor-pointer", children: "Also replay Welcome Onboarding Tour on next launch" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleResetSettings,
                    className: "px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors",
                    children: "Yes, Reset Preferences"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setShowResetConfirm(false),
                    className: "px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-helm-surface rounded-lg transition-colors",
                    children: "Cancel"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Getting Started & Help",
        description: "Review BEACON's features, key bindings, and guided tour",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: "Welcome Tour & Onboarding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Replay the interactive walkthrough for Ambient, Notes, Tasks, and browser monitors" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: onOpenOnboarding,
              className: "text-xs gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Replay Onboarding Tour" })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        title: "Application Information",
        description: "Architecture and version details for this local instance",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-helm-muted", children: "Application Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 dark:text-slate-200", children: "BEACON (Windows Port)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-helm-muted", children: "Version" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-slate-800 dark:text-slate-200", children: appVersion })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5 border-b border-slate-100 dark:border-helm-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-helm-muted", children: "Target Platform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-slate-800 dark:text-slate-200", children: [
              platform,
              " (Windows)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-helm-muted", children: "Runtime Architecture" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600 dark:text-emerald-400", children: "Electron 34 + React 18 + Vite" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-100 dark:bg-helm-card border border-slate-200 dark:border-helm-border/60 flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-emerald-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600 dark:text-helm-muted leading-relaxed", children: [
        "BEACON is designed as an ambient utility. It keeps notes, tasks, and web watches visible without cognitive friction. All settings and preferences are stored locally on your PC under ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: "%APPDATA%\\Beacon\\settings.json" }),
        "."
      ] })
    ] })
  ] });
};
const BuiltInWallpaperView = ({ id }) => {
  if (id.startsWith("space-")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-[#030408] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-[#050814] via-[#090b1e] to-[#04060c] opacity-90" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-950/20 rounded-full blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-violet-950/15 rounded-full blur-[100px]" })
    ] });
  }
  if (id.startsWith("aurora-")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-[#020509] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#030911] via-[#040c14] to-[#020408] opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 left-1/4 w-[700px] h-[500px] bg-emerald-950/20 rounded-full blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-teal-950/15 rounded-full blur-[110px]" })
    ] });
  }
  if (id.startsWith("night-")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-[#020409] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#040713] via-[#060a1a] to-[#02040a] opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-950/15 rounded-full blur-[130px]" })
    ] });
  }
  if (id.startsWith("campfire-")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-[#040306] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#04050c] via-[#08070d] to-[#050306] opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-12 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-amber-950/25 rounded-full blur-[80px]" })
    ] });
  }
  if (id.startsWith("moonlit-")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-[#03050c] overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#050818] via-[#080c20] to-[#03050d] opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-16 right-1/4 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[110px]" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full bg-[#030408] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#040714] via-[#080b1c] to-[#030408]" }) });
};
const KenBurnsSlideshow = ({
  currentWallpaper,
  previousWallpaper,
  nextWallpaper,
  isTransitioning,
  transitionDuration,
  kenBurnsEnabled,
  backgroundDim,
  animationVariant = "a"
}) => {
  const [imageErrorMap, setImageErrorMap] = reactExports.useState({});
  const [imageLoadedMap, setImageLoadedMap] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (!nextWallpaper?.url) return;
    const isWebOrFile = nextWallpaper.url.startsWith("http://") || nextWallpaper.url.startsWith("https://") || nextWallpaper.url.startsWith("beacon-wallpaper://") || nextWallpaper.url.startsWith("helm-wallpaper://") || nextWallpaper.url.startsWith("data:");
    if (isWebOrFile) {
      const img = new Image();
      img.src = nextWallpaper.url;
    }
  }, [nextWallpaper]);
  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };
  const handleImageLoad = (id) => {
    setImageLoadedMap((prev) => ({ ...prev, [id]: true }));
  };
  const getAnimationClass = (variant) => {
    if (!kenBurnsEnabled) return "";
    switch (variant) {
      case "b":
        return "animate-kenburns-b";
      case "c":
        return "animate-kenburns-c";
      case "d":
        return "animate-kenburns-d";
      case "a":
      default:
        return "animate-kenburns-a";
    }
  };
  const renderWallpaperLayer = (wallpaper, variant) => {
    const hasError = imageErrorMap[wallpaper.id];
    const isLoaded = imageLoadedMap[wallpaper.id];
    const animClass = getAnimationClass(variant);
    const isImageSource = Boolean(wallpaper.url) && (wallpaper.url.startsWith("beacon-wallpaper://") || wallpaper.url.startsWith("helm-wallpaper://") || wallpaper.url.startsWith("http://") || wallpaper.url.startsWith("https://") || wallpaper.url.startsWith("data:") || wallpaper.url.startsWith("file:") || wallpaper.type === "file");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `absolute inset-0 w-full h-full overflow-hidden ${animClass}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BuiltInWallpaperView, { id: wallpaper.id }) }),
      isImageSource && !hasError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          ref: (el) => {
            if (el && el.complete && el.naturalWidth > 0 && !imageLoadedMap[wallpaper.id]) {
              handleImageLoad(wallpaper.id);
            }
          },
          src: wallpaper.url,
          alt: wallpaper.name,
          loading: "eager",
          onLoad: () => handleImageLoad(wallpaper.id),
          onError: () => handleImageError(wallpaper.id),
          className: `absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`,
          style: {
            filter: "brightness(1.20) contrast(1.06) saturate(1.15)"
          }
        }
      )
    ] });
  };
  const previousVariant = animationVariant === "a" ? "b" : animationVariant === "b" ? "c" : animationVariant === "c" ? "d" : "a";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full overflow-hidden bg-black select-none pointer-events-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full z-0", children: renderWallpaperLayer(currentWallpaper, animationVariant) }),
    previousWallpaper && isTransitioning && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 w-full h-full z-10 transition-opacity ease-in-out",
        style: {
          opacity: 0,
          transitionDuration: `${transitionDuration}s`
        },
        children: renderWallpaperLayer(previousWallpaper, previousVariant)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 w-full h-full z-20 pointer-events-none transition-colors duration-500",
        style: {
          backgroundColor: `rgba(0, 0, 0, ${Math.min(Math.max(backgroundDim ?? 0.1, 0), 0.2)})`
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full z-20 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 w-full h-full z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_80%,rgba(0,0,0,0.06)_100%)]" })
  ] });
};
const CALM_QUOTES = [
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Quiet minds cannot be perplexed or frightened.", author: "Robert Louis Stevenson" },
  { text: "In the depth of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" }
];
const AmbientClockWeather = ({
  settings,
  settingsLoaded = true,
  onOpenSettings,
  isScreensaver = false
}) => {
  const [timeStr, setTimeStr] = reactExports.useState("");
  const [ampmStr, setAmpmStr] = reactExports.useState("");
  const [dateStr, setDateStr] = reactExports.useState("");
  const [weather, setWeather] = reactExports.useState(null);
  const [weatherLoading, setWeatherLoading] = reactExports.useState(false);
  const [quoteIndex, setQuoteIndex] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let timer = null;
    const updateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
      if (settings.use24Hour) {
        const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;
        setTimeStr(`${formattedHour}:${formattedMin}`);
        setAmpmStr("");
      } else {
        const displayHour = hours % 12 || 12;
        const ampm = hours >= 12 ? "PM" : "AM";
        setTimeStr(`${displayHour}:${formattedMin}`);
        setAmpmStr(ampm);
      }
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
      };
      setDateStr(now.toLocaleDateString(void 0, options));
    };
    const startTimer = () => {
      if (timer) clearInterval(timer);
      updateTime();
      if (!document.hidden) {
        timer = setInterval(updateTime, 1e3);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } else {
        startTimer();
      }
    };
    startTimer();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [settings.use24Hour]);
  reactExports.useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5
    );
    setQuoteIndex(dayOfYear % CALM_QUOTES.length);
  }, []);
  const fetchWeather = async (targetLoc) => {
    if (!settings.showWeather || !window.beacon?.getWeather) {
      console.log("[Diagnostic:AmbientWeather] Skipping fetch: showWeather is false or window.beacon.getWeather missing");
      return;
    }
    const loc = (targetLoc !== void 0 ? targetLoc : settings.weatherLocation || "").trim();
    console.log("[Diagnostic:AmbientWeather] Requesting weather for location:", loc || "(empty)");
    if (!loc) {
      setWeather(null);
      setWeatherLoading(false);
      return;
    }
    setWeatherLoading(true);
    try {
      console.log("[Diagnostic:AmbientWeather] Calling window.beacon.getWeather with:", loc);
      const data = await window.beacon.getWeather(loc);
      console.log("[Diagnostic:AmbientWeather] IPC weather response received:", data);
      setWeather(data);
    } catch (err) {
      console.error("[Diagnostic:AmbientWeather] Failed to load weather for " + loc + ":", err?.message);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!settingsLoaded) {
      console.log("[Diagnostic:AmbientWeather] Awaiting settings load before triggering initial weather fetch");
      return;
    }
    let active = true;
    const loc = (settings.weatherLocation || "").trim();
    if (!settings.showWeather || !loc) {
      setWeather(null);
      setWeatherLoading(false);
      return;
    }
    console.log("[Diagnostic:AmbientWeather] Effect triggered. Location:", loc, "showWeather:", settings.showWeather);
    setWeatherLoading(true);
    window.beacon?.getWeather(loc).then((data) => {
      if (active) {
        console.log("[Diagnostic:AmbientWeather] Effect resolved weather data for " + loc + ":", data);
        setWeather(data);
      } else {
        console.log("[Diagnostic:AmbientWeather] Discarded obsolete weather response for:", loc);
      }
    }).catch((err) => {
      if (active) {
        console.warn("[Diagnostic:AmbientWeather] Effect caught error for " + loc + ":", err);
        setWeather(null);
      }
    }).finally(() => {
      if (active) {
        setWeatherLoading(false);
      }
    });
    const interval = setInterval(() => {
      if (active && settings.showWeather && loc) {
        window.beacon?.getWeather(loc).then((d) => {
          if (active) setWeather(d);
        }).catch(() => {
        });
      }
    }, 15 * 60 * 1e3);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [settingsLoaded, settings.showWeather, settings.weatherLocation]);
  const getWeatherIcon = (code) => {
    switch (code) {
      case "thunder":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "snow":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Snowflake, { className: "w-4 h-4 text-sky-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "rain":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudRain, { className: "w-4 h-4 text-sky-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "fog":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudFog, { className: "w-4 h-4 text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "wind":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Wind, { className: "w-4 h-4 text-teal-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "cloudy":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-4 h-4 text-slate-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
      case "clear":
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4 text-amber-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" });
    }
  };
  const quote = CALM_QUOTES[quoteIndex];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex flex-col space-y-1.5 px-5 py-3.5 rounded-2xl ambient-surface-glass max-w-fit select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BeaconSymbol, { size: isScreensaver ? 20 : 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest font-bold text-[#FFFFFF] ambient-shadow-text", children: "BEACON Ambient" }),
          settings.showDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 text-xs", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-200 ambient-shadow-text", children: dateStr })
          ] })
        ] }),
        settings.showDate && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FFFFFF] ambient-shadow-heading", children: dateStr.split(",")[0] })
      ] }),
      settings.showClock && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-baseline gap-2.5 px-6 py-3.5 rounded-2xl ambient-surface-glass select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-mono font-medium sm:font-semibold tracking-tight text-[#FFFFFF] tabular-nums ambient-shadow-clock ${isScreensaver ? "text-6xl sm:text-7xl lg:text-8xl" : "text-5xl sm:text-6xl lg:text-7xl"}`,
            children: timeStr
          }
        ),
        ampmStr && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-bold tracking-wider text-slate-200 uppercase ambient-shadow-text ml-1.5 ${isScreensaver ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`,
            children: ampmStr
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-1", children: [
      settings.showWeather && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2.5", children: weather ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: onOpenSettings,
          className: "group cursor-pointer inline-flex items-center gap-2.5 py-2 px-4 rounded-2xl ambient-pill-glass hover:border-white/40 transition-all text-xs sm:text-sm text-white",
          title: `Weather data by Open-Meteo${weather.isStale ? " (Cached data — offline)" : ""} · Click to configure location`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0", children: getWeatherIcon(weather.conditionCode) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#FFFFFF] text-xs sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]", children: settings.temperatureUnit === "F" ? `${weather.temperatureFahrenheit}°F` : `${weather.temperatureCelsius}°C` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-100 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]", children: weather.condition }),
            weather.isStale && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] bg-amber-500/35 text-amber-100 px-2 py-0.5 rounded-full font-bold border border-amber-400/50", children: "Offline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-200 font-semibold hidden sm:inline-flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-emerald-400 drop-shadow" }),
              weather.location
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => {
            if (settings.weatherLocation?.trim()) {
              fetchWeather(settings.weatherLocation);
            } else {
              onOpenSettings();
            }
          },
          className: "group cursor-pointer inline-flex items-center gap-2 py-2 px-4 rounded-2xl ambient-pill-glass hover:border-white/40 transition-all text-xs text-white",
          title: settings.weatherLocation?.trim() ? `Click to retry weather lookup for ${settings.weatherLocation}` : "Configure weather location (Open-Meteo)",
          children: [
            weatherLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-emerald-400 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-3.5 h-3.5 text-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-100", children: weatherLoading ? settings.weatherLocation?.trim() ? `Updating weather for ${settings.weatherLocation}...` : "Updating weather..." : !settings.weatherLocation?.trim() ? "No location set · Configure location" : `Weather unavailable for ${settings.weatherLocation} · Tap to retry` })
          ]
        }
      ) }),
      settings.showQuote && quote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl ambient-pill-glass max-w-xl text-xs sm:text-sm select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-emerald-400 shrink-0 not-italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate text-slate-100 font-medium italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]", children: [
          "“",
          quote.text,
          "” ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "not-italic text-emerald-300 font-bold ml-1.5", children: [
            "— ",
            quote.author
          ] })
        ] })
      ] })
    ] })
  ] });
};
const KIND_EMOJIS = {
  delivery: "📦",
  appReview: "📱",
  access: "🔑",
  government: "🛂",
  job: "💼",
  results: "🎓",
  booking: "🎫",
  refund: "💸",
  ticket: "🎟️",
  build: "🛠️",
  product: "🏷️"
};
const AmbientWatchesColumn = ({
  watches,
  settings
}) => {
  const handleOpenUrl = (url) => {
    if (!url) return;
    if (window.beacon?.openExternal) {
      window.beacon.openExternal(url).catch(console.error);
    } else {
      window.open(url, "_blank");
    }
  };
  const attentionWatches = watches.filter((w) => w.state === "attention");
  const otherWatches = watches.filter((w) => w.state !== "attention" && w.state !== "done");
  const doneWatches = watches.filter((w) => w.state === "done");
  const glassStyle = {
    backdropFilter: `blur(${settings.frostedGlassBlur}px)`,
    WebkitBackdropFilter: `blur(${settings.frostedGlassBlur}px)`
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4 max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center justify-between w-full px-3.5 py-1.5 rounded-xl ambient-header-glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4 text-emerald-400 drop-shadow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold tracking-wider uppercase text-[#FFFFFF] ambient-shadow-text", children: "Ambient Watch Feed" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-emerald-400 ambient-shadow-text", children: [
        watches.length,
        " tracked"
      ] })
    ] }),
    attentionWatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: attentionWatches.map((w, idx) => {
      const emoji = KIND_EMOJIS[w.kind] || "⚠️";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: glassStyle,
          className: "p-4 rounded-2xl ambient-card-glass-overdue text-white space-y-2.5 transition-all hover:border-rose-400/60",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg shrink-0 drop-shadow", children: emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs sm:text-sm font-bold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]", children: w.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-rose-200 font-bold", children: "Requires Attention" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/30 text-rose-100 border border-rose-400/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
                "Alert"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-100 leading-relaxed font-normal bg-white/10 p-2.5 rounded-xl border border-white/20", children: w.text }),
            w.steps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-slate-200 font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-white", children: [
                  w.step,
                  " of ",
                  w.steps
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-white/25 rounded-full overflow-hidden flex gap-0.5", children: Array.from({ length: w.steps }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-full flex-1 ${i < w.step ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-white/15"}`
                },
                i
              )) })
            ] }),
            w.url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleOpenUrl(w.url),
                "aria-label": `Review details for ${w.name}`,
                className: "inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-1.5 py-0.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Review Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                ]
              }
            ) })
          ]
        },
        `attention-${w.name}-${idx}`
      );
    }) }),
    otherWatches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5 max-h-[380px] overflow-y-auto pr-1", children: otherWatches.map((w, idx) => {
      const emoji = KIND_EMOJIS[w.kind] || "👀";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: glassStyle,
          className: "p-3.5 rounded-2xl ambient-card-glass text-white space-y-2 hover:border-white/25 transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base shrink-0 drop-shadow", children: emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs sm:text-sm font-semibold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]", children: w.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/25 text-emerald-200 border border-emerald-400/35", children: [
                w.state === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                w.state === "pending" ? "Pending" : "Watching"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-200 line-clamp-2 leading-relaxed", children: w.quoted ? `“${w.text}”` : w.text }),
            w.steps > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-slate-300 font-medium pt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Stage ",
                w.step,
                " of ",
                w.steps
              ] }),
              w.url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleOpenUrl(w.url),
                  "aria-label": `Open ${w.name} in browser`,
                  className: "text-emerald-300 hover:text-emerald-200 font-semibold transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded px-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-2.5 h-2.5", "aria-hidden": "true" })
                  ]
                }
              )
            ] })
          ]
        },
        `watch-${w.name}-${idx}`
      );
    }) }),
    doneWatches.length > 0 && otherWatches.length === 0 && attentionWatches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: glassStyle,
        className: "p-3.5 rounded-2xl ambient-card-glass text-slate-200 shadow-md space-y-1.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-emerald-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white", children: "Completed Watches" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-300", children: [
            doneWatches.length,
            " items recently finished. All clear for now."
          ] })
        ]
      }
    ),
    watches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: glassStyle,
        className: "p-5 rounded-2xl ambient-card-glass text-center space-y-2 text-slate-200 shadow-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-6 h-6 text-emerald-400 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold text-white", children: "All Clear" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-300 max-w-xs mx-auto leading-relaxed", children: "No active browser watches or pending alerts. Pages monitored via Chrome, Edge, or Brave will surface here automatically." })
        ]
      }
    )
  ] });
};
const AmbientTasksColumn = ({
  settings,
  isScreensaver = false
}) => {
  const [tasks, setTasks] = reactExports.useState([]);
  const loadTasks = reactExports.useCallback(async () => {
    try {
      if (window.beacon?.getProductivitySummary) {
        const summary = await window.beacon.getProductivitySummary();
        const combined = [...summary.todayTasks, ...summary.upcomingTasks];
        let pending = combined.filter((t) => t.status !== "completed");
        if (isScreensaver) {
          const now = /* @__PURE__ */ new Date();
          const todayStr = now.toISOString().split("T")[0];
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split("T")[0];
          pending.sort((a, b) => {
            const getUrgency = (t) => {
              if (!t.dueDate) return 0;
              const d = new Date(t.dueDate).toISOString().split("T")[0];
              if (d < todayStr) return 4;
              if (d === todayStr) return 3;
              if (d === tomorrowStr) return 2;
              return 1;
            };
            const uDiff = getUrgency(b) - getUrgency(a);
            if (uDiff !== 0) return uDiff;
            const getPriority = (p) => {
              if (p === "high") return 3;
              if (p === "medium") return 2;
              return 1;
            };
            const pDiff = getPriority(b.priority) - getPriority(a.priority);
            if (pDiff !== 0) return pDiff;
            if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
            return (b.createdAt || 0) - (a.createdAt || 0);
          });
          setTasks(pending.slice(0, 4));
        } else {
          setTasks(pending.slice(0, 4));
        }
      } else if (window.beacon?.getTasks) {
        const all = await window.beacon.getTasks({ view: "all" });
        const pending = all.filter((t) => t.status !== "completed").slice(0, 4);
        setTasks(pending);
      }
    } catch (err) {
      console.error("Failed to load ambient tasks:", err);
    }
  }, [isScreensaver]);
  reactExports.useEffect(() => {
    loadTasks();
    let unsub;
    if (window.beacon?.onTasksChange) {
      unsub = window.beacon.onTasksChange(() => {
        loadTasks();
      });
    }
    const timer = setInterval(loadTasks, isScreensaver ? 15e3 : 3e4);
    return () => {
      if (unsub) unsub();
      clearInterval(timer);
    };
  }, [loadTasks, isScreensaver]);
  const glassStyle = {
    backdropFilter: `blur(${settings.frostedGlassBlur || 16}px)`,
    WebkitBackdropFilter: `blur(${settings.frostedGlassBlur || 16}px)`
  };
  if (tasks.length === 0) {
    if (!isScreensaver) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-2.5 max-w-sm w-full animate-fadeIn select-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl ambient-header-glass w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-emerald-400 drop-shadow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold tracking-wider uppercase text-[#FFFFFF] ambient-shadow-text", children: "Pending Tasks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: glassStyle,
          className: "p-3.5 rounded-2xl ambient-card-glass text-white text-xs flex items-center gap-2.5 shadow-lg",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-400 shrink-0 drop-shadow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#FFFFFF] font-semibold text-xs sm:text-sm", children: "No pending tasks" })
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-3 max-w-sm w-full animate-fadeIn select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center justify-between w-full px-3.5 py-1.5 rounded-xl ambient-header-glass", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-emerald-400 drop-shadow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold tracking-wider uppercase text-[#FFFFFF] ambient-shadow-text", children: isScreensaver ? "Pending Tasks" : "Focus & Reminders" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono font-bold text-emerald-400 ambient-shadow-text", children: [
        tasks.length,
        " active"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: tasks.map((task) => {
      const due = formatDueDate(task.dueDate);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: glassStyle,
          className: `p-3.5 rounded-2xl transition-all ${due.isOverdue ? "ambient-card-glass-overdue" : due.isToday ? "ambient-card-glass-today" : "ambient-card-glass"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs sm:text-sm font-bold text-[#FFFFFF] leading-snug line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]", children: task.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-[10px] px-2 py-0.5 rounded-full capitalize font-bold tracking-wide shrink-0 ${task.priority === "high" ? "bg-rose-500/40 text-white border border-rose-400/60 shadow-sm" : task.priority === "medium" ? "bg-amber-500/40 text-white border border-amber-400/60 shadow-sm" : "bg-sky-500/40 text-white border border-sky-400/60 shadow-sm"}`,
                  children: task.priority
                }
              )
            ] }),
            !isScreensaver && task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-200 line-clamp-1 leading-normal font-normal", children: task.description }),
            task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-semibold pt-0.5", children: [
              due.isOverdue ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-rose-400 shrink-0 drop-shadow" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-slate-300 shrink-0 drop-shadow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: due.isOverdue ? "text-rose-200 font-bold" : "text-slate-200 font-semibold", children: due.label })
            ] })
          ]
        },
        task.id
      );
    }) })
  ] });
};
const AmbientControls = ({
  visible,
  isFullscreen,
  isPlaying,
  currentWallpaperIndex,
  totalWallpapers,
  currentWallpaperTitle,
  onPrevWallpaper,
  onNextWallpaper,
  onTogglePlay,
  onToggleFullscreen,
  onOpenSettings,
  onExitAmbient
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 p-1.5 px-2.5 rounded-full bg-slate-900/50 backdrop-blur-2xl border border-white/25 text-white shadow-2xl transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onExitAmbient,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/70 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: "Return to Desktop (Esc)",
            "aria-label": "Return to Desktop",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[1px] h-4 bg-white/20 mx-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onPrevWallpaper,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: "Previous Wallpaper (Left Arrow)",
            "aria-label": "Previous Wallpaper",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onTogglePlay,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/90 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: isPlaying ? "Pause Slideshow (Space)" : "Resume Slideshow (Space)",
            "aria-label": isPlaying ? "Pause Slideshow" : "Resume Slideshow",
            children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 text-white" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onNextWallpaper,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: "Next Wallpaper (Right Arrow)",
            "aria-label": "Next Wallpaper",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
          }
        ),
        currentWallpaperTitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[11px] font-medium text-white/80 hidden md:inline truncate max-w-[150px] px-1 select-none",
            title: currentWallpaperTitle,
            children: currentWallpaperTitle
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[11px] font-mono px-1.5 text-white/60 select-none",
            title: currentWallpaperTitle ? `${currentWallpaperTitle} (${currentWallpaperIndex + 1} of ${totalWallpapers})` : void 0,
            children: totalWallpapers > 0 ? `${currentWallpaperIndex + 1} / ${totalWallpapers}` : "1 / 1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[1px] h-4 bg-white/20 mx-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onToggleFullscreen,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: isFullscreen ? "Exit Fullscreen (Esc or F11)" : "Enter Fullscreen (F11)",
            "aria-label": isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
            children: isFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize2, { className: "w-4 h-4 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onOpenSettings,
            className: "p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
            title: "Configure Ambient Preferences",
            "aria-label": "Configure Ambient Preferences",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-4 h-4" })
          }
        )
      ] })
    }
  );
};
function useFocusTrap({
  isOpen,
  onClose,
  initialFocusRef
}) {
  const containerRef = reactExports.useRef(null);
  const previousActiveElementRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isOpen) {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === "function") {
        const toFocus = previousActiveElementRef.current;
        setTimeout(() => {
          try {
            toFocus.focus();
          } catch {
          }
        }, 30);
        previousActiveElementRef.current = null;
      }
      return;
    }
    previousActiveElementRef.current = document.activeElement;
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 50);
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && containerRef.current) {
        const focusable = Array.from(
          containerRef.current.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, initialFocusRef]);
  return containerRef;
}
const WALLPAPER_CATEGORIES = [
  { id: "all", label: "All Wallpapers", description: "Complete cinematic nighttime collection of 25 environments" },
  { id: "cosmic-space", label: "Deep Space & Milky Way", description: "Galaxy cores, nebulae, and stellar voids" },
  { id: "aurora", label: "Aurora Borealis", description: "Northern lights over Arctic landscapes" },
  { id: "starry-night", label: "Starry Night Landscapes", description: "Mountains, lakes, and deserts under starlit skies" },
  { id: "campfire", label: "Cozy Campfire & Night", description: "Warm campfires beneath cosmic skies" },
  { id: "moonlit", label: "Moonlit Nature", description: "Forests, waterfalls, and mountains in moonlight" }
];
const BUILT_IN_WALLPAPERS = [
  // ==========================================
  // Category A: Deep Space & Milky Way (5)
  // ==========================================
  {
    id: "space-milky-way-core",
    name: "Milky Way Core",
    subtitle: "Galaxy Heart Stretching Across the Night Sky",
    category: "cosmic-space",
    author: "Denis Degioanni",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-milky-way-core.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-milky-way-core.jpg"
  },
  {
    id: "space-deep-nebula",
    name: "Deep Space Nebula",
    subtitle: "Indigo and Violet Gas Cloud Formation",
    category: "cosmic-space",
    author: "Jeremy Thomas",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-deep-nebula.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-deep-nebula.jpg"
  },
  {
    id: "space-stellar-void",
    name: "Stellar Void",
    subtitle: "Thousands of Distant Stars in Deep Space",
    category: "cosmic-space",
    author: "Bryan Goff",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-stellar-void.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-stellar-void.jpg"
  },
  {
    id: "space-cosmic-dust",
    name: "Cosmic Dust Clouds",
    subtitle: "Dimensional Deep Space Silhouette",
    category: "cosmic-space",
    author: "Jeremy Thomas",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-cosmic-dust.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-cosmic-dust.jpg"
  },
  {
    id: "space-orbital-horizon",
    name: "Orbital Night",
    subtitle: "Earth at Night from Orbit with Atmospheric Glow",
    category: "cosmic-space",
    author: "NASA",
    type: "built-in",
    url: "beacon-wallpaper://builtin/space-orbital-horizon.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/space-orbital-horizon.jpg"
  },
  // ==========================================
  // Category B: Aurora Borealis (5)
  // ==========================================
  {
    id: "aurora-emerald-night",
    name: "Emerald Aurora",
    subtitle: "Green Northern Lights over Scandinavian Mountains",
    category: "aurora",
    author: "Jonatan Pie",
    type: "built-in",
    url: "beacon-wallpaper://builtin/aurora-emerald-night.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-emerald-night.jpg"
  },
  {
    id: "aurora-violet-dream",
    name: "Violet Aurora Dream",
    subtitle: "Deep Violet and Indigo Northern Sky",
    category: "aurora",
    author: "Tobias Bjorkli",
    type: "built-in",
    url: "beacon-wallpaper://builtin/aurora-violet-dream.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-violet-dream.jpg"
  },
  {
    id: "aurora-arctic-lake",
    name: "Arctic Lake Aurora",
    subtitle: "Northern Lights Reflected in Still Water",
    category: "aurora",
    author: "Lightscape",
    type: "built-in",
    url: "beacon-wallpaper://builtin/aurora-arctic-lake.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-arctic-lake.jpg"
  },
  {
    id: "aurora-pine-silhouette",
    name: "Forest Aurora",
    subtitle: "Northern Lights Behind Pine Forest Silhouette",
    category: "aurora",
    author: "Jonatan Pie",
    type: "built-in",
    url: "beacon-wallpaper://builtin/aurora-pine-silhouette.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-pine-silhouette.jpg"
  },
  {
    id: "aurora-cosmic-blue",
    name: "Cosmic Blue Aurora",
    subtitle: "Deep Blue and Teal Aurora Waves",
    category: "aurora",
    author: "Nelly Volkovich",
    type: "built-in",
    url: "beacon-wallpaper://builtin/aurora-cosmic-blue.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/aurora-cosmic-blue.jpg"
  },
  // ==========================================
  // Category C: Starry Night Landscapes (5)
  // ==========================================
  {
    id: "night-mountain-stars",
    name: "Mountain Starscape",
    subtitle: "Rugged Peaks Beneath a Spectacular Star-Filled Sky",
    category: "starry-night",
    author: "Arto Marttinen",
    type: "built-in",
    url: "beacon-wallpaper://builtin/night-mountain-stars.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-mountain-stars.jpg"
  },
  {
    id: "night-alpine-lake",
    name: "Alpine Lake Stars",
    subtitle: "Milky Way Reflected in Still Mountain Waters",
    category: "starry-night",
    author: "David Marcu",
    type: "built-in",
    url: "beacon-wallpaper://builtin/night-alpine-lake.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-alpine-lake.jpg"
  },
  {
    id: "night-desert-milky-way",
    name: "Desert Milky Way",
    subtitle: "Extraordinary Star Density over Dark Desert",
    category: "starry-night",
    author: "Luca Bravo",
    type: "built-in",
    url: "beacon-wallpaper://builtin/night-desert-milky-way.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-desert-milky-way.jpg"
  },
  {
    id: "night-misty-forest",
    name: "Misty Forest Night",
    subtitle: "Atmospheric Midnight Fog and Moonlight",
    category: "starry-night",
    author: "Felix Mittermeier",
    type: "built-in",
    url: "beacon-wallpaper://builtin/night-misty-forest.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-misty-forest.jpg"
  },
  {
    id: "night-ocean-horizon",
    name: "Ocean Night Horizon",
    subtitle: "Vast Dark Ocean Under a Starlit Midnight Sky",
    category: "starry-night",
    author: "Patrick Fore",
    type: "built-in",
    url: "beacon-wallpaper://builtin/night-ocean-horizon.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/night-ocean-horizon.jpg"
  },
  // ==========================================
  // Category D: Cozy Campfire & Night Sanctuary (5)
  // ==========================================
  {
    id: "campfire-starry-sky",
    name: "Campfire & Stars",
    subtitle: "Warm Amber Flame Beneath Millions of Stars",
    category: "campfire",
    author: "Mohamed Nohassi",
    type: "built-in",
    url: "beacon-wallpaper://builtin/campfire-starry-sky.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-starry-sky.jpg"
  },
  {
    id: "campfire-mountain-retreat",
    name: "Mountain Campsite",
    subtitle: "Quiet Firelight and the Milky Way Overhead",
    category: "campfire",
    author: "Zach Lezniewicz",
    type: "built-in",
    url: "beacon-wallpaper://builtin/campfire-mountain-retreat.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-mountain-retreat.jpg"
  },
  {
    id: "campfire-pine-forest",
    name: "Pine Forest Campfire",
    subtitle: "Secluded Fire Among Tall Trees at Night",
    category: "campfire",
    author: "David Marcu",
    type: "built-in",
    url: "beacon-wallpaper://builtin/campfire-pine-forest.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-pine-forest.jpg"
  },
  {
    id: "campfire-lakeside",
    name: "Lakeside Campfire",
    subtitle: "Warm Light Reflected Across Dark Water",
    category: "campfire",
    author: "Tim Foster",
    type: "built-in",
    url: "beacon-wallpaper://builtin/campfire-lakeside.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-lakeside.jpg"
  },
  {
    id: "campfire-cosmic-night",
    name: "Cosmic Campsite",
    subtitle: "Minimal Silhouette Beneath a Spectacular Sky",
    category: "campfire",
    author: "Free To Use Sounds",
    type: "built-in",
    url: "beacon-wallpaper://builtin/campfire-cosmic-night.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/campfire-cosmic-night.jpg"
  },
  // ==========================================
  // Category E: Moonlit Nature (5)
  // ==========================================
  {
    id: "moonlit-japanese-forest",
    name: "Japanese Moonlit Forest",
    subtitle: "Peaceful Forest Beneath Soft Moonlight",
    category: "moonlit",
    author: "Lukasz Szmigiel",
    type: "built-in",
    url: "beacon-wallpaper://builtin/moonlit-japanese-forest.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-japanese-forest.jpg"
  },
  {
    id: "moonlit-bamboo-grove",
    name: "Moonlit Bamboo",
    subtitle: "Dark Bamboo Grove with Delicate Moonbeams",
    category: "moonlit",
    author: "kazuend",
    type: "built-in",
    url: "beacon-wallpaper://builtin/moonlit-bamboo-grove.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-bamboo-grove.jpg"
  },
  {
    id: "moonlit-waterfall",
    name: "Nighttime Waterfall",
    subtitle: "Cinematic Cascade with Natural Atmospheric Mist",
    category: "moonlit",
    author: "Ben Guerin",
    type: "built-in",
    url: "beacon-wallpaper://builtin/moonlit-waterfall.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-waterfall.jpg"
  },
  {
    id: "moonlit-sakura",
    name: "Midnight Sakura",
    subtitle: "Cherry Blossom Silhouettes Under Violet Sky",
    category: "moonlit",
    author: "Redd Francisco",
    type: "built-in",
    url: "beacon-wallpaper://builtin/moonlit-sakura.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-sakura.jpg"
  },
  {
    id: "moonlit-cloud-sea",
    name: "Mountain Cloud Sea",
    subtitle: "Peaks Rising Above a Sea of Clouds at Night",
    category: "moonlit",
    author: "Kace Rodriguez",
    type: "built-in",
    url: "beacon-wallpaper://builtin/moonlit-cloud-sea.jpg",
    thumbnailUrl: "beacon-wallpaper://builtin/thumbnails/moonlit-cloud-sea.jpg"
  }
];
const AmbientSettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSelectCustomFolder,
  wallpapers
}) => {
  const [locInput, setLocInput] = reactExports.useState(settings.weatherLocation || "London");
  const [saveSuccess, setSaveSuccess] = reactExports.useState(false);
  const [selectedCategory, setSelectedCategory] = reactExports.useState("all");
  const [thumbErrorMap, setThumbErrorMap] = reactExports.useState({});
  const trapRef = useFocusTrap({ isOpen, onClose });
  React.useEffect(() => {
    if (settings.weatherLocation) {
      setLocInput(settings.weatherLocation);
    }
  }, [settings.weatherLocation]);
  const filteredWallpapers = reactExports.useMemo(() => {
    return wallpapers.map((item, originalIndex) => ({ item, originalIndex })).filter(({ item }) => {
      if (selectedCategory === "all") return true;
      return item.category === selectedCategory;
    });
  }, [wallpapers, selectedCategory]);
  if (!isOpen) return null;
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (locInput.trim()) {
      const target = locInput.trim();
      console.log("[Diagnostic:AmbientModal] Submitting location:", target);
      onUpdateSettings({ weatherLocation: target });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };
  const setPreset = (preset) => {
    console.log("[Diagnostic:AmbientModal] Selecting preset:", preset);
    setLocInput(preset);
    onUpdateSettings({ weatherLocation: preset });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: trapRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "ambient-modal-title",
      className: "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a]/92 backdrop-blur-2xl border border-white/20 text-white shadow-2xl p-6 space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-white/10 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "w-5 h-5 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "ambient-modal-title", className: "text-base font-bold text-white", children: "Ambient Screen Board Preferences" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close preferences",
              className: "p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-3.5 h-3.5" }),
            "Wallpaper & Slideshow Motion"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onUpdateSettings({ wallpaperSource: "built-in" }),
                className: `p-3 rounded-xl border text-left text-xs font-medium transition-all ${settings.wallpaperSource === "built-in" ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white mb-1", children: "Curated Aesthetics (25)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/50", children: "Nature, Zen, Dark, Cosmic, Cozy & Minimal" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onUpdateSettings({ wallpaperSource: "custom-folder" }),
                className: `p-3 rounded-xl border text-left text-xs font-medium transition-all ${settings.wallpaperSource === "custom-folder" ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white mb-1", children: "Local Image Folder" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/50", children: wallpapers.filter((w) => w.type === "file").length > 0 ? `${wallpapers.filter((w) => w.type === "file").length} images loaded` : "Select custom folder on PC" })
                ]
              }
            )
          ] }),
          settings.wallpaperSource === "built-in" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none", children: WALLPAPER_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedCategory(cat.id),
                className: `px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${selectedCategory === cat.id ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border-white/10"}`,
                children: cat.label
              },
              cat.id
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1", children: filteredWallpapers.map(({ item, originalIndex }) => {
              const isSelected = settings.selectedWallpaperIndex === originalIndex;
              const hasThumbError = thumbErrorMap[item.id];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  role: "button",
                  tabIndex: 0,
                  onClick: () => onUpdateSettings({
                    selectedWallpaperIndex: originalIndex,
                    wallpaperSource: "built-in"
                  }),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onUpdateSettings({
                        selectedWallpaperIndex: originalIndex,
                        wallpaperSource: "built-in"
                      });
                    }
                  },
                  className: `group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all text-left ${isSelected ? "ring-2 ring-emerald-400 border-emerald-400 shadow-lg shadow-emerald-500/20" : "border-white/10 hover:border-white/25 hover:shadow-md"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 w-full h-full bg-slate-900 overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BuiltInWallpaperView, { id: item.id }),
                      (item.thumbnailUrl || item.url) && !hasThumbError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: item.thumbnailUrl || item.url,
                          alt: item.name,
                          loading: "lazy",
                          onError: () => setThumbErrorMap((prev) => ({ ...prev, [item.id]: true })),
                          className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-2 pointer-events-none", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-white truncate drop-shadow", children: item.name }),
                      item.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/70 truncate drop-shadow", children: item.subtitle })
                    ] }),
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 stroke-[3]" }) })
                  ]
                },
                item.id
              );
            }) })
          ] }),
          settings.wallpaperSource === "custom-folder" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70", children: "Selected Folder" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: onSelectCustomFolder,
                  className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Choose Folder..." })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] text-white/50 bg-black/40 p-2 rounded border border-white/5 truncate", children: settings.customWallpaperFolder || "No folder selected yet" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slideshow Interval" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-emerald-400", children: settings.slideshowInterval === 0 ? "Paused" : `${settings.slideshowInterval}s` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: [0, 15, 30, 60, 120].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onUpdateSettings({ slideshowInterval: val }),
                className: `py-1.5 rounded-lg border text-xs font-mono transition-all ${settings.slideshowInterval === val ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`,
                children: val === 0 ? "Pause" : `${val}s`
              },
              val
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 border-t border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-white", children: "Ken Burns Pan & Zoom Effect" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-white/50", children: "Slow, smooth cinematic motion across wallpapers" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onUpdateSettings({ kenBurnsEnabled: !settings.kenBurnsEnabled }),
                className: `w-11 h-6 flex items-center rounded-full p-1 transition-all ${settings.kenBurnsEnabled ? "bg-emerald-500 justify-end" : "bg-white/20 justify-start"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full bg-white shadow-md" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-white/10 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
            "Clock, Date & Weather"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show Clock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.showClock,
                  onChange: (e) => onUpdateSettings({ showClock: e.target.checked }),
                  className: "rounded accent-emerald-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "24-Hour Format" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.use24Hour,
                  onChange: (e) => onUpdateSettings({ use24Hour: e.target.checked }),
                  className: "rounded accent-emerald-500"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-white flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-3.5 h-3.5 text-sky-400" }),
                "Weather Location & Units"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onUpdateSettings({ temperatureUnit: "C" }),
                    className: `px-2 py-0.5 rounded text-[11px] font-bold ${settings.temperatureUnit === "C" ? "bg-emerald-500 text-white" : "text-white/60"}`,
                    children: "°C"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onUpdateSettings({ temperatureUnit: "F" }),
                    className: `px-2 py-0.5 rounded text-[11px] font-bold ${settings.temperatureUnit === "F" ? "bg-emerald-500 text-white" : "text-white/60"}`,
                    children: "°F"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLocationSubmit, className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: locInput,
                  onChange: (e) => setLocInput(e.target.value),
                  placeholder: "City name (e.g. Chennai, London, Tokyo)",
                  className: "flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-emerald-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "submit",
                  className: "px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: saveSuccess ? "Saved!" : "Save" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/40", children: "Presets:" }),
                [
                  "Chennai, Tamil Nadu, India",
                  "London, UK",
                  "Tokyo, Japan",
                  "New York, NY"
                ].map((city) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPreset(city),
                    className: "text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors",
                    children: city.split(",")[0]
                  },
                  city
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[10px] text-white/40 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Weather data by Open-Meteo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-refreshes every 15 min" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 border-t border-white/10 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
            "Overlays & Glassmorphism"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5 text-emerald-400" }),
                "Show Watch Feed"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.showWatches,
                  onChange: (e) => onUpdateSettings({ showWatches: e.target.checked }),
                  className: "rounded accent-emerald-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-3.5 h-3.5 text-emerald-400" }),
                "Show Tasks"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.showTasks,
                  onChange: (e) => onUpdateSettings({ showTasks: e.target.checked }),
                  className: "rounded accent-emerald-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-400" }),
                "Show Quotes"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.showQuote,
                  onChange: (e) => onUpdateSettings({ showQuote: e.target.checked }),
                  className: "rounded accent-emerald-500"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-white/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frosted Glass Blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-emerald-400", children: [
                settings.frostedGlassBlur,
                "px"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: "8",
                max: "32",
                step: "2",
                value: settings.frostedGlassBlur,
                onChange: (e) => onUpdateSettings({ frostedGlassBlur: parseInt(e.target.value, 10) }),
                className: "w-full accent-emerald-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-slate-200 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Background Dimming" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-emerald-400 font-bold", children: [
                Math.round(settings.backgroundDim * 100),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: "0.00",
                max: "0.30",
                step: "0.02",
                value: settings.backgroundDim,
                onChange: (e) => onUpdateSettings({ backgroundDim: parseFloat(e.target.value) }),
                className: "w-full accent-emerald-500 cursor-pointer"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-slate-400 font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0% (Raw Photo)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10% (Default)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30% (Max Atmosphere)" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-lg",
            children: "Done"
          }
        ) })
      ]
    }
  ) });
};
const DEFAULT_SETTINGS = {
  slideshowInterval: 30,
  transitionDuration: 2,
  kenBurnsEnabled: true,
  wallpaperSource: "built-in",
  customWallpaperFolder: "",
  selectedWallpaperIndex: 0,
  showClock: true,
  showDate: true,
  use24Hour: false,
  showWeather: true,
  weatherLocation: "London",
  temperatureUnit: "C",
  showWatches: true,
  showTasks: true,
  showQuote: true,
  frostedGlassBlur: 16,
  backgroundDim: 0.1
};
const AmbientBoardPage = ({
  onNavigate,
  isFullscreen,
  setIsFullscreen,
  isScreensaver = false
}) => {
  const [settings, setSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [screensaverSettings, setScreensaverSettings] = reactExports.useState(null);
  const [isSettingsLoaded, setIsSettingsLoaded] = reactExports.useState(false);
  const [wallpapers, setWallpapers] = reactExports.useState(BUILT_IN_WALLPAPERS);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [previousIndex, setPreviousIndex] = reactExports.useState(null);
  const [isTransitioning, setIsTransitioning] = reactExports.useState(false);
  const [animVariant, setAnimVariant] = reactExports.useState("a");
  const [isPlaying, setIsPlaying] = reactExports.useState(true);
  const [watches, setWatches] = reactExports.useState([]);
  const [controlsVisible, setControlsVisible] = reactExports.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = reactExports.useState(false);
  const [isWindowVisible, setIsWindowVisible] = reactExports.useState(!document.hidden);
  const [isDismissing, setIsDismissing] = reactExports.useState(false);
  const idleTimerRef = reactExports.useRef(null);
  const slideshowTimerRef = reactExports.useRef(null);
  const transitionTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (window.beacon?.getAmbientSettings) {
      window.beacon.getAmbientSettings().then((s) => {
        console.log("[Diagnostic:Ambient] Loaded ambient settings from disk:", s);
        setSettings(s);
        setIsSettingsLoaded(true);
        if (s.slideshowInterval === 0) setIsPlaying(false);
        if (typeof s.selectedWallpaperIndex === "number") {
          setCurrentIndex(s.selectedWallpaperIndex);
        }
      }).catch((err) => {
        console.error("[Diagnostic:Ambient] Failed to load ambient settings:", err);
        setIsSettingsLoaded(true);
      });
    } else {
      setIsSettingsLoaded(true);
    }
    if (window.beacon?.getSettings) {
      window.beacon.getSettings().then((s) => {
        if (s?.screensaver) {
          setScreensaverSettings(s.screensaver);
        }
      }).catch(console.error);
    }
    if (window.beacon?.getWallpapers) {
      window.beacon.getWallpapers().then((items) => {
        if (items && items.length > 0) setWallpapers(items);
      }).catch(console.error);
    }
    if (window.beacon?.getWatches) {
      window.beacon.getWatches().then(setWatches).catch(console.error);
    }
    const unsubWatches = window.beacon?.onWatchesUpdate?.((updated) => {
      setWatches(updated);
    });
    const unsubSettings = window.beacon?.onSettingsChange?.((newSettings) => {
      if (newSettings?.ambient) {
        setSettings((prev) => ({ ...prev, ...newSettings.ambient }));
      }
      if (newSettings?.screensaver) {
        setScreensaverSettings(newSettings.screensaver);
      }
    });
    return () => {
      if (unsubWatches) unsubWatches();
      if (unsubSettings) unsubSettings();
    };
  }, []);
  reactExports.useEffect(() => {
    if (isScreensaver) {
      const notify = window.beacon?.notifyScreensaverReady || window.helm?.notifyScreensaverReady;
      if (notify) {
        let rafId1;
        let rafId2;
        let cancelled = false;
        rafId1 = requestAnimationFrame(() => {
          if (cancelled) return;
          rafId2 = requestAnimationFrame(() => {
            if (cancelled) return;
            notify().catch(console.error);
          });
        });
        return () => {
          cancelled = true;
          if (rafId1) cancelAnimationFrame(rafId1);
          if (rafId2) cancelAnimationFrame(rafId2);
        };
      }
    }
  }, [isScreensaver]);
  const goToWallpaper = reactExports.useCallback((newIndex) => {
    if (wallpapers.length === 0) return;
    const safeIndex = (newIndex + wallpapers.length) % wallpapers.length;
    if (safeIndex === currentIndex) return;
    setPreviousIndex(currentIndex);
    setCurrentIndex(safeIndex);
    setIsTransitioning(true);
    const VARIANTS = ["a", "b", "c", "d"];
    setAnimVariant((prev) => {
      const nextIdx = (VARIANTS.indexOf(prev) + 1) % VARIANTS.length;
      return VARIANTS[nextIdx];
    });
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, (settings.transitionDuration || 2) * 1e3);
    if (window.beacon?.setAmbientSettings) {
      window.beacon.setAmbientSettings({ selectedWallpaperIndex: safeIndex }).catch(console.error);
    }
  }, [currentIndex, wallpapers.length, settings.transitionDuration]);
  const handleNext = reactExports.useCallback(() => {
    goToWallpaper(currentIndex + 1);
  }, [currentIndex, goToWallpaper]);
  const handlePrev = reactExports.useCallback(() => {
    goToWallpaper(currentIndex - 1);
  }, [currentIndex, goToWallpaper]);
  reactExports.useEffect(() => {
    const handleVisibility = () => {
      setIsWindowVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    if (isPlaying && isWindowVisible && settings.slideshowInterval > 0 && wallpapers.length > 1) {
      slideshowTimerRef.current = setInterval(() => {
        handleNext();
      }, settings.slideshowInterval * 1e3);
    }
    return () => {
      if (slideshowTimerRef.current) clearInterval(slideshowTimerRef.current);
    };
  }, [isPlaying, isWindowVisible, settings.slideshowInterval, wallpapers.length, handleNext]);
  const resetIdleTimer = reactExports.useCallback(() => {
    setControlsVisible(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (!isSettingsOpen) {
        setControlsVisible(false);
      }
    }, 3e3);
  }, [isSettingsOpen]);
  reactExports.useEffect(() => {
    const onMouseMove = () => resetIdleTimer();
    window.addEventListener("mousemove", onMouseMove);
    resetIdleTimer();
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);
  const toggleFullscreen = reactExports.useCallback(async () => {
    if (window.beacon?.setFullscreen) {
      const target = !isFullscreen;
      await window.beacon.setFullscreen(target);
      setIsFullscreen(target);
    }
  }, [isFullscreen, setIsFullscreen]);
  reactExports.useEffect(() => {
    if (isScreensaver) return;
    const handleKeyDown = (e) => {
      const target = e.target;
      const isEditable = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if (isEditable && e.key !== "Escape") {
        return;
      }
      if (e.key === "Escape") {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isFullscreen) {
          if (window.beacon?.setFullscreen) {
            window.beacon.setFullscreen(false);
          }
          setIsFullscreen(false);
        } else {
          onNavigate("home");
        }
        return;
      }
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (e.code === "Space" && !isSettingsOpen) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
        return;
      }
      if (e.key === "ArrowRight" && !isSettingsOpen) {
        handleNext();
      } else if (e.key === "ArrowLeft" && !isSettingsOpen) {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScreensaver, isSettingsOpen, isFullscreen, toggleFullscreen, onNavigate, handleNext, handlePrev, setIsFullscreen]);
  reactExports.useEffect(() => {
    if (!isScreensaver) return;
    let isExiting = false;
    const startTime = Date.now();
    const GRACE_PERIOD_MS = 600;
    const DISTANCE_THRESHOLD = 15;
    let initialPos = null;
    const triggerExit = (reason) => {
      if (isExiting) return;
      isExiting = true;
      setIsDismissing(true);
      console.log(`[Screensaver] Dismissal triggered by user input: ${reason}`);
      if (window.beacon?.exitScreensaver) {
        window.beacon.exitScreensaver().catch(console.error);
      } else {
        onNavigate("home");
      }
    };
    const handleMouseMove = (e) => {
      if (screensaverSettings?.exitOnMouseMove === false) return;
      if (Date.now() - startTime < GRACE_PERIOD_MS) {
        initialPos = { x: e.screenX, y: e.screenY };
        return;
      }
      if (!initialPos) {
        initialPos = { x: e.screenX, y: e.screenY };
        return;
      }
      const dx = e.screenX - initialPos.x;
      const dy = e.screenY - initialPos.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= DISTANCE_THRESHOLD) {
        triggerExit(`mouse movement (${Math.round(dist)}px)`);
      }
    };
    const handlePointerDown = () => {
      if (Date.now() - startTime < 400) return;
      triggerExit("pointer/click");
    };
    const handleKeyDown = (e) => {
      if (Date.now() - startTime < 400) return;
      e.preventDefault();
      triggerExit(`key press (${e.key})`);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isScreensaver, screensaverSettings?.exitOnMouseMove, onNavigate]);
  const handleUpdateSettings = async (updated) => {
    const merged = { ...settings, ...updated };
    setSettings(merged);
    if (typeof updated.slideshowInterval === "number") {
      setIsPlaying(updated.slideshowInterval > 0);
    }
    if (window.beacon?.setAmbientSettings) {
      await window.beacon.setAmbientSettings(updated);
    }
    if (updated.wallpaperSource) {
      const refreshed = await window.beacon.getWallpapers();
      if (refreshed && refreshed.length > 0) {
        setWallpapers(refreshed);
        setCurrentIndex(0);
      }
    }
  };
  const handleSelectCustomFolder = async () => {
    if (window.beacon?.selectWallpaperDirectory) {
      const res = await window.beacon.selectWallpaperDirectory();
      if (!res.canceled && res.wallpapers && res.wallpapers.length > 0) {
        setWallpapers(res.wallpapers);
        setCurrentIndex(0);
        setSettings((prev) => ({
          ...prev,
          wallpaperSource: "custom-folder",
          customWallpaperFolder: res.folderPath || prev.customWallpaperFolder
        }));
      }
    }
  };
  const currentWallpaper = wallpapers[currentIndex] || BUILT_IN_WALLPAPERS[0];
  const previousWallpaper = previousIndex !== null ? wallpapers[previousIndex] : null;
  const nextIndex = wallpapers.length > 0 ? (currentIndex + 1) % wallpapers.length : 0;
  const nextWallpaper = wallpapers[nextIndex] || null;
  const effectiveSettings = isScreensaver ? {
    ...settings,
    showClock: screensaverSettings?.showClock ?? true,
    showDate: screensaverSettings?.showDate ?? true,
    showWeather: screensaverSettings?.showWeather ?? true,
    showQuote: screensaverSettings?.showQuote ?? true,
    // Privacy-first: Tasks and Watches hidden on screensaver unless explicitly opted-in
    showTasks: screensaverSettings?.showTasks ?? false,
    showWatches: screensaverSettings?.showWatches ?? false
  } : settings;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative w-full h-full overflow-hidden bg-[#080811] transition-opacity duration-300 ease-out ${isFullscreen ? "fixed inset-0 z-40" : "min-h-[620px] rounded-2xl"} ${isScreensaver || !controlsVisible && isFullscreen ? "cursor-none select-none" : ""} ${isDismissing ? "opacity-0 pointer-events-none" : "opacity-100"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          KenBurnsSlideshow,
          {
            currentWallpaper,
            previousWallpaper,
            nextWallpaper,
            isTransitioning,
            transitionDuration: effectiveSettings.transitionDuration,
            kenBurnsEnabled: effectiveSettings.kenBurnsEnabled,
            backgroundDim: effectiveSettings.backgroundDim,
            animationVariant: animVariant
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-x-0 top-0 h-1/4 z-[5] pointer-events-none bg-gradient-to-b from-black/25 via-black/5 to-transparent transition-opacity duration-500",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-x-0 bottom-0 h-1/4 z-[5] pointer-events-none bg-gradient-to-t from-black/30 via-black/10 to-transparent transition-opacity duration-500",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-12 overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AmbientClockWeather,
            {
              settings: effectiveSettings,
              settingsLoaded: isSettingsLoaded,
              isScreensaver,
              onOpenSettings: () => {
                if (!isScreensaver) setIsSettingsOpen(true);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col lg:flex-row items-end justify-between py-6 gap-6", children: [
            effectiveSettings.showTasks ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AmbientTasksColumn, { settings: effectiveSettings, isScreensaver }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block flex-1" }),
            effectiveSettings.showWatches && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AmbientWatchesColumn, { watches, settings: effectiveSettings }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 shrink-0" })
        ] }),
        !isScreensaver && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AmbientControls,
          {
            visible: controlsVisible,
            isFullscreen,
            isPlaying,
            currentWallpaperIndex: currentIndex,
            totalWallpapers: wallpapers.length,
            currentWallpaperTitle: currentWallpaper.name,
            onPrevWallpaper: handlePrev,
            onNextWallpaper: handleNext,
            onTogglePlay: () => setIsPlaying((p) => !p),
            onToggleFullscreen: toggleFullscreen,
            onOpenSettings: () => setIsSettingsOpen(true),
            onExitAmbient: () => {
              if (isFullscreen) {
                if (window.beacon?.setFullscreen) window.beacon.setFullscreen(false);
                setIsFullscreen(false);
              }
              onNavigate("home");
            }
          }
        ),
        !isScreensaver && /* @__PURE__ */ jsxRuntimeExports.jsx(
          AmbientSettingsModal,
          {
            isOpen: isSettingsOpen,
            onClose: () => setIsSettingsOpen(false),
            settings,
            onUpdateSettings: handleUpdateSettings,
            onSelectCustomFolder: handleSelectCustomFolder,
            wallpapers
          }
        )
      ]
    }
  );
};
const NoteItemCard = ({
  note,
  isSelected,
  onClick
}) => {
  const displayTitle = note.title.trim() || "Untitled Note";
  const isUntitled = !note.title.trim();
  const snippet = note.content.trim().slice(0, 90) || "No additional text";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "aria-selected": isSelected,
      className: `w-full text-left p-3.5 rounded-xl transition-all border focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${isSelected ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 shadow-sm" : "bg-white/60 dark:bg-helm-card/60 hover:bg-slate-100 dark:hover:bg-helm-cardHover border-slate-200/80 dark:border-helm-border/70"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: `text-sm font-semibold truncate flex-1 ${isUntitled ? "italic text-slate-400 dark:text-helm-muted" : "text-slate-900 dark:text-slate-100"}`,
              children: displayTitle
            }
          ),
          note.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0 fill-emerald-500/20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2", children: snippet }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-400 dark:text-helm-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatRelativeTime(note.updatedAt) }),
          note.content.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            note.content.length,
            " chars"
          ] })
        ] })
      ]
    }
  );
};
const NoteEditor = ({
  note,
  onUpdate,
  onDelete,
  onTogglePin
}) => {
  const [title, setTitle] = reactExports.useState(note.title);
  const [content, setContent] = reactExports.useState(note.content);
  const [saveState, setSaveState] = reactExports.useState("saved");
  const [showDeleteModal, setShowDeleteModal] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const deleteModalRef = useFocusTrap({
    isOpen: showDeleteModal,
    onClose: () => setShowDeleteModal(false)
  });
  const debounceTimerRef = reactExports.useRef(null);
  const currentNoteIdRef = reactExports.useRef(note.id);
  reactExports.useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    currentNoteIdRef.current = note.id;
    setTitle(note.title);
    setContent(note.content);
    setSaveState("saved");
    setShowDeleteModal(false);
  }, [note.id]);
  reactExports.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  const triggerAutosave = (newTitle, newContent) => {
    setSaveState("saving");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const noteIdToSave = note.id;
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await onUpdate(noteIdToSave, newTitle, newContent);
        if (currentNoteIdRef.current === noteIdToSave) {
          setSaveState("saved");
        }
      } catch (err) {
        console.error("Failed to autosave note:", err);
        if (currentNoteIdRef.current === noteIdToSave) {
          setSaveState("error");
        }
      }
    }, 350);
  };
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    triggerAutosave(newTitle, content);
  };
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    triggerAutosave(title, newContent);
  };
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(note.id);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete note:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-white/70 dark:bg-helm-surface/80 rounded-2xl border border-slate-200 dark:border-helm-border/80 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-3.5 border-b border-slate-200/80 dark:border-helm-border/80 bg-slate-50/60 dark:bg-helm-card/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "status", "aria-live": "polite", className: "flex items-center gap-1.5 text-xs", children: [
          saveState === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
            "Saved"
          ] }),
          saveState === "saving" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-amber-500 font-medium animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin", "aria-hidden": "true" }),
            "Saving..."
          ] }),
          saveState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-rose-500 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
            "Error saving"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 dark:text-helm-border", "aria-hidden": "true", children: "•" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-slate-400 dark:text-helm-muted flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3", "aria-hidden": "true" }),
          "Edited ",
          formatDateTime(note.updatedAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onTogglePin(note.id),
            title: note.isPinned ? "Unpin note" : "Pin to top",
            "aria-label": note.isPinned ? "Unpin note" : "Pin note to top",
            className: `p-2 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${note.isPinned ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "text-slate-500 dark:text-helm-muted hover:bg-slate-200/60 dark:hover:bg-helm-cardHover"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pin,
              {
                "aria-hidden": "true",
                className: `w-4 h-4 ${note.isPinned ? "fill-emerald-500/30" : ""}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowDeleteModal(true),
            title: "Delete note",
            "aria-label": "Delete note",
            className: "p-2 rounded-lg text-slate-500 dark:text-helm-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4", "aria-hidden": "true" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col p-6 space-y-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: title,
          onChange: handleTitleChange,
          placeholder: "Note title...",
          "aria-label": "Note title",
          maxLength: 200,
          className: "w-full text-xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted/60 focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded px-1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: content,
          onChange: handleContentChange,
          placeholder: "Start writing notes, ideas, or markdown checklists...",
          "aria-label": "Note content",
          maxLength: 1e5,
          className: "w-full flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-helm-muted/50 leading-relaxed font-sans focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded p-1"
        }
      )
    ] }),
    showDeleteModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: deleteModalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "delete-note-title",
        className: "w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-helm-surface border border-slate-200 dark:border-helm-border shadow-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 text-rose-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-rose-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "delete-note-title", className: "text-base font-semibold text-slate-900 dark:text-slate-100", children: "Delete Note?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-600 dark:text-helm-muted leading-relaxed mb-6", children: [
            "Are you sure you want to delete",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 dark:text-slate-200", children: [
              "“",
              title.trim() || "Untitled Note",
              "”"
            ] }),
            "? This action will permanently remove it from your local SQLite database."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isDeleting,
                onClick: () => setShowDeleteModal(false),
                className: "px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-helm-cardHover transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isDeleting,
                onClick: handleConfirmDelete,
                className: "px-3.5 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none",
                children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin", "aria-hidden": "true" }),
                  "Deleting..."
                ] }) : "Delete Forever"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const NotesPage = ({ initialAction }) => {
  const [notes, setNotes] = reactExports.useState([]);
  const [selectedNoteId, setSelectedNoteId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const loadNotes = reactExports.useCallback(async (query) => {
    try {
      if (window.beacon?.getNotes) {
        const fetched = await window.beacon.getNotes(query);
        setNotes(fetched);
        return fetched;
      }
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setIsLoading(false);
    }
    return [];
  }, []);
  reactExports.useEffect(() => {
    loadNotes(searchQuery);
  }, [loadNotes, searchQuery]);
  reactExports.useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    } else if (notes.length > 0 && selectedNoteId) {
      if (!notes.some((n) => n.id === selectedNoteId)) {
        setSelectedNoteId(notes[0].id);
      }
    } else if (notes.length === 0) {
      setSelectedNoteId(null);
    }
  }, [notes, selectedNoteId]);
  const handleCreateNote = async () => {
    if (isCreating || !window.beacon?.createNote) return;
    try {
      setIsCreating(true);
      const newNote = await window.beacon.createNote({
        title: "",
        content: "",
        isPinned: false
      });
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsCreating(false);
    }
  };
  const initialActionHandledRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (initialAction === "new-note" && !initialActionHandledRef.current) {
      initialActionHandledRef.current = true;
      handleCreateNote();
    }
  }, [initialAction]);
  reactExports.useEffect(() => {
    if (window.beacon?.onNavigateAction) {
      const cleanup = window.beacon.onNavigateAction((action) => {
        if (action === "new-note") {
          handleCreateNote();
        }
      });
      return cleanup;
    }
  }, []);
  const handleUpdateNote = async (id, title, content) => {
    if (!window.beacon?.updateNote) return;
    const updated = await window.beacon.updateNote({ id, title, content });
    setNotes(
      (prev) => prev.map((n) => n.id === id ? { ...n, ...updated } : n)
    );
  };
  const handleTogglePin = async (id) => {
    if (!window.beacon?.togglePinNote) return;
    const updated = await window.beacon.togglePinNote(id);
    loadNotes(searchQuery);
    setSelectedNoteId(updated.id);
  };
  const handleDeleteNote = async (id) => {
    if (!window.beacon?.deleteNote) return;
    await window.beacon.deleteNote(id);
    setNotes((prev) => {
      const nextNotes = prev.filter((n) => n.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(nextNotes.length > 0 ? nextNotes[0].id : null);
      }
      return nextNotes;
    });
  };
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);
  const selectedNote = notes.find((n) => n.id === selectedNoteId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[calc(100vh-5rem)] flex gap-5 animate-fadeIn select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 flex flex-col h-full bg-slate-50/70 dark:bg-helm-surface/60 rounded-2xl border border-slate-200 dark:border-helm-border/80 p-3.5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-emerald-500" }),
            "Notes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: [
            notes.length,
            " note",
            notes.length === 1 ? "" : "s",
            " saved locally"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleCreateNote,
            disabled: isCreating,
            "aria-label": "Create new note",
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
            children: [
              isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5", "aria-hidden": "true" }),
              "New Note"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-helm-muted", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search notes...",
            "aria-label": "Search notes",
            className: "w-full pl-8 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSearchQuery(""),
            "aria-label": "Clear search query",
            className: "absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto space-y-4 pr-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) }) : notes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-helm-card flex items-center justify-center text-slate-400 dark:text-helm-muted mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1", children: searchQuery ? "No matching notes" : "No notes yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 dark:text-helm-muted leading-relaxed mb-4", children: searchQuery ? "Try searching for something else or clear the query." : "Capture ideas, checklists, and snippets saved directly in SQLite." }),
        searchQuery ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline",
            children: "Clear search"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCreateNote,
            className: "px-3 py-1.5 text-xs rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-medium hover:bg-emerald-600/20",
            children: "Create your first note"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        pinnedNotes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3 h-3 fill-emerald-500/20" }),
            "Pinned"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: pinnedNotes.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            NoteItemCard,
            {
              note,
              isSelected: note.id === selectedNoteId,
              onClick: () => setSelectedNoteId(note.id)
            },
            note.id
          )) })
        ] }),
        otherNotes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          pinnedNotes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-helm-muted", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: otherNotes.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            NoteItemCard,
            {
              note,
              isSelected: note.id === selectedNoteId,
              onClick: () => setSelectedNoteId(note.id)
            },
            note.id
          )) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-full", children: selectedNote ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteEditor,
      {
        note: selectedNote,
        onUpdate: handleUpdateNote,
        onDelete: handleDeleteNote,
        onTogglePin: handleTogglePin
      },
      selectedNote.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-300 dark:border-helm-border/80 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-7 h-7" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5", children: "Select or create a note" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-helm-muted max-w-sm leading-relaxed mb-6", children: "Write down your thoughts, markdown checklists, and project scratchpads. Everything is persisted locally in your secure SQLite database." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCreateNote,
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Create New Note"
          ]
        }
      )
    ] }) })
  ] });
};
const TaskItemCard = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";
  const dueDateInfo = formatDueDate(task.dueDate);
  const priorityStyles = {
    high: {
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
      text: "High"
    },
    medium: {
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
      text: "Medium"
    },
    low: {
      badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
      text: "Low"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `group flex items-start gap-3.5 p-4 rounded-xl border transition-all ${isCompleted ? "bg-slate-50/50 dark:bg-helm-surface/40 border-slate-200/60 dark:border-helm-border/50 opacity-75" : "bg-white/80 dark:bg-helm-card/70 hover:bg-white dark:hover:bg-helm-card border-slate-200/80 dark:border-helm-border/80 shadow-sm"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "checkbox",
            "aria-checked": isCompleted,
            "aria-label": `Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`,
            onClick: () => onToggleComplete(task.id),
            className: `w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-helm-surface"}`,
            children: isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 stroke-[3]", "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: `text-sm font-medium leading-snug break-words ${isCompleted ? "line-through text-slate-400 dark:text-helm-muted" : "text-slate-900 dark:text-slate-100"}`,
                children: task.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onEdit(task),
                  title: "Edit task",
                  "aria-label": `Edit task "${task.title}"`,
                  className: "p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-helm-cardHover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onDelete(task),
                  title: "Delete task",
                  "aria-label": `Delete task "${task.title}"`,
                  className: "p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          task.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs leading-relaxed line-clamp-2 ${isCompleted ? "text-slate-400/80 dark:text-helm-muted/60" : "text-slate-500 dark:text-slate-400"}`,
              children: task.description
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-1 text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `px-2 py-0.5 rounded-full border font-medium ${priorityStyles[task.priority].badge}`,
                children: priorityStyles[task.priority].text
              }
            ),
            isInProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-3 h-3" }),
              "In Progress"
            ] }),
            task.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${isCompleted ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700" : dueDateInfo.isOverdue ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" : dueDateInfo.isToday ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" : "bg-slate-100 dark:bg-helm-card text-slate-600 dark:text-slate-300 border-slate-200 dark:border-helm-border"}`,
                children: [
                  dueDateInfo.isOverdue && !isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3 text-rose-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  dueDateInfo.label
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
};
const TaskModal = ({
  isOpen,
  taskToEdit,
  onClose,
  onSave
}) => {
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState("medium");
  const [status, setStatus] = reactExports.useState("pending");
  const [dueDateString, setDueDateString] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const trapRef = useFocusTrap({ isOpen, onClose });
  reactExports.useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDueDateString(toInputDateTimeString(taskToEdit.dueDate));
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDateString("");
    }
    setError(null);
    setIsSaving(false);
  }, [taskToEdit, isOpen]);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please provide a task title.");
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      const parsedDueDate = fromInputDateTimeString(dueDateString);
      await onSave({
        id: taskToEdit?.id,
        title: trimmedTitle,
        description: description.trim(),
        priority,
        status,
        dueDate: parsedDueDate !== void 0 ? parsedDueDate : dueDateString ? null : null
      });
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
      setError(err instanceof Error ? err.message : "Failed to save task.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: trapRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "task-modal-title",
      className: "w-full max-w-lg bg-white dark:bg-helm-surface rounded-2xl border border-slate-200 dark:border-helm-border shadow-2xl overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-helm-border/80 bg-slate-50/60 dark:bg-helm-card/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { id: "task-modal-title", className: "text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-500", "aria-hidden": "true" }),
            taskToEdit ? "Edit Task" : "New Task"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close task modal",
              className: "p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-helm-cardHover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alert", className: "flex items-center gap-2 p-3 text-xs text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "task-title-input", className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5", children: [
              "Task Title ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "task-title-input",
                type: "text",
                autoFocus: true,
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "What needs to be done?",
                maxLength: 200,
                className: "w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "task-desc-input", className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5", children: "Description / Notes (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "task-desc-input",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Add extra context, links, or bullet points...",
                rows: 3,
                maxLength: 1e4,
                className: "w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none resize-none leading-relaxed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-3.5 h-3.5 text-slate-400", "aria-hidden": "true" }),
                "Priority"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "radiogroup", "aria-label": "Task Priority", className: "grid grid-cols-3 gap-1.5", children: ["low", "medium", "high"].map((p) => {
                const isSelected = priority === p;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    role: "radio",
                    "aria-checked": isSelected,
                    onClick: () => setPriority(p),
                    className: `py-1.5 text-xs font-medium rounded-lg capitalize border transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${isSelected ? p === "high" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 font-semibold" : p === "medium" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold" : "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40 font-semibold" : "bg-slate-50 dark:bg-helm-card text-slate-600 dark:text-slate-400 border-slate-200 dark:border-helm-border hover:bg-slate-100 dark:hover:bg-helm-cardHover"}`,
                    children: p
                  },
                  p
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "task-status-select", className: "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "task-status-select",
                  value: status,
                  onChange: (e) => setStatus(e.target.value),
                  className: "w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "in_progress", children: "In Progress" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "completed", children: "Completed" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "task-due-input", className: "text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400", "aria-hidden": "true" }),
                "Due Date & Time (Optional)"
              ] }),
              dueDateString && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setDueDateString(""),
                  className: "text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
                  children: "Clear date"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "task-due-input",
                type: "datetime-local",
                value: dueDateString,
                onChange: (e) => setDueDateString(e.target.value),
                className: "w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-helm-card border border-slate-200 dark:border-helm-border text-slate-900 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200/80 dark:border-helm-border/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isSaving,
                onClick: onClose,
                className: "px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-helm-cardHover transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: isSaving,
                className: "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin", "aria-hidden": "true" }),
                  "Saving..."
                ] }) : taskToEdit ? "Save Changes" : "Create Task"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
};
const TasksPage = ({ initialAction }) => {
  const [tasks, setTasks] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [priorityFilter, setPriorityFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [announcement, setAnnouncement] = reactExports.useState(null);
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [taskToEdit, setTaskToEdit] = reactExports.useState(null);
  const [taskToDelete, setTaskToDelete] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const deleteModalRef = useFocusTrap({
    isOpen: Boolean(taskToDelete),
    onClose: () => setTaskToDelete(null)
  });
  const loadTasks = reactExports.useCallback(async () => {
    try {
      if (window.beacon?.getTasks) {
        const filter = {
          view: activeTab,
          priority: priorityFilter,
          search: searchQuery
        };
        const fetched = await window.beacon.getTasks(filter);
        setTasks(fetched);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, priorityFilter, searchQuery]);
  reactExports.useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  const initialActionHandledRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (initialAction === "new-task" && !initialActionHandledRef.current) {
      initialActionHandledRef.current = true;
      setTaskToEdit(null);
      setIsModalOpen(true);
    }
  }, [initialAction]);
  reactExports.useEffect(() => {
    if (window.beacon?.onNavigateAction) {
      const cleanup = window.beacon.onNavigateAction((action) => {
        if (action === "new-task") {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }
      });
      return cleanup;
    }
  }, []);
  const handleToggleComplete = async (id) => {
    if (!window.beacon?.toggleCompleteTask) return;
    try {
      const updated = await window.beacon.toggleCompleteTask(id);
      const target = tasks.find((t) => t.id === id);
      const newStatus = updated.status === "completed" ? "completed" : "pending";
      setAnnouncement(`Task "${target?.title || "item"}" marked as ${newStatus}`);
      setTasks(
        (prev) => prev.map((t) => t.id === id ? { ...t, ...updated } : t)
      );
      if (activeTab !== "all") {
        loadTasks();
      }
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
    }
  };
  const handleSaveTask = async (data) => {
    if (data.id) {
      if (!window.beacon?.updateTask) return;
      await window.beacon.updateTask({
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate
      });
    } else {
      if (!window.beacon?.createTask) return;
      await window.beacon.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate !== null ? data.dueDate : void 0
      });
    }
    loadTasks();
  };
  const handleConfirmDelete = async () => {
    if (!taskToDelete || !window.beacon?.deleteTask) return;
    try {
      setIsDeleting(true);
      await window.beacon.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
    }
  };
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn select-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-6 h-6 text-emerald-500" }),
          "Tasks & Reminders"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-helm-muted mt-1", children: "Organize daily focus, deadlines, and project milestones saved in your local SQLite store." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          },
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New Task"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", "aria-live": "polite", className: "sr-only", children: announcement }),
    totalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-2xl bg-white/60 dark:bg-helm-card/60 border border-slate-200 dark:border-helm-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Overall Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
          completedCount,
          " of ",
          totalCount,
          " completed (",
          completionPercentage,
          "%)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          role: "progressbar",
          "aria-valuenow": completionPercentage,
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-label": "Overall tasks progress",
          className: "w-full h-2 rounded-full bg-slate-200/80 dark:bg-helm-surface overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-emerald-500 transition-all duration-500 rounded-full",
              style: { width: `${completionPercentage}%` }
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "tablist", "aria-label": "Task Filter Views", className: "flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-helm-surface border border-slate-200/80 dark:border-helm-border/80 self-start", children: [
        { id: "all", label: "All Tasks" },
        { id: "today", label: "Due Today" },
        { id: "upcoming", label: "Upcoming" },
        { id: "completed", label: "Completed" }
      ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": activeTab === tab.id,
          onClick: () => setActiveTab(tab.id),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${activeTab === tab.id ? "bg-white dark:bg-helm-card text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/60 dark:border-helm-border/60" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`,
          children: tab.label
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "w-3.5 h-3.5 text-slate-400 dark:text-helm-muted", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: priorityFilter,
              onChange: (e) => setPriorityFilter(e.target.value),
              "aria-label": "Filter tasks by priority",
              className: "bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Priorities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High Priority" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium Priority" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low Priority" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-helm-muted", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "Search tasks...",
              "aria-label": "Search tasks",
              className: "w-48 pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-helm-muted focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
            }
          ),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setSearchQuery(""),
              "aria-label": "Clear task search",
              className: "absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5 min-h-[300px]", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20 text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) }) : tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-helm-border text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-slate-100 dark:bg-helm-card flex items-center justify-center text-slate-400 dark:text-helm-muted mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-6 h-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1", children: searchQuery ? "No matching tasks" : activeTab === "completed" ? "No completed tasks" : activeTab === "today" ? "Nothing due today" : "No tasks found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-helm-muted max-w-sm mb-4", children: searchQuery ? "Try tweaking your search term or clear filters." : activeTab === "today" ? "You are all caught up for today! Enjoy the clear schedule or add a new goal." : activeTab === "completed" ? "Tasks you check off will be archived here." : "Create tasks to track action items, due dates, and priorities." }),
      searchQuery ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSearchQuery(""),
          className: "text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline",
          children: "Clear search"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          },
          className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
            "Add a task"
          ]
        }
      )
    ] }) : tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TaskItemCard,
      {
        task,
        onToggleComplete: handleToggleComplete,
        onEdit: (t) => {
          setTaskToEdit(t);
          setIsModalOpen(true);
        },
        onDelete: (t) => setTaskToDelete(t)
      },
      task.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TaskModal,
      {
        isOpen: isModalOpen,
        taskToEdit,
        onClose: () => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        },
        onSave: handleSaveTask
      }
    ),
    taskToDelete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: deleteModalRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "delete-task-title",
        className: "w-full max-w-sm p-6 rounded-2xl bg-white dark:bg-helm-surface border border-slate-200 dark:border-helm-border shadow-2xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 text-rose-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-rose-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "delete-task-title", className: "text-base font-semibold text-slate-900 dark:text-slate-100", children: "Delete Task?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-600 dark:text-helm-muted leading-relaxed mb-6", children: [
            "Are you sure you want to delete",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-900 dark:text-slate-200", children: [
              "“",
              taskToDelete.title,
              "”"
            ] }),
            "? This action will permanently remove it from your local SQLite database."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isDeleting,
                onClick: () => setTaskToDelete(null),
                className: "px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-helm-cardHover transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isDeleting,
                onClick: handleConfirmDelete,
                className: "px-3.5 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-sm focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none",
                children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
                  "Deleting..."
                ] }) : "Delete Forever"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};
const STEPS = [
  {
    id: "welcome",
    title: "Welcome to BEACON",
    subtitle: "Calm ambient awareness & local-first desktop productivity",
    badge: "Introduction"
  },
  {
    id: "ambient",
    title: "Ambient Screen Board",
    subtitle: "Cinematic full-screen visual canvas and living standby display",
    badge: "Ambient Canvas"
  },
  {
    id: "notes-tasks",
    title: "Notes & Actionable Tasks",
    subtitle: "Instant markdown notes and organized task lists with SQLite storage",
    badge: "Productivity"
  },
  {
    id: "browser",
    title: "Chromium Extension & Watches",
    subtitle: "Live web monitors and Native Messaging for Chrome, Edge, and Brave",
    badge: "Web Monitoring"
  },
  {
    id: "setup",
    title: "Personalize & Get Started",
    subtitle: "Configure your appearance and dive into your new workspace",
    badge: "Quick Setup"
  }
];
const OnboardingModal = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const [selectedTheme, setSelectedTheme] = reactExports.useState(getStoredTheme());
  const handleFinish = reactExports.useCallback(async () => {
    try {
      if (window.beacon?.setOnboardingCompleted) {
        await window.beacon.setOnboardingCompleted(true);
      }
    } catch (err) {
      console.error("[Onboarding] Failed to persist completion flag:", err);
    }
    onClose();
  }, [onClose]);
  const trapRef = useFocusTrap({ isOpen, onClose: handleFinish });
  const handleNext = reactExports.useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, handleFinish]);
  const handleBack = reactExports.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);
  reactExports.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleFinish();
      } else if (e.key === "ArrowRight" && currentStep < STEPS.length - 1) {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, handleNext, handleBack, handleFinish]);
  if (!isOpen) return null;
  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    applyTheme(newTheme);
  };
  const handleQuickAction = (route, action) => {
    handleFinish();
    if (onNavigate) {
      onNavigate(route, action);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Welcome to BEACON Onboarding Tour",
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: trapRef,
          className: "relative w-full max-w-2xl bg-white dark:bg-helm-card border border-slate-200 dark:border-helm-border rounded-2xl shadow-2xl overflow-hidden flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-helm-border/40 bg-slate-50/50 dark:bg-helm-surface/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-[#0e0f22] flex items-center justify-center border border-indigo-500/30 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BeaconSymbol, { size: 20 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider", children: "BEACON Windows" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium", children: STEPS[currentStep].badge })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "status", "aria-live": "polite", className: "text-[11px] text-slate-500 dark:text-helm-muted", children: [
                    "Step ",
                    currentStep + 1,
                    " of ",
                    STEPS.length,
                    ": ",
                    STEPS[currentStep].title
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleFinish,
                  title: "Skip onboarding tour (Esc)",
                  "aria-label": "Skip onboarding tour",
                  className: "text-xs text-slate-500 hover:text-slate-800 dark:text-helm-muted dark:hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Skip tour" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5", "aria-hidden": "true" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-100 dark:bg-black/30 h-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-emerald-500 transition-all duration-300 ease-out",
                style: { width: `${(currentStep + 1) / STEPS.length * 100}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 flex-1 min-h-[380px] flex flex-col justify-between", children: [
              currentStep === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fadeIn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Welcome to BEACON" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: "Ambient Productivity for Windows" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-helm-muted leading-relaxed", children: "BEACON keeps your essential workflow context—ambient visuals, time, weather, markdown notes, task queues, and live web monitors—effortlessly visible without cognitive clutter or intrusive distractions." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Ambient Board" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Cinematic Ken Burns photo slideshows, time, and weather standby." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Notes & Tasks" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Fast SQLite-backed markdown notes, priority tasks, and filters." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Web Watches" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-helm-muted", children: "Monitor web pages with native browser messaging in Chrome & Edge." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-helm-muted", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "100% Local-First & Private:" }),
                    " All your notes, tasks, and settings are stored locally on your machine in ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-slate-800 dark:text-slate-200", children: "%APPDATA%\\Beacon" }),
                    "."
                  ] })
                ] })
              ] }),
              currentStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-medium border border-sky-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cinematic Immersion" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: "Ambient Screen Board" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-helm-muted leading-relaxed", children: "Turn your secondary display or inactive desktop into a calm, living canvas. BEACON combines hardware-accelerated animations with glanceable productivity." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Ken Burns Motion & Photography" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Subtle pan-and-zoom animations with smooth cross-fades. Choose from built-in high-resolution photography or select any custom folder on your computer." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Frosted Glass Productivity HUD" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Floating live clock, local weather conditions, active task summaries, and web watches overlaid on a customizable frosted blur." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Quick Ambient Controls" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: [
                        "Press ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono", children: "F11" }),
                        " for borderless fullscreen, ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono", children: "Space" }),
                        " to pause or resume slideshows, and ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "px-1.5 py-0.5 bg-slate-200 dark:bg-black/40 rounded border border-slate-300 dark:border-helm-border text-[10px] font-mono", children: "← / →" }),
                        " to change slides."
                      ] })
                    ] })
                  ] })
                ] })
              ] }),
              currentStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Local SQLite Foundation" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: "Markdown Notes & Priority Tasks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-helm-muted leading-relaxed", children: "Capture thoughts instantly and track your daily priorities without leaving your desk. Designed for speed, zero startup lag, and offline reliability." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-emerald-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "Markdown Notes" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-[11px] text-slate-600 dark:text-helm-muted space-y-1.5 list-disc list-inside", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Pin critical notes to the top of your list" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Instant live search across titles and content" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Auto-saves edits safely as you type" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Quick capture action from the Windows Tray" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40 space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-4 h-4 text-sky-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "Actionable Tasks" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-[11px] text-slate-600 dark:text-helm-muted space-y-1.5 list-disc list-inside", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Filter by Today, Upcoming, or Completed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Priority indicators: High, Medium, Low" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Due dates with overdue highlights" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Synchronized with the Ambient Board HUD" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200/60 dark:border-helm-border/30 text-xs text-slate-600 dark:text-helm-muted flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tray Quick Actions:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium", children: 'Right-click tray icon → "New Note" or "New Task"' })
                ] })
              ] }),
              currentStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Native Messaging Channel" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: "Browser Extension Integration" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-helm-muted leading-relaxed", children: "BEACON connects with your everyday Chromium browser to bring real-time web awareness directly to your desktop." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Zero-Network Named Pipe IPC" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: [
                        "BEACON communicates with Chrome, Microsoft Edge, and Brave via an ultra-fast local Windows Named Pipe (",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-[10px]", children: "\\\\.\\pipe\\helm-windows-ipc" }),
                        "). No external ports or cloud servers are used."
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-helm-surface/50 border border-slate-200/80 dark:border-helm-border/40", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-800 dark:text-slate-200", children: "Live Watch Monitors" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 dark:text-helm-muted mt-0.5", children: "Monitor build pipelines, ticket status, shipments, and price changes. When a watch item triggers attention, BEACON delivers a native Windows desktop notification." })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200", children: [
                  "Extension registration scripts and live connection status can be verified anytime in ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Settings → Chromium Extension Integration" }),
                  "."
                ] })
              ] }),
              currentStep === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Setup Complete" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: "Personalize & Begin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-helm-muted leading-relaxed", children: "Choose your theme preference and select where you would like to start. You can replay this tour anytime from Settings." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Select Theme Appearance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleThemeChange("system"),
                        className: `flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${selectedTheme === "system" ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "w-4 h-4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "System Default" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleThemeChange("dark"),
                        className: `flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${selectedTheme === "dark" ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-4 h-4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dark (Ambient)" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleThemeChange("light"),
                        className: `flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${selectedTheme === "light" ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20" : "bg-slate-50 dark:bg-helm-surface border-slate-200 dark:border-helm-border/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Light" })
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700 dark:text-slate-300", children: "Quick Start Destinations" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleQuickAction("ambient"),
                        className: "flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 text-emerald-500" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Ambient Board" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleQuickAction("notes", "new-note"),
                        className: "flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-sky-500" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Create First Note" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleQuickAction("tasks", "new-task"),
                        className: "flex items-center justify-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-helm-border bg-slate-50 dark:bg-helm-surface text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "w-3.5 h-3.5 text-purple-500" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add First Task" })
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-helm-border/40 bg-slate-50/50 dark:bg-helm-surface/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "tablist", "aria-label": "Onboarding tour steps", className: "flex items-center gap-1.5", children: STEPS.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  onClick: () => setCurrentStep(idx),
                  "aria-selected": idx === currentStep,
                  "aria-label": `Step ${idx + 1}: ${step.title}`,
                  title: step.title,
                  className: `h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none ${idx === currentStep ? "w-6 bg-emerald-500" : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"}`
                },
                step.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                currentStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "secondary",
                    size: "sm",
                    onClick: handleBack,
                    className: "gap-1.5 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back" })
                    ]
                  }
                ),
                currentStep < STEPS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleNext,
                    className: "gap-1.5 text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Next" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "primary",
                    size: "sm",
                    onClick: handleFinish,
                    className: "gap-1.5 text-xs shadow-md shadow-emerald-500/20",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Get Started with BEACON" })
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
};
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ""
    };
  }
  static getDerivedStateFromError(error) {
    const msg = error?.message ? error.message.replace(/[a-zA-Z]:\\[^\s"'<>]+/g, "<path>") : "An unexpected user interface error occurred.";
    return {
      hasError: true,
      errorMessage: msg
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("[BEACON ErrorBoundary] Caught UI error:", error, errorInfo);
  }
  handleReload = () => {
    this.setState({ hasError: false, errorMessage: "" });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[350px] p-8 text-center bg-slate-50 dark:bg-helm-surface/50 border border-slate-200 dark:border-helm-border/60 rounded-2xl animate-fadeIn m-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-slate-100 mb-1", children: this.props.fallbackTitle || "Component Encountered an Issue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-helm-muted max-w-md mb-4 leading-relaxed", children: "BEACON recovered safely from a component failure. Your persistent notes, tasks, and background settings remain intact." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 mb-6 bg-slate-100 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-helm-border/40 text-[11px] font-mono text-slate-700 dark:text-slate-300 max-w-lg break-words select-all", children: this.state.errorMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "primary", size: "sm", onClick: this.handleReload, className: "gap-1.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reload View" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => {
                this.setState({ hasError: false, errorMessage: "" });
                window.location.hash = "";
              },
              className: "gap-1.5 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Return to Dashboard" })
              ]
            }
          )
        ] })
      ] });
    }
    return this.props.children;
  }
}
const App = () => {
  const isInitialScreensaver = typeof window !== "undefined" && Boolean(window.location.hash.includes("screensaver"));
  const [currentRoute, setCurrentRoute] = reactExports.useState(
    isInitialScreensaver ? "ambient" : "home"
  );
  const [isFullscreen, setIsFullscreen] = reactExports.useState(isInitialScreensaver);
  const [pendingAction, setPendingAction] = reactExports.useState(null);
  const [showOnboarding, setShowOnboarding] = reactExports.useState(false);
  const [isScreensaver, setIsScreensaver] = reactExports.useState(isInitialScreensaver);
  const previousRouteRef = reactExports.useRef("home");
  reactExports.useEffect(() => {
    const cleanupTheme = initTheme();
    if (window.beacon?.isOnboardingCompleted) {
      window.beacon.isOnboardingCompleted().then((completed) => {
        if (!completed) {
          setShowOnboarding(true);
        }
      }).catch((err) => {
        console.error("[BEACON App] Failed to check onboarding status:", err);
      });
    }
    let cleanupNavigation;
    if (window.beacon?.onNavigate) {
      cleanupNavigation = window.beacon.onNavigate((route) => {
        if (route === "home" || route === "ambient" || route === "notes" || route === "tasks" || route === "settings") {
          setCurrentRoute(route);
        }
      });
    }
    let cleanupAction;
    if (window.beacon?.onNavigateAction) {
      cleanupAction = window.beacon.onNavigateAction((action) => {
        setPendingAction(action);
      });
    }
    if (window.beacon?.isFullscreen) {
      window.beacon.isFullscreen().then(setIsFullscreen).catch(console.error);
    }
    let cleanupFullscreen;
    if (window.beacon?.onFullscreenChange) {
      cleanupFullscreen = window.beacon.onFullscreenChange((fs) => {
        setIsFullscreen(fs);
      });
    }
    if (window.beacon?.isScreensaverMode) {
      window.beacon.isScreensaverMode().then((active) => {
        if (active) {
          setIsScreensaver(true);
          setCurrentRoute("ambient");
        }
      }).catch(console.error);
    }
    let cleanupScreensaver;
    if (window.beacon?.onScreensaverChange) {
      cleanupScreensaver = window.beacon.onScreensaverChange((active) => {
        setIsScreensaver(active);
        if (active) {
          setCurrentRoute((prev) => {
            previousRouteRef.current = prev;
            return "ambient";
          });
        } else {
          setCurrentRoute(previousRouteRef.current || "home");
          if (typeof window !== "undefined" && window.location.hash.includes("screensaver")) {
            try {
              window.history.replaceState(null, "", window.location.pathname);
            } catch {
            }
          }
        }
      });
    }
    return () => {
      cleanupTheme();
      if (cleanupNavigation) cleanupNavigation();
      if (cleanupAction) cleanupAction();
      if (cleanupFullscreen) cleanupFullscreen();
      if (cleanupScreensaver) cleanupScreensaver();
    };
  }, []);
  const handleRouteChange = (route, action) => {
    setCurrentRoute(route);
    if (action) {
      setPendingAction(action);
    }
  };
  if (isScreensaver) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-screen h-screen overflow-hidden bg-[#080811] bg-gradient-to-b from-[#0a1218] via-[#10222a] to-[#070e13] select-none cursor-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorBoundary,
      {
        fallbackTitle: "Ambient Screensaver",
        onReset: () => {
          const exitFn = window.beacon?.exitScreensaver || window.helm?.exitScreensaver;
          if (exitFn) {
            exitFn().catch(console.error);
          } else {
            handleRouteChange("home");
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AmbientBoardPage,
          {
            onNavigate: handleRouteChange,
            isFullscreen: true,
            setIsFullscreen,
            isScreensaver: true
          }
        )
      }
    ) });
  }
  if (isFullscreen && currentRoute === "ambient") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-screen h-screen overflow-hidden bg-black select-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AmbientBoardPage,
      {
        onNavigate: handleRouteChange,
        isFullscreen,
        setIsFullscreen
      }
    ) });
  }
  const renderContent = () => {
    switch (currentRoute) {
      case "home":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, { onNavigate: handleRouteChange });
      case "ambient":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          AmbientBoardPage,
          {
            onNavigate: handleRouteChange,
            isFullscreen,
            setIsFullscreen
          }
        );
      case "notes":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(NotesPage, { initialAction: pendingAction ?? void 0 });
      case "tasks":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TasksPage, { initialAction: pendingAction ?? void 0 });
      case "settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, { onOpenOnboarding: () => setShowOnboarding(true) });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(HomePage, { onNavigate: handleRouteChange });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { currentRoute, onRouteChange: handleRouteChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: renderContent() }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OnboardingModal,
      {
        isOpen: showOnboarding,
        onClose: () => setShowOnboarding(false),
        onNavigate: handleRouteChange
      }
    )
  ] });
};
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
