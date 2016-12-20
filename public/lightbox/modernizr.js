/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-csstransforms-csstransforms3d-opacity-touchevents-setclasses !*/
! function(e, n, t) {
	function r(e, n) {
		return typeof e === n
	}

	function s() {
		var e, n, t, s, o, i, a;
		for (var f in g)
			if (g.hasOwnProperty(f)) {
				if (e = [], n = g[f], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
					for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
				for (s = r(n.fn, "function") ? n.fn() : n.fn, o = 0; o < e.length; o++) i = e[o], a = i.split("."), 1 === a.length ? Modernizr[a[0]] = s : (!Modernizr[a[0]] || Modernizr[a[0]] instanceof Boolean || (Modernizr[a[0]] = new Boolean(Modernizr[a[0]])), Modernizr[a[0]][a[1]] = s), w.push((s ? "" : "no-") + a.join("-"))
			}
	}

	function o(e) {
		var n = x.className,
			t = Modernizr._config.classPrefix || "";
		if (S && (n = n.baseVal), Modernizr._config.enableJSClass) {
			var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
			n = n.replace(r, "$1" + t + "js$2")
		}
		Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), S ? x.className.baseVal = n : x.className = n)
	}

	function i() {
		return "function" != typeof n.createElement ? n.createElement(arguments[0]) : S ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
	}

	function a() {
		var e = n.body;
		return e || (e = i(S ? "svg" : "body"), e.fake = !0), e
	}

	function f(e, t, r, s) {
		var o, f, u, l, p = "modernizr",
			d = i("div"),
			c = a();
		if (parseInt(r, 10))
			for (; r--;) u = i("div"), u.id = s ? s[r] : p + (r + 1), d.appendChild(u);
		return o = i("style"), o.type = "text/css", o.id = "s" + p, (c.fake ? c : d).appendChild(o), c.appendChild(d), o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(n.createTextNode(e)), d.id = p, c.fake && (c.style.background = "", c.style.overflow = "hidden", l = x.style.overflow, x.style.overflow = "hidden", x.appendChild(c)), f = t(d, e), c.fake ? (c.parentNode.removeChild(c), x.style.overflow = l, x.offsetHeight) : d.parentNode.removeChild(d), !! f
	}

	function u(e, n) {
		return !!~("" + e).indexOf(n)
	}

	function l(e) {
		return e.replace(/([A-Z])/g, function(e, n) {
			return "-" + n.toLowerCase()
		}).replace(/^ms-/, "-ms-")
	}

	function p(n, r) {
		var s = n.length;
		if ("CSS" in e && "supports" in e.CSS) {
			for (; s--;)
				if (e.CSS.supports(l(n[s]), r)) return !0;
			return !1
		}
		if ("CSSSupportsRule" in e) {
			for (var o = []; s--;) o.push("(" + l(n[s]) + ":" + r + ")");
			return o = o.join(" or "), f("@supports (" + o + ") { #modernizr { position: absolute; } }", function(e) {
				return "absolute" == getComputedStyle(e, null).position
			})
		}
		return t
	}

	function d(e) {
		return e.replace(/([a-z])-([a-z])/g, function(e, n, t) {
			return n + t.toUpperCase()
		}).replace(/^-/, "")
	}

	function c(e, n, s, o) {
		function a() {
			l && (delete j.style, delete j.modElem)
		}
		if (o = r(o, "undefined") ? !1 : o, !r(s, "undefined")) {
			var f = p(e, s);
			if (!r(f, "undefined")) return f
		}
		for (var l, c, m, h, v, y = ["modernizr", "tspan"]; !j.style;) l = !0, j.modElem = i(y.shift()), j.style = j.modElem.style;
		for (m = e.length, c = 0; m > c; c++)
			if (h = e[c], v = j.style[h], u(h, "-") && (h = d(h)), j.style[h] !== t) {
				if (o || r(s, "undefined")) return a(), "pfx" == n ? h : !0;
				try {
					j.style[h] = s
				} catch (g) {}
				if (j.style[h] != v) return a(), "pfx" == n ? h : !0
			}
		return a(), !1
	}

	function m(e, n) {
		return function() {
			return e.apply(n, arguments)
		}
	}

	function h(e, n, t) {
		var s;
		for (var o in e)
			if (e[o] in n) return t === !1 ? e[o] : (s = n[e[o]], r(s, "function") ? m(s, t || n) : s);
		return !1
	}

	function v(e, n, t, s, o) {
		var i = e.charAt(0).toUpperCase() + e.slice(1),
			a = (e + " " + z.join(i + " ") + i).split(" ");
		return r(n, "string") || r(n, "undefined") ? c(a, n, s, o) : (a = (e + " " + E.join(i + " ") + i).split(" "), h(a, n, t))
	}

	function y(e, n, r) {
		return v(e, t, t, n, r)
	}
	var g = [],
		C = {
			_version: "3.3.1",
			_config: {
				classPrefix: "",
				enableClasses: !0,
				enableJSClass: !0,
				usePrefixes: !0
			},
			_q: [],
			on: function(e, n) {
				var t = this;
				setTimeout(function() {
					n(t[e])
				}, 0)
			},
			addTest: function(e, n, t) {
				g.push({
					name: e,
					fn: n,
					options: t
				})
			},
			addAsyncTest: function(e) {
				g.push({
					name: null,
					fn: e
				})
			}
		}, Modernizr = function() {};
	Modernizr.prototype = C, Modernizr = new Modernizr;
	var w = [],
		x = n.documentElement,
		S = "svg" === x.nodeName.toLowerCase(),
		_ = C._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
	C._prefixes = _;
	var b = C.testStyles = f;
	Modernizr.addTest("touchevents", function() {
		var t;
		if ("ontouchstart" in e || e.DocumentTouch && n instanceof DocumentTouch) t = !0;
		else {
			var r = ["@media (", _.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
			b(r, function(e) {
				t = 9 === e.offsetTop
			})
		}
		return t
	});
	var T = "Moz O ms Webkit",
		z = C._config.usePrefixes ? T.split(" ") : [];
	C._cssomPrefixes = z;
	var P = {
		elem: i("modernizr")
	};
	Modernizr._q.push(function() {
		delete P.elem
	});
	var j = {
		style: P.elem.style
	};
	Modernizr._q.unshift(function() {
		delete j.style
	});
	var E = C._config.usePrefixes ? T.toLowerCase().split(" ") : [];
	C._domPrefixes = E, C.testAllProps = v, C.testAllProps = y, Modernizr.addTest("csstransforms", function() {
		return -1 === navigator.userAgent.indexOf("Android 2.") && y("transform", "scale(1)", !0)
	});
	var k = "CSS" in e && "supports" in e.CSS,
		N = "supportsCSS" in e;
	Modernizr.addTest("supports", k || N), Modernizr.addTest("csstransforms3d", function() {
		var e = !! y("perspective", "1px", !0),
			n = Modernizr._config.usePrefixes;
		if (e && (!n || "webkitPerspective" in x.style)) {
			var t, r = "#modernizr{width:0;height:0}";
			Modernizr.supports ? t = "@supports (perspective: 1px)" : (t = "@media (transform-3d)", n && (t += ",(-webkit-transform-3d)")), t += "{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}", b(r + t, function(n) {
				e = 7 === n.offsetWidth && 18 === n.offsetHeight
			})
		}
		return e
	}), Modernizr.addTest("opacity", function() {
		var e = i("a").style;
		return e.cssText = _.join("opacity:.55;"), /^0.55$/.test(e.opacity)
	}), s(), o(w), delete C.addTest, delete C.addAsyncTest;
	for (var A = 0; A < Modernizr._q.length; A++) Modernizr._q[A]();
	e.Modernizr = Modernizr
}(window, document);