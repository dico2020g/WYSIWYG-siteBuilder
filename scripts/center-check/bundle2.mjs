var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/react/cjs/react.production.min.js
var require_react_production_min = __commonJS({
  "node_modules/react/cjs/react.production.min.js"(exports) {
    "use strict";
    var l = Symbol.for("react.element");
    var n = Symbol.for("react.portal");
    var p = Symbol.for("react.fragment");
    var q = Symbol.for("react.strict_mode");
    var r = Symbol.for("react.profiler");
    var t = Symbol.for("react.provider");
    var u = Symbol.for("react.context");
    var v = Symbol.for("react.forward_ref");
    var w = Symbol.for("react.suspense");
    var x = Symbol.for("react.memo");
    var y = Symbol.for("react.lazy");
    var z = Symbol.iterator;
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
    } };
    var C = Object.assign;
    var D = {};
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
    var I = Array.isArray;
    var J = Object.prototype.hasOwnProperty;
    var K = { current: null };
    var L = { key: true, ref: true, __self: true, __source: true };
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
    var U = { current: null };
    var V = { transition: null };
    var W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
    function X() {
      throw Error("act(...) is not supported in production builds of React.");
    }
    exports.Children = { map: S, forEach: function(a, b, e) {
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
    exports.Component = E;
    exports.Fragment = p;
    exports.Profiler = r;
    exports.PureComponent = G;
    exports.StrictMode = q;
    exports.Suspense = w;
    exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
    exports.act = X;
    exports.cloneElement = function(a, b, e) {
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
    exports.createContext = function(a) {
      a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
      a.Provider = { $$typeof: t, _context: a };
      return a.Consumer = a;
    };
    exports.createElement = M;
    exports.createFactory = function(a) {
      var b = M.bind(null, a);
      b.type = a;
      return b;
    };
    exports.createRef = function() {
      return { current: null };
    };
    exports.forwardRef = function(a) {
      return { $$typeof: v, render: a };
    };
    exports.isValidElement = O;
    exports.lazy = function(a) {
      return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
    };
    exports.memo = function(a, b) {
      return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
    };
    exports.startTransition = function(a) {
      var b = V.transition;
      V.transition = {};
      try {
        a();
      } finally {
        V.transition = b;
      }
    };
    exports.unstable_act = X;
    exports.useCallback = function(a, b) {
      return U.current.useCallback(a, b);
    };
    exports.useContext = function(a) {
      return U.current.useContext(a);
    };
    exports.useDebugValue = function() {
    };
    exports.useDeferredValue = function(a) {
      return U.current.useDeferredValue(a);
    };
    exports.useEffect = function(a, b) {
      return U.current.useEffect(a, b);
    };
    exports.useId = function() {
      return U.current.useId();
    };
    exports.useImperativeHandle = function(a, b, e) {
      return U.current.useImperativeHandle(a, b, e);
    };
    exports.useInsertionEffect = function(a, b) {
      return U.current.useInsertionEffect(a, b);
    };
    exports.useLayoutEffect = function(a, b) {
      return U.current.useLayoutEffect(a, b);
    };
    exports.useMemo = function(a, b) {
      return U.current.useMemo(a, b);
    };
    exports.useReducer = function(a, b, e) {
      return U.current.useReducer(a, b, e);
    };
    exports.useRef = function(a) {
      return U.current.useRef(a);
    };
    exports.useState = function(a) {
      return U.current.useState(a);
    };
    exports.useSyncExternalStore = function(a, b, e) {
      return U.current.useSyncExternalStore(a, b, e);
    };
    exports.useTransition = function() {
      return U.current.useTransition();
    };
    exports.version = "18.3.1";
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV !== "production") {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var ReactVersion = "18.3.1";
        var REACT_ELEMENT_TYPE = Symbol.for("react.element");
        var REACT_PORTAL_TYPE = Symbol.for("react.portal");
        var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
        var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
        var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
        var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
        var REACT_CONTEXT_TYPE = Symbol.for("react.context");
        var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
        var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
        var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
        var REACT_MEMO_TYPE = Symbol.for("react.memo");
        var REACT_LAZY_TYPE = Symbol.for("react.lazy");
        var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
        var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
        var FAUX_ITERATOR_SYMBOL = "@@iterator";
        function getIteratorFn(maybeIterable) {
          if (maybeIterable === null || typeof maybeIterable !== "object") {
            return null;
          }
          var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
          if (typeof maybeIterator === "function") {
            return maybeIterator;
          }
          return null;
        }
        var ReactCurrentDispatcher = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactCurrentBatchConfig = {
          transition: null
        };
        var ReactCurrentActQueue = {
          current: null,
          // Used to reproduce behavior of `batchedUpdates` in legacy mode.
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false
        };
        var ReactCurrentOwner = {
          /**
           * @internal
           * @type {ReactComponent}
           */
          current: null
        };
        var ReactDebugCurrentFrame = {};
        var currentExtraStackFrame = null;
        function setExtraStackFrame(stack) {
          {
            currentExtraStackFrame = stack;
          }
        }
        {
          ReactDebugCurrentFrame.setExtraStackFrame = function(stack) {
            {
              currentExtraStackFrame = stack;
            }
          };
          ReactDebugCurrentFrame.getCurrentStack = null;
          ReactDebugCurrentFrame.getStackAddendum = function() {
            var stack = "";
            if (currentExtraStackFrame) {
              stack += currentExtraStackFrame;
            }
            var impl = ReactDebugCurrentFrame.getCurrentStack;
            if (impl) {
              stack += impl() || "";
            }
            return stack;
          };
        }
        var enableScopeAPI = false;
        var enableCacheElement = false;
        var enableTransitionTracing = false;
        var enableLegacyHidden = false;
        var enableDebugTracing = false;
        var ReactSharedInternals = {
          ReactCurrentDispatcher,
          ReactCurrentBatchConfig,
          ReactCurrentOwner
        };
        {
          ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
          ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
        }
        function warn(format) {
          {
            {
              for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
              }
              printWarning("warn", format, args);
            }
          }
        }
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame2.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        var didWarnStateUpdateForUnmountedComponent = {};
        function warnNoop(publicInstance, callerName) {
          {
            var _constructor = publicInstance.constructor;
            var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
            var warningKey = componentName + "." + callerName;
            if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
              return;
            }
            error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
            didWarnStateUpdateForUnmountedComponent[warningKey] = true;
          }
        }
        var ReactNoopUpdateQueue = {
          /**
           * Checks whether or not this composite component is mounted.
           * @param {ReactClass} publicInstance The instance we want to test.
           * @return {boolean} True if mounted, false otherwise.
           * @protected
           * @final
           */
          isMounted: function(publicInstance) {
            return false;
          },
          /**
           * Forces an update. This should only be invoked when it is known with
           * certainty that we are **not** in a DOM transaction.
           *
           * You may want to call this when you know that some deeper aspect of the
           * component's state has changed but `setState` was not called.
           *
           * This will not invoke `shouldComponentUpdate`, but it will invoke
           * `componentWillUpdate` and `componentDidUpdate`.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueForceUpdate: function(publicInstance, callback, callerName) {
            warnNoop(publicInstance, "forceUpdate");
          },
          /**
           * Replaces all of the state. Always use this or `setState` to mutate state.
           * You should treat `this.state` as immutable.
           *
           * There is no guarantee that `this.state` will be immediately updated, so
           * accessing `this.state` after calling this method may return the old value.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} completeState Next state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} callerName name of the calling function in the public API.
           * @internal
           */
          enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
            warnNoop(publicInstance, "replaceState");
          },
          /**
           * Sets a subset of the state. This only exists because _pendingState is
           * internal. This provides a merging strategy that is not available to deep
           * properties which is confusing. TODO: Expose pendingState or don't use it
           * during the merge.
           *
           * @param {ReactClass} publicInstance The instance that should rerender.
           * @param {object} partialState Next partial state to be merged with state.
           * @param {?function} callback Called after component is updated.
           * @param {?string} Name of the calling function in the public API.
           * @internal
           */
          enqueueSetState: function(publicInstance, partialState, callback, callerName) {
            warnNoop(publicInstance, "setState");
          }
        };
        var assign = Object.assign;
        var emptyObject = {};
        {
          Object.freeze(emptyObject);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
            throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
          }
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        {
          var deprecatedAPIs = {
            isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
            replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
          };
          var defineDeprecationWarning = function(methodName, info) {
            Object.defineProperty(Component.prototype, methodName, {
              get: function() {
                warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
                return void 0;
              }
            });
          };
          for (var fnName in deprecatedAPIs) {
            if (deprecatedAPIs.hasOwnProperty(fnName)) {
              defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
            }
          }
        }
        function ComponentDummy() {
        }
        ComponentDummy.prototype = Component.prototype;
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
        pureComponentPrototype.constructor = PureComponent;
        assign(pureComponentPrototype, Component.prototype);
        pureComponentPrototype.isPureReactComponent = true;
        function createRef() {
          var refObject = {
            current: null
          };
          {
            Object.seal(refObject);
          }
          return refObject;
        }
        var isArrayImpl = Array.isArray;
        function isArray(a) {
          return isArrayImpl(a);
        }
        function typeName(value) {
          {
            var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
            var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            return type;
          }
        }
        function willCoercionThrow(value) {
          {
            try {
              testStringCoercion(value);
              return false;
            } catch (e) {
              return true;
            }
          }
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          {
            if (willCoercionThrow(value)) {
              error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
              return testStringCoercion(value);
            }
          }
        }
        function getWrappedName(outerType, innerType, wrapperName) {
          var displayName = outerType.displayName;
          if (displayName) {
            return displayName;
          }
          var functionName = innerType.displayName || innerType.name || "";
          return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
        }
        function getContextName(type) {
          return type.displayName || "Context";
        }
        function getComponentNameFromType(type) {
          if (type == null) {
            return null;
          }
          {
            if (typeof type.tag === "number") {
              error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
            }
          }
          if (typeof type === "function") {
            return type.displayName || type.name || null;
          }
          if (typeof type === "string") {
            return type;
          }
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                var context = type;
                return getContextName(context) + ".Consumer";
              case REACT_PROVIDER_TYPE:
                var provider = type;
                return getContextName(provider._context) + ".Provider";
              case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef");
              case REACT_MEMO_TYPE:
                var outerName = type.displayName || null;
                if (outerName !== null) {
                  return outerName;
                }
                return getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }
            }
          }
          return null;
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var RESERVED_PROPS = {
          key: true,
          ref: true,
          __self: true,
          __source: true
        };
        var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
        {
          didWarnAboutStringRefs = {};
        }
        function hasValidRef(config) {
          {
            if (hasOwnProperty.call(config, "ref")) {
              var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.ref !== void 0;
        }
        function hasValidKey(config) {
          {
            if (hasOwnProperty.call(config, "key")) {
              var getter = Object.getOwnPropertyDescriptor(config, "key").get;
              if (getter && getter.isReactWarning) {
                return false;
              }
            }
          }
          return config.key !== void 0;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          var warnAboutAccessingKey = function() {
            {
              if (!specialPropKeyWarningShown) {
                specialPropKeyWarningShown = true;
                error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function defineRefPropWarningGetter(props, displayName) {
          var warnAboutAccessingRef = function() {
            {
              if (!specialPropRefWarningShown) {
                specialPropRefWarningShown = true;
                error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
              }
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
        function warnIfStringRefCannotBeAutoConverted(config) {
          {
            if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
              var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
              if (!didWarnAboutStringRefs[componentName]) {
                error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
                didWarnAboutStringRefs[componentName] = true;
              }
            }
          }
        }
        var ReactElement = function(type, key, ref, self, source, owner, props) {
          var element = {
            // This tag allows us to uniquely identify this as a React Element
            $$typeof: REACT_ELEMENT_TYPE,
            // Built-in properties that belong on the element
            type,
            key,
            ref,
            props,
            // Record the component responsible for creating this element.
            _owner: owner
          };
          {
            element._store = {};
            Object.defineProperty(element._store, "validated", {
              configurable: false,
              enumerable: false,
              writable: true,
              value: false
            });
            Object.defineProperty(element, "_self", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: self
            });
            Object.defineProperty(element, "_source", {
              configurable: false,
              enumerable: false,
              writable: false,
              value: source
            });
            if (Object.freeze) {
              Object.freeze(element.props);
              Object.freeze(element);
            }
          }
          return element;
        };
        function createElement(type, config, children) {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          var self = null;
          var source = null;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              {
                warnIfStringRefCannotBeAutoConverted(config);
              }
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            self = config.__self === void 0 ? null : config.__self;
            source = config.__source === void 0 ? null : config.__source;
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            {
              if (Object.freeze) {
                Object.freeze(childArray);
              }
            }
            props.children = childArray;
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          {
            if (key || ref) {
              var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
              if (key) {
                defineKeyPropWarningGetter(props, displayName);
              }
              if (ref) {
                defineRefPropWarningGetter(props, displayName);
              }
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
          return newElement;
        }
        function cloneElement(element, config, children) {
          if (element === null || element === void 0) {
            throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
          }
          var propName;
          var props = assign({}, element.props);
          var key = element.key;
          var ref = element.ref;
          var self = element._self;
          var source = element._source;
          var owner = element._owner;
          if (config != null) {
            if (hasValidRef(config)) {
              ref = config.ref;
              owner = ReactCurrentOwner.current;
            }
            if (hasValidKey(config)) {
              {
                checkKeyStringCoercion(config.key);
              }
              key = "" + config.key;
            }
            var defaultProps;
            if (element.type && element.type.defaultProps) {
              defaultProps = element.type.defaultProps;
            }
            for (propName in config) {
              if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                if (config[propName] === void 0 && defaultProps !== void 0) {
                  props[propName] = defaultProps[propName];
                } else {
                  props[propName] = config[propName];
                }
              }
            }
          }
          var childrenLength = arguments.length - 2;
          if (childrenLength === 1) {
            props.children = children;
          } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
              childArray[i] = arguments[i + 2];
            }
            props.children = childArray;
          }
          return ReactElement(element.type, key, ref, self, source, owner, props);
        }
        function isValidElement(object) {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        var SEPARATOR = ".";
        var SUBSEPARATOR = ":";
        function escape(key) {
          var escapeRegex = /[=:]/g;
          var escaperLookup = {
            "=": "=0",
            ":": "=2"
          };
          var escapedString = key.replace(escapeRegex, function(match) {
            return escaperLookup[match];
          });
          return "$" + escapedString;
        }
        var didWarnAboutMaps = false;
        var userProvidedKeyEscapeRegex = /\/+/g;
        function escapeUserProvidedKey(text) {
          return text.replace(userProvidedKeyEscapeRegex, "$&/");
        }
        function getElementKey(element, index) {
          if (typeof element === "object" && element !== null && element.key != null) {
            {
              checkKeyStringCoercion(element.key);
            }
            return escape("" + element.key);
          }
          return index.toString(36);
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if (type === "undefined" || type === "boolean") {
            children = null;
          }
          var invokeCallback = false;
          if (children === null) {
            invokeCallback = true;
          } else {
            switch (type) {
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                }
            }
          }
          if (invokeCallback) {
            var _child = children;
            var mappedChild = callback(_child);
            var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
            if (isArray(mappedChild)) {
              var escapedChildKey = "";
              if (childKey != null) {
                escapedChildKey = escapeUserProvidedKey(childKey) + "/";
              }
              mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
                return c;
              });
            } else if (mappedChild != null) {
              if (isValidElement(mappedChild)) {
                {
                  if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                    checkKeyStringCoercion(mappedChild.key);
                  }
                }
                mappedChild = cloneAndReplaceKey(
                  mappedChild,
                  // Keep both the (mapped) and old keys if they differ, just as
                  // traverseAllChildren used to do for objects as children
                  escapedPrefix + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                  (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? (
                    // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                    // eslint-disable-next-line react-internal/safe-string-coercion
                    escapeUserProvidedKey("" + mappedChild.key) + "/"
                  ) : "") + childKey
                );
              }
              array.push(mappedChild);
            }
            return 1;
          }
          var child;
          var nextName;
          var subtreeCount = 0;
          var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
          if (isArray(children)) {
            for (var i = 0; i < children.length; i++) {
              child = children[i];
              nextName = nextNamePrefix + getElementKey(child, i);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else {
            var iteratorFn = getIteratorFn(children);
            if (typeof iteratorFn === "function") {
              var iterableChildren = children;
              {
                if (iteratorFn === iterableChildren.entries) {
                  if (!didWarnAboutMaps) {
                    warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                  }
                  didWarnAboutMaps = true;
                }
              }
              var iterator = iteratorFn.call(iterableChildren);
              var step;
              var ii = 0;
              while (!(step = iterator.next()).done) {
                child = step.value;
                nextName = nextNamePrefix + getElementKey(child, ii++);
                subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
              }
            } else if (type === "object") {
              var childrenString = String(children);
              throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
            }
          }
          return subtreeCount;
        }
        function mapChildren(children, func, context) {
          if (children == null) {
            return children;
          }
          var result = [];
          var count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function countChildren(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        }
        function forEachChildren(children, forEachFunc, forEachContext) {
          mapChildren(children, function() {
            forEachFunc.apply(this, arguments);
          }, forEachContext);
        }
        function toArray(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        }
        function onlyChild(children) {
          if (!isValidElement(children)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
          }
          return children;
        }
        function createContext(defaultValue) {
          var context = {
            $$typeof: REACT_CONTEXT_TYPE,
            // As a workaround to support multiple concurrent renderers, we categorize
            // some renderers as primary and others as secondary. We only expect
            // there to be two concurrent renderers at most: React Native (primary) and
            // Fabric (secondary); React DOM (primary) and React ART (secondary).
            // Secondary renderers store their context values on separate fields.
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            // Used to track how many concurrent renderers this context currently
            // supports within in a single renderer. Such as parallel server rendering.
            _threadCount: 0,
            // These are circular
            Provider: null,
            Consumer: null,
            // Add these to use same hidden class in VM as ServerContext
            _defaultValue: null,
            _globalName: null
          };
          context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context: context
          };
          var hasWarnedAboutUsingNestedContextConsumers = false;
          var hasWarnedAboutUsingConsumerProvider = false;
          var hasWarnedAboutDisplayNameOnConsumer = false;
          {
            var Consumer = {
              $$typeof: REACT_CONTEXT_TYPE,
              _context: context
            };
            Object.defineProperties(Consumer, {
              Provider: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumerProvider) {
                    hasWarnedAboutUsingConsumerProvider = true;
                    error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                  }
                  return context.Provider;
                },
                set: function(_Provider) {
                  context.Provider = _Provider;
                }
              },
              _currentValue: {
                get: function() {
                  return context._currentValue;
                },
                set: function(_currentValue) {
                  context._currentValue = _currentValue;
                }
              },
              _currentValue2: {
                get: function() {
                  return context._currentValue2;
                },
                set: function(_currentValue2) {
                  context._currentValue2 = _currentValue2;
                }
              },
              _threadCount: {
                get: function() {
                  return context._threadCount;
                },
                set: function(_threadCount) {
                  context._threadCount = _threadCount;
                }
              },
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingNestedContextConsumers) {
                    hasWarnedAboutUsingNestedContextConsumers = true;
                    error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                  }
                  return context.Consumer;
                }
              },
              displayName: {
                get: function() {
                  return context.displayName;
                },
                set: function(displayName) {
                  if (!hasWarnedAboutDisplayNameOnConsumer) {
                    warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                    hasWarnedAboutDisplayNameOnConsumer = true;
                  }
                }
              }
            });
            context.Consumer = Consumer;
          }
          {
            context._currentRenderer = null;
            context._currentRenderer2 = null;
          }
          return context;
        }
        var Uninitialized = -1;
        var Pending = 0;
        var Resolved = 1;
        var Rejected = 2;
        function lazyInitializer(payload) {
          if (payload._status === Uninitialized) {
            var ctor = payload._result;
            var thenable = ctor();
            thenable.then(function(moduleObject2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var resolved = payload;
                resolved._status = Resolved;
                resolved._result = moduleObject2;
              }
            }, function(error2) {
              if (payload._status === Pending || payload._status === Uninitialized) {
                var rejected = payload;
                rejected._status = Rejected;
                rejected._result = error2;
              }
            });
            if (payload._status === Uninitialized) {
              var pending = payload;
              pending._status = Pending;
              pending._result = thenable;
            }
          }
          if (payload._status === Resolved) {
            var moduleObject = payload._result;
            {
              if (moduleObject === void 0) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
              }
            }
            {
              if (!("default" in moduleObject)) {
                error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            return moduleObject.default;
          } else {
            throw payload._result;
          }
        }
        function lazy(ctor) {
          var payload = {
            // We use these fields to store the result.
            _status: Uninitialized,
            _result: ctor
          };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: payload,
            _init: lazyInitializer
          };
          {
            var defaultProps;
            var propTypes;
            Object.defineProperties(lazyType, {
              defaultProps: {
                configurable: true,
                get: function() {
                  return defaultProps;
                },
                set: function(newDefaultProps) {
                  error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  defaultProps = newDefaultProps;
                  Object.defineProperty(lazyType, "defaultProps", {
                    enumerable: true
                  });
                }
              },
              propTypes: {
                configurable: true,
                get: function() {
                  return propTypes;
                },
                set: function(newPropTypes) {
                  error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                  propTypes = newPropTypes;
                  Object.defineProperty(lazyType, "propTypes", {
                    enumerable: true
                  });
                }
              }
            });
          }
          return lazyType;
        }
        function forwardRef(render) {
          {
            if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
              error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
            } else if (typeof render !== "function") {
              error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
            } else {
              if (render.length !== 0 && render.length !== 2) {
                error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
              }
            }
            if (render != null) {
              if (render.defaultProps != null || render.propTypes != null) {
                error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
              }
            }
          }
          var elementType = {
            $$typeof: REACT_FORWARD_REF_TYPE,
            render
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!render.name && !render.displayName) {
                  render.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        var REACT_MODULE_REFERENCE;
        {
          REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
        }
        function isValidElementType(type) {
          if (typeof type === "string" || typeof type === "function") {
            return true;
          }
          if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
            return true;
          }
          if (typeof type === "object" && type !== null) {
            if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
            // types supported by any Flight configuration anywhere since
            // we don't know which Flight build this will end up being used
            // with.
            type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
              return true;
            }
          }
          return false;
        }
        function memo(type, compare) {
          {
            if (!isValidElementType(type)) {
              error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
            }
          }
          var elementType = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: compare === void 0 ? null : compare
          };
          {
            var ownName;
            Object.defineProperty(elementType, "displayName", {
              enumerable: false,
              configurable: true,
              get: function() {
                return ownName;
              },
              set: function(name) {
                ownName = name;
                if (!type.name && !type.displayName) {
                  type.displayName = name;
                }
              }
            });
          }
          return elementType;
        }
        function resolveDispatcher() {
          var dispatcher = ReactCurrentDispatcher.current;
          {
            if (dispatcher === null) {
              error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
            }
          }
          return dispatcher;
        }
        function useContext(Context) {
          var dispatcher = resolveDispatcher();
          {
            if (Context._context !== void 0) {
              var realContext = Context._context;
              if (realContext.Consumer === Context) {
                error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
              } else if (realContext.Provider === Context) {
                error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
              }
            }
          }
          return dispatcher.useContext(Context);
        }
        function useState(initialState) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useState(initialState);
        }
        function useReducer(reducer, initialArg, init) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useReducer(reducer, initialArg, init);
        }
        function useRef(initialValue) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useRef(initialValue);
        }
        function useEffect(create2, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useEffect(create2, deps);
        }
        function useInsertionEffect(create2, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useInsertionEffect(create2, deps);
        }
        function useLayoutEffect(create2, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useLayoutEffect(create2, deps);
        }
        function useCallback(callback, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useCallback(callback, deps);
        }
        function useMemo(create2, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useMemo(create2, deps);
        }
        function useImperativeHandle(ref, create2, deps) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useImperativeHandle(ref, create2, deps);
        }
        function useDebugValue(value, formatterFn) {
          {
            var dispatcher = resolveDispatcher();
            return dispatcher.useDebugValue(value, formatterFn);
          }
        }
        function useTransition() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useTransition();
        }
        function useDeferredValue(value) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDeferredValue(value);
        }
        function useId() {
          var dispatcher = resolveDispatcher();
          return dispatcher.useId();
        }
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          var dispatcher = resolveDispatcher();
          return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        var disabledDepth = 0;
        var prevLog;
        var prevInfo;
        var prevWarn;
        var prevError;
        var prevGroup;
        var prevGroupCollapsed;
        var prevGroupEnd;
        function disabledLog() {
        }
        disabledLog.__reactDisabledLog = true;
        function disableLogs() {
          {
            if (disabledDepth === 0) {
              prevLog = console.log;
              prevInfo = console.info;
              prevWarn = console.warn;
              prevError = console.error;
              prevGroup = console.group;
              prevGroupCollapsed = console.groupCollapsed;
              prevGroupEnd = console.groupEnd;
              var props = {
                configurable: true,
                enumerable: true,
                value: disabledLog,
                writable: true
              };
              Object.defineProperties(console, {
                info: props,
                log: props,
                warn: props,
                error: props,
                group: props,
                groupCollapsed: props,
                groupEnd: props
              });
            }
            disabledDepth++;
          }
        }
        function reenableLogs() {
          {
            disabledDepth--;
            if (disabledDepth === 0) {
              var props = {
                configurable: true,
                enumerable: true,
                writable: true
              };
              Object.defineProperties(console, {
                log: assign({}, props, {
                  value: prevLog
                }),
                info: assign({}, props, {
                  value: prevInfo
                }),
                warn: assign({}, props, {
                  value: prevWarn
                }),
                error: assign({}, props, {
                  value: prevError
                }),
                group: assign({}, props, {
                  value: prevGroup
                }),
                groupCollapsed: assign({}, props, {
                  value: prevGroupCollapsed
                }),
                groupEnd: assign({}, props, {
                  value: prevGroupEnd
                })
              });
            }
            if (disabledDepth < 0) {
              error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
            }
          }
        }
        var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
        var prefix;
        function describeBuiltInComponentFrame(name, source, ownerFn) {
          {
            if (prefix === void 0) {
              try {
                throw Error();
              } catch (x) {
                var match = x.stack.trim().match(/\n( *(at )?)/);
                prefix = match && match[1] || "";
              }
            }
            return "\n" + prefix + name;
          }
        }
        var reentry = false;
        var componentFrameCache;
        {
          var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
          componentFrameCache = new PossiblyWeakMap();
        }
        function describeNativeComponentFrame(fn, construct) {
          if (!fn || reentry) {
            return "";
          }
          {
            var frame = componentFrameCache.get(fn);
            if (frame !== void 0) {
              return frame;
            }
          }
          var control;
          reentry = true;
          var previousPrepareStackTrace = Error.prepareStackTrace;
          Error.prepareStackTrace = void 0;
          var previousDispatcher;
          {
            previousDispatcher = ReactCurrentDispatcher$1.current;
            ReactCurrentDispatcher$1.current = null;
            disableLogs();
          }
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if (typeof Reflect === "object" && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x) {
                  control = x;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                control = x;
              }
              fn();
            }
          } catch (sample) {
            if (sample && control && typeof sample.stack === "string") {
              var sampleLines = sample.stack.split("\n");
              var controlLines = control.stack.split("\n");
              var s = sampleLines.length - 1;
              var c = controlLines.length - 1;
              while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
                c--;
              }
              for (; s >= 1 && c >= 0; s--, c--) {
                if (sampleLines[s] !== controlLines[c]) {
                  if (s !== 1 || c !== 1) {
                    do {
                      s--;
                      c--;
                      if (c < 0 || sampleLines[s] !== controlLines[c]) {
                        var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                        if (fn.displayName && _frame.includes("<anonymous>")) {
                          _frame = _frame.replace("<anonymous>", fn.displayName);
                        }
                        {
                          if (typeof fn === "function") {
                            componentFrameCache.set(fn, _frame);
                          }
                        }
                        return _frame;
                      }
                    } while (s >= 1 && c >= 0);
                  }
                  break;
                }
              }
            }
          } finally {
            reentry = false;
            {
              ReactCurrentDispatcher$1.current = previousDispatcher;
              reenableLogs();
            }
            Error.prepareStackTrace = previousPrepareStackTrace;
          }
          var name = fn ? fn.displayName || fn.name : "";
          var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
          {
            if (typeof fn === "function") {
              componentFrameCache.set(fn, syntheticFrame);
            }
          }
          return syntheticFrame;
        }
        function describeFunctionComponentFrame(fn, source, ownerFn) {
          {
            return describeNativeComponentFrame(fn, false);
          }
        }
        function shouldConstruct(Component2) {
          var prototype = Component2.prototype;
          return !!(prototype && prototype.isReactComponent);
        }
        function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
          if (type == null) {
            return "";
          }
          if (typeof type === "function") {
            {
              return describeNativeComponentFrame(type, shouldConstruct(type));
            }
          }
          if (typeof type === "string") {
            return describeBuiltInComponentFrame(type);
          }
          switch (type) {
            case REACT_SUSPENSE_TYPE:
              return describeBuiltInComponentFrame("Suspense");
            case REACT_SUSPENSE_LIST_TYPE:
              return describeBuiltInComponentFrame("SuspenseList");
          }
          if (typeof type === "object") {
            switch (type.$$typeof) {
              case REACT_FORWARD_REF_TYPE:
                return describeFunctionComponentFrame(type.render);
              case REACT_MEMO_TYPE:
                return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
              case REACT_LAZY_TYPE: {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {
                }
              }
            }
          }
          return "";
        }
        var loggedTypeFailures = {};
        var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
        function setCurrentlyValidatingElement(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
            } else {
              ReactDebugCurrentFrame$1.setExtraStackFrame(null);
            }
          }
        }
        function checkPropTypes(typeSpecs, values, location, componentName, element) {
          {
            var has = Function.call.bind(hasOwnProperty);
            for (var typeSpecName in typeSpecs) {
              if (has(typeSpecs, typeSpecName)) {
                var error$1 = void 0;
                try {
                  if (typeof typeSpecs[typeSpecName] !== "function") {
                    var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                    err.name = "Invariant Violation";
                    throw err;
                  }
                  error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                } catch (ex) {
                  error$1 = ex;
                }
                if (error$1 && !(error$1 instanceof Error)) {
                  setCurrentlyValidatingElement(element);
                  error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                  setCurrentlyValidatingElement(null);
                }
                if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                  loggedTypeFailures[error$1.message] = true;
                  setCurrentlyValidatingElement(element);
                  error("Failed %s type: %s", location, error$1.message);
                  setCurrentlyValidatingElement(null);
                }
              }
            }
          }
        }
        function setCurrentlyValidatingElement$1(element) {
          {
            if (element) {
              var owner = element._owner;
              var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
              setExtraStackFrame(stack);
            } else {
              setExtraStackFrame(null);
            }
          }
        }
        var propTypesMisspellWarningShown;
        {
          propTypesMisspellWarningShown = false;
        }
        function getDeclarationErrorAddendum() {
          if (ReactCurrentOwner.current) {
            var name = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
        function getSourceInfoErrorAddendum(source) {
          if (source !== void 0) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, "");
            var lineNumber = source.lineNumber;
            return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
          }
          return "";
        }
        function getSourceInfoErrorAddendumForProps(elementProps) {
          if (elementProps !== null && elementProps !== void 0) {
            return getSourceInfoErrorAddendum(elementProps.__source);
          }
          return "";
        }
        var ownerHasKeyUseWarning = {};
        function getCurrentComponentErrorInfo(parentType) {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
        function validateExplicitKey(element, parentType) {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          {
            setCurrentlyValidatingElement$1(element);
            error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
            setCurrentlyValidatingElement$1(null);
          }
        }
        function validateChildKeys(node, parentType) {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
        function validatePropTypes(element) {
          {
            var type = element.type;
            if (type === null || type === void 0 || typeof type === "string") {
              return;
            }
            var propTypes;
            if (typeof type === "function") {
              propTypes = type.propTypes;
            } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof === REACT_MEMO_TYPE)) {
              propTypes = type.propTypes;
            } else {
              return;
            }
            if (propTypes) {
              var name = getComponentNameFromType(type);
              checkPropTypes(propTypes, element.props, "prop", name, element);
            } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
              propTypesMisspellWarningShown = true;
              var _name = getComponentNameFromType(type);
              error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
            }
            if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
              error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
            }
          }
        }
        function validateFragmentProps(fragment) {
          {
            var keys = Object.keys(fragment.props);
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              if (key !== "children" && key !== "key") {
                setCurrentlyValidatingElement$1(fragment);
                error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
                setCurrentlyValidatingElement$1(null);
                break;
              }
            }
            if (fragment.ref !== null) {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid attribute `ref` supplied to `React.Fragment`.");
              setCurrentlyValidatingElement$1(null);
            }
          }
        }
        function createElementWithValidation(type, props, children) {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendumForProps(props);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            {
              error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
            }
          }
          var element = createElement.apply(this, arguments);
          if (element == null) {
            return element;
          }
          if (validType) {
            for (var i = 2; i < arguments.length; i++) {
              validateChildKeys(arguments[i], type);
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
        var didWarnAboutDeprecatedCreateFactory = false;
        function createFactoryWithValidation(type) {
          var validatedFactory = createElementWithValidation.bind(null, type);
          validatedFactory.type = type;
          {
            if (!didWarnAboutDeprecatedCreateFactory) {
              didWarnAboutDeprecatedCreateFactory = true;
              warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
            }
            Object.defineProperty(validatedFactory, "type", {
              enumerable: false,
              get: function() {
                warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
                Object.defineProperty(this, "type", {
                  value: type
                });
                return type;
              }
            });
          }
          return validatedFactory;
        }
        function cloneElementWithValidation(element, props, children) {
          var newElement = cloneElement.apply(this, arguments);
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], newElement.type);
          }
          validatePropTypes(newElement);
          return newElement;
        }
        function startTransition(scope, options) {
          var prevTransition = ReactCurrentBatchConfig.transition;
          ReactCurrentBatchConfig.transition = {};
          var currentTransition = ReactCurrentBatchConfig.transition;
          {
            ReactCurrentBatchConfig.transition._updatedFibers = /* @__PURE__ */ new Set();
          }
          try {
            scope();
          } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
            {
              if (prevTransition === null && currentTransition._updatedFibers) {
                var updatedFibersCount = currentTransition._updatedFibers.size;
                if (updatedFibersCount > 10) {
                  warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
                }
                currentTransition._updatedFibers.clear();
              }
            }
          }
        }
        var didWarnAboutMessageChannel = false;
        var enqueueTaskImpl = null;
        function enqueueTask(task) {
          if (enqueueTaskImpl === null) {
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              var nodeRequire = module && module[requireString];
              enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                {
                  if (didWarnAboutMessageChannel === false) {
                    didWarnAboutMessageChannel = true;
                    if (typeof MessageChannel === "undefined") {
                      error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                    }
                  }
                }
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          }
          return enqueueTaskImpl(task);
        }
        var actScopeDepth = 0;
        var didWarnNoAwaitAct = false;
        function act(callback) {
          {
            var prevActScopeDepth = actScopeDepth;
            actScopeDepth++;
            if (ReactCurrentActQueue.current === null) {
              ReactCurrentActQueue.current = [];
            }
            var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
            var result;
            try {
              ReactCurrentActQueue.isBatchingLegacy = true;
              result = callback();
              if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
                var queue = ReactCurrentActQueue.current;
                if (queue !== null) {
                  ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                  flushActQueue(queue);
                }
              }
            } catch (error2) {
              popActScope(prevActScopeDepth);
              throw error2;
            } finally {
              ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            }
            if (result !== null && typeof result === "object" && typeof result.then === "function") {
              var thenableResult = result;
              var wasAwaited = false;
              var thenable = {
                then: function(resolve, reject) {
                  wasAwaited = true;
                  thenableResult.then(function(returnValue2) {
                    popActScope(prevActScopeDepth);
                    if (actScopeDepth === 0) {
                      recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                    } else {
                      resolve(returnValue2);
                    }
                  }, function(error2) {
                    popActScope(prevActScopeDepth);
                    reject(error2);
                  });
                }
              };
              {
                if (!didWarnNoAwaitAct && typeof Promise !== "undefined") {
                  Promise.resolve().then(function() {
                  }).then(function() {
                    if (!wasAwaited) {
                      didWarnNoAwaitAct = true;
                      error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
                    }
                  });
                }
              }
              return thenable;
            } else {
              var returnValue = result;
              popActScope(prevActScopeDepth);
              if (actScopeDepth === 0) {
                var _queue = ReactCurrentActQueue.current;
                if (_queue !== null) {
                  flushActQueue(_queue);
                  ReactCurrentActQueue.current = null;
                }
                var _thenable = {
                  then: function(resolve, reject) {
                    if (ReactCurrentActQueue.current === null) {
                      ReactCurrentActQueue.current = [];
                      recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                    } else {
                      resolve(returnValue);
                    }
                  }
                };
                return _thenable;
              } else {
                var _thenable2 = {
                  then: function(resolve, reject) {
                    resolve(returnValue);
                  }
                };
                return _thenable2;
              }
            }
          }
        }
        function popActScope(prevActScopeDepth) {
          {
            if (prevActScopeDepth !== actScopeDepth - 1) {
              error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
            }
            actScopeDepth = prevActScopeDepth;
          }
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          {
            var queue = ReactCurrentActQueue.current;
            if (queue !== null) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  if (queue.length === 0) {
                    ReactCurrentActQueue.current = null;
                    resolve(returnValue);
                  } else {
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  }
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              resolve(returnValue);
            }
          }
        }
        var isFlushing = false;
        function flushActQueue(queue) {
          {
            if (!isFlushing) {
              isFlushing = true;
              var i = 0;
              try {
                for (; i < queue.length; i++) {
                  var callback = queue[i];
                  do {
                    callback = callback(true);
                  } while (callback !== null);
                }
                queue.length = 0;
              } catch (error2) {
                queue = queue.slice(i + 1);
                throw error2;
              } finally {
                isFlushing = false;
              }
            }
          }
        }
        var createElement$1 = createElementWithValidation;
        var cloneElement$1 = cloneElementWithValidation;
        var createFactory = createFactoryWithValidation;
        var Children = {
          map: mapChildren,
          forEach: forEachChildren,
          count: countChildren,
          toArray,
          only: onlyChild
        };
        exports.Children = Children;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
        exports.act = act;
        exports.cloneElement = cloneElement$1;
        exports.createContext = createContext;
        exports.createElement = createElement$1;
        exports.createFactory = createFactory;
        exports.createRef = createRef;
        exports.forwardRef = forwardRef;
        exports.isValidElement = isValidElement;
        exports.lazy = lazy;
        exports.memo = memo;
        exports.startTransition = startTransition;
        exports.unstable_act = act;
        exports.useCallback = useCallback;
        exports.useContext = useContext;
        exports.useDebugValue = useDebugValue;
        exports.useDeferredValue = useDeferredValue;
        exports.useEffect = useEffect;
        exports.useId = useId;
        exports.useImperativeHandle = useImperativeHandle;
        exports.useInsertionEffect = useInsertionEffect;
        exports.useLayoutEffect = useLayoutEffect;
        exports.useMemo = useMemo;
        exports.useReducer = useReducer;
        exports.useRef = useRef;
        exports.useState = useState;
        exports.useSyncExternalStore = useSyncExternalStore;
        exports.useTransition = useTransition;
        exports.version = ReactVersion;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_react_production_min();
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

// node_modules/zustand/esm/react.mjs
var import_react = __toESM(require_react(), 1);
var identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = import_react.default.useSyncExternalStore(
    api.subscribe,
    import_react.default.useCallback(() => selector(api.getState()), [api, selector]),
    import_react.default.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  import_react.default.useDebugValue(slice);
  return slice;
}
var createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
var create = (createState) => createState ? createImpl(createState) : createImpl;

// src/model/factory.ts
function createDatabaseState() {
  return {
    connections: [],
    tables: [],
    views: [],
    matviews: [],
    functions: [],
    queries: [],
    api: {
      connectionId: "",
      tableIds: [],
      baseUrl: "https://yourdomain.com/api",
      auth: "JWT Authentication",
      format: "JSON",
      version: "v1",
      pagination: true,
      filtering: true,
      relatedData: false
    }
  };
}
var counter = 1;
function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;
}
function createPage(name, title) {
  return {
    id: uid("page"),
    name,
    title: title ?? name,
    templateId: null,
    width: 970,
    height: 1e3,
    backgroundColor: "#ffffff",
    components: [],
    pageCode: "",
    headCode: "",
    bodyStartCode: "",
    bodyEndCode: "",
    cssCode: ""
  };
}
function createProject(name = "Untitled1") {
  return {
    id: uid("proj"),
    name,
    pages: [createPage("index", "Untitled Page")],
    templates: [],
    breakpoints: [
      { id: "bp_tablet", name: "Tablet", maxWidth: 768, direction: "max", orientation: "none", fontSize: null },
      { id: "bp_mobile", name: "Mobile", maxWidth: 480, direction: "max", orientation: "none", fontSize: null }
    ],
    breakpointMode: "smaller",
    database: createDatabaseState()
  };
}
function sortBreakpoints(bps) {
  return [...bps].sort((a, b) => {
    const ad = a.direction ?? "max";
    const bd = b.direction ?? "max";
    if (ad !== bd) return ad === "max" ? -1 : 1;
    return ad === "max" ? b.maxWidth - a.maxWidth : a.maxWidth - b.maxWidth;
  });
}
function breakpointDirection(bp) {
  return bp.direction ?? "max";
}

// src/model/componentDefs.ts
function commonDefaults() {
  return {
    componentName: "",
    // Layout extras
    minWidth: "",
    maxWidth: "",
    minHeight: "",
    maxHeight: "",
    margin: "",
    padding: "",
    position: "absolute",
    zIndex: "",
    overflow: "visible",
    boxSizing: "border-box",
    cursor: "auto",
    // Background / Border
    backgroundColor: "",
    backgroundImage: "",
    backgroundSize: "auto",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "scroll",
    backgroundOpacity: 100,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#000000",
    borderRadius: 0,
    borderTopWidth: "",
    borderRightWidth: "",
    borderBottomWidth: "",
    borderLeftWidth: "",
    borderTopColor: "",
    borderRightColor: "",
    borderBottomColor: "",
    borderLeftColor: "",
    borderTopStyle: "",
    borderRightStyle: "",
    borderBottomStyle: "",
    borderLeftStyle: "",
    borderTopLeftRadius: "",
    borderTopRightRadius: "",
    borderBottomRightRadius: "",
    borderBottomLeftRadius: "",
    outlineWidth: 0,
    outlineStyle: "solid",
    outlineColor: "#000000",
    boxShadow: "",
    // Typography
    fontFamily: "Arial",
    fontSize: 14,
    fontWeight: "normal",
    color: "#000000",
    textAlign: "left",
    lineHeight: "",
    letterSpacing: "",
    wordSpacing: "",
    fontStyle: "normal",
    textDecoration: "none",
    textTransform: "none",
    whiteSpace: "normal",
    // Effects
    opacity: 100,
    filter: "none",
    mixBlendMode: "normal",
    hoverCss: "",
    transition: "",
    animation: "",
    transform: "",
    filterBlur: "",
    filterBrightness: "",
    filterContrast: "",
    filterSaturation: "",
    filterGrayscale: "",
    filterSepia: "",
    filterHue: "",
    textShadowX: "",
    textShadowY: "",
    textShadowBlur: "",
    textShadowColor: "",
    textShadowOpacity: 100,
    boxShadowX: "",
    boxShadowY: "",
    boxShadowBlur: "",
    boxShadowSpread: "",
    boxShadowColor: "",
    boxShadowOpacity: 100,
    boxShadowInset: false,
    // Advanced
    domId: "",
    cssClass: "",
    customAttributes: "",
    ariaLabel: "",
    customCss: "",
    objectBeforeHtml: "",
    objectAfterHtml: "",
    animationPreset: "",
    animationDuration: 1e3,
    animationDelay: 0,
    animationIterationCount: "1",
    animationDirection: "normal",
    animationTimingFunction: "linear",
    animationFillMode: "both",
    animationPlayState: "running",
    animationDefinitions: "",
    animationUseAliases: false,
    transitionTrigger: "hover",
    transitionProperty: "background-color",
    transitionValue: "",
    transitionDuration: 500,
    transitionDelay: 0,
    transitionTimingFunction: "linear"
  };
}
var extra = (key, label, type, group, options) => ({ key, label, type, group, options });
var INPUT_EXTRAS = [
  extra("required", "Required", "checkbox", "Form & Validation"),
  extra("disabled", "Disabled", "checkbox", "Form & Validation"),
  extra("readOnly", "Read Only", "checkbox", "Form & Validation"),
  extra("autocomplete", "Autocomplete", "select", "Form & Validation", ["off", "on", "name", "email", "username", "current-password", "new-password", "tel", "street-address", "postal-code"])
];
var COMPONENT_EXTRA_FIELDS = {
  image: [
    extra("loading", "Loading", "select", "Media", ["lazy", "eager"]),
    extra("decoding", "Decoding", "select", "Media", ["auto", "async", "sync"])
  ],
  button: [
    extra("buttonType", "Button Type", "select", "Behavior", ["button", "submit", "reset"]),
    extra("disabled", "Disabled", "checkbox", "Behavior")
  ],
  form: [
    extra("enctype", "Encoding", "select", "Form & Validation", ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]),
    extra("autocomplete", "Autocomplete", "select", "Form & Validation", ["on", "off"]),
    extra("noValidate", "Disable Browser Validation", "checkbox", "Form & Validation")
  ],
  textInput: [...INPUT_EXTRAS, extra("inputMode", "Input Mode", "select", "Form & Validation", ["text", "search", "email", "tel", "url", "numeric", "decimal", "none"]), extra("pattern", "Validation Pattern", "text", "Form & Validation")],
  password: [...INPUT_EXTRAS, extra("minLength", "Minimum Length", "number", "Form & Validation"), extra("maxLength", "Maximum Length", "number", "Form & Validation")],
  email: [...INPUT_EXTRAS, extra("multiple", "Allow Multiple", "checkbox", "Form & Validation")],
  number: [...INPUT_EXTRAS, extra("step", "Step", "text", "Form & Validation")],
  tel: [...INPUT_EXTRAS, extra("pattern", "Validation Pattern", "text", "Form & Validation")],
  date: [...INPUT_EXTRAS, extra("step", "Step", "text", "Form & Validation")],
  time: [...INPUT_EXTRAS, extra("step", "Step", "text", "Form & Validation")],
  textarea: [...INPUT_EXTRAS, extra("minLength", "Minimum Length", "number", "Form & Validation"), extra("maxLength", "Maximum Length", "number", "Form & Validation"), extra("wrap", "Text Wrapping", "select", "Form & Validation", ["soft", "hard", "off"])],
  select: [extra("required", "Required", "checkbox", "Form & Validation"), extra("disabled", "Disabled", "checkbox", "Form & Validation"), extra("multiple", "Allow Multiple", "checkbox", "Form & Validation")],
  file: [extra("required", "Required", "checkbox", "Form & Validation"), extra("disabled", "Disabled", "checkbox", "Form & Validation"), extra("multiple", "Allow Multiple", "checkbox", "Form & Validation"), extra("capture", "Capture Source", "select", "Form & Validation", ["", "user", "environment"])],
  range: [extra("disabled", "Disabled", "checkbox", "Form & Validation"), extra("step", "Step", "text", "Form & Validation")],
  checkbox: [extra("required", "Required", "checkbox", "Form & Validation"), extra("disabled", "Disabled", "checkbox", "Form & Validation")],
  radio: [extra("required", "Required", "checkbox", "Form & Validation"), extra("disabled", "Disabled", "checkbox", "Form & Validation")],
  video: [extra("poster", "Poster Image", "text", "Media"), extra("preload", "Preload", "select", "Media", ["metadata", "auto", "none"]), extra("muted", "Muted", "checkbox", "Behavior"), extra("loop", "Loop", "checkbox", "Behavior"), extra("playsInline", "Play Inline", "checkbox", "Behavior")],
  audio: [extra("preload", "Preload", "select", "Media", ["metadata", "auto", "none"]), extra("autoplay", "Autoplay", "checkbox", "Behavior"), extra("muted", "Muted", "checkbox", "Behavior"), extra("loop", "Loop", "checkbox", "Behavior")],
  iframe: [extra("loading", "Loading", "select", "Media", ["lazy", "eager"]), extra("allowFullscreen", "Allow Full Screen", "checkbox", "Behavior"), extra("referrerPolicy", "Referrer Policy", "select", "Behavior", ["strict-origin-when-cross-origin", "no-referrer", "origin", "same-origin", "unsafe-url"])]
};
function content(key, label, type = "text", options) {
  return { key, label, type, group: "Content", options };
}
function def(type, label, o) {
  return {
    type,
    label,
    icon: o.icon,
    group: o.group,
    defaultSize: { width: o.w, height: o.h },
    defaultProps: { ...commonDefaults(), ...o.props ?? {} },
    fields: o.fields ?? []
  };
}
var COMPONENT_DEFS = [
  /* ---- Layout ---- */
  def("section", "Section", { icon: "\u25AD", group: "Layout", w: 940, h: 300, props: { backgroundColor: "#f8f9fa" } }),
  def("header", "Header", { icon: "\u2594", group: "Layout", w: 940, h: 120, props: { backgroundColor: "#f8f9fa" } }),
  def("footer", "Footer", { icon: "\u2581", group: "Layout", w: 940, h: 100, props: { backgroundColor: "#f8f9fa" } }),
  def("container", "Container", { icon: "\u25A2", group: "Layout", w: 300, h: 200, props: { backgroundColor: "#f8f9fa", borderWidth: 1, borderColor: "#dee2e6" } }),
  def("row", "Row", { icon: "\u2630", group: "Layout", w: 600, h: 120, props: { gap: 10, backgroundColor: "" }, fields: [content("gap", "Gap (px)", "number")] }),
  def("column", "Column", { icon: "\u25AF", group: "Layout", w: 200, h: 300, props: { gap: 10 }, fields: [content("gap", "Gap (px)", "number")] }),
  def("flex", "Flexbox", {
    icon: "\u2B0C",
    group: "Layout",
    w: 400,
    h: 120,
    props: { direction: "row", gap: 10, justify: "flex-start", alignItems: "center", backgroundColor: "" },
    fields: [
      content("direction", "Direction", "select", ["row", "row-reverse", "column", "column-reverse"]),
      content("gap", "Gap (px)", "number"),
      content("justify", "Justify Content", "select", ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]),
      content("alignItems", "Align Items", "select", ["flex-start", "center", "flex-end", "stretch", "baseline"])
    ]
  }),
  def("grid", "Grid", {
    icon: "\u229E",
    group: "Layout",
    w: 400,
    h: 200,
    props: { columns: 3, gap: 10, backgroundColor: "" },
    fields: [content("columns", "Columns", "number"), content("gap", "Gap (px)", "number")]
  }),
  def("card", "Card", {
    icon: "\u{1F0CF}",
    group: "Layout",
    w: 280,
    h: 320,
    props: { title: "Card title", text: "Card body text", imageSrc: "", backgroundColor: "#ffffff", borderRadius: 8, borderWidth: 1, borderColor: "#dee2e6", boxShadow: "0 2px 8px rgba(0,0,0,.08)", padding: "16px" },
    fields: [content("title", "Title"), content("text", "Text", "textarea"), content("imageSrc", "Image URL")]
  }),
  def("panel", "Panel", {
    icon: "\u25A4",
    group: "Layout",
    w: 320,
    h: 200,
    props: { title: "Panel", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 4 },
    fields: [content("title", "Title")]
  }),
  def("group", "Group", { icon: "\u29C9", group: "Layout", w: 300, h: 200, props: { borderWidth: 1, borderColor: "#adb5bd", borderStyle: "dashed" } }),
  def("spacer", "Spacer", { icon: "\u2195", group: "Layout", w: 80, h: 40 }),
  /* ---- Basic ---- */
  def("text", "Text", { icon: "T", group: "Basic", w: 250, h: 60, props: { text: "Double-click to edit text" }, fields: [content("text", "Text", "textarea")] }),
  def("heading", "Heading", {
    icon: "H1",
    group: "Basic",
    w: 300,
    h: 50,
    props: { text: "Heading", level: "h1", fontSize: 32, fontWeight: "bold" },
    fields: [content("text", "Text"), content("level", "Level", "select", ["h1", "h2", "h3", "h4", "h5", "h6"])]
  }),
  def("paragraph", "Paragraph", { icon: "\xB6", group: "Basic", w: 400, h: 120, props: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", lineHeight: "1.6" }, fields: [content("text", "Text", "textarea")] }),
  def("image", "Image", {
    icon: "\u{1F5BC}",
    group: "Basic",
    w: 200,
    h: 150,
    props: { src: "", alt: "image", objectFit: "cover", backgroundColor: "#e9ecef" },
    fields: [content("src", "Image URL"), content("alt", "Alt Text"), content("objectFit", "Fit", "select", ["cover", "contain", "fill", "none"])]
  }),
  def("button", "Button", {
    icon: "Btn",
    group: "Basic",
    w: 120,
    h: 36,
    props: { text: "Button", href: "", target: "_self", color: "#ffffff", backgroundColor: "#0d6efd", borderRadius: 4, textAlign: "center", fontWeight: "600" },
    fields: [content("text", "Text"), content("href", "Link URL"), content("target", "Target", "select", ["_self", "_blank"])]
  }),
  def("link", "Link", {
    icon: "\u{1F517}",
    group: "Basic",
    w: 150,
    h: 24,
    props: { text: "Link", href: "https://", target: "_self", color: "#0d6efd" },
    fields: [content("text", "Text"), content("href", "URL"), content("target", "Target", "select", ["_self", "_blank"])]
  }),
  def("icon", "Icon", {
    icon: "\u2605",
    group: "Basic",
    w: 48,
    h: 48,
    props: { glyph: "\u2605", fontSize: 32, textAlign: "center" },
    fields: [content("glyph", "Glyph (emoji/char)")]
  }),
  def("divider", "Divider", { icon: "\u2015", group: "Basic", w: 400, h: 10, props: { lineThickness: 1 }, fields: [content("lineThickness", "Thickness", "number")] }),
  def("rectangle", "Rectangle", { icon: "\u25AD", group: "Basic", w: 200, h: 120, props: { backgroundColor: "#e9ecef", borderWidth: 1, borderColor: "#adb5bd" } }),
  def("roundedRectangle", "Rounded Rectangle", { icon: "\u25A2", group: "Basic", w: 200, h: 120, props: { backgroundColor: "#e9ecef", borderWidth: 1, borderColor: "#adb5bd", borderRadius: 12 } }),
  def("ellipse", "Ellipse", { icon: "\u25EF", group: "Basic", w: 160, h: 160, props: { backgroundColor: "#e9ecef", borderWidth: 1, borderColor: "#adb5bd", borderRadius: 9999 } }),
  def("list", "List", { icon: "\u2630", group: "Basic", w: 240, h: 120, props: { items: "Item 1\nItem 2\nItem 3", lineHeight: "1.8" }, fields: [content("items", "Items (one per line)", "textarea")] }),
  def("htmlEmbed", "HTML", { icon: "</>", group: "Advanced", w: 300, h: 200, props: { html: "<div>Custom HTML</div>" }, fields: [content("html", "HTML Code", "textarea")] }),
  /* ---- Forms ---- */
  def("form", "Form", {
    icon: "\u{1F4DD}",
    group: "Forms",
    w: 360,
    h: 300,
    props: { action: "", method: "post", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", padding: "16px" },
    fields: [content("action", "Action URL"), content("method", "Method", "select", ["post", "get"])]
  }),
  def("textInput", "Text Input", { icon: "\u270E", group: "Forms", w: 220, h: 34, props: { name: "text1", placeholder: "Type here...", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder")] }),
  def("password", "Password", { icon: "\u{1F512}", group: "Forms", w: 220, h: 34, props: { name: "password1", placeholder: "Password", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder")] }),
  def("email", "Email", { icon: "\u2709", group: "Forms", w: 220, h: 34, props: { name: "email1", placeholder: "email@example.com", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder")] }),
  def("number", "Number", { icon: "#", group: "Forms", w: 140, h: 34, props: { name: "number1", placeholder: "0", min: "", max: "", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder"), content("min", "Min", "number"), content("max", "Max", "number")] }),
  def("tel", "Telephone", { icon: "\u260E", group: "Forms", w: 220, h: 34, props: { name: "tel1", placeholder: "+1 555 000 0000", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder")] }),
  def("textarea", "Text Area", { icon: "\u25A4", group: "Forms", w: 260, h: 100, props: { name: "textarea1", placeholder: "", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("placeholder", "Placeholder")] }),
  def("checkbox", "Checkbox", { icon: "\u2611", group: "Forms", w: 160, h: 26, props: { label: "Checkbox", name: "check1", checked: false }, fields: [content("label", "Label"), content("name", "Name"), content("checked", "Checked", "checkbox")] }),
  def("radio", "Radio", { icon: "\u25C9", group: "Forms", w: 160, h: 26, props: { label: "Radio", name: "radio1", checked: false }, fields: [content("label", "Label"), content("name", "Group Name"), content("checked", "Checked", "checkbox")] }),
  def("select", "Select", { icon: "\u25BE", group: "Forms", w: 220, h: 34, props: { name: "select1", options: "Option 1\nOption 2\nOption 3", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name"), content("options", "Options (one per line)", "textarea")] }),
  def("date", "Date Picker", { icon: "\u{1F4C5}", group: "Forms", w: 180, h: 34, props: { name: "date1", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name")] }),
  def("time", "Time Picker", { icon: "\u{1F550}", group: "Forms", w: 150, h: 34, props: { name: "time1", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("name", "Name")] }),
  def("file", "File Upload", { icon: "\u{1F4CE}", group: "Forms", w: 260, h: 34, props: { name: "file1", accept: "", backgroundColor: "#ffffff" }, fields: [content("name", "Name"), content("accept", "Accept (e.g. image/*)")] }),
  def("range", "Range Slider", { icon: "\u{1F39A}", group: "Forms", w: 220, h: 30, props: { name: "range1", min: 0, max: 100, value: 50 }, fields: [content("name", "Name"), content("min", "Min", "number"), content("max", "Max", "number"), content("value", "Value", "number")] }),
  def("submit", "Submit Button", { icon: "\u27A4", group: "Forms", w: 120, h: 36, props: { text: "Submit", color: "#ffffff", backgroundColor: "#198754", borderRadius: 4, textAlign: "center", fontWeight: "600" }, fields: [content("text", "Text")] }),
  def("reset", "Reset Button", { icon: "\u21BA", group: "Forms", w: 120, h: 36, props: { text: "Reset", backgroundColor: "#e9ecef", borderRadius: 4, textAlign: "center" }, fields: [content("text", "Text")] }),
  def("hiddenField", "Hidden Field", { icon: "\u{1FAE5}", group: "Forms", w: 120, h: 26, props: { name: "hidden1", value: "" }, fields: [content("name", "Name"), content("value", "Value")] }),
  /* ---- Navigation ---- */
  def("navbar", "Navbar", {
    icon: "\u{1F9ED}",
    group: "Navigation",
    w: 940,
    h: 56,
    props: { brand: "Brand", links: "Home|/\nAbout|/about\nContact|/contact", backgroundColor: "#212529", color: "#ffffff", padding: "0 20px" },
    fields: [content("brand", "Brand"), content("links", "Links (Label|URL per line)", "textarea")]
  }),
  def("menubar", "Menu Bar", {
    icon: "\u2630",
    group: "Navigation",
    w: 500,
    h: 40,
    props: { items: "File\nEdit\nView\nHelp", backgroundColor: "#f8f9fa", borderWidth: 1, borderColor: "#dee2e6" },
    fields: [content("items", "Items (one per line)", "textarea")]
  }),
  def("hamburger", "Hamburger Menu", {
    icon: "\u2261",
    group: "Navigation",
    w: 48,
    h: 44,
    props: { links: "Home|/\nAbout|/about", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4, fontSize: 20, textAlign: "center" },
    fields: [content("links", "Links (Label|URL per line)", "textarea")]
  }),
  def("dropdown", "Dropdown Menu", {
    icon: "\u23F7",
    group: "Navigation",
    w: 180,
    h: 38,
    props: { label: "Menu", items: "Action|#\nAnother action|#\nSomething else|#", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 },
    fields: [content("label", "Label"), content("items", "Items (Label|URL per line)", "textarea")]
  }),
  def("sidebar", "Sidebar Menu", {
    icon: "\u258C",
    group: "Navigation",
    w: 240,
    h: 500,
    props: { title: "Menu", links: "Dashboard|#\nReports|#\nSettings|#", backgroundColor: "#343a40", color: "#ffffff", padding: "16px" },
    fields: [content("title", "Title"), content("links", "Links (Label|URL per line)", "textarea")]
  }),
  def("breadcrumb", "Breadcrumb", {
    icon: "\u203A",
    group: "Navigation",
    w: 300,
    h: 30,
    props: { items: "Home|/\nProducts|/products\nCurrent", separator: "/" },
    fields: [content("items", "Items (Label|URL per line, last = current)", "textarea"), content("separator", "Separator")]
  }),
  def("pagination", "Pagination", {
    icon: "\u276E\u276F",
    group: "Navigation",
    w: 260,
    h: 38,
    props: { pages: 5, current: 1 },
    fields: [content("pages", "Page Count", "number"), content("current", "Current Page", "number")]
  }),
  def("tabs", "Tabs", {
    icon: "\u29C9",
    group: "Navigation",
    w: 420,
    h: 44,
    props: { tabs: "Tab 1\nTab 2\nTab 3", active: 0, backgroundColor: "#f8f9fa", borderColor: "#dee2e6" },
    fields: [content("tabs", "Tabs (one per line)", "textarea"), content("active", "Active Index", "number")]
  }),
  /* ---- Media ---- */
  def("video", "Video", { icon: "\u25B6", group: "Media", w: 320, h: 180, props: { src: "", controls: true, autoplay: false, backgroundColor: "#000000" }, fields: [content("src", "Video URL"), content("controls", "Show Controls", "checkbox"), content("autoplay", "Autoplay", "checkbox")] }),
  def("audio", "Audio", { icon: "\u266B", group: "Media", w: 300, h: 54, props: { src: "", controls: true, backgroundColor: "#f1f3f5" }, fields: [content("src", "Audio URL"), content("controls", "Show Controls", "checkbox")] }),
  def("youtube", "YouTube", { icon: "\u25B6", group: "Media", w: 320, h: 180, props: { videoId: "dQw4w9WgXcQ", backgroundColor: "#000000" }, fields: [content("videoId", "Video ID")] }),
  def("gallery", "Image Gallery", { icon: "\u{1F3DE}", group: "Media", w: 420, h: 260, props: { images: "", columns: 3, gap: 8, backgroundColor: "#f8f9fa" }, fields: [content("images", "Image URLs (one per line)", "textarea"), content("columns", "Columns", "number"), content("gap", "Gap (px)", "number")] }),
  def("slideshow", "Slideshow", { icon: "\u{1F39E}", group: "Media", w: 400, h: 240, props: { images: "", interval: 3e3, backgroundColor: "#000000" }, fields: [content("images", "Image URLs (one per line)", "textarea"), content("interval", "Interval (ms)", "number")] }),
  def("carousel", "Carousel", { icon: "\u{1F3A0}", group: "Media", w: 500, h: 200, props: { images: "", visible: 3, gap: 10, backgroundColor: "#f8f9fa" }, fields: [content("images", "Image URLs (one per line)", "textarea"), content("visible", "Visible Slides", "number"), content("gap", "Gap (px)", "number")] }),
  def("lightbox", "Lightbox", { icon: "\u{1F50D}", group: "Media", w: 200, h: 150, props: { src: "", caption: "", backgroundColor: "#e9ecef" }, fields: [content("src", "Image URL"), content("caption", "Caption")] }),
  /* ---- Advanced ---- */
  def("accordion", "Accordion", {
    icon: "\u{1FA97}",
    group: "Advanced",
    w: 400,
    h: 220,
    props: { items: "Section 1|Content for section 1\nSection 2|Content for section 2\nSection 3|Content for section 3", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 4 },
    fields: [content("items", "Items (Title|Content per line)", "textarea")]
  }),
  def("modal", "Modal / Popup", {
    icon: "\u{1F5D4}",
    group: "Advanced",
    w: 400,
    h: 220,
    props: { title: "Modal title", text: "Modal content", open: true, backgroundColor: "#ffffff", borderRadius: 8, boxShadow: "0 8px 30px rgba(0,0,0,.2)" },
    fields: [content("title", "Title"), content("text", "Content", "textarea"), content("open", "Open by default", "checkbox")]
  }),
  def("tooltip", "Tooltip", { icon: "\u{1F4AC}", group: "Advanced", w: 180, h: 28, props: { text: "Hover me", tip: "Tooltip text" }, fields: [content("text", "Text"), content("tip", "Tooltip Text")] }),
  def("progress", "Progress Bar", { icon: "\u25B0", group: "Advanced", w: 300, h: 22, props: { value: 60, max: 100, barColor: "#0d6efd", backgroundColor: "#e9ecef", borderRadius: 4 }, fields: [content("value", "Value", "number"), content("max", "Max", "number"), { ...content("barColor", "Bar Color", "color") }] }),
  def("counter", "Counter", { icon: "\u{1F522}", group: "Advanced", w: 140, h: 60, props: { from: 0, to: 100, duration: 2e3, fontSize: 32, fontWeight: "bold", textAlign: "center" }, fields: [content("from", "From", "number"), content("to", "To", "number"), content("duration", "Duration (ms)", "number")] }),
  def("rating", "Rating", { icon: "\u2605", group: "Advanced", w: 160, h: 32, props: { value: 4, max: 5, starColor: "#ffc107", fontSize: 22 }, fields: [content("value", "Value", "number"), content("max", "Stars", "number"), { ...content("starColor", "Star Color", "color") }] }),
  def("badge", "Badge", { icon: "\u{1F3F7}", group: "Advanced", w: 80, h: 26, props: { text: "New", color: "#ffffff", backgroundColor: "#dc3545", borderRadius: 12, fontSize: 12, textAlign: "center" }, fields: [content("text", "Text")] }),
  def("alert", "Alert", {
    icon: "\u26A0",
    group: "Advanced",
    w: 400,
    h: 50,
    props: { text: "This is an alert message.", kind: "info", padding: "12px 16px", borderRadius: 4 },
    fields: [content("text", "Text", "textarea"), content("kind", "Kind", "select", ["info", "success", "warning", "error"])]
  }),
  def("timeline", "Timeline", { icon: "\u{1F553}", group: "Advanced", w: 320, h: 300, props: { items: "2021|Founded\n2022|Launched v1\n2023|10k users" }, fields: [content("items", "Items (Date|Text per line)", "textarea")] }),
  /* ---- Data ---- */
  def("table", "Table", { icon: "\u229E", group: "Data", w: 360, h: 160, props: { rows: 3, columns: 3, headerRow: true, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("rows", "Rows", "number"), content("columns", "Columns", "number"), content("headerRow", "Header Row", "checkbox")] }),
  def("datagrid", "Data Grid", { icon: "\u25A6", group: "Data", w: 480, h: 240, props: { apiUrl: "", columns: "ID\nName\nEmail", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("apiUrl", "Data API URL (JSON array)"), content("columns", "Columns (one per line)", "textarea")] }),
  def("repeater", "Repeater / List", { icon: "\u{1F501}", group: "Data", w: 320, h: 200, props: { apiUrl: "", itemTemplate: "<div>{{name}}</div>", gap: 8 }, fields: [content("apiUrl", "Data API URL (JSON array)"), content("itemTemplate", "Item Template ({{field}})", "textarea"), content("gap", "Gap (px)", "number")] }),
  def("treeview", "Tree View", { icon: "\u{1F332}", group: "Data", w: 240, h: 220, props: { items: "Root\n  Child A\n  Child B\n    Grandchild" }, fields: [content("items", "Items (indent with 2 spaces)", "textarea")] }),
  def("searchbox", "Search Box", { icon: "\u{1F50E}", group: "Data", w: 280, h: 38, props: { placeholder: "Search...", action: "", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("placeholder", "Placeholder"), content("action", "Search URL (action)")] }),
  /* ---- Social ---- */
  def("socialicons", "Social Icons", { icon: "\u{1F310}", group: "Social", w: 220, h: 44, props: { networks: "facebook\nx\ninstagram\nlinkedin", size: 36, gap: 8 }, fields: [content("networks", "Networks (one per line)", "textarea"), content("size", "Icon Size (px)", "number"), content("gap", "Gap (px)", "number")] }),
  def("sharebuttons", "Share Buttons", { icon: "\u2197", group: "Social", w: 300, h: 38, props: { networks: "facebook\nx\nwhatsapp\nlinkedin", gap: 8 }, fields: [content("networks", "Networks (one per line)", "textarea"), content("gap", "Gap (px)", "number")] }),
  def("whatsapp", "WhatsApp Button", { icon: "\u{1F4AC}", group: "Social", w: 200, h: 44, props: { phone: "", message: "Hello!", color: "#ffffff", backgroundColor: "#25d366", borderRadius: 6, textAlign: "center", fontWeight: "600" }, fields: [content("phone", "Phone (international)"), content("message", "Prefilled Message")] }),
  def("facebook", "Facebook Embed", { icon: "f", group: "Social", w: 340, h: 400, props: { pageUrl: "", backgroundColor: "#e9ecef" }, fields: [content("pageUrl", "Page URL")] }),
  def("xembed", "X / Twitter Embed", { icon: "\u{1D54F}", group: "Social", w: 340, h: 400, props: { tweetUrl: "", backgroundColor: "#e9ecef" }, fields: [content("tweetUrl", "Post URL")] }),
  /* ---- Maps ---- */
  def("map", "Map", { icon: "\u{1F5FA}", group: "Maps", w: 400, h: 300, props: { address: "London", zoom: 12, provider: "osm", backgroundColor: "#e9ecef" }, fields: [content("address", "Address / Query"), content("zoom", "Zoom", "number"), content("provider", "Provider", "select", ["osm", "google"])] }),
  def("marker", "Location Marker", { icon: "\u{1F4CD}", group: "Maps", w: 40, h: 50, props: { label: "", markerColor: "#dc3545" }, fields: [content("label", "Label"), { ...content("markerColor", "Color", "color") }] }),
  /* ---- Code ---- */
  def("html", "HTML", { icon: "</>", group: "Code", w: 300, h: 200, props: { html: "<div>Custom HTML</div>" }, fields: [content("html", "HTML Code", "textarea")] }),
  def("css", "CSS", { icon: "\u{1F3A8}", group: "Code", w: 200, h: 60, props: { code: "/* custom css */" }, fields: [content("code", "CSS Code", "textarea")] }),
  def("javascript", "JavaScript", { icon: "JS", group: "Code", w: 200, h: 60, props: { code: "// custom js" }, fields: [content("code", "JavaScript Code", "textarea")] }),
  def("iframe", "iFrame", { icon: "\u{1FA9F}", group: "Code", w: 400, h: 300, props: { src: "https://example.com", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("src", "URL")] }),
  /* ---- Special ---- */
  def("qrcode", "QR Code", { icon: "\u25A6", group: "Special", w: 128, h: 128, props: { data: "https://example.com", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("data", "Data / URL")] }),
  def("countdown", "Countdown Timer", { icon: "\u23F3", group: "Special", w: 320, h: 70, props: { targetDate: "2027-01-01T00:00", format: "dd : hh : mm : ss", fontSize: 24, fontWeight: "bold", textAlign: "center" }, fields: [content("targetDate", "Target Date/Time (ISO)"), content("format", "Format")] }),
  def("calendar", "Calendar", { icon: "\u{1F4C6}", group: "Special", w: 280, h: 280, props: { month: 0, year: 0, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("month", "Month (1-12, 0 = current)", "number"), content("year", "Year (0 = current)", "number")] }),
  def("captcha", "CAPTCHA", { icon: "\u{1F916}", group: "Special", w: 300, h: 70, props: { provider: "recaptcha", siteKey: "", backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#d3d3d3" }, fields: [content("provider", "Provider", "select", ["recaptcha", "hcaptcha"]), content("siteKey", "Site Key")] }),
  def("cookieconsent", "Cookie Consent", { icon: "\u{1F36A}", group: "Special", w: 940, h: 60, props: { message: "This website uses cookies to ensure you get the best experience.", buttonText: "Accept", backgroundColor: "#212529", color: "#ffffff", padding: "12px 20px" }, fields: [content("message", "Message"), content("buttonText", "Button Text")] }),
  /* ---- User (Database) ---- */
  def("login", "Login", { icon: "\u{1F511}", group: "User", w: 300, h: 260, props: { apiUrl: "/api/login", redirect: "/", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 8, padding: "24px" }, fields: [content("apiUrl", "Login API URL"), content("redirect", "Redirect after login")] }),
  def("register", "Register", { icon: "\u{1F4CB}", group: "User", w: 300, h: 320, props: { apiUrl: "/api/register", redirect: "/login.html", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 8, padding: "24px" }, fields: [content("apiUrl", "Register API URL"), content("redirect", "Redirect after register")] }),
  def("logout", "Logout", { icon: "\u{1F6AA}", group: "User", w: 120, h: 36, props: { text: "Logout", apiUrl: "/api/logout", redirect: "/", color: "#ffffff", backgroundColor: "#6c757d", borderRadius: 4, textAlign: "center" }, fields: [content("text", "Text"), content("apiUrl", "Logout API URL"), content("redirect", "Redirect after logout")] }),
  def("profile", "User Profile", { icon: "\u{1F464}", group: "User", w: 280, h: 90, props: { name: "User Name", email: "user@example.com", avatarUrl: "", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 8, padding: "12px" }, fields: [content("name", "Name"), content("email", "Email"), content("avatarUrl", "Avatar URL")] }),
  def("dbform", "Database Form", { icon: "\u{1F5C2}", group: "User", w: 340, h: 320, props: { apiUrl: "/api/submit", method: "POST", fields: "name|text|Name\nemail|email|Email\nmessage|textarea|Message", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", padding: "16px" }, fields: [content("apiUrl", "Submit API URL"), content("method", "Method", "select", ["POST", "PUT", "PATCH"]), content("fields", "Fields (name|type|label per line)", "textarea")] }),
  def("dbtable", "Database Table", { icon: "\u{1F5C3}", group: "User", w: 480, h: 240, props: { apiUrl: "/api/items", columns: "id\nname\nemail", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6" }, fields: [content("apiUrl", "Data API URL (JSON array)"), content("columns", "Columns (field names, one per line)", "textarea")] }),
  def("searchresults", "Search Results", { icon: "\u{1F50D}", group: "User", w: 400, h: 300, props: { apiUrl: "/api/search", param: "q", backgroundColor: "#ffffff" }, fields: [content("apiUrl", "Search API URL"), content("param", "Query Param Name")] }),
  /* ---- E-Commerce ---- */
  def("productcard", "Product Card", { icon: "\u{1F6CD}", group: "E-Commerce", w: 260, h: 360, props: { title: "Product Name", price: "49.99", currency: "$", imageSrc: "", buttonText: "Add to Cart", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }, fields: [content("title", "Title"), content("price", "Price"), content("currency", "Currency"), content("imageSrc", "Image URL"), content("buttonText", "Button Text")] }),
  def("productgrid", "Product Grid", { icon: "\u{1F3EC}", group: "E-Commerce", w: 640, h: 400, props: { apiUrl: "", columns: 3, gap: 16, backgroundColor: "" }, fields: [content("apiUrl", "Products API URL (JSON array)"), content("columns", "Columns", "number"), content("gap", "Gap (px)", "number")] }),
  def("price", "Price", { icon: "\u{1F4B2}", group: "E-Commerce", w: 120, h: 40, props: { amount: "49.99", currency: "$", fontSize: 24, fontWeight: "bold" }, fields: [content("amount", "Amount"), content("currency", "Currency")] }),
  def("quantity", "Quantity Selector", { icon: "\xB1", group: "E-Commerce", w: 130, h: 36, props: { min: 1, max: 99, value: 1, backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#ced4da", borderRadius: 4 }, fields: [content("min", "Min", "number"), content("max", "Max", "number"), content("value", "Default", "number")] }),
  def("addtocart", "Add to Cart", { icon: "\u{1F6D2}", group: "E-Commerce", w: 150, h: 40, props: { text: "Add to Cart", productId: "", color: "#ffffff", backgroundColor: "#0d6efd", borderRadius: 4, textAlign: "center", fontWeight: "600" }, fields: [content("text", "Text"), content("productId", "Product ID")] }),
  def("cart", "Shopping Cart", { icon: "\u{1F6D2}", group: "E-Commerce", w: 200, h: 44, props: { text: "Cart", checkoutUrl: "/checkout.html", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#dee2e6", borderRadius: 4, textAlign: "center" }, fields: [content("text", "Text"), content("checkoutUrl", "Checkout URL")] }),
  def("checkout", "Checkout Button", { icon: "\u{1F4B3}", group: "E-Commerce", w: 180, h: 44, props: { text: "Checkout", url: "/checkout.html", color: "#ffffff", backgroundColor: "#198754", borderRadius: 4, textAlign: "center", fontWeight: "600" }, fields: [content("text", "Text"), content("url", "Checkout URL")] })
];
var COMPONENT_MAP = Object.fromEntries(
  COMPONENT_DEFS.map((d) => [d.type, d])
);

// src/model/responsive.ts
function bpDirection(bp) {
  return bp.direction ?? "max";
}
function governingBreakpointId(c, breakpoints, targetId) {
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return null;
  const direction = bpDirection(target);
  let best = null;
  for (const b of breakpoints) {
    if (bpDirection(b) !== direction) continue;
    if (direction === "max" && b.maxWidth < target.maxWidth) continue;
    if (direction === "min" && b.maxWidth > target.maxWidth) continue;
    if (!c.overrides[b.id]) continue;
    if (!best) best = b;
    else if (direction === "max" && b.maxWidth < best.maxWidth) best = b;
    else if (direction === "min" && b.maxWidth > best.maxWidth) best = b;
  }
  return best ? best.id : null;
}
function resolveComponent(c, breakpoints, targetId, baseWidth) {
  if (!targetId) return c;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return c;
  const gid = governingBreakpointId(c, breakpoints, targetId);
  const sourceWidth = gid ? breakpoints.find((b) => b.id === gid)?.maxWidth ?? target.maxWidth : baseWidth || target.maxWidth;
  const scale = sourceWidth > 0 ? target.maxWidth / sourceWidth : 1;
  if (!gid) {
    return {
      ...c,
      x: Math.round(c.x * scale),
      y: Math.round(c.y * scale),
      width: Math.round(c.width * scale),
      height: Math.round(c.height * scale)
    };
  }
  const ov = c.overrides[gid];
  const x = ov.x ?? c.x;
  const y = ov.y ?? c.y;
  const width = ov.width ?? c.width;
  const height = ov.height ?? c.height;
  return {
    ...c,
    x: Math.round(x * scale),
    y: Math.round(y * scale),
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    props: { ...c.props, ...ov.props ?? {} }
  };
}
function responsiveBaseWidth(page) {
  return Math.max(
    page.width,
    ...page.components.filter((c) => !c.hidden).map((c) => Math.max(0, c.x + c.width))
  );
}
function resolveComponentHidden(c, breakpoints, targetId) {
  if (c.hidden) return true;
  if (!targetId) return false;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return false;
  const direction = bpDirection(target);
  let best = null;
  for (const b of breakpoints) {
    if (bpDirection(b) !== direction) continue;
    if (direction === "max" && b.maxWidth < target.maxWidth) continue;
    if (direction === "min" && b.maxWidth > target.maxWidth) continue;
    if (!c.overrides[b.id] && !(c.hiddenIn ?? []).includes(b.id)) continue;
    if (!best) best = b;
    else if (direction === "max" && b.maxWidth < best.maxWidth) best = b;
    else if (direction === "min" && b.maxWidth > best.maxWidth) best = b;
  }
  if (!best) return false;
  const ov = c.overrides[best.id];
  if (ov && typeof ov.hidden === "boolean") return ov.hidden;
  return (c.hiddenIn ?? []).includes(best.id);
}
function snapshotOverride(r, hidden = false) {
  return { x: r.x, y: r.y, width: r.width, height: r.height, hidden, props: { ...r.props } };
}

// src/model/transform.ts
var ROTATE_RE = /^rotate\(\s*(-?[\d.]+)deg\s*\)$/;
var FLIP_H_RE = /^scaleX\(\s*-1\s*\)$/;
var FLIP_V_RE = /^scaleY\(\s*-1\s*\)$/;
function readTransform(transform) {
  const state = { rotate: 0, flipH: false, flipV: false, other: [] };
  if (typeof transform !== "string" || !transform.trim()) return state;
  for (const token of transform.trim().split(/\s+(?=[a-z])/i)) {
    const t = token.trim();
    if (!t) continue;
    const rot = ROTATE_RE.exec(t);
    if (rot) {
      state.rotate = (Number(rot[1]) % 360 + 360) % 360;
    } else if (FLIP_H_RE.test(t)) {
      state.flipH = true;
    } else if (FLIP_V_RE.test(t)) {
      state.flipV = true;
    } else {
      state.other.push(t);
    }
  }
  return state;
}
function buildTransform(state) {
  const parts = [];
  const rot = (Math.round(state.rotate) % 360 + 360) % 360;
  if (rot !== 0) parts.push(`rotate(${rot}deg)`);
  if (state.flipH) parts.push("scaleX(-1)");
  if (state.flipV) parts.push("scaleY(-1)");
  parts.push(...state.other);
  return parts.join(" ");
}
function transformPatch(current, mutate) {
  const state = readTransform(current);
  mutate(state);
  return { transform: buildTransform(state) };
}

// src/model/styleFromProps.ts
function pxish(v) {
  if (v === void 0 || v === null || v === "") return "0px";
  const s = String(v).trim();
  if (s === "0") return "0px";
  return isNaN(Number(s)) ? s : `${s}px`;
}
function pct(v) {
  const s = String(v).trim();
  return s.endsWith("%") ? s : `${s}%`;
}
function deg(v) {
  const s = String(v).trim();
  return s.endsWith("deg") ? s : `${s}deg`;
}
function hexToRgba(hex, alpha) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}
function styleFromProps(props) {
  const css = {};
  const num = (v) => v === void 0 || v === null || v === "" ? void 0 : Number(v);
  const str = (v) => v === void 0 || v === null || v === "" ? void 0 : String(v);
  const fontSize = num(props.fontSize);
  if (fontSize) css["font-size"] = `${fontSize}px`;
  if (str(props.fontFamily)) css["font-family"] = String(props.fontFamily);
  if (str(props.fontWeight)) css["font-weight"] = String(props.fontWeight);
  if (str(props.textAlign)) css["text-align"] = String(props.textAlign);
  if (str(props.color)) css["color"] = String(props.color);
  if (str(props.lineHeight)) css["line-height"] = String(props.lineHeight);
  if (str(props.letterSpacing)) css["letter-spacing"] = String(props.letterSpacing);
  if (str(props.wordSpacing)) css["word-spacing"] = String(props.wordSpacing);
  if (str(props.fontStyle) && props.fontStyle !== "normal") css["font-style"] = String(props.fontStyle);
  if (str(props.textDecoration) && props.textDecoration !== "none") css["text-decoration"] = String(props.textDecoration);
  if (str(props.textDecorationColor)) css["text-decoration-color"] = String(props.textDecorationColor);
  if (str(props.textDecorationStyle)) css["text-decoration-style"] = String(props.textDecorationStyle);
  if (str(props.textTransform) && props.textTransform !== "none") css["text-transform"] = String(props.textTransform);
  if (str(props.whiteSpace) && props.whiteSpace !== "normal") css["white-space"] = String(props.whiteSpace);
  if (str(props.wordBreak)) css["word-break"] = String(props.wordBreak);
  if (str(props.overflowWrap)) css["overflow-wrap"] = String(props.overflowWrap);
  if (str(props.textOverflow)) css["text-overflow"] = String(props.textOverflow);
  if (str(props.textIndent)) css["text-indent"] = String(props.textIndent);
  if (str(props.direction)) css["direction"] = String(props.direction);
  const bgOpacity = num(props.backgroundOpacity);
  const bgColor = str(props.backgroundColor);
  if (bgColor) {
    if (bgOpacity !== void 0 && bgOpacity < 100 && bgOpacity >= 0) {
      css["background-color"] = hexToRgba(bgColor, bgOpacity / 100);
    } else {
      css["background-color"] = bgColor;
    }
  }
  if (str(props.backgroundImage)) css["background-image"] = String(props.backgroundImage);
  if (str(props.backgroundSize) && props.backgroundSize !== "auto") css["background-size"] = String(props.backgroundSize);
  if (str(props.backgroundPosition)) css["background-position"] = String(props.backgroundPosition);
  if (str(props.backgroundRepeat)) css["background-repeat"] = String(props.backgroundRepeat);
  if (str(props.backgroundAttachment) && props.backgroundAttachment !== "scroll") css["background-attachment"] = String(props.backgroundAttachment);
  const bw = num(props.borderWidth);
  if (bw) {
    css["border-style"] = str(props.borderStyle) ?? "solid";
    css["border-width"] = `${bw}px`;
    if (str(props.borderColor)) css["border-color"] = String(props.borderColor);
  }
  const br = num(props.borderRadius);
  if (br) css["border-radius"] = `${br}px`;
  const side = (key, prop) => {
    if (str(props[key])) css[prop + "-width"] = pxish(props[key]);
  };
  side("borderTopWidth", "border-top");
  side("borderRightWidth", "border-right");
  side("borderBottomWidth", "border-bottom");
  side("borderLeftWidth", "border-left");
  if (str(props.borderTopStyle)) css["border-top-style"] = String(props.borderTopStyle);
  if (str(props.borderRightStyle)) css["border-right-style"] = String(props.borderRightStyle);
  if (str(props.borderBottomStyle)) css["border-bottom-style"] = String(props.borderBottomStyle);
  if (str(props.borderLeftStyle)) css["border-left-style"] = String(props.borderLeftStyle);
  if (str(props.borderTopColor)) css["border-top-color"] = String(props.borderTopColor);
  if (str(props.borderRightColor)) css["border-right-color"] = String(props.borderRightColor);
  if (str(props.borderBottomColor)) css["border-bottom-color"] = String(props.borderBottomColor);
  if (str(props.borderLeftColor)) css["border-left-color"] = String(props.borderLeftColor);
  if (str(props.borderTopLeftRadius)) css["border-top-left-radius"] = pxish(props.borderTopLeftRadius);
  if (str(props.borderTopRightRadius)) css["border-top-right-radius"] = pxish(props.borderTopRightRadius);
  if (str(props.borderBottomRightRadius)) css["border-bottom-right-radius"] = pxish(props.borderBottomRightRadius);
  if (str(props.borderBottomLeftRadius)) css["border-bottom-left-radius"] = pxish(props.borderBottomLeftRadius);
  const ow = num(props.outlineWidth);
  if (ow) {
    css["outline-width"] = `${ow}px`;
    css["outline-style"] = str(props.outlineStyle) ?? "solid";
    if (str(props.outlineColor)) css["outline-color"] = String(props.outlineColor);
  }
  if (str(props.minWidth)) css["min-width"] = String(props.minWidth);
  if (str(props.maxWidth)) css["max-width"] = String(props.maxWidth);
  if (str(props.minHeight)) css["min-height"] = String(props.minHeight);
  if (str(props.maxHeight)) css["max-height"] = String(props.maxHeight);
  if (str(props.margin)) css["margin"] = String(props.margin);
  if (str(props.padding)) css["padding"] = String(props.padding);
  if (str(props.boxSizing)) css["box-sizing"] = String(props.boxSizing);
  if (str(props.cursor) && props.cursor !== "auto") css["cursor"] = String(props.cursor);
  if (str(props.overflow) && props.overflow !== "visible") css["overflow"] = String(props.overflow);
  if (str(props.position) && props.position !== "absolute") css["position"] = String(props.position);
  const z = num(props.zIndex);
  if (z !== void 0) css["z-index"] = String(z);
  if (str(props.display)) css["display"] = String(props.display);
  if (str(props.flexDirection)) css["flex-direction"] = String(props.flexDirection);
  if (str(props.flexWrap)) css["flex-wrap"] = String(props.flexWrap);
  if (str(props.gap)) css["gap"] = String(props.gap);
  if (str(props.justifyContent)) css["justify-content"] = String(props.justifyContent);
  if (str(props.alignItems)) css["align-items"] = String(props.alignItems);
  const cva = str(props.contentVerticalAlign);
  if (cva && cva !== "top") {
    css["display"] = css["display"] ?? "flex";
    css["flex-direction"] = css["flex-direction"] ?? "column";
    css["justify-content"] = cva === "middle" ? "center" : cva === "bottom" ? "flex-end" : "flex-start";
  }
  const op = num(props.opacity);
  if (op !== void 0 && op < 100) css["opacity"] = String(op / 100);
  if (str(props.boxShadow)) {
    css["box-shadow"] = String(props.boxShadow);
  } else {
    const sx = str(props.boxShadowX);
    const sy = str(props.boxShadowY);
    if (sx || sy) {
      const blur = str(props.boxShadowBlur) ?? "0";
      const spread = str(props.boxShadowSpread) ?? "0";
      const col = str(props.boxShadowColor) ?? "#000000";
      const sop = num(props.boxShadowOpacity);
      const colWithA = sop !== void 0 && sop < 100 ? hexToRgba(col, sop / 100) : col;
      const inset = props.boxShadowInset ? "inset " : "";
      css["box-shadow"] = `${inset}${pxish(sx ?? 0)} ${pxish(sy ?? 0)} ${pxish(blur)} ${pxish(spread)} ${colWithA}`;
    }
  }
  const tsx = str(props.textShadowX);
  const tsy = str(props.textShadowY);
  if (tsx || tsy) {
    const tblur = str(props.textShadowBlur) ?? "0";
    const tcol = str(props.textShadowColor) ?? "#000000";
    css["text-shadow"] = `${pxish(tsx ?? 0)} ${pxish(tsy ?? 0)} ${pxish(tblur)} ${tcol}`;
  }
  if (str(props.filter) && props.filter !== "none") {
    css["filter"] = String(props.filter);
  } else {
    const parts = [];
    if (str(props.filterBlur)) parts.push(`blur(${pxish(props.filterBlur)})`);
    if (str(props.filterBrightness)) parts.push(`brightness(${pct(props.filterBrightness)})`);
    if (str(props.filterContrast)) parts.push(`contrast(${pct(props.filterContrast)})`);
    if (str(props.filterSaturation)) parts.push(`saturate(${pct(props.filterSaturation)})`);
    if (str(props.filterGrayscale)) parts.push(`grayscale(${pct(props.filterGrayscale)})`);
    if (str(props.filterSepia)) parts.push(`sepia(${pct(props.filterSepia)})`);
    if (str(props.filterHue)) parts.push(`hue-rotate(${deg(props.filterHue)})`);
    if (parts.length) css["filter"] = parts.join(" ");
  }
  if (str(props.mixBlendMode) && props.mixBlendMode !== "normal") css["mix-blend-mode"] = String(props.mixBlendMode);
  if (str(props.transition)) css["transition"] = String(props.transition);
  if (str(props.animation)) css["animation"] = String(props.animation);
  if (str(props.transform)) css["transform"] = String(props.transform);
  if (str(props.transformOrigin) && props.transformOrigin !== "center center") css["transform-origin"] = String(props.transformOrigin);
  return css;
}

// src/export/exportHtml.ts
function sanitizeIdent(s) {
  let out = String(s ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  if (!out) out = "page";
  if (/^[0-9]/.test(out)) out = `p-${out}`;
  return out;
}
function escapeHtml(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttr(s) {
  return escapeHtml(s);
}
function textToHtml(s) {
  return escapeHtml(s).replace(/\r\n|\r|\n/g, "<br>");
}
function px(n) {
  return `${Math.round(n ?? 0)}px`;
}
function elementId(cmp) {
  const domId = String(cmp.props?.domId ?? "").trim();
  return domId ? sanitizeIdent(domId) : cmp.id;
}
function linesOf(s) {
  return String(s ?? "").split(/\r\n|\r|\n/).map((l) => l.trim()).filter((l) => l.length > 0);
}
function linkLines(s) {
  return linesOf(s).map((l) => {
    const i = l.indexOf("|");
    return i >= 0 ? { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() } : { label: l, url: "" };
  });
}
function jsStr(v) {
  return JSON.stringify(String(v ?? "")).replace(/</g, "\\u003c");
}
function cssDeclarations(css) {
  return Object.entries(css).map(([k, v]) => `${k}: ${v};`).join(" ");
}
var ALERT_PALETTES = {
  info: { bg: "#cff4fc", fg: "#055160", border: "#b6effb" },
  success: { bg: "#d1e7dd", fg: "#0f5132", border: "#badbcc" },
  warning: { bg: "#fff3cd", fg: "#664d03", border: "#ffecb5" },
  error: { bg: "#f8d7da", fg: "#842029", border: "#f5c2c7" }
};
function typeExtraCss(cmp, props) {
  const css = {};
  const gap = Number(props.gap) || 0;
  switch (cmp.type) {
    case "row":
      css["display"] = "flex";
      css["flex-direction"] = "row";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "column":
      css["display"] = "flex";
      css["flex-direction"] = "column";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "flex": {
      css["display"] = "flex";
      css["flex-direction"] = String(props.direction || "row");
      if (gap) css["gap"] = `${gap}px`;
      if (props.justify) css["justify-content"] = String(props.justify);
      if (props.alignItems) css["align-items"] = String(props.alignItems);
      break;
    }
    case "grid":
    case "productgrid": {
      css["display"] = "grid";
      const cols = Math.max(1, Math.floor(Number(props.columns) || 1));
      css["grid-template-columns"] = `repeat(${cols}, 1fr)`;
      if (gap) css["gap"] = `${gap}px`;
      break;
    }
    case "gallery": {
      css["display"] = "grid";
      const cols = Math.max(1, Math.floor(Number(props.columns) || 1));
      css["grid-template-columns"] = `repeat(${cols}, 1fr)`;
      if (gap) css["gap"] = `${gap}px`;
      break;
    }
    case "carousel":
      css["display"] = "flex";
      css["align-items"] = "center";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "navbar":
      css["display"] = "flex";
      css["align-items"] = "center";
      css["justify-content"] = "space-between";
      break;
    case "tabs":
    case "quantity":
      css["display"] = "flex";
      break;
    case "searchbox":
      css["display"] = "flex";
      break;
    case "socialicons":
      css["display"] = "flex";
      css["align-items"] = "center";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "sharebuttons":
      css["display"] = "flex";
      css["align-items"] = "center";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "repeater":
      css["display"] = "flex";
      css["flex-direction"] = "column";
      if (gap) css["gap"] = `${gap}px`;
      break;
    case "divider":
      css["background-color"] = String(props.color || "#000000");
      css["height"] = `${Number(props.lineThickness) || 1}px`;
      break;
    case "button":
    case "submit":
    case "reset":
    case "addtocart":
      css["cursor"] = "pointer";
      break;
    case "image":
      if (props.objectFit) css["object-fit"] = String(props.objectFit);
      break;
    case "icon":
    case "marker":
      css["line-height"] = "1";
      break;
    case "table":
    case "datagrid":
    case "dbtable":
      css["border-collapse"] = "collapse";
      break;
    case "video":
      css["object-fit"] = "contain";
      break;
    case "alert": {
      const pal = ALERT_PALETTES[String(props.kind)] ?? ALERT_PALETTES.info;
      if (!props.backgroundColor) css["background-color"] = pal.bg;
      css["color"] = pal.fg;
      css["border"] = `1px solid ${pal.border}`;
      break;
    }
    case "cookieconsent":
      css["position"] = "fixed";
      css["left"] = "0";
      css["right"] = "0";
      css["bottom"] = "0";
      css["top"] = "auto";
      css["width"] = "auto";
      break;
  }
  if (props.animationPlayState) css["animation-play-state"] = String(props.animationPlayState);
  return css;
}
function componentCss(cmp, geom, props) {
  return {
    // styleFromProps only emits position when it is not 'absolute', so a
    // 'fixed'/'sticky' prop overrides the default below via the spread.
    position: "absolute",
    left: px(geom.x),
    top: px(geom.y),
    width: px(geom.width),
    height: px(geom.height),
    ...styleFromProps(props),
    ...typeExtraCss(cmp, props)
  };
}
function toggleScript(elId) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var b=r.querySelector("button"),u=r.querySelector("ul");if(!b||!u)return;b.addEventListener("click",function(){u.classList.toggle("open");});})();`;
}
function slideshowScript(elId, interval) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var im=r.querySelectorAll("img");if(im.length<2)return;var i=0;setInterval(function(){im[i].style.display="none";i=(i+1)%im.length;im[i].style.display="block";},${Math.max(500, interval)}));})();`;
}
function lightboxScript(elId) {
  return `(function(){var img=document.getElementById(${jsStr(elId)});if(!img)return;img.style.cursor="zoom-in";img.addEventListener("click",function(){var ov=document.createElement("div");ov.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:99999;cursor:zoom-out";var im=document.createElement("img");im.src=img.src;im.style.cssText="max-width:90%;max-height:90%";ov.appendChild(im);ov.addEventListener("click",function(){ov.remove();});document.body.appendChild(ov);});})();`;
}
function accordionScript(elId) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var hs=r.querySelectorAll(".sb-acc-h");for(var i=0;i<hs.length;i++)(function(h){h.addEventListener("click",function(){var b=h.nextElementSibling;if(!b)return;b.style.display=b.style.display==="none"?"block":"none";});})(hs[i]);})();`;
}
function modalScript(elId) {
  return `(function(){var m=document.getElementById(${jsStr(elId)});if(!m)return;var x=m.querySelector(".sb-modal-close");if(x)x.addEventListener("click",function(){m.style.display="none";});})();`;
}
function counterScript(elId, from, to, duration) {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;var from=${from},to=${to},dur=${Math.max(100, duration)},t0=0;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=String(Math.round(from+(to-from)*p));if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);})();`;
}
function fetchRows(url) {
  return `fetch(${jsStr(url)}).then(function(r){return r.json();}).then(function(rows){if(!Array.isArray(rows))return;`;
}
function dataTableScript(elId, apiUrl, columns) {
  return `(function(){var t=document.getElementById(${jsStr(elId)});if(!t)return;var tb=t.querySelector("tbody");if(!tb)return;var cols=${JSON.stringify(columns)};var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};try{${fetchRows(apiUrl)}tb.innerHTML=rows.map(function(row){return "<tr>"+cols.map(function(c){return "<td>"+esc(row[c])+"</td>";}).join("")+"</tr>";}).join("");}).catch(function(){})}catch(e){}})();`;
}
function repeaterScript(elId, apiUrl) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var tpl=r.querySelector("template");if(!tpl)return;var html=tpl.innerHTML;try{${fetchRows(apiUrl)}r.innerHTML=rows.map(function(row){return html.replace(/\\{\\{(\\w+)\\}\\}/g,function(m,k){var v=row[k];return v==null?"":String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;");});}).join("");}).catch(function(){})}catch(e){}})();`;
}
function countdownScript(elId, targetDate, format) {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;var target=new Date(${jsStr(targetDate)}).getTime(),fmt=${jsStr(format)};function pad(n){return (n<10?"0":"")+n;}function tick(){var d=Math.max(0,target-Date.now());var dd=Math.floor(d/864e5),hh=Math.floor(d/36e5)%24,mm=Math.floor(d/6e4)%60,ss=Math.floor(d/1e3)%60;el.textContent=fmt.replace(/dd/g,pad(dd)).replace(/hh/g,pad(hh)).replace(/mm/g,pad(mm)).replace(/ss/g,pad(ss));}tick();setInterval(tick,1000);})();`;
}
function calendarScript(elId, month, year) {
  return `(function(){var t=document.getElementById(${jsStr(elId)});if(!t)return;var now=new Date(),mm=${month}||now.getMonth()+1,yy=${year}||now.getFullYear();var start=new Date(yy,mm-1,1).getDay(),days=new Date(yy,mm,0).getDate();var h="<tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr><tr>";for(var i=0;i<start;i++)h+="<td></td>";for(var d=1;d<=days;d++){h+="<td>"+d+"</td>";if((start+d)%7===0&&d<days)h+="</tr><tr>";}h+="</tr>";t.innerHTML=h;})();`;
}
function cookieConsentScript(elId) {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;try{if(localStorage.getItem("sb-cookie-ok")){el.style.display="none";return;}}catch(e){}var b=el.querySelector("button");if(b)b.addEventListener("click",function(){el.style.display="none";try{localStorage.setItem("sb-cookie-ok","1");}catch(e){}});})();`;
}
function submitFormScript(elId, apiUrl, method, redirect) {
  return `(function(){var f=document.getElementById(${jsStr(elId)});if(!f)return;f.addEventListener("submit",function(ev){ev.preventDefault();var data={};new FormData(f).forEach(function(v,k){data[k]=v;});fetch(${jsStr(apiUrl)},{method:${jsStr(method)},headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then(function(r){if(r.ok&&${jsStr(redirect)})location.href=${jsStr(redirect)};}).catch(function(){});});})();`;
}
function logoutScript(elId, apiUrl, redirect) {
  return `(function(){var b=document.getElementById(${jsStr(elId)});if(!b)return;b.addEventListener("click",function(){fetch(${jsStr(apiUrl)},{method:"POST"}).catch(function(){}).finally(function(){if(${jsStr(redirect)})location.href=${jsStr(redirect)};});});})();`;
}
function searchResultsScript(elId, apiUrl, param) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var q=new URLSearchParams(location.search).get(${jsStr(param)})||"";if(!q){r.textContent="Enter a search query.";return;}var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};fetch(${jsStr(apiUrl)}+(${jsStr(apiUrl)}.indexOf("?")>=0?"&":"?")+encodeURIComponent(${jsStr(param)})+"="+encodeURIComponent(q)).then(function(res){return res.json();}).then(function(rows){if(!Array.isArray(rows))return;r.innerHTML="<ul>"+rows.map(function(it){return "<li>"+esc(typeof it==="object"?JSON.stringify(it):it)+"</li>";}).join("")+"</ul>";}).catch(function(){});})();`;
}
function productGridScript(elId, apiUrl) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};try{${fetchRows(apiUrl)}r.innerHTML=rows.map(function(p){return '<div class="sb-product">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'')+"<h4>"+esc(p.name)+"</h4>"+'<div class="sb-price">'+esc(p.price)+"</div></div>";}).join("");}).catch(function(){})}catch(e){}})();`;
}
function quantityScript(elId, min, max) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var inp=r.querySelector("input"),btns=r.querySelectorAll("button");if(!inp||btns.length<2)return;function clamp(){var v=parseInt(inp.value,10)||${min};inp.value=Math.max(${min},Math.min(${max},v));}btns[0].addEventListener("click",function(){inp.value=(parseInt(inp.value,10)||${min})-1;clamp();});btns[1].addEventListener("click",function(){inp.value=(parseInt(inp.value,10)||${min})+1;clamp();});})();`;
}
function shareButtonsScript(elId) {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var as=r.querySelectorAll("a[data-share]");for(var i=0;i<as.length;i++)(function(a){a.addEventListener("click",function(){a.href=a.getAttribute("data-share")+encodeURIComponent(location.href);});})(as[i]);})();`;
}
var HEADING_LEVELS = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
var INPUT_TYPE_MAP = {
  textInput: "text",
  password: "password",
  email: "email",
  number: "number",
  tel: "tel",
  date: "date",
  time: "time"
};
var SOCIAL_NETWORKS = {
  facebook: { glyph: "f", color: "#1877f2" },
  x: { glyph: "\u{1D54F}", color: "#000000" },
  twitter: { glyph: "\u{1D54F}", color: "#000000" },
  instagram: { glyph: "\u25C9", color: "#e1306c" },
  linkedin: { glyph: "in", color: "#0a66c2" },
  youtube: { glyph: "\u25B6", color: "#ff0000" },
  whatsapp: { glyph: "\u2706", color: "#25d366" }
};
var SHARE_ENDPOINTS = {
  facebook: "https://www.facebook.com/sharer/sharer.php?u=",
  x: "https://twitter.com/intent/tweet?url=",
  twitter: "https://twitter.com/intent/tweet?url=",
  whatsapp: "https://wa.me/?text=",
  linkedin: "https://www.linkedin.com/sharing/share-offsite/?url="
};
function eventAttrs(cmp) {
  let out = "";
  for (const [name, code] of Object.entries(cmp.events ?? {})) {
    if (!code) continue;
    const attr = /^on[a-z]+$/i.test(name) ? name.toLowerCase() : `on${sanitizeIdent(name)}`;
    out += ` ${attr}="${escapeAttr(code)}"`;
  }
  return out;
}
function customAttributeAttrs(cmp) {
  const raw = String(cmp.props.customAttributes ?? "");
  if (!raw.trim()) return "";
  let out = "";
  const re = /([A-Za-z_:][\w:.-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+)/g;
  let m;
  while (m = re.exec(raw)) {
    const key = m[1];
    if (/^(id|class)$/i.test(key)) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    out += ` ${key}="${escapeAttr(val)}"`;
  }
  return out;
}
function commonAttrs(cmp, extraClass = "") {
  const cssClass = String(cmp.props.cssClass ?? "").trim();
  let cls = `sb-cmp sb-${cmp.type}`;
  if (extraClass) cls += ` ${extraClass}`;
  if (cssClass) cls += ` ${cssClass}`;
  let out = `id="${escapeAttr(elementId(cmp))}" class="${escapeAttr(cls)}"`;
  const aria = String(cmp.props.ariaLabel ?? "").trim();
  if (aria) out += ` aria-label="${escapeAttr(aria)}"`;
  out += customAttributeAttrs(cmp);
  return out;
}
function openTag(cmp, tag, extra2 = "", extraClass = "") {
  return `<${tag} ${commonAttrs(cmp, extraClass)}${extra2 ? " " + extra2 : ""}${eventAttrs(cmp)}>`;
}
function selfClosingTag(cmp, tag, extra2 = "") {
  return `<${tag} ${commonAttrs(cmp)}${extra2 ? " " + extra2 : ""}${eventAttrs(cmp)}>`;
}
function linkListItems(cmp, links) {
  return links.map((l) => `<li><a href="${escapeAttr(l.url || "#")}">${escapeHtml(l.label)}</a></li>`).join("");
}
function treeviewMarkup(itemsRaw) {
  const items = String(itemsRaw ?? "").split(/\r\n|\r|\n/).filter((l) => l.trim().length > 0).map((l) => ({ depth: Math.floor((l.match(/^ */)?.[0].length ?? 0) / 2), text: l.trim() }));
  let html = "<ul>";
  let cur = 1;
  for (const it of items) {
    const lvl = Math.min(it.depth + 1, cur + 1);
    while (lvl > cur) {
      html += "<ul>";
      cur++;
    }
    while (lvl < cur) {
      html += "</ul>";
      cur--;
    }
    html += `<li>${escapeHtml(it.text)}</li>`;
  }
  while (cur > 0) {
    html += "</ul>";
    cur--;
  }
  return html;
}
function componentHtmlRaw(cmp, scripts) {
  const p = cmp.props ?? {};
  const elId = elementId(cmp);
  switch (cmp.type) {
    case "section":
    case "container":
    case "group":
    case "row":
    case "column":
    case "flex":
    case "grid":
    case "spacer":
      return `${openTag(cmp, "div")}</div>`;
    case "header":
      return `${openTag(cmp, "header")}</header>`;
    case "footer":
      return `${openTag(cmp, "footer")}</footer>`;
    case "card": {
      const img = String(p.imageSrc ?? "").trim() ? `<img src="${escapeAttr(String(p.imageSrc))}" alt="">` : "";
      const title = String(p.title ?? "").trim() ? `<h3>${escapeHtml(String(p.title))}</h3>` : "";
      const text = String(p.text ?? "").trim() ? `<p>${textToHtml(String(p.text))}</p>` : "";
      return `${openTag(cmp, "div")}${img}${title}${text}</div>`;
    }
    case "panel":
      return `${openTag(cmp, "div")}<div class="sb-panel-title">${escapeHtml(String(p.title ?? ""))}</div></div>`;
    case "text":
      return `${openTag(cmp, "div")}${textToHtml(String(p.text ?? ""))}</div>`;
    case "paragraph":
      return `${openTag(cmp, "p")}${textToHtml(String(p.text ?? ""))}</p>`;
    case "heading": {
      const level = HEADING_LEVELS.has(String(p.level)) ? String(p.level) : "h1";
      return `${openTag(cmp, level)}${escapeHtml(String(p.text ?? ""))}</${level}>`;
    }
    case "image": {
      const src = String(p.src ?? "").trim();
      if (!src) return `${openTag(cmp, "div")}<!-- image: no src set --></div>`;
      return selfClosingTag(cmp, "img", `src="${escapeAttr(src)}" alt="${escapeAttr(String(p.alt ?? ""))}" loading="${escapeAttr(String(p.loading || "lazy"))}" decoding="${escapeAttr(String(p.decoding || "auto"))}"`);
    }
    case "button": {
      const buttonAttrs = `type="${escapeAttr(String(p.buttonType || "button"))}"${p.disabled ? " disabled" : ""}`;
      const btn = `${openTag(cmp, "button", buttonAttrs)}${escapeHtml(String(p.text ?? ""))}</button>`;
      const href = String(p.href ?? "").trim();
      if (!href) return btn;
      const target = String(p.target ?? "_self");
      return `<a href="${escapeAttr(href)}" target="${escapeAttr(target)}">${btn}</a>`;
    }
    case "link": {
      const href = String(p.href ?? "#");
      const target = String(p.target ?? "_self");
      return `${openTag(cmp, "a", `href="${escapeAttr(href)}" target="${escapeAttr(target)}"`)}${escapeHtml(String(p.text ?? ""))}</a>`;
    }
    case "icon":
      return `${openTag(cmp, "span")}${escapeHtml(String(p.glyph ?? ""))}</span>`;
    case "divider":
      return `${openTag(cmp, "div")}</div>`;
    case "rectangle":
    case "roundedRectangle":
    case "ellipse":
      return `${openTag(cmp, "div")}</div>`;
    case "list": {
      const items = String(p.items ?? "").split("\n").filter((s) => s.trim()).map((s) => `<li>${escapeHtml(s)}</li>`).join("");
      return `${openTag(cmp, "ul")}${items}</ul>`;
    }
    case "html":
    case "htmlEmbed":
      return `${openTag(cmp, "div")}${String(p.html ?? "")}</div>`;
    case "form": {
      const attrs = [
        `action="${escapeAttr(String(p.action ?? ""))}"`,
        `method="${escapeAttr(String(p.method ?? "post"))}"`,
        `enctype="${escapeAttr(String(p.enctype || "application/x-www-form-urlencoded"))}"`,
        `autocomplete="${escapeAttr(String(p.autocomplete || "on"))}"`
      ];
      if (p.noValidate) attrs.push("novalidate");
      return `${openTag(cmp, "form", attrs.join(" "))}<!-- form body: field components are positioned inside this box --></form>`;
    }
    case "textInput":
    case "password":
    case "email":
    case "number":
    case "tel":
    case "date":
    case "time": {
      const attrs = [`type="${INPUT_TYPE_MAP[cmp.type]}"`, `name="${escapeAttr(String(p.name ?? ""))}"`];
      const ph = String(p.placeholder ?? "");
      if (ph) attrs.push(`placeholder="${escapeAttr(ph)}"`);
      if (p.required) attrs.push("required");
      if (p.disabled) attrs.push("disabled");
      if (p.readOnly) attrs.push("readonly");
      if (p.multiple) attrs.push("multiple");
      if (p.autocomplete) attrs.push(`autocomplete="${escapeAttr(String(p.autocomplete))}"`);
      if (p.inputMode) attrs.push(`inputmode="${escapeAttr(String(p.inputMode))}"`);
      if (p.pattern) attrs.push(`pattern="${escapeAttr(String(p.pattern))}"`);
      if (p.minLength !== "" && p.minLength !== void 0) attrs.push(`minlength="${escapeAttr(String(p.minLength))}"`);
      if (p.maxLength !== "" && p.maxLength !== void 0) attrs.push(`maxlength="${escapeAttr(String(p.maxLength))}"`);
      if (p.step !== "" && p.step !== void 0) attrs.push(`step="${escapeAttr(String(p.step))}"`);
      if (cmp.type === "number") {
        if (p.min !== "" && p.min !== void 0) attrs.push(`min="${escapeAttr(String(p.min))}"`);
        if (p.max !== "" && p.max !== void 0) attrs.push(`max="${escapeAttr(String(p.max))}"`);
      }
      return selfClosingTag(cmp, "input", attrs.join(" "));
    }
    case "file": {
      const accept = String(p.accept ?? "").trim();
      const attrs = [`type="file"`, `name="${escapeAttr(String(p.name ?? ""))}"`];
      if (accept) attrs.push(`accept="${escapeAttr(accept)}"`);
      if (p.required) attrs.push("required");
      if (p.disabled) attrs.push("disabled");
      if (p.multiple) attrs.push("multiple");
      if (p.capture) attrs.push(`capture="${escapeAttr(String(p.capture))}"`);
      return selfClosingTag(
        cmp,
        "input",
        attrs.join(" ")
      );
    }
    case "textarea": {
      const attrs = [`name="${escapeAttr(String(p.name ?? ""))}"`, `placeholder="${escapeAttr(String(p.placeholder ?? ""))}"`];
      if (p.required) attrs.push("required");
      if (p.disabled) attrs.push("disabled");
      if (p.readOnly) attrs.push("readonly");
      if (p.autocomplete) attrs.push(`autocomplete="${escapeAttr(String(p.autocomplete))}"`);
      if (p.minLength !== "" && p.minLength !== void 0) attrs.push(`minlength="${escapeAttr(String(p.minLength))}"`);
      if (p.maxLength !== "" && p.maxLength !== void 0) attrs.push(`maxlength="${escapeAttr(String(p.maxLength))}"`);
      if (p.wrap) attrs.push(`wrap="${escapeAttr(String(p.wrap))}"`);
      return `${openTag(cmp, "textarea", attrs.join(" "))}</textarea>`;
    }
    case "checkbox":
    case "radio": {
      const checked = p.checked ? " checked" : "";
      const required = p.required ? " required" : "";
      const disabled = p.disabled ? " disabled" : "";
      return `${openTag(cmp, "label")}<input type="${cmp.type}" name="${escapeAttr(String(p.name ?? ""))}"${checked}${required}${disabled}> ${escapeHtml(String(p.label ?? ""))}</label>`;
    }
    case "select": {
      const options = linesOf(p.options).map((o) => `<option value="${escapeAttr(o)}">${escapeHtml(o)}</option>`).join("");
      const attrs = [`name="${escapeAttr(String(p.name ?? ""))}"`];
      if (p.required) attrs.push("required");
      if (p.disabled) attrs.push("disabled");
      if (p.multiple) attrs.push("multiple");
      return `${openTag(cmp, "select", attrs.join(" "))}${options}</select>`;
    }
    case "range":
      return selfClosingTag(
        cmp,
        "input",
        `type="range" name="${escapeAttr(String(p.name ?? ""))}" min="${Number(p.min) || 0}" max="${Number(p.max) || 100}" value="${Number(p.value) || 0}"${p.step ? ` step="${escapeAttr(String(p.step))}"` : ""}${p.disabled ? " disabled" : ""}`
      );
    case "submit":
      return `${openTag(cmp, "button", 'type="submit"')}${escapeHtml(String(p.text ?? "Submit"))}</button>`;
    case "reset":
      return `${openTag(cmp, "button", 'type="reset"')}${escapeHtml(String(p.text ?? "Reset"))}</button>`;
    case "hiddenField":
      return selfClosingTag(
        cmp,
        "input",
        `type="hidden" name="${escapeAttr(String(p.name ?? ""))}" value="${escapeAttr(String(p.value ?? ""))}"`
      );
    case "navbar": {
      const links = linkListItems(cmp, linkLines(p.links));
      const brand = String(p.brand ?? "").trim();
      return `${openTag(cmp, "nav")}${brand ? `<span class="sb-brand">${escapeHtml(brand)}</span>` : ""}<ul>${links}</ul></nav>`;
    }
    case "menubar": {
      const items = linesOf(p.items).map((i) => `<li>${escapeHtml(i)}</li>`).join("");
      return `${openTag(cmp, "nav")}<ul>${items}</ul></nav>`;
    }
    case "hamburger": {
      scripts.push(toggleScript(elId));
      const links = linkListItems(cmp, linkLines(p.links));
      return `${openTag(cmp, "div")}<button type="button" class="sb-burger" aria-label="Menu">\u2630</button><ul>${links}</ul></div>`;
    }
    case "dropdown": {
      scripts.push(toggleScript(elId));
      const links = linkListItems(cmp, linkLines(p.items));
      return `${openTag(cmp, "div", "", "sb-dropdown")}<button type="button">${escapeHtml(String(p.label ?? "Menu"))} \u25BE</button><ul>${links}</ul></div>`;
    }
    case "sidebar": {
      const links = linkListItems(cmp, linkLines(p.links));
      const title = String(p.title ?? "").trim();
      return `${openTag(cmp, "nav")}${title ? `<div class="sb-side-title">${escapeHtml(title)}</div>` : ""}<ul>${links}</ul></nav>`;
    }
    case "breadcrumb": {
      const items = linkLines(p.items);
      const sep = `<span class="sep">${escapeHtml(String(p.separator ?? "/"))}</span>`;
      const parts = items.map(
        (it, i) => i === items.length - 1 || !it.url ? `<span>${escapeHtml(it.label)}</span>` : `<a href="${escapeAttr(it.url)}">${escapeHtml(it.label)}</a>`
      );
      return `${openTag(cmp, "nav", 'aria-label="breadcrumb"')}${parts.join(sep)}</nav>`;
    }
    case "pagination": {
      const pages = Math.max(1, Math.floor(Number(p.pages) || 1));
      const current = Math.min(pages, Math.max(1, Math.floor(Number(p.current) || 1)));
      const parts = ['<a href="?page=' + Math.max(1, current - 1) + '">\u276E</a>'];
      for (let i = 1; i <= pages; i++) {
        parts.push(`<a href="?page=${i}"${i === current ? ' class="active"' : ""}>${i}</a>`);
      }
      parts.push('<a href="?page=' + Math.min(pages, current + 1) + '">\u276F</a>');
      return `${openTag(cmp, "nav", 'aria-label="pagination"')}${parts.join("")}</nav>`;
    }
    case "tabs": {
      const tabs = linesOf(p.tabs);
      const active = Math.floor(Number(p.active) || 0);
      const btns = tabs.map((t, i) => `<button type="button"${i === active ? ' class="active"' : ""}>${escapeHtml(t)}</button>`).join("");
      return `${openTag(cmp, "div", 'role="tablist"')}${btns}</div>`;
    }
    case "video": {
      const src = String(p.src ?? "").trim();
      const attrs = [];
      if (src) attrs.push(`src="${escapeAttr(src)}"`);
      if (p.controls) attrs.push("controls");
      if (p.autoplay) attrs.push("autoplay muted");
      if (p.poster) attrs.push(`poster="${escapeAttr(String(p.poster))}"`);
      if (p.preload) attrs.push(`preload="${escapeAttr(String(p.preload))}"`);
      if (p.muted) attrs.push("muted");
      if (p.loop) attrs.push("loop");
      if (p.playsInline) attrs.push("playsinline");
      return `${openTag(cmp, "video", attrs.join(" "))}</video>`;
    }
    case "audio": {
      const src = String(p.src ?? "").trim();
      const attrs = [];
      if (src) attrs.push(`src="${escapeAttr(src)}"`);
      if (p.controls) attrs.push("controls");
      if (p.preload) attrs.push(`preload="${escapeAttr(String(p.preload))}"`);
      if (p.autoplay) attrs.push("autoplay");
      if (p.muted) attrs.push("muted");
      if (p.loop) attrs.push("loop");
      return `${openTag(cmp, "audio", attrs.join(" "))}</audio>`;
    }
    case "youtube": {
      const vid = escapeAttr(String(p.videoId ?? "").trim());
      return selfClosingTag(cmp, "iframe", `src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen`);
    }
    case "gallery": {
      const imgs = linesOf(p.images).map((u) => `<img src="${escapeAttr(u)}" alt="">`).join("");
      if (!imgs) return `${openTag(cmp, "div")}<!-- gallery: no images set --></div>`;
      return `${openTag(cmp, "div")}${imgs}</div>`;
    }
    case "slideshow": {
      const urls = linesOf(p.images);
      if (urls.length === 0) return `${openTag(cmp, "div")}<!-- slideshow: no images set --></div>`;
      scripts.push(slideshowScript(elId, Number(p.interval) || 3e3));
      const imgs = urls.map((u, i) => `<img src="${escapeAttr(u)}" alt=""${i > 0 ? ' style="display:none"' : ""}>`).join("");
      return `${openTag(cmp, "div")}${imgs}</div>`;
    }
    case "carousel": {
      const imgs = linesOf(p.images).map((u) => `<img src="${escapeAttr(u)}" alt="">`).join("");
      if (!imgs) return `${openTag(cmp, "div")}<!-- carousel: no images set --></div>`;
      return `${openTag(cmp, "div")}${imgs}</div>`;
    }
    case "lightbox": {
      const src = String(p.src ?? "").trim();
      if (!src) return `${openTag(cmp, "div")}<!-- lightbox: no src set --></div>`;
      scripts.push(lightboxScript(elId));
      const caption = escapeAttr(String(p.caption ?? ""));
      return selfClosingTag(cmp, "img", `src="${escapeAttr(src)}" alt="${caption}"`);
    }
    case "accordion": {
      scripts.push(accordionScript(elId));
      const items = linkLines(p.items).map(
        (it, i) => `<button type="button" class="sb-acc-h">${escapeHtml(it.label)}</button><div class="sb-acc-b"${i > 0 ? ' style="display:none"' : ""}>${textToHtml(it.url)}</div>`
      ).join("");
      return `${openTag(cmp, "div")}${items}</div>`;
    }
    case "modal": {
      scripts.push(modalScript(elId));
      const hidden = p.open ? "" : ' style="display:none"';
      return `${openTag(cmp, "div", hidden ? hidden.trimStart().replace(/^style=/, "style=") && `style="display:none"` : "")}<div class="sb-modal-head"><span>${escapeHtml(String(p.title ?? ""))}</span><button type="button" class="sb-modal-close" aria-label="Close">\u2715</button></div><div class="sb-modal-body">${textToHtml(String(p.text ?? ""))}</div></div>`;
    }
    case "tooltip":
      return `${openTag(cmp, "span", `data-tip="${escapeAttr(String(p.tip ?? ""))}"`, "sb-tooltip")}${escapeHtml(String(p.text ?? ""))}</span>`;
    case "progress": {
      const max = Number(p.max) || 100;
      const value = Math.min(max, Math.max(0, Number(p.value) || 0));
      const pct2 = Math.round(value / max * 100);
      const barColor = escapeAttr(String(p.barColor || "#0d6efd"));
      return `${openTag(cmp, "div")}<div class="sb-progress-fill" style="width: ${pct2}%; height: 100%; background: ${barColor};"></div></div>`;
    }
    case "counter": {
      const from = Number(p.from) || 0;
      const to = Number(p.to) || 0;
      const duration = Number(p.duration) || 2e3;
      scripts.push(counterScript(elId, from, to, duration));
      return `${openTag(cmp, "span", `data-to="${to}" data-duration="${duration}"`)}${from}</span>`;
    }
    case "rating": {
      const max = Math.max(1, Math.floor(Number(p.max) || 5));
      const value = Math.min(max, Math.max(0, Math.floor(Number(p.value) || 0)));
      const color = escapeAttr(String(p.starColor || "#ffc107"));
      let stars = "";
      for (let i = 0; i < max; i++) {
        stars += i < value ? `<span style="color: ${color};">\u2605</span>` : "<span>\u2606</span>";
      }
      return `${openTag(cmp, "span")}${stars}</span>`;
    }
    case "badge":
      return `${openTag(cmp, "span")}${escapeHtml(String(p.text ?? ""))}</span>`;
    case "alert":
      return `${openTag(cmp, "div", 'role="alert"')}${textToHtml(String(p.text ?? ""))}</div>`;
    case "timeline": {
      const items = linkLines(p.items).map((it) => `<li><strong>${escapeHtml(it.label)}</strong> ${escapeHtml(it.url)}</li>`).join("");
      return `${openTag(cmp, "div")}<ul>${items}</ul></div>`;
    }
    case "table": {
      const rows = Math.max(1, Math.floor(Number(p.rows) || 1));
      const cols = Math.max(1, Math.floor(Number(p.columns) || 1));
      const headerRow = !!p.headerRow;
      const body = [];
      for (let r = 0; r < rows; r++) {
        const cell = headerRow && r === 0 ? "th" : "td";
        body.push(`<tr>${`<${cell}></${cell}>`.repeat(cols)}</tr>`);
      }
      return `${openTag(cmp, "table")}${body.join("")}</table>`;
    }
    case "datagrid":
    case "dbtable": {
      const columns = linesOf(p.columns);
      const apiUrl = String(p.apiUrl ?? "").trim();
      if (apiUrl) scripts.push(dataTableScript(elId, apiUrl, columns));
      const head = columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
      return `${openTag(cmp, "table", `data-api="${escapeAttr(apiUrl)}"`)}<thead><tr>${head}</tr></thead><tbody></tbody></table>`;
    }
    case "repeater": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      if (apiUrl) scripts.push(repeaterScript(elId, apiUrl));
      return `${openTag(cmp, "div", `data-api="${escapeAttr(apiUrl)}"`)}<template>${String(p.itemTemplate ?? "")}</template></div>`;
    }
    case "treeview":
      return `${openTag(cmp, "div")}${treeviewMarkup(p.items)}</div>`;
    case "searchbox":
      return `${openTag(cmp, "form", `action="${escapeAttr(String(p.action ?? ""))}" method="get" role="search"`)}<input type="search" name="q" placeholder="${escapeAttr(String(p.placeholder ?? ""))}"><button type="submit">\u{1F50D}</button></form>`;
    case "socialicons": {
      const size = Math.max(8, Number(p.size) || 36);
      const icons = linesOf(p.networks).map((n) => {
        const net = SOCIAL_NETWORKS[n.toLowerCase()] ?? { glyph: n.charAt(0), color: "#6c757d" };
        return `<a href="#" title="${escapeAttr(n)}" style="width: ${size}px; height: ${size}px; background: ${net.color}; font-size: ${Math.round(size / 2)}px;">${escapeHtml(net.glyph)}</a>`;
      }).join("");
      return `${openTag(cmp, "div")}${icons}</div>`;
    }
    case "sharebuttons": {
      scripts.push(shareButtonsScript(elId));
      const buttons = linesOf(p.networks).map((n) => {
        const key = n.toLowerCase();
        const endpoint = SHARE_ENDPOINTS[key];
        if (!endpoint) return "";
        const color = SOCIAL_NETWORKS[key]?.color ?? "#6c757d";
        const label = key === "x" || key === "twitter" ? "X" : n.charAt(0).toUpperCase() + n.slice(1);
        return `<a href="${escapeAttr(endpoint)}" data-share="${escapeAttr(endpoint)}" target="_blank" rel="noopener" style="background: ${color};">${escapeHtml(label)}</a>`;
      }).filter(Boolean).join("");
      return `${openTag(cmp, "div")}${buttons}</div>`;
    }
    case "whatsapp": {
      const phone = String(p.phone ?? "").replace(/[^0-9]/g, "");
      const msg = encodeURIComponent(String(p.message ?? ""));
      const href = `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`;
      return `${openTag(cmp, "a", `href="${escapeAttr(href)}" target="_blank" rel="noopener"`)}\u{1F4AC} WhatsApp</a>`;
    }
    case "facebook": {
      const pageUrl = String(p.pageUrl ?? "").trim();
      if (!pageUrl) return `${openTag(cmp, "div")}<!-- facebook: no page URL set --></div>`;
      const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(pageUrl)}&tabs=timeline`;
      return selfClosingTag(cmp, "iframe", `src="${escapeAttr(src)}" frameborder="0" allowfullscreen`);
    }
    case "xembed": {
      const tweetUrl = String(p.tweetUrl ?? "").trim();
      if (!tweetUrl) return `${openTag(cmp, "div")}<!-- x embed: no post URL set --></div>`;
      return `${openTag(cmp, "div")}<blockquote class="twitter-tweet"><a href="${escapeAttr(tweetUrl)}">${escapeHtml(tweetUrl)}</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`;
    }
    case "map": {
      const provider = String(p.provider ?? "osm");
      const zoom = Math.max(1, Math.min(20, Number(p.zoom) || 12));
      let src;
      if (provider === "google") {
        src = `https://maps.google.com/maps?q=${encodeURIComponent(String(p.address ?? ""))}&z=${zoom}&output=embed`;
      } else {
        src = "https://www.openstreetmap.org/export/embed.html?bbox=-0.13,51.49,-0.09,51.52&layer=mapnik&marker=51.505,-0.11";
      }
      return selfClosingTag(cmp, "iframe", `src="${escapeAttr(src)}" frameborder="0"`);
    }
    case "marker": {
      const color = escapeAttr(String(p.markerColor || "#dc3545"));
      const label = String(p.label ?? "").trim();
      return `${openTag(cmp, "span")}<span style="color: ${color}; font-size: 28px;">\u{1F4CD}</span>${label ? ` ${escapeHtml(label)}` : ""}</span>`;
    }
    case "css":
      return `${openTag(cmp, "div")}<!-- css component: styles emitted inline below --></div><style>${String(p.code ?? "")}</style>`;
    case "javascript":
      return `${openTag(cmp, "div")}<!-- javascript component: code emitted inline below --></div><script>${String(p.code ?? "")}</script>`;
    case "iframe": {
      const attrs = [`src="${escapeAttr(String(p.src ?? ""))}"`, 'frameborder="0"', `loading="${escapeAttr(String(p.loading || "lazy"))}"`];
      if (p.allowFullscreen) attrs.push("allowfullscreen");
      if (p.referrerPolicy) attrs.push(`referrerpolicy="${escapeAttr(String(p.referrerPolicy))}"`);
      return selfClosingTag(cmp, "iframe", attrs.join(" "));
    }
    case "qrcode": {
      const data = encodeURIComponent(String(p.data ?? ""));
      const src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
      return selfClosingTag(cmp, "img", `src="${escapeAttr(src)}" alt="QR code"`);
    }
    case "countdown": {
      scripts.push(countdownScript(elId, String(p.targetDate ?? ""), String(p.format ?? "dd : hh : mm : ss")));
      return `${openTag(cmp, "span")}${escapeHtml(String(p.format ?? ""))}</span>`;
    }
    case "calendar": {
      scripts.push(calendarScript(elId, Math.floor(Number(p.month) || 0), Math.floor(Number(p.year) || 0)));
      return `${openTag(cmp, "div")}<table></table></div>`;
    }
    case "captcha": {
      const siteKey = String(p.siteKey ?? "").trim();
      if (!siteKey) return `${openTag(cmp, "div")}<!-- captcha: no site key set --></div>`;
      const hcaptcha = String(p.provider) === "hcaptcha";
      const cls = hcaptcha ? "h-captcha" : "g-recaptcha";
      const src = hcaptcha ? "https://js.hcaptcha.com/1/api.js" : "https://www.google.com/recaptcha/api.js";
      return `${openTag(cmp, "div")}<div class="${cls}" data-sitekey="${escapeAttr(siteKey)}"></div><script src="${src}" async defer></script></div>`;
    }
    case "cookieconsent": {
      scripts.push(cookieConsentScript(elId));
      return `${openTag(cmp, "div", 'role="dialog"')}<span>${escapeHtml(String(p.message ?? ""))}</span><button type="button">${escapeHtml(String(p.buttonText ?? "Accept"))}</button></div>`;
    }
    case "login":
    case "register": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      const redirect = String(p.redirect ?? "").trim();
      if (apiUrl) scripts.push(submitFormScript(elId, apiUrl, "POST", redirect));
      const emailField = cmp.type === "register" ? '<label>Email</label><input type="email" name="email" required>' : "";
      const btnLabel = cmp.type === "register" ? "Register" : "Login";
      return `${openTag(cmp, "form")}<label>Username</label><input type="text" name="username" required>${emailField}<label>Password</label><input type="password" name="password" required><button type="submit">${btnLabel}</button></form>`;
    }
    case "logout": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      const redirect = String(p.redirect ?? "").trim();
      if (apiUrl) scripts.push(logoutScript(elId, apiUrl, redirect));
      return `${openTag(cmp, "button", 'type="button"')}${escapeHtml(String(p.text ?? "Logout"))}</button>`;
    }
    case "profile": {
      const avatarUrl = String(p.avatarUrl ?? "").trim();
      const name = String(p.name ?? "");
      const avatar = avatarUrl ? `<img src="${escapeAttr(avatarUrl)}" alt="">` : `<span class="sb-avatar">${escapeHtml(name.charAt(0).toUpperCase() || "?")}</span>`;
      return `${openTag(cmp, "div")}${avatar}<div><div>${escapeHtml(name)}</div><div>${escapeHtml(String(p.email ?? ""))}</div></div></div>`;
    }
    case "dbform": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      const method = String(p.method ?? "POST").toUpperCase();
      if (apiUrl) scripts.push(submitFormScript(elId, apiUrl, method, ""));
      const fields = String(p.fields ?? "").split(/\r\n|\r|\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
        const [name = "", type = "text", label = ""] = l.split("|").map((s) => s.trim());
        const safeName = escapeAttr(name);
        const safeLabel = escapeHtml(label || name);
        const input = type === "textarea" ? `<textarea name="${safeName}"></textarea>` : `<input type="${escapeAttr(type || "text")}" name="${safeName}">`;
        return `<label>${safeLabel}</label>${input}`;
      }).join("");
      return `${openTag(cmp, "form")}${fields}<button type="submit">Submit</button></form>`;
    }
    case "searchresults": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      const param = String(p.param ?? "q").trim() || "q";
      if (apiUrl) scripts.push(searchResultsScript(elId, apiUrl, param));
      return `${openTag(cmp, "div", `data-api="${escapeAttr(apiUrl)}"`)}</div>`;
    }
    case "productcard": {
      const img = String(p.imageSrc ?? "").trim() ? `<img src="${escapeAttr(String(p.imageSrc))}" alt="">` : "";
      const pid = String(p.productId ?? "").trim();
      return `${openTag(cmp, "div")}${img}<h3>${escapeHtml(String(p.title ?? ""))}</h3><div class="sb-price">${escapeHtml(String(p.currency ?? ""))}${escapeHtml(String(p.price ?? ""))}</div><button type="button"${pid ? ` data-product-id="${escapeAttr(pid)}"` : ""}>${escapeHtml(String(p.buttonText ?? "Add to Cart"))}</button></div>`;
    }
    case "productgrid": {
      const apiUrl = String(p.apiUrl ?? "").trim();
      if (apiUrl) scripts.push(productGridScript(elId, apiUrl));
      return `${openTag(cmp, "div", `data-api="${escapeAttr(apiUrl)}"`)}</div>`;
    }
    case "price":
      return `${openTag(cmp, "span")}${escapeHtml(String(p.currency ?? ""))}${escapeHtml(String(p.amount ?? ""))}</span>`;
    case "quantity": {
      const min = Math.floor(Number(p.min) || 0);
      const max = Math.max(min, Math.floor(Number(p.max) || 99));
      const value = Math.min(max, Math.max(min, Math.floor(Number(p.value) || min)));
      scripts.push(quantityScript(elId, min, max));
      return `${openTag(cmp, "div")}<button type="button">\u2212</button><input type="text" inputmode="numeric" value="${value}"><button type="button">\uFF0B</button></div>`;
    }
    case "addtocart": {
      const pid = String(p.productId ?? "").trim();
      return `${openTag(cmp, "button", `type="button"${pid ? ` data-product-id="${escapeAttr(pid)}"` : ""}`)}${escapeHtml(String(p.text ?? "Add to Cart"))}</button>`;
    }
    case "cart": {
      const url = String(p.checkoutUrl ?? "#").trim() || "#";
      return `${openTag(cmp, "a", `href="${escapeAttr(url)}"`)}\u{1F6D2} ${escapeHtml(String(p.text ?? "Cart"))}</a>`;
    }
    case "checkout": {
      const url = String(p.url ?? "#").trim() || "#";
      return `${openTag(cmp, "a", `href="${escapeAttr(url)}"`)}${escapeHtml(String(p.text ?? "Checkout"))}</a>`;
    }
    default:
      return `${openTag(cmp, "div")}<!-- unknown component type: ${escapeHtml(cmp.type)} --></div>`;
  }
}
function componentHtml(cmp, scripts) {
  const before = String(cmp.props?.objectBeforeHtml ?? "");
  const after = String(cmp.props?.objectAfterHtml ?? "");
  return `${before}${componentHtmlRaw(cmp, scripts)}${after}`;
}
function mergedBlockHtml(items, effs) {
  const minX = Math.min(...effs.map((e) => e.x));
  const minY = Math.min(...effs.map((e) => e.y));
  const parts = [];
  for (let i = 0; i < items.length; i++) {
    const cmp = items[i];
    const eff = effs[i];
    const css = componentCss(cmp, { x: 0, y: 0, width: eff.width, height: eff.height }, eff.props);
    delete css.position;
    delete css.left;
    delete css.top;
    css.width = "100%";
    css.height = "100%";
    css["box-sizing"] = "border-box";
    const inner = componentHtml(cmp, []);
    const styled = inner.replace(/^(<[a-zA-Z][^>]*?)>/, `$1 style="${escapeAttr(cssDeclarations(css))}">`);
    parts.push(
      `<div style="position:absolute;left:${px(eff.x - minX)};top:${px(eff.y - minY)};width:${px(eff.width)};height:${px(eff.height)};">${styled}</div>`
    );
  }
  return parts.join("");
}

// src/store/projectStore.ts
function currentPage(state) {
  if (state.activeTemplateId) {
    const template = (state.project.templates ?? []).find((p) => p.id === state.activeTemplateId);
    if (template) return template;
  }
  const page = state.project.pages.find((p) => p.id === state.currentPageId);
  return page ?? state.project.pages[0];
}
function selectionIds(state) {
  if (state.selectedIds.length > 0) return state.selectedIds;
  return state.selectedId ? [state.selectedId] : [];
}
function withPage(state, fn) {
  if (state.activeTemplateId) {
    return {
      project: {
        ...state.project,
        templates: (state.project.templates ?? []).map((p) => p.id === state.activeTemplateId ? fn(p) : p)
      },
      dirty: true
    };
  }
  return {
    project: {
      ...state.project,
      pages: state.project.pages.map((p) => p.id === currentPage(state).id ? fn(p) : p)
    },
    dirty: true
  };
}
function snap(v, size, enabled) {
  return enabled ? Math.round(v / size) * size : Math.round(v);
}
function snapshotAtBreakpoint(c, breakpoints, breakpointId, baseWidth) {
  return snapshotOverride(
    resolveComponent(c, breakpoints, breakpointId, baseWidth),
    resolveComponentHidden(c, breakpoints, breakpointId)
  );
}
function guideGoverningBreakpointId(guide, breakpoints, targetId) {
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return null;
  const direction = breakpointDirection(target);
  let best = null;
  for (const b of breakpoints) {
    if (breakpointDirection(b) !== direction) continue;
    if (direction === "max" && b.maxWidth < target.maxWidth) continue;
    if (direction === "min" && b.maxWidth > target.maxWidth) continue;
    if (!guide.overrides?.[b.id]) continue;
    if (!best) best = b;
    else if (direction === "max" && b.maxWidth < best.maxWidth) best = b;
    else if (direction === "min" && b.maxWidth > best.maxWidth) best = b;
  }
  return best?.id ?? null;
}
function resolveGuide(guide, breakpoints, targetId, baseWidth) {
  if (!targetId) return guide;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return guide;
  const gid = guideGoverningBreakpointId(guide, breakpoints, targetId);
  const sourceWidth = gid ? breakpoints.find((b) => b.id === gid)?.maxWidth ?? target.maxWidth : baseWidth;
  const scale = sourceWidth > 0 ? target.maxWidth / sourceWidth : 1;
  const ov = gid ? guide.overrides?.[gid] : void 0;
  return {
    ...guide,
    position: Math.round((ov?.position ?? guide.position) * scale),
    start: Math.round((ov?.start ?? guide.start) * scale),
    length: Math.round((ov?.length ?? guide.length) * scale)
  };
}
function snapshotGuideAtBreakpoint(guide, breakpoints, breakpointId, baseWidth) {
  const resolved = resolveGuide(guide, breakpoints, breakpointId, baseWidth);
  return { position: resolved.position, start: resolved.start, length: resolved.length };
}
var PAGE_BOTTOM_PADDING = 50;
function fitPageHeight(page, bottom, gridSize, snapEnabled) {
  const raw = bottom + PAGE_BOTTOM_PADDING;
  const needed = snapEnabled ? Math.ceil(raw / gridSize) * gridSize : Math.round(raw);
  return needed > page.height ? { ...page, height: needed } : page;
}
var useProjectStore = create((set, get) => {
  const initial = createProject();
  return {
    project: initial,
    currentPageId: initial.pages[0].id,
    selectedId: null,
    selectedIds: [],
    selectedGuideId: null,
    activeBreakpointId: null,
    activeTemplateId: null,
    zoom: 1,
    snapToGrid: true,
    gridSize: 10,
    gridVisible: true,
    selectionFrameGap: 10,
    filePath: null,
    dirty: false,
    tool: "pointer",
    manageBreakpointsOpen: false,
    breakpointEditor: null,
    codeDialog: null,
    contextMenu: null,
    clipboard: null,
    styleClipboard: null,
    boxDialog: null,
    newPageDialogOpen: false,
    openDbPages: [],
    activeDbPage: null,
    connectionsOpen: false,
    selectedConnectionId: null,
    selectedTableId: null,
    newProject: () => {
      const p = createProject();
      set({ project: p, currentPageId: p.pages[0].id, selectedId: null, selectedIds: [], selectedGuideId: null, activeBreakpointId: null, activeTemplateId: null, filePath: null, dirty: false });
    },
    loadProject: (project, filePath) => set({
      // merge db defaults so projects saved before new db fields existed still load
      project: {
        ...project,
        templates: project.templates ?? [],
        breakpoints: sortBreakpoints((project.breakpoints ?? []).map((bp) => ({ ...bp, direction: bp.direction ?? "max" }))),
        database: { ...createDatabaseState(), ...project.database }
      },
      currentPageId: project.pages[0]?.id ?? "",
      selectedId: null,
      selectedIds: [],
      selectedGuideId: null,
      activeBreakpointId: null,
      activeTemplateId: null,
      filePath,
      dirty: false
    }),
    markSaved: (filePath) => set({ filePath, dirty: false }),
    renameProject: (name) => set((s) => ({ project: { ...s.project, name }, dirty: true })),
    addPage: (templateId = null) => set((s) => {
      let n = s.project.pages.length + 1;
      let name = `page${n}`;
      while (s.project.pages.some((p) => p.name === name)) name = `page${++n}`;
      const page = { ...createPage(name), templateId };
      return {
        project: { ...s.project, pages: [...s.project.pages, page] },
        currentPageId: page.id,
        activeTemplateId: null,
        selectedId: null,
        selectedIds: [],
        selectedGuideId: null,
        dirty: true
      };
    }),
    renamePage: (pageId, name) => set((s) => ({
      project: { ...s.project, pages: s.project.pages.map((p) => p.id === pageId ? { ...p, name } : p) },
      dirty: true
    })),
    deletePage: (pageId) => set((s) => {
      if (s.project.pages.length <= 1) return {};
      const pages = s.project.pages.filter((p) => p.id !== pageId);
      return {
        project: { ...s.project, pages },
        currentPageId: s.currentPageId === pageId ? pages[0].id : s.currentPageId,
        selectedId: null,
        selectedIds: [],
        selectedGuideId: null,
        dirty: true
      };
    }),
    clonePage: (pageId) => set((s) => {
      const src = s.project.pages.find((p) => p.id === pageId);
      if (!src) return {};
      const clone = JSON.parse(JSON.stringify(src));
      clone.id = uid("page");
      clone.name = src.name + "_copy";
      clone.components = clone.components.map((c) => ({ ...c, id: uid("cmp") }));
      const idx = s.project.pages.findIndex((p) => p.id === pageId);
      const pages = [...s.project.pages];
      pages.splice(idx + 1, 0, clone);
      return { project: { ...s.project, pages }, currentPageId: clone.id, selectedId: null, selectedIds: [], selectedGuideId: null, dirty: true };
    }),
    selectPage: (pageId) => set({ currentPageId: pageId, activeTemplateId: null, selectedId: null, selectedIds: [], selectedGuideId: null, activeDbPage: null }),
    updatePageProps: (pageId, patch) => set((s) => ({
      project: s.activeTemplateId === pageId ? {
        ...s.project,
        templates: (s.project.templates ?? []).map((p) => p.id === pageId ? { ...p, ...patch } : p)
      } : { ...s.project, pages: s.project.pages.map((p) => p.id === pageId ? { ...p, ...patch } : p) },
      dirty: true
    })),
    setTool: (tool) => set({ tool }),
    addComponent: (type, x, y) => {
      const def2 = COMPONENT_MAP[type];
      if (!def2) return null;
      const s = get();
      const w = def2.defaultSize.width;
      const h = def2.defaultSize.height;
      const sx = snap(x, s.gridSize, s.snapToGrid);
      const sy = snap(y, s.gridSize, s.snapToGrid);
      const comp = {
        id: uid("cmp"),
        type,
        x: sx - w / 2,
        y: sy - h / 2,
        width: w,
        height: h,
        props: { ...def2.defaultProps },
        events: {},
        overrides: {}
      };
      set((st) => ({
        ...withPage(
          st,
          (p) => fitPageHeight({ ...p, components: [...p.components, comp] }, comp.y + comp.height, st.gridSize, st.snapToGrid)
        ),
        selectedId: comp.id,
        selectedIds: [comp.id],
        selectedGuideId: null,
        tool: "pointer"
      }));
      return comp.id;
    },
    selectComponent: (id) => set({ selectedId: id, selectedIds: id ? [id] : [], selectedGuideId: null }),
    selectComponents: (ids) => {
      const unique = [...new Set(ids)].filter(Boolean);
      set({ selectedIds: unique, selectedId: unique[0] ?? null, selectedGuideId: null });
    },
    toggleComponentSelection: (id) => set((s) => {
      const selected = s.selectedIds.includes(id) ? s.selectedIds.filter((selectedId) => selectedId !== id) : [...s.selectedIds, id];
      return { selectedIds: selected, selectedId: selected[0] ?? null, selectedGuideId: null };
    }),
    deleteComponent: (id) => set((s) => ({
      ...withPage(s, (p) => ({ ...p, components: p.components.filter((c) => c.id !== id) })),
      selectedId: s.selectedId === id ? null : s.selectedId,
      selectedIds: s.selectedIds.filter((selectedId) => selectedId !== id)
    })),
    setGeometry: (id, geo) => set(
      (s) => withPage(s, (p) => {
        const baseWidth = responsiveBaseWidth(p);
        const components = p.components.map((c) => {
          if (c.id !== id) return c;
          const g = {};
          if (geo.x !== void 0) g.x = geo.x;
          if (geo.y !== void 0) g.y = geo.y;
          if (geo.width !== void 0) g.width = geo.width;
          if (geo.height !== void 0) g.height = geo.height;
          if (s.activeBreakpointId) {
            const prev = c.overrides[s.activeBreakpointId] ?? snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, baseWidth);
            return { ...c, overrides: { ...c.overrides, [s.activeBreakpointId]: { ...prev, ...g } } };
          }
          return { ...c, ...g };
        });
        const changed = components.find((c) => c.id === id);
        const page = { ...p, components };
        if (!changed) return page;
        const eff = resolveComponent(changed, s.project.breakpoints, s.activeBreakpointId, baseWidth);
        return fitPageHeight(page, eff.y + eff.height, s.gridSize, s.snapToGrid);
      })
    ),
    updateProps: (id, patch) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => {
          if (c.id !== id) return c;
          if (s.activeBreakpointId) {
            const prev = c.overrides[s.activeBreakpointId] ?? snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(p));
            return {
              ...c,
              overrides: {
                ...c.overrides,
                [s.activeBreakpointId]: { ...prev, props: { ...prev.props ?? {}, ...patch } }
              }
            };
          }
          return { ...c, props: { ...c.props, ...patch } };
        })
      }))
    ),
    updateEvents: (id, events) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => c.id === id ? { ...c, events } : c)
      }))
    ),
    arrange: (id, op) => set(
      (s) => withPage(s, (p) => {
        const list = [...p.components];
        const idx = list.findIndex((c) => c.id === id);
        if (idx < 0) return p;
        const [item] = list.splice(idx, 1);
        if (op === "front") list.push(item);
        else if (op === "back") list.unshift(item);
        else if (op === "forward") list.splice(Math.min(idx + 1, list.length), 0, item);
        else list.splice(Math.max(idx - 1, 0), 0, item);
        return { ...p, components: list };
      })
    ),
    openContextMenu: (menu) => set({ contextMenu: menu }),
    closeContextMenu: () => set({ contextMenu: null }),
    copyComponent: (id) => set((s) => {
      const c = currentPage(s).components.find((c2) => c2.id === id);
      return c ? { clipboard: JSON.parse(JSON.stringify(c)) } : {};
    }),
    cutComponent: (id) => set((s) => {
      const page = currentPage(s);
      const c = page.components.find((c2) => c2.id === id);
      if (!c) return {};
      return {
        clipboard: JSON.parse(JSON.stringify(c)),
        project: {
          ...s.project,
          pages: s.project.pages.map(
            (p) => p.id === page.id ? { ...p, components: p.components.filter((c2) => c2.id !== id) } : p
          )
        },
        selectedId: s.selectedId === id ? null : s.selectedId,
        selectedIds: s.selectedIds.filter((selectedId) => selectedId !== id),
        dirty: true
      };
    }),
    pasteComponent: (inPlace) => {
      const s = get();
      if (!s.clipboard) return null;
      const comp = JSON.parse(JSON.stringify(s.clipboard));
      comp.id = uid("cmp");
      if (!inPlace) {
        comp.x += 10;
        comp.y += 10;
      }
      set((st) => ({
        ...withPage(
          st,
          (p) => fitPageHeight({ ...p, components: [...p.components, comp] }, comp.y + comp.height, st.gridSize, st.snapToGrid)
        ),
        selectedId: comp.id,
        selectedIds: [comp.id],
        selectedGuideId: null
      }));
      return comp.id;
    },
    copyStyle: (id) => set((s) => {
      const c = currentPage(s).components.find((c2) => c2.id === id);
      return c ? { styleClipboard: JSON.parse(JSON.stringify(c.props)) } : {};
    }),
    pasteStyle: (id) => set((s) => {
      if (!s.styleClipboard) return {};
      const style = JSON.parse(JSON.stringify(s.styleClipboard));
      return withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => {
          if (c.id !== id) return c;
          if (s.activeBreakpointId) {
            const prev = c.overrides[s.activeBreakpointId] ?? snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(p));
            return {
              ...c,
              overrides: { ...c.overrides, [s.activeBreakpointId]: { ...prev, props: style } }
            };
          }
          return { ...c, props: style };
        })
      }));
    }),
    renameComponentId: (id, newId) => {
      const s = get();
      const trimmed = newId.trim();
      if (!/^[A-Za-z][\w-]*$/.test(trimmed)) return false;
      if (currentPage(s).components.some((c) => c.id === trimmed && c.id !== id)) return false;
      set((st) => ({
        ...withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => c.id === id ? { ...c, id: trimmed } : c)
        })),
        selectedId: st.selectedId === id ? trimmed : st.selectedId,
        selectedIds: st.selectedIds.map((selectedId) => selectedId === id ? trimmed : selectedId),
        contextMenu: st.contextMenu?.componentId === id ? { ...st.contextMenu, componentId: trimmed } : st.contextMenu
      }));
      return true;
    },
    cloneComponent: (id, hideOriginal) => {
      const s = get();
      const src = currentPage(s).components.find((c) => c.id === id);
      if (!src) return null;
      const clone = JSON.parse(JSON.stringify(src));
      clone.id = uid("cmp");
      clone.x += 10;
      clone.y += 10;
      clone.hidden = false;
      set((st) => ({
        ...withPage(st, (p) => {
          const components = hideOriginal ? p.components.map((c) => c.id === id ? { ...c, hidden: true } : c) : p.components;
          return fitPageHeight({ ...p, components: [...components, clone] }, clone.y + clone.height, st.gridSize, st.snapToGrid);
        }),
        selectedId: clone.id,
        selectedIds: [clone.id],
        selectedGuideId: null
      }));
      return clone.id;
    },
    toggleHidden: (id) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => c.id === id ? { ...c, hidden: !c.hidden } : c)
      }))
    ),
    setHidden: (id, hidden) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => c.id === id ? { ...c, hidden } : c)
      }))
    ),
    setHiddenIn: (id, breakpointId, hidden) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => {
          if (c.id !== id) return c;
          const cur = new Set(c.hiddenIn ?? []);
          if (hidden) cur.add(breakpointId);
          else cur.delete(breakpointId);
          const prev = c.overrides[breakpointId] ?? snapshotAtBreakpoint(c, s.project.breakpoints, breakpointId, responsiveBaseWidth(p));
          return {
            ...c,
            hiddenIn: [...cur],
            overrides: { ...c.overrides, [breakpointId]: { ...prev, hidden } }
          };
        })
      }))
    ),
    toggleLocked: (id) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => c.id === id ? { ...c, locked: !c.locked } : c)
      }))
    ),
    centerInPage: (id, axis, artboardWidth, pageHeight) => {
      const s = get();
      const page = currentPage(s);
      const c = page.components.find((c2) => c2.id === id);
      if (!c) return;
      const eff = effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(page));
      const geo = {};
      if (axis === "h" || axis === "both") geo.x = Math.round((artboardWidth - eff.width) / 2);
      if (axis === "v" || axis === "both") geo.y = Math.round((pageHeight - eff.height) / 2);
      s.setGeometry(id, geo);
    },
    // ---- selection operations ----
    arrangeSelection: (op) => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      const page = currentPage(s);
      const ordered = page.components.filter((c) => ids.includes(c.id)).map((c) => c.id);
      const seq = op === "forward" || op === "back" ? [...ordered].reverse() : ordered;
      for (const id of seq) get().arrange(id, op);
    },
    deleteSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      set((st) => ({
        ...withPage(st, (p) => ({ ...p, components: p.components.filter((c) => !ids.includes(c.id)) })),
        selectedId: null,
        selectedIds: []
      }));
    },
    alignSelection: (mode, artboardWidth, pageHeight) => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const effs = page.components.filter((c) => ids.includes(c.id)).map((c) => ({ id: c.id, eff: effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth) }));
      if (!effs.length) return;
      const single = effs.length === 1;
      const anchorId = ids.includes(s.selectedId ?? "") ? s.selectedId : ids[0];
      const anchor = effs.find((e) => e.id === anchorId) ?? effs[0];
      const minX = single ? 0 : anchor.eff.x;
      const maxX = single ? artboardWidth : anchor.eff.x + anchor.eff.width;
      const minY = single ? 0 : anchor.eff.y;
      const maxY = single ? pageHeight : anchor.eff.y + anchor.eff.height;
      for (const { id, eff } of effs) {
        if (!single && id === anchor.id) continue;
        const geo = {};
        if (mode === "left") geo.x = Math.round(minX);
        else if (mode === "centerH") geo.x = Math.round((minX + maxX - eff.width) / 2);
        else if (mode === "right") geo.x = Math.round(maxX - eff.width);
        else if (mode === "top") geo.y = Math.round(minY);
        else if (mode === "middleV") geo.y = Math.round((minY + maxY - eff.height) / 2);
        else if (mode === "bottom") geo.y = Math.round(maxY - eff.height);
        get().setGeometry(id, geo);
      }
    },
    matchSizeSelection: (mode) => {
      const s = get();
      const ids = selectionIds(s);
      if (ids.length < 2) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const anchorId = ids.includes(s.selectedId ?? "") ? s.selectedId : ids[0];
      const anchor = page.components.find((c) => c.id === anchorId);
      if (!anchor) return;
      const aEff = effectiveComponent(anchor, s.project.breakpoints, s.activeBreakpointId, baseWidth);
      for (const id of ids) {
        if (id === anchorId) continue;
        const geo = {};
        if (mode === "width" || mode === "both") geo.width = aEff.width;
        if (mode === "height" || mode === "both") geo.height = aEff.height;
        get().setGeometry(id, geo);
      }
    },
    distributeSelection: (axis) => {
      const s = get();
      const ids = selectionIds(s);
      if (ids.length < 3) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const effs = page.components.filter((c) => ids.includes(c.id)).map((c) => ({ id: c.id, eff: effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth) }));
      const pos = (e) => axis === "h" ? e.eff.x : e.eff.y;
      const size = (e) => axis === "h" ? e.eff.width : e.eff.height;
      effs.sort((a, b) => pos(a) - pos(b));
      const first = effs[0];
      const last = effs[effs.length - 1];
      const span = pos(last) + size(last) - pos(first);
      const totalSize = effs.reduce((sum, e) => sum + size(e), 0);
      const gap = (span - totalSize) / (effs.length - 1);
      let cursor = pos(first);
      for (const e of effs) {
        const target = Math.round(cursor);
        get().setGeometry(e.id, axis === "h" ? { x: target } : { y: target });
        cursor += size(e) + gap;
      }
    },
    scaleSelection: (percent) => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length || !Number.isFinite(percent) || percent <= 0) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const effs = page.components.filter((c) => ids.includes(c.id)).map((c) => ({ id: c.id, eff: effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth) }));
      if (!effs.length) return;
      const minX = Math.min(...effs.map((e) => e.eff.x));
      const minY = Math.min(...effs.map((e) => e.eff.y));
      const f = percent / 100;
      for (const { id, eff } of effs) {
        get().setGeometry(id, {
          x: Math.round(minX + (eff.x - minX) * f),
          y: Math.round(minY + (eff.y - minY) * f),
          width: Math.max(4, Math.round(eff.width * f)),
          height: Math.max(4, Math.round(eff.height * f))
        });
      }
    },
    rotateSelection: (deltaDeg) => {
      const s = get();
      for (const id of selectionIds(s)) {
        const c = currentPage(get()).components.find((c2) => c2.id === id);
        if (!c) continue;
        const eff = effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(currentPage(get())));
        get().updateProps(id, transformPatch(eff.props.transform, (t) => {
          t.rotate += deltaDeg;
        }));
      }
    },
    flipSelection: (axis) => {
      const s = get();
      for (const id of selectionIds(s)) {
        const c = currentPage(get()).components.find((c2) => c2.id === id);
        if (!c) continue;
        const eff = effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(currentPage(get())));
        get().updateProps(id, transformPatch(eff.props.transform, (t) => {
          if (axis === "h") t.flipH = !t.flipH;
          else t.flipV = !t.flipV;
        }));
      }
    },
    matchPageWidthSelection: (artboardWidth) => {
      const s = get();
      for (const id of selectionIds(s)) get().setGeometry(id, { x: 0, width: Math.round(artboardWidth) });
    },
    groupSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (ids.length < 2) return;
      const gid = uid("grp");
      set(
        (st) => withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => ids.includes(c.id) ? { ...c, props: { ...c.props, groupId: gid } } : c)
        }))
      );
    },
    ungroupSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      const page = currentPage(s);
      const gids = new Set(
        page.components.filter((c) => ids.includes(c.id) && c.props?.groupId).map((c) => String(c.props.groupId))
      );
      if (!gids.size) return;
      set(
        (st) => withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (!c.props?.groupId || !gids.has(String(c.props.groupId))) return c;
            const props = { ...c.props };
            delete props.groupId;
            return { ...c, props };
          })
        }))
      );
    },
    mergeSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (ids.length < 2) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const items = page.components.filter((c) => ids.includes(c.id));
      if (items.length < 2) return;
      const effs = items.map((c) => effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth));
      const html = mergedBlockHtml(items, effs);
      const minX = Math.min(...effs.map((e) => e.x));
      const minY = Math.min(...effs.map((e) => e.y));
      const maxX = Math.max(...effs.map((e) => e.x + e.width));
      const maxY = Math.max(...effs.map((e) => e.y + e.height));
      const def2 = COMPONENT_MAP["htmlEmbed"];
      const merged = {
        id: uid("cmp"),
        type: "htmlEmbed",
        x: minX,
        y: minY,
        width: Math.max(4, maxX - minX),
        height: Math.max(4, maxY - minY),
        props: {
          ...def2?.defaultProps ?? {},
          html,
          mergedItems: JSON.parse(JSON.stringify(items))
        },
        events: {},
        overrides: {}
      };
      set((st) => ({
        ...withPage(
          st,
          (p) => fitPageHeight(
            { ...p, components: [...p.components.filter((c) => !ids.includes(c.id)), merged] },
            merged.y + merged.height,
            st.gridSize,
            st.snapToGrid
          )
        ),
        selectedId: merged.id,
        selectedIds: [merged.id],
        selectedGuideId: null
      }));
    },
    splitSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      const page = currentPage(s);
      const targets = page.components.filter((c) => ids.includes(c.id) && Array.isArray(c.props?.mergedItems));
      if (!targets.length) return;
      const restored = targets.flatMap(
        (t) => t.props.mergedItems.map((it) => ({
          ...JSON.parse(JSON.stringify(it)),
          id: uid("cmp")
        }))
      );
      const targetIds = targets.map((t) => t.id);
      set((st) => ({
        ...withPage(st, (p) => ({
          ...p,
          components: [...p.components.filter((c) => !targetIds.includes(c.id)), ...restored]
        })),
        selectedId: restored[0]?.id ?? null,
        selectedIds: restored.map((r) => r.id)
      }));
    },
    saveSelectionAsBlock: (name) => {
      const s = get();
      const ids = selectionIds(s);
      const page = currentPage(s);
      const items = page.components.filter((c) => ids.includes(c.id));
      if (!items.length) return;
      const minX = Math.min(...items.map((c) => c.x));
      const minY = Math.min(...items.map((c) => c.y));
      const cloned = items.map((c) => ({
        ...JSON.parse(JSON.stringify(c)),
        x: c.x - minX,
        y: c.y - minY
      }));
      const block = { id: uid("blk"), name: name.trim() || "Block", items: cloned };
      set((st) => ({
        project: { ...st.project, customBlocks: [...st.project.customBlocks ?? [], block] },
        dirty: true
      }));
    },
    insertBlock: (blockId) => {
      const s = get();
      const block = s.project.customBlocks?.find((b) => b.id === blockId);
      if (!block || !block.items.length) return;
      const offset = 20;
      const items = block.items.map((it) => ({
        ...JSON.parse(JSON.stringify(it)),
        id: uid("cmp"),
        x: it.x + offset,
        y: it.y + offset
      }));
      const maxBottom = Math.max(...items.map((i) => i.y + i.height));
      set((st) => ({
        ...withPage(
          st,
          (p) => fitPageHeight({ ...p, components: [...p.components, ...items] }, maxBottom, st.gridSize, st.snapToGrid)
        ),
        selectedId: items[0].id,
        selectedIds: items.map((i) => i.id),
        selectedGuideId: null
      }));
    },
    deleteBlock: (blockId) => set((st) => ({
      project: { ...st.project, customBlocks: (st.project.customBlocks ?? []).filter((b) => b.id !== blockId) },
      dirty: true
    })),
    lockSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      const page = currentPage(s);
      const anyUnlocked = page.components.some((c) => ids.includes(c.id) && !c.locked);
      set(
        (st) => withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => ids.includes(c.id) ? { ...c, locked: anyUnlocked } : c)
        }))
      );
    },
    lockAll: () => set(
      (st) => withPage(st, (p) => ({ ...p, components: p.components.map((c) => ({ ...c, locked: true })) }))
    ),
    unlockAll: () => set(
      (st) => withPage(st, (p) => ({ ...p, components: p.components.map((c) => ({ ...c, locked: false })) }))
    ),
    toggleProtectedSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      const page = currentPage(s);
      const allProtected = page.components.filter((c) => ids.includes(c.id)).every((c) => c.props?.protected);
      set(
        (st) => withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (!ids.includes(c.id)) return c;
            const props = { ...c.props };
            if (allProtected) delete props.protected;
            else props.protected = true;
            return { ...c, props };
          })
        }))
      );
    },
    toggleFlexboxSelection: () => {
      const s = get();
      const ids = selectionIds(s);
      if (!ids.length) return;
      const page = currentPage(s);
      const baseWidth = responsiveBaseWidth(page);
      const allFlex = page.components.filter((c) => ids.includes(c.id)).every((c) => effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth).props?.display === "flex");
      for (const id of ids) {
        if (allFlex) {
          const c = currentPage(get()).components.find((c2) => c2.id === id);
          if (!c) continue;
          const eff = effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, baseWidth);
          const patch = {};
          for (const k of ["display", "flexDirection", "flexWrap", "gap", "justifyContent", "alignItems"]) {
            if (eff.props[k] !== void 0) patch[k] = "";
          }
          get().updateProps(id, patch);
        } else {
          get().updateProps(id, { display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" });
        }
      }
    },
    setBoxSelection: (kind, value) => {
      const v = value.trim();
      if (v && !/^[\d.a-z%]+(\s+[\d.a-z%]+){0,3}$/i.test(v)) return;
      const s = get();
      for (const id of selectionIds(s)) get().updateProps(id, { [kind]: v });
    },
    openNewPageDialog: () => set({ newPageDialogOpen: true }),
    closeNewPageDialog: () => set({ newPageDialogOpen: false }),
    openBoxDialog: (kind) => set({ boxDialog: { kind } }),
    closeBoxDialog: () => set({ boxDialog: null }),
    addTemplate: (name) => {
      const clean = name.trim().replace(/\.wdt$/i, "") || "Template";
      const template = {
        ...createPage(clean, clean),
        name: `${clean}.wdt`,
        title: clean,
        templateId: null
      };
      set((s) => ({
        project: { ...s.project, templates: [...s.project.templates ?? [], template] },
        activeTemplateId: template.id,
        selectedId: null,
        selectedIds: [],
        selectedGuideId: null,
        dirty: true
      }));
      return template.id;
    },
    openTemplate: (id) => set({ activeTemplateId: id, selectedId: null, selectedIds: [], selectedGuideId: null, activeDbPage: null }),
    closeTemplateEditor: () => set({ activeTemplateId: null, selectedId: null, selectedIds: [], selectedGuideId: null }),
    renameTemplate: (id, name) => set((s) => ({
      project: {
        ...s.project,
        templates: (s.project.templates ?? []).map(
          (template) => template.id === id ? { ...template, name, title: name.replace(/\.wdt$/i, "") } : template
        )
      },
      dirty: true
    })),
    deleteTemplate: (id) => set((s) => ({
      project: {
        ...s.project,
        templates: (s.project.templates ?? []).filter((template) => template.id !== id),
        pages: s.project.pages.map((page) => page.templateId === id ? { ...page, templateId: null } : page)
      },
      activeTemplateId: s.activeTemplateId === id ? null : s.activeTemplateId,
      selectedId: null,
      selectedIds: [],
      selectedGuideId: null,
      dirty: true
    })),
    selectGuide: (id) => set({ selectedGuideId: id, selectedId: null, selectedIds: [] }),
    addGuide: (guide) => {
      const id = uid("guide");
      const item = { ...guide, id, overrides: {} };
      set((s) => ({
        ...withPage(s, (p) => ({ ...p, guides: [...p.guides ?? [], item] })),
        selectedGuideId: id,
        selectedId: null,
        selectedIds: []
      }));
      return id;
    },
    updateGuide: (id, patch) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        guides: (p.guides ?? []).map((guide) => {
          if (guide.id !== id) return guide;
          if (!s.activeBreakpointId) return { ...guide, ...patch };
          const prev = guide.overrides?.[s.activeBreakpointId] ?? snapshotGuideAtBreakpoint(guide, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(p));
          return {
            ...guide,
            overrides: {
              ...guide.overrides ?? {},
              [s.activeBreakpointId]: { ...prev, ...patch }
            }
          };
        })
      }))
    ),
    deleteGuide: (id) => set((s) => ({
      ...withPage(s, (p) => ({ ...p, guides: (p.guides ?? []).filter((guide) => guide.id !== id) })),
      selectedGuideId: s.selectedGuideId === id ? null : s.selectedGuideId
    })),
    addBreakpoint: (name, maxWidth) => set((s) => ({
      project: {
        ...s.project,
        breakpoints: sortBreakpoints([
          ...s.project.breakpoints,
          { id: uid("bp"), name, maxWidth, direction: "max", orientation: "none", fontSize: null }
        ])
      },
      dirty: true
    })),
    removeBreakpoint: (id) => set((s) => ({
      project: {
        ...s.project,
        breakpoints: s.project.breakpoints.filter((b) => b.id !== id),
        // drop this breakpoint's overrides/hidden flags on every component
        pages: s.project.pages.map((p) => ({
          ...p,
          components: p.components.map((c) => {
            if (!c.overrides[id] && !(c.hiddenIn ?? []).includes(id)) return c;
            const overrides = { ...c.overrides };
            delete overrides[id];
            return { ...c, overrides, hiddenIn: (c.hiddenIn ?? []).filter((b) => b !== id) };
          }),
          guides: (p.guides ?? []).map((guide) => {
            if (!guide.overrides?.[id]) return guide;
            const overrides = { ...guide.overrides ?? {} };
            delete overrides[id];
            return { ...guide, overrides };
          })
        }))
      },
      activeBreakpointId: s.activeBreakpointId === id ? null : s.activeBreakpointId,
      dirty: true
    })),
    removeAllBreakpoints: () => set((s) => ({
      project: {
        ...s.project,
        breakpoints: [],
        pages: s.project.pages.map((p) => ({
          ...p,
          components: p.components.map((c) => ({ ...c, overrides: {}, hiddenIn: [] })),
          guides: (p.guides ?? []).map((guide) => ({ ...guide, overrides: {} }))
        }))
      },
      activeBreakpointId: null,
      dirty: true
    })),
    moveBreakpoint: (id, dir) => set((s) => {
      const list = [...s.project.breakpoints];
      const idx = list.findIndex((b) => b.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= list.length) return {};
      const [item] = list.splice(idx, 1);
      list.splice(target, 0, item);
      return { project: { ...s.project, breakpoints: list }, dirty: true };
    }),
    upsertBreakpoint: (bp) => set((s) => {
      if (bp.id) {
        return {
          project: {
            ...s.project,
            breakpoints: sortBreakpoints(
              s.project.breakpoints.map(
                (b) => b.id === bp.id ? { ...b, maxWidth: bp.maxWidth, direction: bp.direction, orientation: bp.orientation, fontSize: bp.fontSize } : b
              )
            )
          },
          dirty: true
        };
      }
      const created = {
        id: uid("bp"),
        name: `${bp.direction === "min" ? "\u2265" : "\u2264"} ${bp.maxWidth}px`,
        maxWidth: bp.maxWidth,
        direction: bp.direction,
        orientation: bp.orientation,
        fontSize: bp.fontSize
      };
      return {
        project: { ...s.project, breakpoints: sortBreakpoints([...s.project.breakpoints, created]) },
        dirty: true
      };
    }),
    setBreakpointMode: (mode) => set((s) => ({ project: { ...s.project, breakpointMode: mode }, dirty: true })),
    setActiveBreakpoint: (id) => set({ activeBreakpointId: id, selectedId: null, selectedIds: [], selectedGuideId: null }),
    openManageBreakpoints: () => set({ manageBreakpointsOpen: true }),
    closeManageBreakpoints: () => set({ manageBreakpointsOpen: false }),
    openBreakpointEditor: (editor) => set({ breakpointEditor: editor }),
    closeBreakpointEditor: () => set({ breakpointEditor: null }),
    openCodeDialog: (dialog) => set({ codeDialog: dialog }),
    closeCodeDialog: () => set({ codeDialog: null }),
    clearOverride: (componentId, breakpointId) => set(
      (s) => withPage(s, (p) => ({
        ...p,
        components: p.components.map((c) => {
          if (c.id !== componentId) return c;
          const overrides = { ...c.overrides };
          delete overrides[breakpointId];
          return { ...c, overrides, hiddenIn: (c.hiddenIn ?? []).filter((id) => id !== breakpointId) };
        })
      }))
    ),
    setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.25, zoom)) }),
    toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
    toggleGrid: () => set((s) => ({ gridVisible: !s.gridVisible })),
    setGridSize: (size) => set((s) => ({ gridSize: Math.min(200, Math.max(2, Math.round(size) || 10)) })),
    setSelectionFrameGap: (gap) => set({ selectionFrameGap: Math.min(24, Math.max(0, Math.round(gap) || 0)) }),
    // ---- database workspace ----
    openDatabase: (page) => set((s) => {
      const db = dbOf(s.project);
      return {
        openDbPages: s.openDbPages.includes(page) ? s.openDbPages : [...s.openDbPages, page],
        activeDbPage: page,
        selectedConnectionId: s.selectedConnectionId ?? db.connections[0]?.id ?? null,
        selectedTableId: s.selectedTableId ?? db.tables[0]?.id ?? null
      };
    }),
    closeDatabase: (page) => set((s) => {
      const target = page ?? s.activeDbPage;
      if (!target || !s.openDbPages.includes(target)) return {};
      const remaining = s.openDbPages.filter((p) => p !== target);
      return {
        openDbPages: remaining,
        activeDbPage: s.activeDbPage === target ? remaining[remaining.length - 1] ?? null : s.activeDbPage
      };
    }),
    setDatabasePage: (page) => set((s) => ({
      openDbPages: s.openDbPages.includes(page) ? s.openDbPages : [...s.openDbPages, page],
      activeDbPage: page
    })),
    openConnections: () => set((s) => ({
      connectionsOpen: true,
      selectedConnectionId: s.selectedConnectionId ?? dbOf(s.project).connections[0]?.id ?? null
    })),
    closeConnections: () => set({ connectionsOpen: false }),
    selectConnection: (id) => set({ selectedConnectionId: id }),
    selectDbTable: (id) => set({ selectedTableId: id }),
    saveConnection: (conn) => set((s) => {
      const db = dbOf(s.project);
      const exists = db.connections.some((c) => c.id === conn.id);
      const connections = exists ? db.connections.map((c) => c.id === conn.id ? conn : c) : [...db.connections, conn];
      return {
        project: withDb(s.project, { ...db, connections }),
        selectedConnectionId: conn.id,
        dirty: true
      };
    }),
    deleteConnection: (id) => set((s) => {
      const db = dbOf(s.project);
      return {
        project: withDb(s.project, { ...db, connections: db.connections.filter((c) => c.id !== id) }),
        selectedConnectionId: s.selectedConnectionId === id ? null : s.selectedConnectionId,
        dirty: true
      };
    }),
    saveTable: (table) => set((s) => {
      const db = dbOf(s.project);
      const exists = db.tables.some((t) => t.id === table.id);
      const tables = exists ? db.tables.map((t) => t.id === table.id ? table : t) : [...db.tables, table];
      return {
        project: withDb(s.project, { ...db, tables }),
        selectedTableId: table.id,
        dirty: true
      };
    }),
    deleteTable: (id) => set((s) => {
      const db = dbOf(s.project);
      return {
        project: withDb(s.project, { ...db, tables: db.tables.filter((t) => t.id !== id) }),
        selectedTableId: s.selectedTableId === id ? null : s.selectedTableId,
        dirty: true
      };
    }),
    saveDbObject: (kind, obj) => set((s) => {
      const db = dbOf(s.project);
      const list = db[kind];
      const next = list.some((o) => o.id === obj.id) ? list.map((o) => o.id === obj.id ? obj : o) : [...list, obj];
      return { project: withDb(s.project, { ...db, [kind]: next }), dirty: true };
    }),
    deleteDbObject: (kind, id) => set((s) => {
      const db = dbOf(s.project);
      return {
        project: withDb(s.project, { ...db, [kind]: db[kind].filter((o) => o.id !== id) }),
        dirty: true
      };
    }),
    updateApiConfig: (patch) => set((s) => {
      const db = dbOf(s.project);
      return { project: withDb(s.project, { ...db, api: { ...db.api, ...patch } }), dirty: true };
    })
  };
});
var FALLBACK_DB = createDatabaseState();
function dbOf(project) {
  return project.database ?? FALLBACK_DB;
}
function withDb(project, database) {
  return { ...project, database };
}
function effectiveComponent(c, breakpoints, activeBreakpointId, baseWidth) {
  return resolveComponent(c, breakpoints, activeBreakpointId, baseWidth);
}
export {
  COMPONENT_MAP,
  useProjectStore
};
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
