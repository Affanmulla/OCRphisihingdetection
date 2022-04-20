// Future JavaScript will go here



//Diable cods starts
// Google Analytics Tracking =================================================================

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45190281-6']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Add event tracking to G+ profile link
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('profile_link').addEventListener('click', function()
    {
        _gaq.push(['_trackEvent', 'Links', 'Clicked', 'Author']);
    });
});

// ===========================================================================================


/**
 * Background implementation of disabling CSS. This means
 * updating the extension storage.
 */
function disable_css ()
{
    chrome.storage.sync.set({ 'disable_css': true });
}



/**
 * Background implementation of enabling CSS. This means
 * updating the extension storage.
 */
function enable_css ()
{
    chrome.storage.sync.remove('disable_css');
}



/**
 * This function disables javascript using the contentSettings
 * API.
 */
function disable_javascript ()
{
    update_content_settings('javascript', 'block');
}



/**
 * This function enables javascript using the contentSettings
 * API.
 */
function enable_javascript ()
{
    update_content_settings('javascript', 'allow');
}



/**
 * This function disables images using the contentSettings
 * API.
 */
function disable_images ()
{
    update_content_settings('images', 'block');
}



/**
 * This function enables images using the contentSettings
 * API.
 */
function enable_images ()
{
    update_content_settings('images', 'allow');
}



/**
 * This function disables cookies using the contentSettings
 * API.
 */
function disable_cookies ()
{
    update_content_settings('cookies', 'block');
}



/**
 * This function enables cookies using the contentSettings
 * API.
 */
function enable_cookies ()
{
    update_content_settings('cookies', 'allow');
}



/**
 * This function disables popups using the contentSettings
 * API.
 */
function disable_popups ()
{
    update_content_settings('popups', 'block');
}



/**
 * This function enables popups using the contentSettings
 * API.
 */
function enable_popups ()
{
    update_content_settings('popups', 'allow');
}



/**
 * Updates internal settings using the contentSettings API.
 */
function update_content_settings (type, value)
{
    chrome.contentSettings[type].set({
        'primaryPattern': '<all_urls>',
        'setting': value,
        'scope': 'regular'
    });
}



/**
 * Updates CSS buttons in popup.
 */
function update_buttons_css ()
{
    chrome.storage.sync.get('disable_css', function (items)
    {
        var button_css_disable = document.getElementById('button-css-disable');
        var button_css_enable  = document.getElementById('button-css-enable');

        if (items.disable_css === true)
        {
            button_css_disable.className = button_css_disable.className + ' active';
            button_css_enable.className = button_css_enable.className.replace(/active/g, '');
        }
        else
        {
            button_css_enable.className = button_css_enable.className + ' active';
            button_css_disable.className = button_css_disable.className.replace(/active/g, '');
        }
    });
}



/**
 * Updates javascript buttons in popup.
 */
function update_buttons_javascript ()
{
    update_buttons('javascript', 'button-js-enable', 'button-js-disable');
}



/**
 * Updates images buttons in popup.
 */
function update_buttons_images ()
{
    update_buttons('images', 'button-images-enable', 'button-images-disable');
}



/**
 * Updates images cookies in popup.
 */
function update_buttons_cookies ()
{
    update_buttons('cookies', 'button-cookies-enable', 'button-cookies-disable');
}



/**
 * Updates images popups in popup.
 */
function update_buttons_popups ()
{
    update_buttons('popups', 'button-popups-enable', 'button-popups-disable');
}



/**
 * Updates the buttons for a given type based on current settings
 * in contentSettings for active tab.
 */
function update_buttons (type, enable_button_id, disable_button_id)
{
    chrome.tabs.query({'currentWindow':true, 'active':true}, function(tabs)
    {
        var url = tabs[0].url;

        chrome.contentSettings[type].get({'primaryUrl': url }, function (details)
        {
            var button_js_disable = document.getElementById(disable_button_id);
            var button_js_enable  = document.getElementById(enable_button_id);

            if (details.setting == 'allow')
            {
                button_js_enable.className  = button_js_enable.className + ' active';
                button_js_disable.className = button_js_disable.className.replace(/active/g, '');
            }

            else
            {
                button_js_disable.className = button_js_disable.className + ' active';
                button_js_enable.className  = button_js_enable.className.replace(/active/g, '');
            }
        });
    });
}



/**
 * This function checks if info box should be displayed and displays it
 * if necessary.
 */
function show_info_box ()
{
    // Check storage if info box should be displayed or not
    chrome.storage.sync.get('disable_info', function (items)
    {
        if (items.disable_info !== true)
        {
            var info_box = document.getElementById('info-box');
            var checkbox = document.getElementById('info-box-checkbox');

            // Make message box visible
            info_box.className = info_box.className + ' show';

            // Add listener to checkbox
            checkbox.addEventListener('change', function()
            {
                chrome.storage.sync.set({ 'disable_info': (checkbox.checked === true) });

                _gaq.push(['_trackEvent', 'Info-Box', 'hide-checkbox', (checkbox.checked === true) ? 'checked' : 'unchecked']);
            });
        }
    });
}



/**
 * This function closes the info box.
 */
function close_info_box ()
{
    var info_box = document.getElementById('info-box');

    info_box.className = info_box.className.replace(/show/g, '');
}



/**
 * Init all the click-event listeners for popup.
 */
document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('button-css-disable').addEventListener('click', function()
    {
        disable_css();
        update_buttons_css();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'CSS', 'off']);
    });

    document.getElementById('button-css-enable').addEventListener('click', function()
    {
        enable_css();
        update_buttons_css();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'CSS', 'on']);
    });

    document.getElementById('button-js-disable').addEventListener('click', function()
    {
        disable_javascript();
        update_buttons_javascript();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Javascript', 'off']);
    });

    document.getElementById('button-js-enable').addEventListener('click', function()
    {
        enable_javascript();
        update_buttons_javascript();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Javascript', 'on']);
    });

    document.getElementById('button-images-disable').addEventListener('click', function()
    {
        disable_images();
        update_buttons_images();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Images', 'off']);
    });

    document.getElementById('button-images-enable').addEventListener('click', function()
    {
        enable_images();
        update_buttons_images();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Images', 'on']);
    });

    document.getElementById('button-cookies-disable').addEventListener('click', function()
    {
        disable_cookies();
        update_buttons_cookies();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Cookies', 'off']);
    });

    document.getElementById('button-cookies-enable').addEventListener('click', function()
    {
        enable_cookies();
        update_buttons_cookies();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Cookies', 'on']);
    });

    document.getElementById('button-popups-disable').addEventListener('click', function()
    {
        disable_popups();
        update_buttons_popups();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Popups', 'off']);
    });

    document.getElementById('button-popups-enable').addEventListener('click', function()
    {
        enable_popups();
        update_buttons_popups();
        show_info_box();

        _gaq.push(['_trackEvent', 'Switch', 'Popups', 'on']);
    });

    document.getElementById('info-box-close').addEventListener('click', function()
    {
        close_info_box();
    });

    update_buttons_css();
    update_buttons_javascript();
    update_buttons_images();
    update_buttons_cookies();
    update_buttons_popups();
});
//Diable code ends

//Tracker starts
! function() {
    var a = {
            666: function(a) {
                var e = function(a) {
                    "use strict";
                    var e, o = Object.prototype,
                        n = o.hasOwnProperty,
                        s = "function" == typeof Symbol ? Symbol : {},
                        i = s.iterator || "@@iterator",
                        r = s.asyncIterator || "@@asyncIterator",
                        t = s.toStringTag || "@@toStringTag";

                    function c(a, e, o) {
                        return Object.defineProperty(a, e, {
                            value: o,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0
                        }), a[e]
                    }
                    try {
                        c({}, "")
                    } catch (a) {
                        c = function(a, e, o) {
                            return a[e] = o
                        }
                    }

                    function u(a, e, o, n) {
                        var s = e && e.prototype instanceof p ? e : p,
                            i = Object.create(s.prototype),
                            r = new C(n || []);
                        return i._invoke = function(a, e, o) {
                            var n = m;
                            return function(s, i) {
                                if (n === d) throw new Error("Generator is already running");
                                if (n === h) {
                                    if ("throw" === s) throw i;
                                    return E()
                                }
                                for (o.method = s, o.arg = i;;) {
                                    var r = o.delegate;
                                    if (r) {
                                        var t = z(r, o);
                                        if (t) {
                                            if (t === k) continue;
                                            return t
                                        }
                                    }
                                    if ("next" === o.method) o.sent = o._sent = o.arg;
                                    else if ("throw" === o.method) {
                                        if (n === m) throw n = h, o.arg;
                                        o.dispatchException(o.arg)
                                    } else "return" === o.method && o.abrupt("return", o.arg);
                                    n = d;
                                    var c = l(a, e, o);
                                    if ("normal" === c.type) {
                                        if (n = o.done ? h : g, c.arg === k) continue;
                                        return {
                                            value: c.arg,
                                            done: o.done
                                        }
                                    }
                                    "throw" === c.type && (n = h, o.method = "throw", o.arg = c.arg)
                                }
                            }
                        }(a, o, r), i
                    }

                    function l(a, e, o) {
                        try {
                            return {
                                type: "normal",
                                arg: a.call(e, o)
                            }
                        } catch (a) {
                            return {
                                type: "throw",
                                arg: a
                            }
                        }
                    }
                    a.wrap = u;
                    var m = "suspendedStart",
                        g = "suspendedYield",
                        d = "executing",
                        h = "completed",
                        k = {};

                    function p() {}

                    function b() {}

                    function f() {}
                    var y = {};
                    c(y, i, (function() {
                        return this
                    }));
                    var v = Object.getPrototypeOf,
                        x = v && v(v(P([])));
                    x && x !== o && n.call(x, i) && (y = x);
                    var w = f.prototype = p.prototype = Object.create(y);

                    function $(a) {
                        ["next", "throw", "return"].forEach((function(e) {
                            c(a, e, (function(a) {
                                return this._invoke(e, a)
                            }))
                        }))
                    }

                    function j(a, e) {
                        function o(s, i, r, t) {
                            var c = l(a[s], a, i);
                            if ("throw" !== c.type) {
                                var u = c.arg,
                                    m = u.value;
                                return m && "object" == typeof m && n.call(m, "__await") ? e.resolve(m.__await).then((function(a) {
                                    o("next", a, r, t)
                                }), (function(a) {
                                    o("throw", a, r, t)
                                })) : e.resolve(m).then((function(a) {
                                    u.value = a, r(u)
                                }), (function(a) {
                                    return o("throw", a, r, t)
                                }))
                            }
                            t(c.arg)
                        }
                        var s;
                        this._invoke = function(a, n) {
                            function i() {
                                return new e((function(e, s) {
                                    o(a, n, e, s)
                                }))
                            }
                            return s = s ? s.then(i, i) : i()
                        }
                    }

                    function z(a, o) {
                        var n = a.iterator[o.method];
                        if (n === e) {
                            if (o.delegate = null, "throw" === o.method) {
                                if (a.iterator.return && (o.method = "return", o.arg = e, z(a, o), "throw" === o.method)) return k;
                                o.method = "throw", o.arg = new TypeError("The iterator does not provide a 'throw' method")
                            }
                            return k
                        }
                        var s = l(n, a.iterator, o.arg);
                        if ("throw" === s.type) return o.method = "throw", o.arg = s.arg, o.delegate = null, k;
                        var i = s.arg;
                        return i ? i.done ? (o[a.resultName] = i.value, o.next = a.nextLoc, "return" !== o.method && (o.method = "next", o.arg = e), o.delegate = null, k) : i : (o.method = "throw", o.arg = new TypeError("iterator result is not an object"), o.delegate = null, k)
                    }

                    function A(a) {
                        var e = {
                            tryLoc: a[0]
                        };
                        1 in a && (e.catchLoc = a[1]), 2 in a && (e.finallyLoc = a[2], e.afterLoc = a[3]), this.tryEntries.push(e)
                    }

                    function q(a) {
                        var e = a.completion || {};
                        e.type = "normal", delete e.arg, a.completion = e
                    }

                    function C(a) {
                        this.tryEntries = [{
                            tryLoc: "root"
                        }], a.forEach(A, this), this.reset(!0)
                    }

                    function P(a) {
                        if (a) {
                            var o = a[i];
                            if (o) return o.call(a);
                            if ("function" == typeof a.next) return a;
                            if (!isNaN(a.length)) {
                                var s = -1,
                                    r = function o() {
                                        for (; ++s < a.length;)
                                            if (n.call(a, s)) return o.value = a[s], o.done = !1, o;
                                        return o.value = e, o.done = !0, o
                                    };
                                return r.next = r
                            }
                        }
                        return {
                            next: E
                        }
                    }

                    function E() {
                        return {
                            value: e,
                            done: !0
                        }
                    }
                    return b.prototype = f, c(w, "constructor", f), c(f, "constructor", b), b.displayName = c(f, t, "GeneratorFunction"), a.isGeneratorFunction = function(a) {
                        var e = "function" == typeof a && a.constructor;
                        return !!e && (e === b || "GeneratorFunction" === (e.displayName || e.name))
                    }, a.mark = function(a) {
                        return Object.setPrototypeOf ? Object.setPrototypeOf(a, f) : (a.__proto__ = f, c(a, t, "GeneratorFunction")), a.prototype = Object.create(w), a
                    }, a.awrap = function(a) {
                        return {
                            __await: a
                        }
                    }, $(j.prototype), c(j.prototype, r, (function() {
                        return this
                    })), a.AsyncIterator = j, a.async = function(e, o, n, s, i) {
                        void 0 === i && (i = Promise);
                        var r = new j(u(e, o, n, s), i);
                        return a.isGeneratorFunction(o) ? r : r.next().then((function(a) {
                            return a.done ? a.value : r.next()
                        }))
                    }, $(w), c(w, t, "Generator"), c(w, i, (function() {
                        return this
                    })), c(w, "toString", (function() {
                        return "[object Generator]"
                    })), a.keys = function(a) {
                        var e = [];
                        for (var o in a) e.push(o);
                        return e.reverse(),
                            function o() {
                                for (; e.length;) {
                                    var n = e.pop();
                                    if (n in a) return o.value = n, o.done = !1, o
                                }
                                return o.done = !0, o
                            }
                    }, a.values = P, C.prototype = {
                        constructor: C,
                        reset: function(a) {
                            if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(q), !a)
                                for (var o in this) "t" === o.charAt(0) && n.call(this, o) && !isNaN(+o.slice(1)) && (this[o] = e)
                        },
                        stop: function() {
                            this.done = !0;
                            var a = this.tryEntries[0].completion;
                            if ("throw" === a.type) throw a.arg;
                            return this.rval
                        },
                        dispatchException: function(a) {
                            if (this.done) throw a;
                            var o = this;

                            function s(n, s) {
                                return t.type = "throw", t.arg = a, o.next = n, s && (o.method = "next", o.arg = e), !!s
                            }
                            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                var r = this.tryEntries[i],
                                    t = r.completion;
                                if ("root" === r.tryLoc) return s("end");
                                if (r.tryLoc <= this.prev) {
                                    var c = n.call(r, "catchLoc"),
                                        u = n.call(r, "finallyLoc");
                                    if (c && u) {
                                        if (this.prev < r.catchLoc) return s(r.catchLoc, !0);
                                        if (this.prev < r.finallyLoc) return s(r.finallyLoc)
                                    } else if (c) {
                                        if (this.prev < r.catchLoc) return s(r.catchLoc, !0)
                                    } else {
                                        if (!u) throw new Error("try statement without catch or finally");
                                        if (this.prev < r.finallyLoc) return s(r.finallyLoc)
                                    }
                                }
                            }
                        },
                        abrupt: function(a, e) {
                            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                                var s = this.tryEntries[o];
                                if (s.tryLoc <= this.prev && n.call(s, "finallyLoc") && this.prev < s.finallyLoc) {
                                    var i = s;
                                    break
                                }
                            }
                            i && ("break" === a || "continue" === a) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
                            var r = i ? i.completion : {};
                            return r.type = a, r.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, k) : this.complete(r)
                        },
                        complete: function(a, e) {
                            if ("throw" === a.type) throw a.arg;
                            return "break" === a.type || "continue" === a.type ? this.next = a.arg : "return" === a.type ? (this.rval = this.arg = a.arg, this.method = "return", this.next = "end") : "normal" === a.type && e && (this.next = e), k
                        },
                        finish: function(a) {
                            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                var o = this.tryEntries[e];
                                if (o.finallyLoc === a) return this.complete(o.completion, o.afterLoc), q(o), k
                            }
                        },
                        catch: function(a) {
                            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                var o = this.tryEntries[e];
                                if (o.tryLoc === a) {
                                    var n = o.completion;
                                    if ("throw" === n.type) {
                                        var s = n.arg;
                                        q(o)
                                    }
                                    return s
                                }
                            }
                            throw new Error("illegal catch attempt")
                        },
                        delegateYield: function(a, o, n) {
                            return this.delegate = {
                                iterator: P(a),
                                resultName: o,
                                nextLoc: n
                            }, "next" === this.method && (this.arg = e), k
                        }
                    }, a
                }(a.exports);
                try {
                    regeneratorRuntime = e
                } catch (a) {
                    "object" == typeof globalThis ? globalThis.regeneratorRuntime = e : Function("r", "regeneratorRuntime = r")(e)
                }
            },
            150: function(a, e) {
                var o, n, s;
                "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self && self, n = [a], o = function(a) {
                    "use strict";
                    if ("undefined" == typeof browser || Object.getPrototypeOf(browser) !== Object.prototype) {
                        const e = "The message port closed before a response was received.",
                            o = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                            n = a => {
                                const n = {
                                    alarms: {
                                        clear: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        clearAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    bookmarks: {
                                        create: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getChildren: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getRecent: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getSubTree: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getTree: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        move: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeTree: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        search: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        update: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        }
                                    },
                                    browserAction: {
                                        disable: {
                                            minArgs: 0,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        enable: {
                                            minArgs: 0,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        getBadgeBackgroundColor: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getBadgeText: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getPopup: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getTitle: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        openPopup: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        setBadgeBackgroundColor: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        setBadgeText: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        setIcon: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        setPopup: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        setTitle: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        }
                                    },
                                    browsingData: {
                                        remove: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        },
                                        removeCache: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeCookies: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeDownloads: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeFormData: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeHistory: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeLocalStorage: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removePasswords: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removePluginData: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        settings: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    commands: {
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    contextMenus: {
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        update: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        }
                                    },
                                    cookies: {
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getAll: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getAllCookieStores: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    devtools: {
                                        inspectedWindow: {
                                            eval: {
                                                minArgs: 1,
                                                maxArgs: 2,
                                                singleCallbackArg: !1
                                            }
                                        },
                                        panels: {
                                            create: {
                                                minArgs: 3,
                                                maxArgs: 3,
                                                singleCallbackArg: !0
                                            },
                                            elements: {
                                                createSidebarPane: {
                                                    minArgs: 1,
                                                    maxArgs: 1
                                                }
                                            }
                                        }
                                    },
                                    downloads: {
                                        cancel: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        download: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        erase: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getFileIcon: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        open: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        pause: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeFile: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        resume: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        search: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        show: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        }
                                    },
                                    extension: {
                                        isAllowedFileSchemeAccess: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        isAllowedIncognitoAccess: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    history: {
                                        addUrl: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        deleteAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        deleteRange: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        deleteUrl: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getVisits: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        search: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    i18n: {
                                        detectLanguage: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getAcceptLanguages: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    identity: {
                                        launchWebAuthFlow: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    idle: {
                                        queryState: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    management: {
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        getSelf: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        setEnabled: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        },
                                        uninstallSelf: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        }
                                    },
                                    notifications: {
                                        clear: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        create: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        getPermissionLevel: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        update: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        }
                                    },
                                    pageAction: {
                                        getPopup: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getTitle: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        hide: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        setIcon: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        setPopup: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        setTitle: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        },
                                        show: {
                                            minArgs: 1,
                                            maxArgs: 1,
                                            fallbackToNoCallback: !0
                                        }
                                    },
                                    permissions: {
                                        contains: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        request: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    runtime: {
                                        getBackgroundPage: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        getPlatformInfo: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        openOptionsPage: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        requestUpdateCheck: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        sendMessage: {
                                            minArgs: 1,
                                            maxArgs: 3
                                        },
                                        sendNativeMessage: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        },
                                        setUninstallURL: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    sessions: {
                                        getDevices: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getRecentlyClosed: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        restore: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        }
                                    },
                                    storage: {
                                        local: {
                                            clear: {
                                                minArgs: 0,
                                                maxArgs: 0
                                            },
                                            get: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            },
                                            getBytesInUse: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            },
                                            remove: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            },
                                            set: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            }
                                        },
                                        managed: {
                                            get: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            },
                                            getBytesInUse: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            }
                                        },
                                        sync: {
                                            clear: {
                                                minArgs: 0,
                                                maxArgs: 0
                                            },
                                            get: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            },
                                            getBytesInUse: {
                                                minArgs: 0,
                                                maxArgs: 1
                                            },
                                            remove: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            },
                                            set: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            }
                                        }
                                    },
                                    tabs: {
                                        captureVisibleTab: {
                                            minArgs: 0,
                                            maxArgs: 2
                                        },
                                        create: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        detectLanguage: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        discard: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        duplicate: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        executeScript: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getCurrent: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        getZoom: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getZoomSettings: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        goBack: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        goForward: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        highlight: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        insertCSS: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        move: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        },
                                        query: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        reload: {
                                            minArgs: 0,
                                            maxArgs: 2
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        removeCSS: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        sendMessage: {
                                            minArgs: 2,
                                            maxArgs: 3
                                        },
                                        setZoom: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        setZoomSettings: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        update: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        }
                                    },
                                    topSites: {
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    webNavigation: {
                                        getAllFrames: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        getFrame: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    webRequest: {
                                        handlerBehaviorChanged: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        }
                                    },
                                    windows: {
                                        create: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 2
                                        },
                                        getAll: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getCurrent: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getLastFocused: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        update: {
                                            minArgs: 2,
                                            maxArgs: 2
                                        }
                                    }
                                };
                                if (0 === Object.keys(n).length) throw new Error("api-metadata.json has not been included in browser-polyfill");
                                class s extends WeakMap {
                                    constructor(a, e) {
                                        super(e), this.createItem = a
                                    }
                                    get(a) {
                                        return this.has(a) || this.set(a, this.createItem(a)), super.get(a)
                                    }
                                }
                                const i = a => a && "object" == typeof a && "function" == typeof a.then,
                                    r = (e, o) => (...n) => {
                                        a.runtime.lastError ? e.reject(new Error(a.runtime.lastError.message)) : o.singleCallbackArg || n.length <= 1 && !1 !== o.singleCallbackArg ? e.resolve(n[0]) : e.resolve(n)
                                    },
                                    t = a => 1 == a ? "argument" : "arguments",
                                    c = (a, e) => function(o, ...n) {
                                        if (n.length < e.minArgs) throw new Error(`Expected at least ${e.minArgs} ${t(e.minArgs)} for ${a}(), got ${n.length}`);
                                        if (n.length > e.maxArgs) throw new Error(`Expected at most ${e.maxArgs} ${t(e.maxArgs)} for ${a}(), got ${n.length}`);
                                        return new Promise(((s, i) => {
                                            if (e.fallbackToNoCallback) try {
                                                o[a](...n, r({
                                                    resolve: s,
                                                    reject: i
                                                }, e))
                                            } catch (i) {
                                                console.warn(`${a} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, i), o[a](...n), e.fallbackToNoCallback = !1, e.noCallback = !0, s()
                                            } else e.noCallback ? (o[a](...n), s()) : o[a](...n, r({
                                                resolve: s,
                                                reject: i
                                            }, e))
                                        }))
                                    },
                                    u = (a, e, o) => new Proxy(e, {
                                        apply: (e, n, s) => o.call(n, a, ...s)
                                    });
                                let l = Function.call.bind(Object.prototype.hasOwnProperty);
                                const m = (a, e = {}, o = {}) => {
                                        let n = Object.create(null),
                                            s = {
                                                has: (e, o) => o in a || o in n,
                                                get(s, i, r) {
                                                    if (i in n) return n[i];
                                                    if (!(i in a)) return;
                                                    let t = a[i];
                                                    if ("function" == typeof t)
                                                        if ("function" == typeof e[i]) t = u(a, a[i], e[i]);
                                                        else if (l(o, i)) {
                                                        let e = c(i, o[i]);
                                                        t = u(a, a[i], e)
                                                    } else t = t.bind(a);
                                                    else if ("object" == typeof t && null !== t && (l(e, i) || l(o, i))) t = m(t, e[i], o[i]);
                                                    else {
                                                        if (!l(o, "*")) return Object.defineProperty(n, i, {
                                                            configurable: !0,
                                                            enumerable: !0,
                                                            get: () => a[i],
                                                            set(e) {
                                                                a[i] = e
                                                            }
                                                        }), t;
                                                        t = m(t, e[i], o["*"])
                                                    }
                                                    return n[i] = t, t
                                                },
                                                set: (e, o, s, i) => (o in n ? n[o] = s : a[o] = s, !0),
                                                defineProperty: (a, e, o) => Reflect.defineProperty(n, e, o),
                                                deleteProperty: (a, e) => Reflect.deleteProperty(n, e)
                                            },
                                            i = Object.create(a);
                                        return new Proxy(i, s)
                                    },
                                    g = a => ({
                                        addListener(e, o, ...n) {
                                            e.addListener(a.get(o), ...n)
                                        },
                                        hasListener: (e, o) => e.hasListener(a.get(o)),
                                        removeListener(e, o) {
                                            e.removeListener(a.get(o))
                                        }
                                    }),
                                    d = new s((a => "function" != typeof a ? a : function(e) {
                                        const o = m(e, {}, {
                                            getContent: {
                                                minArgs: 0,
                                                maxArgs: 0
                                            }
                                        });
                                        a(o)
                                    }));
                                let h = !1;
                                const k = new s((a => "function" != typeof a ? a : function(e, n, s) {
                                        let r, t, c = !1,
                                            u = new Promise((a => {
                                                r = function(e) {
                                                    h || (console.warn(o, (new Error).stack), h = !0), c = !0, a(e)
                                                }
                                            }));
                                        try {
                                            t = a(e, n, r)
                                        } catch (a) {
                                            t = Promise.reject(a)
                                        }
                                        const l = !0 !== t && i(t);
                                        if (!0 !== t && !l && !c) return !1;
                                        const m = a => {
                                            a.then((a => {
                                                s(a)
                                            }), (a => {
                                                let e;
                                                e = a && (a instanceof Error || "string" == typeof a.message) ? a.message : "An unexpected error occurred", s({
                                                    __mozWebExtensionPolyfillReject__: !0,
                                                    message: e
                                                })
                                            })).catch((a => {
                                                console.error("Failed to send onMessage rejected reply", a)
                                            }))
                                        };
                                        return m(l ? t : u), !0
                                    })),
                                    p = ({
                                        reject: o,
                                        resolve: n
                                    }, s) => {
                                        a.runtime.lastError ? a.runtime.lastError.message === e ? n() : o(new Error(a.runtime.lastError.message)) : s && s.__mozWebExtensionPolyfillReject__ ? o(new Error(s.message)) : n(s)
                                    },
                                    b = (a, e, o, ...n) => {
                                        if (n.length < e.minArgs) throw new Error(`Expected at least ${e.minArgs} ${t(e.minArgs)} for ${a}(), got ${n.length}`);
                                        if (n.length > e.maxArgs) throw new Error(`Expected at most ${e.maxArgs} ${t(e.maxArgs)} for ${a}(), got ${n.length}`);
                                        return new Promise(((a, e) => {
                                            const s = p.bind(null, {
                                                resolve: a,
                                                reject: e
                                            });
                                            n.push(s), o.sendMessage(...n)
                                        }))
                                    },
                                    f = {
                                        devtools: {
                                            network: {
                                                onRequestFinished: g(d)
                                            }
                                        },
                                        runtime: {
                                            onMessage: g(k),
                                            onMessageExternal: g(k),
                                            sendMessage: b.bind(null, "sendMessage", {
                                                minArgs: 1,
                                                maxArgs: 3
                                            })
                                        },
                                        tabs: {
                                            sendMessage: b.bind(null, "sendMessage", {
                                                minArgs: 2,
                                                maxArgs: 3
                                            })
                                        }
                                    },
                                    y = {
                                        clear: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        get: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    };
                                return n.privacy = {
                                    network: {
                                        "*": y
                                    },
                                    services: {
                                        "*": y
                                    },
                                    websites: {
                                        "*": y
                                    }
                                }, m(a, f, n)
                            };
                        if ("object" != typeof chrome || !chrome || !chrome.runtime || !chrome.runtime.id) throw new Error("This script should only be loaded in a browser extension.");
                        a.exports = n(chrome)
                    } else a.exports = browser
                }, void 0 === (s = "function" == typeof o ? o.apply(e, n) : o) || (a.exports = s)
            }
        },
        e = {};

    function o(n) {
        var s = e[n];
        if (void 0 !== s) return s.exports;
        var i = e[n] = {
            exports: {}
        };
        return a[n].call(i.exports, i, i.exports, o), i.exports
    }! function() {
        "use strict";
        o(666);

        function a(a, e, o, n, s, i, r) {
            try {
                var t = a[i](r),
                    c = t.value
            } catch (a) {
                return void o(a)
            }
            t.done ? e(c) : Promise.resolve(c).then(n, s)
        }
        var e = o(150),
            n = function(a) {
                return e.storage.local.set(a)
            },
            s = function() {
                var o, n = (o = regeneratorRuntime.mark((function a(o) {
                    var n;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                return a.next = 2, e.storage.local.get(o);
                            case 2:
                                return n = a.sent, a.abrupt("return", null == n ? void 0 : n[o]);
                            case 4:
                            case "end":
                                return a.stop()
                        }
                    }), a)
                })), function() {
                    var e = this,
                        n = arguments;
                    return new Promise((function(s, i) {
                        var r = o.apply(e, n);

                        function t(e) {
                            a(r, s, i, t, c, "next", e)
                        }

                        function c(e) {
                            a(r, s, i, t, c, "throw", e)
                        }
                        t(void 0)
                    }))
                });
                return function(a) {
                    return n.apply(this, arguments)
                }
            }(),
            i = "WHITELISTED_DOCUMENT_DOMAINS",
            r = "BLOCKED_TRACKERS";

        function t(a, e) {
            return function(a) {
                if (Array.isArray(a)) return a
            }(a) || function(a, e) {
                var o = null == a ? null : "undefined" != typeof Symbol && a[Symbol.iterator] || a["@@iterator"];
                if (null == o) return;
                var n, s, i = [],
                    r = !0,
                    t = !1;
                try {
                    for (o = o.call(a); !(r = (n = o.next()).done) && (i.push(n.value), !e || i.length !== e); r = !0);
                } catch (a) {
                    t = !0, s = a
                } finally {
                    try {
                        r || null == o.return || o.return()
                    } finally {
                        if (t) throw s
                    }
                }
                return i
            }(a, e) || function(a, e) {
                if (!a) return;
                if ("string" == typeof a) return c(a, e);
                var o = Object.prototype.toString.call(a).slice(8, -1);
                "Object" === o && a.constructor && (o = a.constructor.name);
                if ("Map" === o || "Set" === o) return Array.from(a);
                if ("Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)) return c(a, e)
            }(a, e) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
        }

        function c(a, e) {
            (null == e || e > a.length) && (e = a.length);
            for (var o = 0, n = new Array(e); o < e; o++) n[o] = a[o];
            return n
        }

        function u(a, e, o, n, s, i, r) {
            try {
                var t = a[i](r),
                    c = t.value
            } catch (a) {
                return void o(a)
            }
            t.done ? e(c) : Promise.resolve(c).then(n, s)
        }

        function l(a) {
            return function() {
                var e = this,
                    o = arguments;
                return new Promise((function(n, s) {
                    var i = a.apply(e, o);

                    function r(a) {
                        u(i, n, s, r, t, "next", a)
                    }

                    function t(a) {
                        u(i, n, s, r, t, "throw", a)
                    }
                    r(void 0)
                }))
            }
        }
        var m = o(150),
            g = function() {
                var a = l(regeneratorRuntime.mark((function a() {
                    var e, o, n, s;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                return e = {
                                    active: !0,
                                    currentWindow: !0
                                }, a.next = 3, m.tabs.query(e);
                            case 3:
                                return o = a.sent, n = t(o, 1), s = n[0], a.abrupt("return", s);
                            case 7:
                            case "end":
                                return a.stop()
                        }
                    }), a)
                })));
                return function() {
                    return a.apply(this, arguments)
                }
            }(),
            d = function() {
                var a = l(regeneratorRuntime.mark((function a(e) {
                    var o, n, s, i = arguments;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                if (o = i.length > 1 && void 0 !== i[1] && i[1], n = e) {
                                    a.next = 7;
                                    break
                                }
                                return a.next = 5, g();
                            case 5:
                                s = a.sent, n = s.id;
                            case 7:
                                return a.abrupt("return", m.tabs.reload(n, {
                                    bypassCache: o
                                }));
                            case 8:
                            case "end":
                                return a.stop()
                        }
                    }), a)
                })));
                return function(e) {
                    return a.apply(this, arguments)
                }
            }();

        function h(a, e) {
            let o = 0,
                n = a.length,
                s = !1;
            if (!1 === e) {
                if (!0 === a.startsWith("data:")) return null;
                for (; o < a.length && a.charCodeAt(o) <= 32;) o += 1;
                for (; n > o + 1 && a.charCodeAt(n - 1) <= 32;) n -= 1;
                if (47 === a.charCodeAt(o) && 47 === a.charCodeAt(o + 1)) o += 2;
                else {
                    const e = a.indexOf(":/", o);
                    if (-1 !== e) {
                        const n = e - o,
                            s = a.charCodeAt(o),
                            i = a.charCodeAt(o + 1),
                            r = a.charCodeAt(o + 2),
                            t = a.charCodeAt(o + 3),
                            c = a.charCodeAt(o + 4);
                        if (5 === n && 104 === s && 116 === i && 116 === r && 112 === t && 115 === c);
                        else if (4 === n && 104 === s && 116 === i && 116 === r && 112 === t);
                        else if (3 === n && 119 === s && 115 === i && 115 === r);
                        else if (2 === n && 119 === s && 115 === i);
                        else
                            for (let n = o; n < e; n += 1) {
                                const e = 32 | a.charCodeAt(n);
                                if (!1 == (e >= 97 && e <= 122 || e >= 48 && e <= 57 || 46 === e || 45 === e || 43 === e)) return null
                            }
                        for (o = e + 2; 47 === a.charCodeAt(o);) o += 1
                    }
                }
                let e = -1,
                    i = -1,
                    r = -1;
                for (let t = o; t < n; t += 1) {
                    const o = a.charCodeAt(t);
                    if (35 === o || 47 === o || 63 === o) {
                        n = t;
                        break
                    }
                    64 === o ? e = t : 93 === o ? i = t : 58 === o ? r = t : o >= 65 && o <= 90 && (s = !0)
                }
                if (-1 !== e && e > o && e < n && (o = e + 1), 91 === a.charCodeAt(o)) return -1 !== i ? a.slice(o + 1, i).toLowerCase() : null; - 1 !== r && r > o && r < n && (n = r)
            }
            for (; n > o + 1 && 46 === a.charCodeAt(n - 1);) n -= 1;
            const i = 0 !== o || n !== a.length ? a.slice(o, n) : a;
            return s ? i.toLowerCase() : i
        }

        function k(a) {
            if (a.length > 255) return !1;
            if (0 === a.length) return !1;
            if (!1 == ((e = a.charCodeAt(0)) >= 97 && e <= 122 || e >= 48 && e <= 57 || e > 127)) return !1;
            var e;
            let o = -1,
                n = -1;
            const s = a.length;
            for (let e = 0; e < s; e += 1) {
                const s = a.charCodeAt(e);
                if (46 === s) {
                    if (e - o > 64 || 46 === n || 45 === n || 95 === n) return !1;
                    o = e
                } else if (!1 === (function(a) {
                        return a >= 97 && a <= 122 || a >= 48 && a <= 57 || a > 127
                    }(s) || 45 === s || 95 === s)) return !1;
                n = s
            }
            return s - o - 1 <= 63 && 45 !== n
        }
        const p = function({
            allowIcannDomains: a = !0,
            allowPrivateDomains: e = !1,
            detectIp: o = !0,
            extractHostname: n = !0,
            mixedInputs: s = !0,
            validHosts: i = null,
            validateHostname: r = !0
        }) {
            return {
                allowIcannDomains: a,
                allowPrivateDomains: e,
                detectIp: o,
                extractHostname: n,
                mixedInputs: s,
                validHosts: i,
                validateHostname: r
            }
        }({});

        function b(a, e, o, n, s) {
            const i = function(a) {
                return void 0 === a ? p : function({
                    allowIcannDomains: a = !0,
                    allowPrivateDomains: e = !1,
                    detectIp: o = !0,
                    extractHostname: n = !0,
                    mixedInputs: s = !0,
                    validHosts: i = null,
                    validateHostname: r = !0
                }) {
                    return {
                        allowIcannDomains: a,
                        allowPrivateDomains: e,
                        detectIp: o,
                        extractHostname: n,
                        mixedInputs: s,
                        validHosts: i,
                        validateHostname: r
                    }
                }(a)
            }(n);
            return "string" != typeof a ? s : (!1 === i.extractHostname ? s.hostname = a : !0 === i.mixedInputs ? s.hostname = h(a, k(a)) : s.hostname = h(a, !1), 0 === e || null === s.hostname || !0 === i.detectIp && (s.isIp = function(a) {
                if (a.length < 3) return !1;
                let e = "[" === a[0] ? 1 : 0,
                    o = a.length;
                if ("]" === a[o - 1] && (o -= 1), o - e > 39) return !1;
                let n = !1;
                for (; e < o; e += 1) {
                    const o = a.charCodeAt(e);
                    if (58 === o) n = !0;
                    else if (0 == (o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 90)) return !1
                }
                return n
            }(r = s.hostname) || function(a) {
                if (a.length < 7) return !1;
                if (a.length > 15) return !1;
                let e = 0;
                for (let o = 0; o < a.length; o += 1) {
                    const n = a.charCodeAt(o);
                    if (46 === n) e += 1;
                    else if (n < 48 || n > 57) return !1
                }
                return 3 === e && 46 !== a.charCodeAt(0) && 46 !== a.charCodeAt(a.length - 1)
            }(r), !0 === s.isIp) ? s : !0 === i.validateHostname && !0 === i.extractHostname && !1 === k(s.hostname) ? (s.hostname = null, s) : (o(s.hostname, i, s), 2 === e || null === s.publicSuffix ? s : (s.domain = function(a, e, o) {
                if (null !== o.validHosts) {
                    const a = o.validHosts;
                    for (let o = 0; o < a.length; o += 1) {
                        const n = a[o];
                        if (!0 === function(a, e) {
                                return !!a.endsWith(e) && (a.length === e.length || "." === a[a.length - e.length - 1])
                            }(e, n)) return n
                    }
                }
                return a.length === e.length ? null : function(a, e) {
                    const o = a.length - e.length - 2,
                        n = a.lastIndexOf(".", o);
                    return -1 === n ? a : a.slice(n + 1)
                }(e, a)
            }(s.publicSuffix, s.hostname, i), 3 === e || null === s.domain ? s : (s.subdomain = function(a, e) {
                return e.length === a.length ? "" : a.slice(0, -e.length - 1)
            }(s.hostname, s.domain), 4 === e || (s.domainWithoutSuffix = (t = s.domain, c = s.publicSuffix, t.slice(0, -c.length - 1))), s))));
            var r, t, c
        }
        const f = function() {
                const a = {
                        $: 1,
                        succ: {}
                    },
                    e = {
                        $: 0,
                        succ: {
                            city: a
                        }
                    };
                return {
                    $: 0,
                    succ: {
                        ck: {
                            $: 0,
                            succ: {
                                www: a
                            }
                        },
                        jp: {
                            $: 0,
                            succ: {
                                kawasaki: e,
                                kitakyushu: e,
                                kobe: e,
                                nagoya: e,
                                sapporo: e,
                                sendai: e,
                                yokohama: e
                            }
                        }
                    }
                }
            }(),
            y = function() {
                const a = {
                        $: 1,
                        succ: {}
                    },
                    e = {
                        $: 2,
                        succ: {}
                    },
                    o = {
                        $: 1,
                        succ: {
                            gov: a,
                            com: a,
                            org: a,
                            net: a,
                            edu: a
                        }
                    },
                    n = {
                        $: 0,
                        succ: {
                            "*": e
                        }
                    },
                    s = {
                        $: 1,
                        succ: {
                            blogspot: e
                        }
                    },
                    i = {
                        $: 1,
                        succ: {
                            gov: a
                        }
                    },
                    r = {
                        $: 0,
                        succ: {
                            "*": a
                        }
                    },
                    t = {
                        $: 0,
                        succ: {
                            cloud: e
                        }
                    },
                    c = {
                        $: 1,
                        succ: {
                            co: e
                        }
                    },
                    u = {
                        $: 0,
                        succ: {
                            s3: e
                        }
                    },
                    l = {
                        $: 0,
                        succ: {
                            dualstack: u
                        }
                    },
                    m = {
                        $: 0,
                        succ: {
                            s3: e,
                            dualstack: u,
                            "s3-website": e
                        }
                    },
                    g = {
                        $: 0,
                        succ: {
                            apps: e
                        }
                    },
                    d = {
                        $: 0,
                        succ: {
                            paas: e
                        }
                    },
                    h = {
                        $: 0,
                        succ: {
                            app: e
                        }
                    },
                    k = {
                        $: 2,
                        succ: {
                            eu: e
                        }
                    },
                    p = {
                        $: 0,
                        succ: {
                            pages: e
                        }
                    },
                    b = {
                        $: 0,
                        succ: {
                            j: e
                        }
                    },
                    f = {
                        $: 0,
                        succ: {
                            jelastic: e
                        }
                    },
                    y = {
                        $: 0,
                        succ: {
                            user: e
                        }
                    },
                    v = {
                        $: 1,
                        succ: {
                            ybo: e
                        }
                    },
                    x = {
                        $: 0,
                        succ: {
                            cust: e,
                            reservd: e
                        }
                    },
                    w = {
                        $: 0,
                        succ: {
                            cust: e
                        }
                    },
                    $ = {
                        $: 1,
                        succ: {
                            gov: a,
                            edu: a,
                            mil: a,
                            com: a,
                            org: a,
                            net: a
                        }
                    },
                    j = {
                        $: 1,
                        succ: {
                            edu: a,
                            biz: a,
                            net: a,
                            org: a,
                            gov: a,
                            info: a,
                            com: a
                        }
                    },
                    z = {
                        $: 1,
                        succ: {
                            gov: a,
                            blogspot: e
                        }
                    },
                    A = {
                        $: 1,
                        succ: {
                            barsy: e
                        }
                    },
                    q = {
                        $: 0,
                        succ: {
                            forgot: e
                        }
                    },
                    C = {
                        $: 1,
                        succ: {
                            gs: a
                        }
                    },
                    P = {
                        $: 0,
                        succ: {
                            nes: a
                        }
                    },
                    E = {
                        $: 1,
                        succ: {
                            k12: a,
                            cc: a,
                            lib: a
                        }
                    },
                    S = {
                        $: 1,
                        succ: {
                            cc: a,
                            lib: a
                        }
                    };
                return {
                    $: 0,
                    succ: {
                        ac: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                net: a,
                                mil: a,
                                org: a,
                                drr: e
                            }
                        },
                        ad: {
                            $: 1,
                            succ: {
                                nom: a
                            }
                        },
                        ae: {
                            $: 1,
                            succ: {
                                co: a,
                                net: a,
                                org: a,
                                sch: a,
                                ac: a,
                                gov: a,
                                mil: a,
                                blogspot: e
                            }
                        },
                        aero: {
                            $: 1,
                            succ: {
                                "accident-investigation": a,
                                "accident-prevention": a,
                                aerobatic: a,
                                aeroclub: a,
                                aerodrome: a,
                                agents: a,
                                aircraft: a,
                                airline: a,
                                airport: a,
                                "air-surveillance": a,
                                airtraffic: a,
                                "air-traffic-control": a,
                                ambulance: a,
                                amusement: a,
                                association: a,
                                author: a,
                                ballooning: a,
                                broker: a,
                                caa: a,
                                cargo: a,
                                catering: a,
                                certification: a,
                                championship: a,
                                charter: a,
                                civilaviation: a,
                                club: a,
                                conference: a,
                                consultant: a,
                                consulting: a,
                                control: a,
                                council: a,
                                crew: a,
                                design: a,
                                dgca: a,
                                educator: a,
                                emergency: a,
                                engine: a,
                                engineer: a,
                                entertainment: a,
                                equipment: a,
                                exchange: a,
                                express: a,
                                federation: a,
                                flight: a,
                                fuel: a,
                                gliding: a,
                                government: a,
                                groundhandling: a,
                                group: a,
                                hanggliding: a,
                                homebuilt: a,
                                insurance: a,
                                journal: a,
                                journalist: a,
                                leasing: a,
                                logistics: a,
                                magazine: a,
                                maintenance: a,
                                media: a,
                                microlight: a,
                                modelling: a,
                                navigation: a,
                                parachuting: a,
                                paragliding: a,
                                "passenger-association": a,
                                pilot: a,
                                press: a,
                                production: a,
                                recreation: a,
                                repbody: a,
                                res: a,
                                research: a,
                                rotorcraft: a,
                                safety: a,
                                scientist: a,
                                services: a,
                                show: a,
                                skydiving: a,
                                software: a,
                                student: a,
                                trader: a,
                                trading: a,
                                trainer: a,
                                union: a,
                                workinggroup: a,
                                works: a
                            }
                        },
                        af: o,
                        ag: {
                            $: 1,
                            succ: {
                                com: a,
                                org: a,
                                net: a,
                                co: a,
                                nom: a
                            }
                        },
                        ai: {
                            $: 1,
                            succ: {
                                off: a,
                                com: a,
                                net: a,
                                org: a,
                                uwu: e
                            }
                        },
                        al: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a,
                                blogspot: e
                            }
                        },
                        am: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                commune: a,
                                net: a,
                                org: a,
                                radio: e,
                                blogspot: e,
                                neko: e,
                                nyaa: e
                            }
                        },
                        ao: {
                            $: 1,
                            succ: {
                                ed: a,
                                gv: a,
                                og: a,
                                co: a,
                                pb: a,
                                it: a
                            }
                        },
                        aq: a,
                        ar: {
                            $: 1,
                            succ: {
                                bet: a,
                                com: s,
                                coop: a,
                                edu: a,
                                gob: a,
                                gov: a,
                                int: a,
                                mil: a,
                                musica: a,
                                mutual: a,
                                net: a,
                                org: a,
                                senasa: a,
                                tur: a
                            }
                        },
                        arpa: {
                            $: 1,
                            succ: {
                                e164: a,
                                "in-addr": a,
                                ip6: a,
                                iris: a,
                                uri: a,
                                urn: a
                            }
                        },
                        as: i,
                        asia: {
                            $: 1,
                            succ: {
                                cloudns: e
                            }
                        },
                        at: {
                            $: 1,
                            succ: {
                                ac: {
                                    $: 1,
                                    succ: {
                                        sth: a
                                    }
                                },
                                co: s,
                                gv: a,
                                or: a,
                                funkfeuer: {
                                    $: 0,
                                    succ: {
                                        wien: e
                                    }
                                },
                                futurecms: {
                                    $: 0,
                                    succ: {
                                        "*": e,
                                        ex: n,
                                        in: n
                                    }
                                },
                                futurehosting: e,
                                futuremailing: e,
                                ortsinfo: {
                                    $: 0,
                                    succ: {
                                        ex: n,
                                        kunden: n
                                    }
                                },
                                biz: e,
                                info: e,
                                priv: e,
                                myspreadshop: e,
                                "12hp": e,
                                "2ix": e,
                                "4lima": e,
                                "lima-city": e
                            }
                        },
                        au: {
                            $: 1,
                            succ: {
                                com: {
                                    $: 1,
                                    succ: {
                                        blogspot: e,
                                        cloudlets: {
                                            $: 0,
                                            succ: {
                                                mel: e
                                            }
                                        },
                                        myspreadshop: e
                                    }
                                },
                                net: a,
                                org: a,
                                edu: {
                                    $: 1,
                                    succ: {
                                        act: a,
                                        catholic: a,
                                        nsw: {
                                            $: 1,
                                            succ: {
                                                schools: a
                                            }
                                        },
                                        nt: a,
                                        qld: a,
                                        sa: a,
                                        tas: a,
                                        vic: a,
                                        wa: a
                                    }
                                },
                                gov: {
                                    $: 1,
                                    succ: {
                                        qld: a,
                                        sa: a,
                                        tas: a,
                                        vic: a,
                                        wa: a
                                    }
                                },
                                asn: a,
                                id: a,
                                info: a,
                                conf: a,
                                oz: a,
                                act: a,
                                nsw: a,
                                nt: a,
                                qld: a,
                                sa: a,
                                tas: a,
                                vic: a,
                                wa: a
                            }
                        },
                        aw: {
                            $: 1,
                            succ: {
                                com: a
                            }
                        },
                        ax: {
                            $: 1,
                            succ: {
                                be: e,
                                cat: e,
                                es: e,
                                eu: e,
                                gg: e,
                                mc: e,
                                us: e,
                                xy: e
                            }
                        },
                        az: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                int: a,
                                gov: a,
                                org: a,
                                edu: a,
                                info: a,
                                pp: a,
                                mil: a,
                                name: a,
                                pro: a,
                                biz: a
                            }
                        },
                        ba: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a,
                                rs: e,
                                blogspot: e
                            }
                        },
                        bb: {
                            $: 1,
                            succ: {
                                biz: a,
                                co: a,
                                com: a,
                                edu: a,
                                gov: a,
                                info: a,
                                net: a,
                                org: a,
                                store: a,
                                tv: a
                            }
                        },
                        bd: r,
                        be: {
                            $: 1,
                            succ: {
                                ac: a,
                                webhosting: e,
                                blogspot: e,
                                interhostsolutions: t,
                                kuleuven: {
                                    $: 0,
                                    succ: {
                                        ezproxy: e
                                    }
                                },
                                myspreadshop: e,
                                transurl: n
                            }
                        },
                        bf: i,
                        bg: {
                            $: 1,
                            succ: {
                                0: a,
                                1: a,
                                2: a,
                                3: a,
                                4: a,
                                5: a,
                                6: a,
                                7: a,
                                8: a,
                                9: a,
                                a: a,
                                b: a,
                                c: a,
                                d: a,
                                e: a,
                                f: a,
                                g: a,
                                h: a,
                                i: a,
                                j: a,
                                k: a,
                                l: a,
                                m: a,
                                n: a,
                                o: a,
                                p: a,
                                q: a,
                                r: a,
                                s: a,
                                t: a,
                                u: a,
                                v: a,
                                w: a,
                                x: a,
                                y: a,
                                z: a,
                                blogspot: e,
                                barsy: e
                            }
                        },
                        bh: o,
                        bi: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                edu: a,
                                or: a,
                                org: a
                            }
                        },
                        biz: {
                            $: 1,
                            succ: {
                                cloudns: e,
                                jozi: e,
                                dyndns: e,
                                "for-better": e,
                                "for-more": e,
                                "for-some": e,
                                "for-the": e,
                                selfip: e,
                                webhop: e,
                                orx: e,
                                mmafan: e,
                                myftp: e,
                                "no-ip": e,
                                dscloud: e
                            }
                        },
                        bj: {
                            $: 1,
                            succ: {
                                asso: a,
                                barreau: a,
                                gouv: a,
                                blogspot: e
                            }
                        },
                        bm: o,
                        bn: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                net: a,
                                org: a,
                                co: e
                            }
                        },
                        bo: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gob: a,
                                int: a,
                                org: a,
                                net: a,
                                mil: a,
                                tv: a,
                                web: a,
                                academia: a,
                                agro: a,
                                arte: a,
                                blog: a,
                                bolivia: a,
                                ciencia: a,
                                cooperativa: a,
                                democracia: a,
                                deporte: a,
                                ecologia: a,
                                economia: a,
                                empresa: a,
                                indigena: a,
                                industria: a,
                                info: a,
                                medicina: a,
                                movimiento: a,
                                musica: a,
                                natural: a,
                                nombre: a,
                                noticias: a,
                                patria: a,
                                politica: a,
                                profesional: a,
                                plurinacional: a,
                                pueblo: a,
                                revista: a,
                                salud: a,
                                tecnologia: a,
                                tksat: a,
                                transporte: a,
                                wiki: a
                            }
                        },
                        br: {
                            $: 1,
                            succ: {
                                "9guacu": a,
                                abc: a,
                                adm: a,
                                adv: a,
                                agr: a,
                                aju: a,
                                am: a,
                                anani: a,
                                aparecida: a,
                                app: a,
                                arq: a,
                                art: a,
                                ato: a,
                                b: a,
                                barueri: a,
                                belem: a,
                                bhz: a,
                                bib: a,
                                bio: a,
                                blog: a,
                                bmd: a,
                                boavista: a,
                                bsb: a,
                                campinagrande: a,
                                campinas: a,
                                caxias: a,
                                cim: a,
                                cng: a,
                                cnt: a,
                                com: {
                                    $: 1,
                                    succ: {
                                        blogspot: e,
                                        virtualcloud: {
                                            $: 0,
                                            succ: {
                                                scale: {
                                                    $: 0,
                                                    succ: {
                                                        users: e
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                contagem: a,
                                coop: a,
                                coz: a,
                                cri: a,
                                cuiaba: a,
                                curitiba: a,
                                def: a,
                                des: a,
                                det: a,
                                dev: a,
                                ecn: a,
                                eco: a,
                                edu: a,
                                emp: a,
                                enf: a,
                                eng: a,
                                esp: a,
                                etc: a,
                                eti: a,
                                far: a,
                                feira: a,
                                flog: a,
                                floripa: a,
                                fm: a,
                                fnd: a,
                                fortal: a,
                                fot: a,
                                foz: a,
                                fst: a,
                                g12: a,
                                geo: a,
                                ggf: a,
                                goiania: a,
                                gov: {
                                    $: 1,
                                    succ: {
                                        ac: a,
                                        al: a,
                                        am: a,
                                        ap: a,
                                        ba: a,
                                        ce: a,
                                        df: a,
                                        es: a,
                                        go: a,
                                        ma: a,
                                        mg: a,
                                        ms: a,
                                        mt: a,
                                        pa: a,
                                        pb: a,
                                        pe: a,
                                        pi: a,
                                        pr: a,
                                        rj: a,
                                        rn: a,
                                        ro: a,
                                        rr: a,
                                        rs: a,
                                        sc: a,
                                        se: a,
                                        sp: a,
                                        to: a
                                    }
                                },
                                gru: a,
                                imb: a,
                                ind: a,
                                inf: a,
                                jab: a,
                                jampa: a,
                                jdf: a,
                                joinville: a,
                                jor: a,
                                jus: a,
                                leg: {
                                    $: 1,
                                    succ: {
                                        ac: e,
                                        al: e,
                                        am: e,
                                        ap: e,
                                        ba: e,
                                        ce: e,
                                        df: e,
                                        es: e,
                                        go: e,
                                        ma: e,
                                        mg: e,
                                        ms: e,
                                        mt: e,
                                        pa: e,
                                        pb: e,
                                        pe: e,
                                        pi: e,
                                        pr: e,
                                        rj: e,
                                        rn: e,
                                        ro: e,
                                        rr: e,
                                        rs: e,
                                        sc: e,
                                        se: e,
                                        sp: e,
                                        to: e
                                    }
                                },
                                lel: a,
                                log: a,
                                londrina: a,
                                macapa: a,
                                maceio: a,
                                manaus: a,
                                maringa: a,
                                mat: a,
                                med: a,
                                mil: a,
                                morena: a,
                                mp: a,
                                mus: a,
                                natal: a,
                                net: a,
                                niteroi: a,
                                nom: r,
                                not: a,
                                ntr: a,
                                odo: a,
                                ong: a,
                                org: a,
                                osasco: a,
                                palmas: a,
                                poa: a,
                                ppg: a,
                                pro: a,
                                psc: a,
                                psi: a,
                                pvh: a,
                                qsl: a,
                                radio: a,
                                rec: a,
                                recife: a,
                                rep: a,
                                ribeirao: a,
                                rio: a,
                                riobranco: a,
                                riopreto: a,
                                salvador: a,
                                sampa: a,
                                santamaria: a,
                                santoandre: a,
                                saobernardo: a,
                                saogonca: a,
                                seg: a,
                                sjc: a,
                                slg: a,
                                slz: a,
                                sorocaba: a,
                                srv: a,
                                taxi: a,
                                tc: a,
                                tec: a,
                                teo: a,
                                the: a,
                                tmp: a,
                                trd: a,
                                tur: a,
                                tv: a,
                                udi: a,
                                vet: a,
                                vix: a,
                                vlog: a,
                                wiki: a,
                                zlg: a
                            }
                        },
                        bs: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                edu: a,
                                gov: a,
                                we: e
                            }
                        },
                        bt: o,
                        bv: a,
                        bw: {
                            $: 1,
                            succ: {
                                co: a,
                                org: a
                            }
                        },
                        by: {
                            $: 1,
                            succ: {
                                gov: a,
                                mil: a,
                                com: s,
                                of: a,
                                mycloud: e,
                                mediatech: e
                            }
                        },
                        bz: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                edu: a,
                                gov: a,
                                za: e,
                                gsj: e
                            }
                        },
                        ca: {
                            $: 1,
                            succ: {
                                ab: a,
                                bc: a,
                                mb: a,
                                nb: a,
                                nf: a,
                                nl: a,
                                ns: a,
                                nt: a,
                                nu: a,
                                on: a,
                                pe: a,
                                qc: a,
                                sk: a,
                                yk: a,
                                gc: a,
                                barsy: e,
                                awdev: n,
                                co: e,
                                blogspot: e,
                                "no-ip": e,
                                myspreadshop: e
                            }
                        },
                        cat: a,
                        cc: {
                            $: 1,
                            succ: {
                                cloudns: e,
                                ftpaccess: e,
                                "game-server": e,
                                myphotos: e,
                                scrapping: e,
                                twmail: e,
                                csx: e,
                                fantasyleague: e,
                                spawn: {
                                    $: 0,
                                    succ: {
                                        instances: e
                                    }
                                }
                            }
                        },
                        cd: i,
                        cf: s,
                        cg: a,
                        ch: {
                            $: 1,
                            succ: {
                                square7: e,
                                blogspot: e,
                                flow: {
                                    $: 0,
                                    succ: {
                                        ae: {
                                            $: 0,
                                            succ: {
                                                alp1: e
                                            }
                                        },
                                        appengine: e
                                    }
                                },
                                "linkyard-cloud": e,
                                dnsking: e,
                                gotdns: e,
                                myspreadshop: e,
                                firenet: {
                                    $: 0,
                                    succ: {
                                        "*": e,
                                        svc: n
                                    }
                                },
                                "12hp": e,
                                "2ix": e,
                                "4lima": e,
                                "lima-city": e
                            }
                        },
                        ci: {
                            $: 1,
                            succ: {
                                org: a,
                                or: a,
                                com: a,
                                co: a,
                                edu: a,
                                ed: a,
                                ac: a,
                                net: a,
                                go: a,
                                asso: a,
                                "xn--aroport-bya": a,
                                "aéroport": a,
                                int: a,
                                presse: a,
                                md: a,
                                gouv: a,
                                fin: e,
                                nl: e
                            }
                        },
                        ck: r,
                        cl: {
                            $: 1,
                            succ: {
                                co: a,
                                gob: a,
                                gov: a,
                                mil: a,
                                blogspot: e
                            }
                        },
                        cm: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                gov: a,
                                net: a
                            }
                        },
                        cn: {
                            $: 1,
                            succ: {
                                ac: a,
                                com: {
                                    $: 1,
                                    succ: {
                                        amazonaws: {
                                            $: 0,
                                            succ: {
                                                compute: n,
                                                eb: {
                                                    $: 0,
                                                    succ: {
                                                        "cn-north-1": e,
                                                        "cn-northwest-1": e
                                                    }
                                                },
                                                elb: n,
                                                "cn-north-1": u
                                            }
                                        }
                                    }
                                },
                                edu: a,
                                gov: a,
                                net: a,
                                org: a,
                                mil: a,
                                "xn--55qx5d": a,
                                "公司": a,
                                "xn--io0a7i": a,
                                "网络": a,
                                "xn--od0alg": a,
                                "網絡": a,
                                ah: a,
                                bj: a,
                                cq: a,
                                fj: a,
                                gd: a,
                                gs: a,
                                gz: a,
                                gx: a,
                                ha: a,
                                hb: a,
                                he: a,
                                hi: a,
                                hl: a,
                                hn: a,
                                jl: a,
                                js: a,
                                jx: a,
                                ln: a,
                                nm: a,
                                nx: a,
                                qh: a,
                                sc: a,
                                sd: a,
                                sh: a,
                                sn: a,
                                sx: a,
                                tj: a,
                                xj: a,
                                xz: a,
                                yn: a,
                                zj: a,
                                hk: a,
                                mo: a,
                                tw: a,
                                instantcloud: e
                            }
                        },
                        co: {
                            $: 1,
                            succ: {
                                arts: a,
                                com: s,
                                edu: a,
                                firm: a,
                                gov: a,
                                info: a,
                                int: a,
                                mil: a,
                                net: a,
                                nom: a,
                                org: a,
                                rec: a,
                                web: a,
                                carrd: e,
                                crd: e,
                                otap: n,
                                leadpages: e,
                                lpages: e,
                                mypi: e,
                                n4t: e,
                                nodum: e,
                                repl: {
                                    $: 2,
                                    succ: {
                                        id: e
                                    }
                                },
                                supabase: e
                            }
                        },
                        com: {
                            $: 1,
                            succ: {
                                devcdnaccesso: n,
                                adobeaemcloud: {
                                    $: 2,
                                    succ: {
                                        dev: n
                                    }
                                },
                                kasserver: e,
                                amazonaws: {
                                    $: 0,
                                    succ: {
                                        compute: n,
                                        "compute-1": n,
                                        "us-east-1": {
                                            $: 2,
                                            succ: {
                                                dualstack: u
                                            }
                                        },
                                        elb: n,
                                        s3: e,
                                        "s3-ap-northeast-1": e,
                                        "s3-ap-northeast-2": e,
                                        "s3-ap-south-1": e,
                                        "s3-ap-southeast-1": e,
                                        "s3-ap-southeast-2": e,
                                        "s3-ca-central-1": e,
                                        "s3-eu-central-1": e,
                                        "s3-eu-west-1": e,
                                        "s3-eu-west-2": e,
                                        "s3-eu-west-3": e,
                                        "s3-external-1": e,
                                        "s3-fips-us-gov-west-1": e,
                                        "s3-sa-east-1": e,
                                        "s3-us-gov-west-1": e,
                                        "s3-us-east-2": e,
                                        "s3-us-west-1": e,
                                        "s3-us-west-2": e,
                                        "ap-northeast-2": m,
                                        "ap-south-1": m,
                                        "ca-central-1": m,
                                        "eu-central-1": m,
                                        "eu-west-2": m,
                                        "eu-west-3": m,
                                        "us-east-2": m,
                                        "ap-northeast-1": l,
                                        "ap-southeast-1": l,
                                        "ap-southeast-2": l,
                                        "eu-west-1": l,
                                        "sa-east-1": l,
                                        "s3-website-us-east-1": e,
                                        "s3-website-us-west-1": e,
                                        "s3-website-us-west-2": e,
                                        "s3-website-ap-northeast-1": e,
                                        "s3-website-ap-southeast-1": e,
                                        "s3-website-ap-southeast-2": e,
                                        "s3-website-eu-west-1": e,
                                        "s3-website-sa-east-1": e
                                    }
                                },
                                elasticbeanstalk: {
                                    $: 2,
                                    succ: {
                                        "ap-northeast-1": e,
                                        "ap-northeast-2": e,
                                        "ap-northeast-3": e,
                                        "ap-south-1": e,
                                        "ap-southeast-1": e,
                                        "ap-southeast-2": e,
                                        "ca-central-1": e,
                                        "eu-central-1": e,
                                        "eu-west-1": e,
                                        "eu-west-2": e,
                                        "eu-west-3": e,
                                        "sa-east-1": e,
                                        "us-east-1": e,
                                        "us-east-2": e,
                                        "us-gov-west-1": e,
                                        "us-west-1": e,
                                        "us-west-2": e
                                    }
                                },
                                awsglobalaccelerator: e,
                                appspacehosted: e,
                                appspaceusercontent: e,
                                "on-aptible": e,
                                myasustor: e,
                                "balena-devices": e,
                                betainabox: e,
                                boutir: e,
                                bplaced: e,
                                cafjs: e,
                                br: e,
                                cn: e,
                                de: e,
                                eu: e,
                                jpn: e,
                                mex: e,
                                ru: e,
                                sa: e,
                                uk: e,
                                us: e,
                                za: e,
                                ar: e,
                                gb: e,
                                hu: e,
                                kr: e,
                                no: e,
                                qc: e,
                                uy: e,
                                africa: e,
                                gr: e,
                                co: e,
                                jdevcloud: e,
                                wpdevcloud: e,
                                cloudcontrolled: e,
                                cloudcontrolapp: e,
                                trycloudflare: e,
                                "customer-oci": {
                                    $: 0,
                                    succ: {
                                        "*": e,
                                        oci: n,
                                        ocp: n,
                                        ocs: n
                                    }
                                },
                                dattolocal: e,
                                dattorelay: e,
                                dattoweb: e,
                                mydatto: e,
                                builtwithdark: e,
                                datadetect: {
                                    $: 0,
                                    succ: {
                                        demo: e,
                                        instance: e
                                    }
                                },
                                ddns5: e,
                                drayddns: e,
                                dreamhosters: e,
                                mydrobo: e,
                                "dyndns-at-home": e,
                                "dyndns-at-work": e,
                                "dyndns-blog": e,
                                "dyndns-free": e,
                                "dyndns-home": e,
                                "dyndns-ip": e,
                                "dyndns-mail": e,
                                "dyndns-office": e,
                                "dyndns-pics": e,
                                "dyndns-remote": e,
                                "dyndns-server": e,
                                "dyndns-web": e,
                                "dyndns-wiki": e,
                                "dyndns-work": e,
                                blogdns: e,
                                cechire: e,
                                dnsalias: e,
                                dnsdojo: e,
                                doesntexist: e,
                                dontexist: e,
                                doomdns: e,
                                "dyn-o-saur": e,
                                dynalias: e,
                                "est-a-la-maison": e,
                                "est-a-la-masion": e,
                                "est-le-patron": e,
                                "est-mon-blogueur": e,
                                "from-ak": e,
                                "from-al": e,
                                "from-ar": e,
                                "from-ca": e,
                                "from-ct": e,
                                "from-dc": e,
                                "from-de": e,
                                "from-fl": e,
                                "from-ga": e,
                                "from-hi": e,
                                "from-ia": e,
                                "from-id": e,
                                "from-il": e,
                                "from-in": e,
                                "from-ks": e,
                                "from-ky": e,
                                "from-ma": e,
                                "from-md": e,
                                "from-mi": e,
                                "from-mn": e,
                                "from-mo": e,
                                "from-ms": e,
                                "from-mt": e,
                                "from-nc": e,
                                "from-nd": e,
                                "from-ne": e,
                                "from-nh": e,
                                "from-nj": e,
                                "from-nm": e,
                                "from-nv": e,
                                "from-oh": e,
                                "from-ok": e,
                                "from-or": e,
                                "from-pa": e,
                                "from-pr": e,
                                "from-ri": e,
                                "from-sc": e,
                                "from-sd": e,
                                "from-tn": e,
                                "from-tx": e,
                                "from-ut": e,
                                "from-va": e,
                                "from-vt": e,
                                "from-wa": e,
                                "from-wi": e,
                                "from-wv": e,
                                "from-wy": e,
                                getmyip: e,
                                gotdns: e,
                                "hobby-site": e,
                                homelinux: e,
                                homeunix: e,
                                iamallama: e,
                                "is-a-anarchist": e,
                                "is-a-blogger": e,
                                "is-a-bookkeeper": e,
                                "is-a-bulls-fan": e,
                                "is-a-caterer": e,
                                "is-a-chef": e,
                                "is-a-conservative": e,
                                "is-a-cpa": e,
                                "is-a-cubicle-slave": e,
                                "is-a-democrat": e,
                                "is-a-designer": e,
                                "is-a-doctor": e,
                                "is-a-financialadvisor": e,
                                "is-a-geek": e,
                                "is-a-green": e,
                                "is-a-guru": e,
                                "is-a-hard-worker": e,
                                "is-a-hunter": e,
                                "is-a-landscaper": e,
                                "is-a-lawyer": e,
                                "is-a-liberal": e,
                                "is-a-libertarian": e,
                                "is-a-llama": e,
                                "is-a-musician": e,
                                "is-a-nascarfan": e,
                                "is-a-nurse": e,
                                "is-a-painter": e,
                                "is-a-personaltrainer": e,
                                "is-a-photographer": e,
                                "is-a-player": e,
                                "is-a-republican": e,
                                "is-a-rockstar": e,
                                "is-a-socialist": e,
                                "is-a-student": e,
                                "is-a-teacher": e,
                                "is-a-techie": e,
                                "is-a-therapist": e,
                                "is-an-accountant": e,
                                "is-an-actor": e,
                                "is-an-actress": e,
                                "is-an-anarchist": e,
                                "is-an-artist": e,
                                "is-an-engineer": e,
                                "is-an-entertainer": e,
                                "is-certified": e,
                                "is-gone": e,
                                "is-into-anime": e,
                                "is-into-cars": e,
                                "is-into-cartoons": e,
                                "is-into-games": e,
                                "is-leet": e,
                                "is-not-certified": e,
                                "is-slick": e,
                                "is-uberleet": e,
                                "is-with-theband": e,
                                "isa-geek": e,
                                "isa-hockeynut": e,
                                issmarterthanyou: e,
                                "likes-pie": e,
                                likescandy: e,
                                "neat-url": e,
                                "saves-the-whales": e,
                                selfip: e,
                                "sells-for-less": e,
                                "sells-for-u": e,
                                servebbs: e,
                                "simple-url": e,
                                "space-to-rent": e,
                                "teaches-yoga": e,
                                writesthisblog: e,
                                ddnsfree: e,
                                ddnsgeek: e,
                                giize: e,
                                gleeze: e,
                                kozow: e,
                                loseyourip: e,
                                ooguy: e,
                                theworkpc: e,
                                elluciancrmadvance: e,
                                elluciancrmadvise: e,
                                elluciancrmrecruit: e,
                                mytuleap: e,
                                "tuleap-partners": e,
                                evennode: {
                                    $: 0,
                                    succ: {
                                        "eu-1": e,
                                        "eu-2": e,
                                        "eu-3": e,
                                        "eu-4": e,
                                        "us-1": e,
                                        "us-2": e,
                                        "us-3": e,
                                        "us-4": e
                                    }
                                },
                                onfabrica: e,
                                fbsbx: g,
                                "fastly-terrarium": e,
                                "fastvps-server": e,
                                mydobiss: e,
                                firebaseapp: e,
                                forgeblocks: e,
                                framercanvas: e,
                                "freebox-os": e,
                                freeboxos: e,
                                freemyip: e,
                                gentapps: e,
                                gentlentapis: e,
                                githubusercontent: e,
                                "0emm": n,
                                appspot: {
                                    $: 2,
                                    succ: {
                                        r: n
                                    }
                                },
                                codespot: e,
                                googleapis: e,
                                googlecode: e,
                                pagespeedmobilizer: e,
                                publishproxy: e,
                                withgoogle: e,
                                withyoutube: e,
                                blogspot: e,
                                awsmppl: e,
                                herokuapp: e,
                                herokussl: e,
                                myravendb: e,
                                impertrixcdn: e,
                                impertrix: e,
                                smushcdn: e,
                                wphostedmail: e,
                                wpmucdn: e,
                                pixolino: e,
                                amscompute: e,
                                clicketcloud: e,
                                dopaas: e,
                                hidora: e,
                                "hosted-by-previder": d,
                                hosteur: {
                                    $: 0,
                                    succ: {
                                        "rag-cloud": e,
                                        "rag-cloud-ch": e
                                    }
                                },
                                "ik-server": {
                                    $: 0,
                                    succ: {
                                        jcloud: e,
                                        "jcloud-ver-jpc": e
                                    }
                                },
                                jelastic: {
                                    $: 0,
                                    succ: {
                                        demo: e
                                    }
                                },
                                kilatiron: e,
                                massivegrid: d,
                                wafaicloud: {
                                    $: 0,
                                    succ: {
                                        jed: e,
                                        lon: e,
                                        ryd: e
                                    }
                                },
                                joyent: {
                                    $: 0,
                                    succ: {
                                        cns: n
                                    }
                                },
                                lpusercontent: e,
                                lmpm: h,
                                linode: {
                                    $: 0,
                                    succ: {
                                        members: e,
                                        nodebalancer: n
                                    }
                                },
                                linodeobjects: n,
                                barsycenter: e,
                                barsyonline: e,
                                mazeplay: e,
                                miniserver: e,
                                meteorapp: k,
                                hostedpi: e,
                                "mythic-beasts": {
                                    $: 0,
                                    succ: {
                                        customer: e,
                                        caracal: e,
                                        fentiger: e,
                                        lynx: e,
                                        ocelot: e,
                                        oncilla: e,
                                        onza: e,
                                        sphinx: e,
                                        vs: e,
                                        x: e,
                                        yali: e
                                    }
                                },
                                "4u": e,
                                nfshost: e,
                                "001www": e,
                                ddnslive: e,
                                myiphost: e,
                                blogsyte: e,
                                ciscofreak: e,
                                damnserver: e,
                                ditchyourip: e,
                                dnsiskinky: e,
                                dynns: e,
                                geekgalaxy: e,
                                "health-carereform": e,
                                homesecuritymac: e,
                                homesecuritypc: e,
                                myactivedirectory: e,
                                mysecuritycamera: e,
                                "net-freaks": e,
                                onthewifi: e,
                                point2this: e,
                                quicksytes: e,
                                securitytactics: e,
                                serveexchange: e,
                                servehumour: e,
                                servep2p: e,
                                servesarcasm: e,
                                stufftoread: e,
                                unusualperson: e,
                                workisboring: e,
                                "3utilities": e,
                                ddnsking: e,
                                myvnc: e,
                                servebeer: e,
                                servecounterstrike: e,
                                serveftp: e,
                                servegame: e,
                                servehalflife: e,
                                servehttp: e,
                                serveirc: e,
                                servemp3: e,
                                servepics: e,
                                servequake: e,
                                observableusercontent: {
                                    $: 0,
                                    succ: {
                                        static: e
                                    }
                                },
                                orsites: e,
                                operaunite: e,
                                "authgear-staging": e,
                                authgearapps: e,
                                skygearapp: e,
                                outsystemscloud: e,
                                ownprovider: e,
                                pgfog: e,
                                pagefrontapp: e,
                                pagexl: e,
                                paywhirl: n,
                                gotpantheon: e,
                                "platter-app": e,
                                pleskns: e,
                                "postman-echo": e,
                                prgmr: {
                                    $: 0,
                                    succ: {
                                        xen: e
                                    }
                                },
                                pythonanywhere: k,
                                qualifioapp: e,
                                qbuser: e,
                                qa2: e,
                                "dev-myqnapcloud": e,
                                "alpha-myqnapcloud": e,
                                myqnapcloud: e,
                                quipelements: n,
                                rackmaze: e,
                                rhcloud: e,
                                render: h,
                                onrender: e,
                                logoip: e,
                                scrysec: e,
                                "firewall-gateway": e,
                                myshopblocks: e,
                                myshopify: e,
                                shopitsite: e,
                                "1kapp": e,
                                appchizi: e,
                                applinzi: e,
                                sinaapp: e,
                                vipsinaapp: e,
                                "bounty-full": {
                                    $: 2,
                                    succ: {
                                        alpha: e,
                                        beta: e
                                    }
                                },
                                "try-snowplow": e,
                                "stackhero-network": e,
                                "playstation-cloud": e,
                                myspreadshop: e,
                                stdlib: {
                                    $: 0,
                                    succ: {
                                        api: e
                                    }
                                },
                                "temp-dns": e,
                                dsmynas: e,
                                familyds: e,
                                reservd: e,
                                thingdustdata: e,
                                bloxcms: e,
                                "townnews-staging": e,
                                hk: e,
                                wafflecell: e,
                                idnblogger: e,
                                indowapblog: e,
                                "reserve-online": e,
                                hotelwithflight: e,
                                remotewd: e,
                                wiardweb: p,
                                "woltlab-demo": e,
                                wpenginepowered: {
                                    $: 2,
                                    succ: {
                                        js: e
                                    }
                                },
                                wixsite: e,
                                xnbay: {
                                    $: 2,
                                    succ: {
                                        u2: e,
                                        "u2-local": e
                                    }
                                },
                                yolasite: e
                            }
                        },
                        coop: a,
                        cr: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                ed: a,
                                fi: a,
                                go: a,
                                or: a,
                                sa: a
                            }
                        },
                        cu: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                org: a,
                                net: a,
                                gov: a,
                                inf: a
                            }
                        },
                        cv: s,
                        cw: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                net: a,
                                org: a
                            }
                        },
                        cx: {
                            $: 1,
                            succ: {
                                gov: a,
                                ath: e,
                                info: e
                            }
                        },
                        cy: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                com: {
                                    $: 1,
                                    succ: {
                                        blogspot: e,
                                        scaleforce: b
                                    }
                                },
                                ekloges: a,
                                gov: a,
                                ltd: a,
                                name: a,
                                net: a,
                                org: a,
                                parliament: a,
                                press: a,
                                pro: a,
                                tm: a
                            }
                        },
                        cz: {
                            $: 1,
                            succ: {
                                co: e,
                                realm: e,
                                e4: e,
                                blogspot: e,
                                metacentrum: {
                                    $: 0,
                                    succ: {
                                        cloud: n,
                                        custom: e
                                    }
                                },
                                muni: {
                                    $: 0,
                                    succ: {
                                        cloud: {
                                            $: 0,
                                            succ: {
                                                flt: e,
                                                usr: e
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        de: {
                            $: 1,
                            succ: {
                                bplaced: e,
                                square7: e,
                                com: e,
                                cosidns: {
                                    $: 0,
                                    succ: {
                                        dyn: e
                                    }
                                },
                                "dynamisches-dns": e,
                                dnsupdater: e,
                                "internet-dns": e,
                                "l-o-g-i-n": e,
                                dnshome: e,
                                fuettertdasnetz: e,
                                isteingeek: e,
                                istmein: e,
                                lebtimnetz: e,
                                leitungsen: e,
                                traeumtgerade: e,
                                ddnss: {
                                    $: 2,
                                    succ: {
                                        dyn: e,
                                        dyndns: e
                                    }
                                },
                                dyndns1: e,
                                "dyn-ip24": e,
                                "home-webserver": {
                                    $: 2,
                                    succ: {
                                        dyn: e
                                    }
                                },
                                "myhome-server": e,
                                frusky: n,
                                goip: e,
                                blogspot: e,
                                "xn--gnstigbestellen-zvb": e,
                                "günstigbestellen": e,
                                "xn--gnstigliefern-wob": e,
                                "günstigliefern": e,
                                "hs-heilbronn": {
                                    $: 0,
                                    succ: {
                                        it: p
                                    }
                                },
                                "dyn-berlin": e,
                                "in-berlin": e,
                                "in-brb": e,
                                "in-butter": e,
                                "in-dsl": e,
                                "in-vpn": e,
                                "mein-iserv": e,
                                schulserver: e,
                                "test-iserv": e,
                                keymachine: e,
                                "git-repos": e,
                                "lcube-server": e,
                                "svn-repos": e,
                                barsy: e,
                                logoip: e,
                                "firewall-gateway": e,
                                "my-gateway": e,
                                "my-router": e,
                                spdns: e,
                                speedpartner: {
                                    $: 0,
                                    succ: {
                                        customer: e
                                    }
                                },
                                myspreadshop: e,
                                "taifun-dns": e,
                                "12hp": e,
                                "2ix": e,
                                "4lima": e,
                                "lima-city": e,
                                "dd-dns": e,
                                "dray-dns": e,
                                draydns: e,
                                "dyn-vpn": e,
                                dynvpn: e,
                                "mein-vigor": e,
                                "my-vigor": e,
                                "my-wan": e,
                                "syno-ds": e,
                                "synology-diskstation": e,
                                "synology-ds": e,
                                uberspace: n,
                                virtualuser: e,
                                "virtual-user": e,
                                "community-pro": e,
                                diskussionsbereich: e
                            }
                        },
                        dj: a,
                        dk: {
                            $: 1,
                            succ: {
                                biz: e,
                                co: e,
                                firm: e,
                                reg: e,
                                store: e,
                                blogspot: e,
                                myspreadshop: e
                            }
                        },
                        dm: o,
                        do: {
                            $: 1,
                            succ: {
                                art: a,
                                com: a,
                                edu: a,
                                gob: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a,
                                sld: a,
                                web: a
                            }
                        },
                        dz: {
                            $: 1,
                            succ: {
                                art: a,
                                asso: a,
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                net: a,
                                pol: a,
                                soc: a,
                                tm: a
                            }
                        },
                        ec: {
                            $: 1,
                            succ: {
                                com: a,
                                info: a,
                                net: a,
                                fin: a,
                                k12: a,
                                med: a,
                                pro: a,
                                org: a,
                                edu: a,
                                gov: a,
                                gob: a,
                                mil: a
                            }
                        },
                        edu: {
                            $: 1,
                            succ: {
                                rit: {
                                    $: 0,
                                    succ: {
                                        "git-pages": e
                                    }
                                }
                            }
                        },
                        ee: {
                            $: 1,
                            succ: {
                                edu: a,
                                gov: a,
                                riik: a,
                                lib: a,
                                med: a,
                                com: s,
                                pri: a,
                                aip: a,
                                org: a,
                                fie: a
                            }
                        },
                        eg: {
                            $: 1,
                            succ: {
                                com: s,
                                edu: a,
                                eun: a,
                                gov: a,
                                mil: a,
                                name: a,
                                net: a,
                                org: a,
                                sci: a
                            }
                        },
                        er: r,
                        es: {
                            $: 1,
                            succ: {
                                com: s,
                                nom: a,
                                org: a,
                                gob: a,
                                edu: a,
                                myspreadshop: e
                            }
                        },
                        et: {
                            $: 1,
                            succ: {
                                com: a,
                                gov: a,
                                org: a,
                                edu: a,
                                biz: a,
                                name: a,
                                info: a,
                                net: a
                            }
                        },
                        eu: {
                            $: 1,
                            succ: {
                                mycd: e,
                                cloudns: e,
                                dogado: f,
                                barsy: e,
                                wellbeingzone: e,
                                spdns: e,
                                transurl: n,
                                diskstation: e
                            }
                        },
                        fi: {
                            $: 1,
                            succ: {
                                aland: a,
                                dy: e,
                                blogspot: e,
                                "xn--hkkinen-5wa": e,
                                "häkkinen": e,
                                iki: e,
                                cloudplatform: {
                                    $: 0,
                                    succ: {
                                        fi: e
                                    }
                                },
                                datacenter: {
                                    $: 0,
                                    succ: {
                                        demo: e,
                                        paas: e
                                    }
                                },
                                myspreadshop: e
                            }
                        },
                        fj: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                com: a,
                                gov: a,
                                info: a,
                                mil: a,
                                name: a,
                                net: a,
                                org: a,
                                pro: a
                            }
                        },
                        fk: r,
                        fm: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                net: a,
                                org: a,
                                radio: e
                            }
                        },
                        fo: a,
                        fr: {
                            $: 1,
                            succ: {
                                asso: a,
                                com: a,
                                gouv: a,
                                nom: a,
                                prd: a,
                                tm: a,
                                aeroport: a,
                                avocat: a,
                                avoues: a,
                                cci: a,
                                chambagri: a,
                                "chirurgiens-dentistes": a,
                                "experts-comptables": a,
                                "geometre-expert": a,
                                greta: a,
                                "huissier-justice": a,
                                medecin: a,
                                notaires: a,
                                pharmacien: a,
                                port: a,
                                veterinaire: a,
                                "en-root": e,
                                "fbx-os": e,
                                fbxos: e,
                                "freebox-os": e,
                                freeboxos: e,
                                blogspot: e,
                                goupile: e,
                                "on-web": e,
                                "chirurgiens-dentistes-en-france": e,
                                myspreadshop: e,
                                ynh: e
                            }
                        },
                        ga: a,
                        gb: a,
                        gd: {
                            $: 1,
                            succ: {
                                edu: a,
                                gov: a
                            }
                        },
                        ge: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                mil: a,
                                net: a,
                                pvt: a
                            }
                        },
                        gf: a,
                        gg: {
                            $: 1,
                            succ: {
                                co: a,
                                net: a,
                                org: a,
                                kaas: e,
                                cya: e,
                                panel: {
                                    $: 2,
                                    succ: {
                                        daemon: e
                                    }
                                }
                            }
                        },
                        gh: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                mil: a
                            }
                        },
                        gi: {
                            $: 1,
                            succ: {
                                com: a,
                                ltd: a,
                                gov: a,
                                mod: a,
                                edu: a,
                                org: a
                            }
                        },
                        gl: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                edu: a,
                                net: a,
                                org: a,
                                biz: e,
                                xx: e
                            }
                        },
                        gm: a,
                        gn: {
                            $: 1,
                            succ: {
                                ac: a,
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                net: a
                            }
                        },
                        gov: a,
                        gp: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                mobi: a,
                                edu: a,
                                org: a,
                                asso: a,
                                app: e
                            }
                        },
                        gq: a,
                        gr: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                net: a,
                                org: a,
                                gov: a,
                                blogspot: e
                            }
                        },
                        gs: a,
                        gt: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gob: a,
                                ind: a,
                                mil: a,
                                net: a,
                                org: a,
                                blog: e,
                                de: e,
                                to: e
                            }
                        },
                        gu: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                guam: a,
                                info: a,
                                net: a,
                                org: a,
                                web: a
                            }
                        },
                        gw: a,
                        gy: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                edu: a,
                                gov: a,
                                net: a,
                                org: a,
                                be: e
                            }
                        },
                        hk: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                idv: a,
                                net: a,
                                org: a,
                                "xn--55qx5d": a,
                                "公司": a,
                                "xn--wcvs22d": a,
                                "教育": a,
                                "xn--lcvr32d": a,
                                "敎育": a,
                                "xn--mxtq1m": a,
                                "政府": a,
                                "xn--gmqw5a": a,
                                "個人": a,
                                "xn--ciqpn": a,
                                "个人": a,
                                "xn--gmq050i": a,
                                "箇人": a,
                                "xn--zf0avx": a,
                                "網络": a,
                                "xn--io0a7i": a,
                                "网络": a,
                                "xn--mk0axi": a,
                                "组織": a,
                                "xn--od0alg": a,
                                "網絡": a,
                                "xn--od0aq3b": a,
                                "网絡": a,
                                "xn--tn0ag": a,
                                "组织": a,
                                "xn--uc0atv": a,
                                "組織": a,
                                "xn--uc0ay4a": a,
                                "組织": a,
                                blogspot: e,
                                secaas: e,
                                ltd: e,
                                inc: e
                            }
                        },
                        hm: a,
                        hn: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                org: a,
                                net: a,
                                mil: a,
                                gob: a,
                                cc: e
                            }
                        },
                        hr: {
                            $: 1,
                            succ: {
                                iz: a,
                                from: a,
                                name: a,
                                com: a,
                                blogspot: e,
                                free: e
                            }
                        },
                        ht: {
                            $: 1,
                            succ: {
                                com: a,
                                shop: a,
                                firm: a,
                                info: a,
                                adult: a,
                                net: a,
                                pro: a,
                                org: a,
                                med: a,
                                art: a,
                                coop: a,
                                pol: a,
                                asso: a,
                                edu: a,
                                rel: a,
                                gouv: a,
                                perso: a
                            }
                        },
                        hu: {
                            $: 1,
                            succ: {
                                2e3: a,
                                co: a,
                                info: a,
                                org: a,
                                priv: a,
                                sport: a,
                                tm: a,
                                agrar: a,
                                bolt: a,
                                casino: a,
                                city: a,
                                erotica: a,
                                erotika: a,
                                film: a,
                                forum: a,
                                games: a,
                                hotel: a,
                                ingatlan: a,
                                jogasz: a,
                                konyvelo: a,
                                lakas: a,
                                media: a,
                                news: a,
                                reklam: a,
                                sex: a,
                                shop: a,
                                suli: a,
                                szex: a,
                                tozsde: a,
                                utazas: a,
                                video: a,
                                blogspot: e
                            }
                        },
                        id: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: s,
                                desa: a,
                                go: a,
                                mil: a,
                                my: {
                                    $: 1,
                                    succ: {
                                        rss: n
                                    }
                                },
                                net: a,
                                or: a,
                                ponpes: a,
                                sch: a,
                                web: a,
                                flap: e,
                                forte: e,
                                bloger: e,
                                wblog: e
                            }
                        },
                        ie: {
                            $: 1,
                            succ: {
                                gov: a,
                                blogspot: e,
                                myspreadshop: e
                            }
                        },
                        il: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: {
                                    $: 1,
                                    succ: {
                                        ravpage: e,
                                        blogspot: e,
                                        tabitorder: e
                                    }
                                },
                                gov: a,
                                idf: a,
                                k12: a,
                                muni: a,
                                net: a,
                                org: a
                            }
                        },
                        im: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: {
                                    $: 1,
                                    succ: {
                                        ltd: a,
                                        plc: a
                                    }
                                },
                                com: a,
                                net: a,
                                org: a,
                                tt: a,
                                tv: a,
                                ro: e
                            }
                        },
                        in: {
                            $: 1,
                            succ: {
                                co: a,
                                firm: a,
                                net: a,
                                org: a,
                                gen: a,
                                ind: a,
                                nic: a,
                                ac: a,
                                edu: a,
                                res: a,
                                gov: a,
                                mil: a,
                                web: e,
                                cloudns: e,
                                blogspot: e,
                                barsy: e,
                                supabase: e
                            }
                        },
                        info: {
                            $: 1,
                            succ: {
                                cloudns: e,
                                "dynamic-dns": e,
                                dyndns: e,
                                "barrel-of-knowledge": e,
                                "barrell-of-knowledge": e,
                                "for-our": e,
                                "groks-the": e,
                                "groks-this": e,
                                "here-for-more": e,
                                knowsitall: e,
                                selfip: e,
                                webhop: e,
                                barsy: e,
                                mayfirst: e,
                                forumz: e,
                                nsupdate: e,
                                dvrcam: e,
                                ilovecollege: e,
                                "no-ip": e,
                                dnsupdate: e,
                                "v-info": e
                            }
                        },
                        int: {
                            $: 1,
                            succ: {
                                eu: a
                            }
                        },
                        io: {
                            $: 1,
                            succ: {
                                2038: e,
                                com: a,
                                apigee: e,
                                "b-data": e,
                                backplaneapp: e,
                                banzaicloud: {
                                    $: 0,
                                    succ: {
                                        app: e,
                                        backyards: n
                                    }
                                },
                                bitbucket: e,
                                bluebite: e,
                                boxfuse: e,
                                browsersafetymark: e,
                                bigv: {
                                    $: 0,
                                    succ: {
                                        uk0: e
                                    }
                                },
                                cleverapps: e,
                                dappnode: {
                                    $: 0,
                                    succ: {
                                        dyndns: e
                                    }
                                },
                                dedyn: e,
                                drud: e,
                                definima: e,
                                "fh-muenster": e,
                                shw: e,
                                forgerock: {
                                    $: 0,
                                    succ: {
                                        id: e
                                    }
                                },
                                ghost: e,
                                github: e,
                                gitlab: e,
                                lolipop: e,
                                "hasura-app": e,
                                hostyhosting: e,
                                moonscale: n,
                                beebyte: d,
                                beebyteapp: {
                                    $: 0,
                                    succ: {
                                        sekd1: e
                                    }
                                },
                                jele: e,
                                unispace: {
                                    $: 0,
                                    succ: {
                                        "cloud-fr1": e
                                    }
                                },
                                webthings: e,
                                loginline: e,
                                barsy: e,
                                azurecontainer: n,
                                ngrok: e,
                                nodeart: {
                                    $: 0,
                                    succ: {
                                        stage: e
                                    }
                                },
                                nodum: e,
                                nid: e,
                                pantheonsite: e,
                                dyn53: e,
                                pstmn: {
                                    $: 2,
                                    succ: {
                                        mock: e
                                    }
                                },
                                protonet: e,
                                qoto: e,
                                qcx: {
                                    $: 2,
                                    succ: {
                                        sys: n
                                    }
                                },
                                vaporcloud: e,
                                vbrplsbx: {
                                    $: 0,
                                    succ: {
                                        g: e
                                    }
                                },
                                "on-k3s": n,
                                "on-rio": n,
                                readthedocs: e,
                                resindevice: e,
                                resinstaging: {
                                    $: 0,
                                    succ: {
                                        devices: e
                                    }
                                },
                                hzc: e,
                                sandcats: e,
                                shiftcrypto: e,
                                shiftedit: e,
                                "mo-siemens": e,
                                lair: g,
                                stolos: n,
                                spacekit: e,
                                utwente: e,
                                s5y: n,
                                telebit: e,
                                thingdust: {
                                    $: 0,
                                    succ: {
                                        dev: x,
                                        disrec: x,
                                        prod: w,
                                        testing: x
                                    }
                                },
                                wedeploy: e,
                                editorx: e,
                                basicserver: e,
                                virtualserver: e
                            }
                        },
                        iq: $,
                        ir: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                gov: a,
                                id: a,
                                net: a,
                                org: a,
                                sch: a,
                                "xn--mgba3a4f16a": a,
                                "ایران": a,
                                "xn--mgba3a4fra": a,
                                "ايران": a
                            }
                        },
                        is: {
                            $: 1,
                            succ: {
                                net: a,
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                int: a,
                                cupcake: e,
                                blogspot: e
                            }
                        },
                        it: {
                            $: 1,
                            succ: {
                                gov: a,
                                edu: a,
                                abr: a,
                                abruzzo: a,
                                "aosta-valley": a,
                                aostavalley: a,
                                bas: a,
                                basilicata: a,
                                cal: a,
                                calabria: a,
                                cam: a,
                                campania: a,
                                "emilia-romagna": a,
                                emiliaromagna: a,
                                emr: a,
                                "friuli-v-giulia": a,
                                "friuli-ve-giulia": a,
                                "friuli-vegiulia": a,
                                "friuli-venezia-giulia": a,
                                "friuli-veneziagiulia": a,
                                "friuli-vgiulia": a,
                                "friuliv-giulia": a,
                                "friulive-giulia": a,
                                friulivegiulia: a,
                                "friulivenezia-giulia": a,
                                friuliveneziagiulia: a,
                                friulivgiulia: a,
                                fvg: a,
                                laz: a,
                                lazio: a,
                                lig: a,
                                liguria: a,
                                lom: a,
                                lombardia: a,
                                lombardy: a,
                                lucania: a,
                                mar: a,
                                marche: a,
                                mol: a,
                                molise: a,
                                piedmont: a,
                                piemonte: a,
                                pmn: a,
                                pug: a,
                                puglia: a,
                                sar: a,
                                sardegna: a,
                                sardinia: a,
                                sic: a,
                                sicilia: a,
                                sicily: a,
                                taa: a,
                                tos: a,
                                toscana: a,
                                "trentin-sud-tirol": a,
                                "xn--trentin-sd-tirol-rzb": a,
                                "trentin-süd-tirol": a,
                                "trentin-sudtirol": a,
                                "xn--trentin-sdtirol-7vb": a,
                                "trentin-südtirol": a,
                                "trentin-sued-tirol": a,
                                "trentin-suedtirol": a,
                                "trentino-a-adige": a,
                                "trentino-aadige": a,
                                "trentino-alto-adige": a,
                                "trentino-altoadige": a,
                                "trentino-s-tirol": a,
                                "trentino-stirol": a,
                                "trentino-sud-tirol": a,
                                "xn--trentino-sd-tirol-c3b": a,
                                "trentino-süd-tirol": a,
                                "trentino-sudtirol": a,
                                "xn--trentino-sdtirol-szb": a,
                                "trentino-südtirol": a,
                                "trentino-sued-tirol": a,
                                "trentino-suedtirol": a,
                                trentino: a,
                                "trentinoa-adige": a,
                                trentinoaadige: a,
                                "trentinoalto-adige": a,
                                trentinoaltoadige: a,
                                "trentinos-tirol": a,
                                trentinostirol: a,
                                "trentinosud-tirol": a,
                                "xn--trentinosd-tirol-rzb": a,
                                "trentinosüd-tirol": a,
                                trentinosudtirol: a,
                                "xn--trentinosdtirol-7vb": a,
                                "trentinosüdtirol": a,
                                "trentinosued-tirol": a,
                                trentinosuedtirol: a,
                                "trentinsud-tirol": a,
                                "xn--trentinsd-tirol-6vb": a,
                                "trentinsüd-tirol": a,
                                trentinsudtirol: a,
                                "xn--trentinsdtirol-nsb": a,
                                "trentinsüdtirol": a,
                                "trentinsued-tirol": a,
                                trentinsuedtirol: a,
                                tuscany: a,
                                umb: a,
                                umbria: a,
                                "val-d-aosta": a,
                                "val-daosta": a,
                                "vald-aosta": a,
                                valdaosta: a,
                                "valle-aosta": a,
                                "valle-d-aosta": a,
                                "valle-daosta": a,
                                valleaosta: a,
                                "valled-aosta": a,
                                valledaosta: a,
                                "vallee-aoste": a,
                                "xn--valle-aoste-ebb": a,
                                "vallée-aoste": a,
                                "vallee-d-aoste": a,
                                "xn--valle-d-aoste-ehb": a,
                                "vallée-d-aoste": a,
                                valleeaoste: a,
                                "xn--valleaoste-e7a": a,
                                "valléeaoste": a,
                                valleedaoste: a,
                                "xn--valledaoste-ebb": a,
                                "valléedaoste": a,
                                vao: a,
                                vda: a,
                                ven: a,
                                veneto: a,
                                ag: a,
                                agrigento: a,
                                al: a,
                                alessandria: a,
                                "alto-adige": a,
                                altoadige: a,
                                an: a,
                                ancona: a,
                                "andria-barletta-trani": a,
                                "andria-trani-barletta": a,
                                andriabarlettatrani: a,
                                andriatranibarletta: a,
                                ao: a,
                                aosta: a,
                                aoste: a,
                                ap: a,
                                aq: a,
                                aquila: a,
                                ar: a,
                                arezzo: a,
                                "ascoli-piceno": a,
                                ascolipiceno: a,
                                asti: a,
                                at: a,
                                av: a,
                                avellino: a,
                                ba: a,
                                "balsan-sudtirol": a,
                                "xn--balsan-sdtirol-nsb": a,
                                "balsan-südtirol": a,
                                "balsan-suedtirol": a,
                                balsan: a,
                                bari: a,
                                "barletta-trani-andria": a,
                                barlettatraniandria: a,
                                belluno: a,
                                benevento: a,
                                bergamo: a,
                                bg: a,
                                bi: a,
                                biella: a,
                                bl: a,
                                bn: a,
                                bo: a,
                                bologna: a,
                                "bolzano-altoadige": a,
                                bolzano: a,
                                "bozen-sudtirol": a,
                                "xn--bozen-sdtirol-2ob": a,
                                "bozen-südtirol": a,
                                "bozen-suedtirol": a,
                                bozen: a,
                                br: a,
                                brescia: a,
                                brindisi: a,
                                bs: a,
                                bt: a,
                                "bulsan-sudtirol": a,
                                "xn--bulsan-sdtirol-nsb": a,
                                "bulsan-südtirol": a,
                                "bulsan-suedtirol": a,
                                bulsan: a,
                                bz: a,
                                ca: a,
                                cagliari: a,
                                caltanissetta: a,
                                "campidano-medio": a,
                                campidanomedio: a,
                                campobasso: a,
                                "carbonia-iglesias": a,
                                carboniaiglesias: a,
                                "carrara-massa": a,
                                carraramassa: a,
                                caserta: a,
                                catania: a,
                                catanzaro: a,
                                cb: a,
                                ce: a,
                                "cesena-forli": a,
                                "xn--cesena-forl-mcb": a,
                                "cesena-forlì": a,
                                cesenaforli: a,
                                "xn--cesenaforl-i8a": a,
                                "cesenaforlì": a,
                                ch: a,
                                chieti: a,
                                ci: a,
                                cl: a,
                                cn: a,
                                co: a,
                                como: a,
                                cosenza: a,
                                cr: a,
                                cremona: a,
                                crotone: a,
                                cs: a,
                                ct: a,
                                cuneo: a,
                                cz: a,
                                "dell-ogliastra": a,
                                dellogliastra: a,
                                en: a,
                                enna: a,
                                fc: a,
                                fe: a,
                                fermo: a,
                                ferrara: a,
                                fg: a,
                                fi: a,
                                firenze: a,
                                florence: a,
                                fm: a,
                                foggia: a,
                                "forli-cesena": a,
                                "xn--forl-cesena-fcb": a,
                                "forlì-cesena": a,
                                forlicesena: a,
                                "xn--forlcesena-c8a": a,
                                "forlìcesena": a,
                                fr: a,
                                frosinone: a,
                                ge: a,
                                genoa: a,
                                genova: a,
                                go: a,
                                gorizia: a,
                                gr: a,
                                grosseto: a,
                                "iglesias-carbonia": a,
                                iglesiascarbonia: a,
                                im: a,
                                imperia: a,
                                is: a,
                                isernia: a,
                                kr: a,
                                "la-spezia": a,
                                laquila: a,
                                laspezia: a,
                                latina: a,
                                lc: a,
                                le: a,
                                lecce: a,
                                lecco: a,
                                li: a,
                                livorno: a,
                                lo: a,
                                lodi: a,
                                lt: a,
                                lu: a,
                                lucca: a,
                                macerata: a,
                                mantova: a,
                                "massa-carrara": a,
                                massacarrara: a,
                                matera: a,
                                mb: a,
                                mc: a,
                                me: a,
                                "medio-campidano": a,
                                mediocampidano: a,
                                messina: a,
                                mi: a,
                                milan: a,
                                milano: a,
                                mn: a,
                                mo: a,
                                modena: a,
                                "monza-brianza": a,
                                "monza-e-della-brianza": a,
                                monza: a,
                                monzabrianza: a,
                                monzaebrianza: a,
                                monzaedellabrianza: a,
                                ms: a,
                                mt: a,
                                na: a,
                                naples: a,
                                napoli: a,
                                no: a,
                                novara: a,
                                nu: a,
                                nuoro: a,
                                og: a,
                                ogliastra: a,
                                "olbia-tempio": a,
                                olbiatempio: a,
                                or: a,
                                oristano: a,
                                ot: a,
                                pa: a,
                                padova: a,
                                padua: a,
                                palermo: a,
                                parma: a,
                                pavia: a,
                                pc: a,
                                pd: a,
                                pe: a,
                                perugia: a,
                                "pesaro-urbino": a,
                                pesarourbino: a,
                                pescara: a,
                                pg: a,
                                pi: a,
                                piacenza: a,
                                pisa: a,
                                pistoia: a,
                                pn: a,
                                po: a,
                                pordenone: a,
                                potenza: a,
                                pr: a,
                                prato: a,
                                pt: a,
                                pu: a,
                                pv: a,
                                pz: a,
                                ra: a,
                                ragusa: a,
                                ravenna: a,
                                rc: a,
                                re: a,
                                "reggio-calabria": a,
                                "reggio-emilia": a,
                                reggiocalabria: a,
                                reggioemilia: a,
                                rg: a,
                                ri: a,
                                rieti: a,
                                rimini: a,
                                rm: a,
                                rn: a,
                                ro: a,
                                roma: a,
                                rome: a,
                                rovigo: a,
                                sa: a,
                                salerno: a,
                                sassari: a,
                                savona: a,
                                si: a,
                                siena: a,
                                siracusa: a,
                                so: a,
                                sondrio: a,
                                sp: a,
                                sr: a,
                                ss: a,
                                suedtirol: a,
                                "xn--sdtirol-n2a": a,
                                "südtirol": a,
                                sv: a,
                                ta: a,
                                taranto: a,
                                te: a,
                                "tempio-olbia": a,
                                tempioolbia: a,
                                teramo: a,
                                terni: a,
                                tn: a,
                                to: a,
                                torino: a,
                                tp: a,
                                tr: a,
                                "trani-andria-barletta": a,
                                "trani-barletta-andria": a,
                                traniandriabarletta: a,
                                tranibarlettaandria: a,
                                trapani: a,
                                trento: a,
                                treviso: a,
                                trieste: a,
                                ts: a,
                                turin: a,
                                tv: a,
                                ud: a,
                                udine: a,
                                "urbino-pesaro": a,
                                urbinopesaro: a,
                                va: a,
                                varese: a,
                                vb: a,
                                vc: a,
                                ve: a,
                                venezia: a,
                                venice: a,
                                verbania: a,
                                vercelli: a,
                                verona: a,
                                vi: a,
                                "vibo-valentia": a,
                                vibovalentia: a,
                                vicenza: a,
                                viterbo: a,
                                vr: a,
                                vs: a,
                                vt: a,
                                vv: a,
                                blogspot: e,
                                neen: {
                                    $: 0,
                                    succ: {
                                        jc: e
                                    }
                                },
                                tim: {
                                    $: 0,
                                    succ: {
                                        open: {
                                            $: 0,
                                            succ: {
                                                jelastic: t
                                            }
                                        }
                                    }
                                },
                                "16-b": e,
                                "32-b": e,
                                "64-b": e,
                                myspreadshop: e,
                                syncloud: e
                            }
                        },
                        je: {
                            $: 1,
                            succ: {
                                co: a,
                                net: a,
                                org: a,
                                of: e
                            }
                        },
                        jm: r,
                        jo: {
                            $: 1,
                            succ: {
                                com: a,
                                org: a,
                                net: a,
                                edu: a,
                                sch: a,
                                gov: a,
                                mil: a,
                                name: a
                            }
                        },
                        jobs: a,
                        jp: {
                            $: 1,
                            succ: {
                                ac: a,
                                ad: a,
                                co: a,
                                ed: a,
                                go: a,
                                gr: a,
                                lg: a,
                                ne: {
                                    $: 1,
                                    succ: {
                                        aseinet: y,
                                        gehirn: e
                                    }
                                },
                                or: a,
                                aichi: {
                                    $: 1,
                                    succ: {
                                        aisai: a,
                                        ama: a,
                                        anjo: a,
                                        asuke: a,
                                        chiryu: a,
                                        chita: a,
                                        fuso: a,
                                        gamagori: a,
                                        handa: a,
                                        hazu: a,
                                        hekinan: a,
                                        higashiura: a,
                                        ichinomiya: a,
                                        inazawa: a,
                                        inuyama: a,
                                        isshiki: a,
                                        iwakura: a,
                                        kanie: a,
                                        kariya: a,
                                        kasugai: a,
                                        kira: a,
                                        kiyosu: a,
                                        komaki: a,
                                        konan: a,
                                        kota: a,
                                        mihama: a,
                                        miyoshi: a,
                                        nishio: a,
                                        nisshin: a,
                                        obu: a,
                                        oguchi: a,
                                        oharu: a,
                                        okazaki: a,
                                        owariasahi: a,
                                        seto: a,
                                        shikatsu: a,
                                        shinshiro: a,
                                        shitara: a,
                                        tahara: a,
                                        takahama: a,
                                        tobishima: a,
                                        toei: a,
                                        togo: a,
                                        tokai: a,
                                        tokoname: a,
                                        toyoake: a,
                                        toyohashi: a,
                                        toyokawa: a,
                                        toyone: a,
                                        toyota: a,
                                        tsushima: a,
                                        yatomi: a
                                    }
                                },
                                akita: {
                                    $: 1,
                                    succ: {
                                        akita: a,
                                        daisen: a,
                                        fujisato: a,
                                        gojome: a,
                                        hachirogata: a,
                                        happou: a,
                                        higashinaruse: a,
                                        honjo: a,
                                        honjyo: a,
                                        ikawa: a,
                                        kamikoani: a,
                                        kamioka: a,
                                        katagami: a,
                                        kazuno: a,
                                        kitaakita: a,
                                        kosaka: a,
                                        kyowa: a,
                                        misato: a,
                                        mitane: a,
                                        moriyoshi: a,
                                        nikaho: a,
                                        noshiro: a,
                                        odate: a,
                                        oga: a,
                                        ogata: a,
                                        semboku: a,
                                        yokote: a,
                                        yurihonjo: a
                                    }
                                },
                                aomori: {
                                    $: 1,
                                    succ: {
                                        aomori: a,
                                        gonohe: a,
                                        hachinohe: a,
                                        hashikami: a,
                                        hiranai: a,
                                        hirosaki: a,
                                        itayanagi: a,
                                        kuroishi: a,
                                        misawa: a,
                                        mutsu: a,
                                        nakadomari: a,
                                        noheji: a,
                                        oirase: a,
                                        owani: a,
                                        rokunohe: a,
                                        sannohe: a,
                                        shichinohe: a,
                                        shingo: a,
                                        takko: a,
                                        towada: a,
                                        tsugaru: a,
                                        tsuruta: a
                                    }
                                },
                                chiba: {
                                    $: 1,
                                    succ: {
                                        abiko: a,
                                        asahi: a,
                                        chonan: a,
                                        chosei: a,
                                        choshi: a,
                                        chuo: a,
                                        funabashi: a,
                                        futtsu: a,
                                        hanamigawa: a,
                                        ichihara: a,
                                        ichikawa: a,
                                        ichinomiya: a,
                                        inzai: a,
                                        isumi: a,
                                        kamagaya: a,
                                        kamogawa: a,
                                        kashiwa: a,
                                        katori: a,
                                        katsuura: a,
                                        kimitsu: a,
                                        kisarazu: a,
                                        kozaki: a,
                                        kujukuri: a,
                                        kyonan: a,
                                        matsudo: a,
                                        midori: a,
                                        mihama: a,
                                        minamiboso: a,
                                        mobara: a,
                                        mutsuzawa: a,
                                        nagara: a,
                                        nagareyama: a,
                                        narashino: a,
                                        narita: a,
                                        noda: a,
                                        oamishirasato: a,
                                        omigawa: a,
                                        onjuku: a,
                                        otaki: a,
                                        sakae: a,
                                        sakura: a,
                                        shimofusa: a,
                                        shirako: a,
                                        shiroi: a,
                                        shisui: a,
                                        sodegaura: a,
                                        sosa: a,
                                        tako: a,
                                        tateyama: a,
                                        togane: a,
                                        tohnosho: a,
                                        tomisato: a,
                                        urayasu: a,
                                        yachimata: a,
                                        yachiyo: a,
                                        yokaichiba: a,
                                        yokoshibahikari: a,
                                        yotsukaido: a
                                    }
                                },
                                ehime: {
                                    $: 1,
                                    succ: {
                                        ainan: a,
                                        honai: a,
                                        ikata: a,
                                        imabari: a,
                                        iyo: a,
                                        kamijima: a,
                                        kihoku: a,
                                        kumakogen: a,
                                        masaki: a,
                                        matsuno: a,
                                        matsuyama: a,
                                        namikata: a,
                                        niihama: a,
                                        ozu: a,
                                        saijo: a,
                                        seiyo: a,
                                        shikokuchuo: a,
                                        tobe: a,
                                        toon: a,
                                        uchiko: a,
                                        uwajima: a,
                                        yawatahama: a
                                    }
                                },
                                fukui: {
                                    $: 1,
                                    succ: {
                                        echizen: a,
                                        eiheiji: a,
                                        fukui: a,
                                        ikeda: a,
                                        katsuyama: a,
                                        mihama: a,
                                        minamiechizen: a,
                                        obama: a,
                                        ohi: a,
                                        ono: a,
                                        sabae: a,
                                        sakai: a,
                                        takahama: a,
                                        tsuruga: a,
                                        wakasa: a
                                    }
                                },
                                fukuoka: {
                                    $: 1,
                                    succ: {
                                        ashiya: a,
                                        buzen: a,
                                        chikugo: a,
                                        chikuho: a,
                                        chikujo: a,
                                        chikushino: a,
                                        chikuzen: a,
                                        chuo: a,
                                        dazaifu: a,
                                        fukuchi: a,
                                        hakata: a,
                                        higashi: a,
                                        hirokawa: a,
                                        hisayama: a,
                                        iizuka: a,
                                        inatsuki: a,
                                        kaho: a,
                                        kasuga: a,
                                        kasuya: a,
                                        kawara: a,
                                        keisen: a,
                                        koga: a,
                                        kurate: a,
                                        kurogi: a,
                                        kurume: a,
                                        minami: a,
                                        miyako: a,
                                        miyama: a,
                                        miyawaka: a,
                                        mizumaki: a,
                                        munakata: a,
                                        nakagawa: a,
                                        nakama: a,
                                        nishi: a,
                                        nogata: a,
                                        ogori: a,
                                        okagaki: a,
                                        okawa: a,
                                        oki: a,
                                        omuta: a,
                                        onga: a,
                                        onojo: a,
                                        oto: a,
                                        saigawa: a,
                                        sasaguri: a,
                                        shingu: a,
                                        shinyoshitomi: a,
                                        shonai: a,
                                        soeda: a,
                                        sue: a,
                                        tachiarai: a,
                                        tagawa: a,
                                        takata: a,
                                        toho: a,
                                        toyotsu: a,
                                        tsuiki: a,
                                        ukiha: a,
                                        umi: a,
                                        usui: a,
                                        yamada: a,
                                        yame: a,
                                        yanagawa: a,
                                        yukuhashi: a
                                    }
                                },
                                fukushima: {
                                    $: 1,
                                    succ: {
                                        aizubange: a,
                                        aizumisato: a,
                                        aizuwakamatsu: a,
                                        asakawa: a,
                                        bandai: a,
                                        date: a,
                                        fukushima: a,
                                        furudono: a,
                                        futaba: a,
                                        hanawa: a,
                                        higashi: a,
                                        hirata: a,
                                        hirono: a,
                                        iitate: a,
                                        inawashiro: a,
                                        ishikawa: a,
                                        iwaki: a,
                                        izumizaki: a,
                                        kagamiishi: a,
                                        kaneyama: a,
                                        kawamata: a,
                                        kitakata: a,
                                        kitashiobara: a,
                                        koori: a,
                                        koriyama: a,
                                        kunimi: a,
                                        miharu: a,
                                        mishima: a,
                                        namie: a,
                                        nango: a,
                                        nishiaizu: a,
                                        nishigo: a,
                                        okuma: a,
                                        omotego: a,
                                        ono: a,
                                        otama: a,
                                        samegawa: a,
                                        shimogo: a,
                                        shirakawa: a,
                                        showa: a,
                                        soma: a,
                                        sukagawa: a,
                                        taishin: a,
                                        tamakawa: a,
                                        tanagura: a,
                                        tenei: a,
                                        yabuki: a,
                                        yamato: a,
                                        yamatsuri: a,
                                        yanaizu: a,
                                        yugawa: a
                                    }
                                },
                                gifu: {
                                    $: 1,
                                    succ: {
                                        anpachi: a,
                                        ena: a,
                                        gifu: a,
                                        ginan: a,
                                        godo: a,
                                        gujo: a,
                                        hashima: a,
                                        hichiso: a,
                                        hida: a,
                                        higashishirakawa: a,
                                        ibigawa: a,
                                        ikeda: a,
                                        kakamigahara: a,
                                        kani: a,
                                        kasahara: a,
                                        kasamatsu: a,
                                        kawaue: a,
                                        kitagata: a,
                                        mino: a,
                                        minokamo: a,
                                        mitake: a,
                                        mizunami: a,
                                        motosu: a,
                                        nakatsugawa: a,
                                        ogaki: a,
                                        sakahogi: a,
                                        seki: a,
                                        sekigahara: a,
                                        shirakawa: a,
                                        tajimi: a,
                                        takayama: a,
                                        tarui: a,
                                        toki: a,
                                        tomika: a,
                                        wanouchi: a,
                                        yamagata: a,
                                        yaotsu: a,
                                        yoro: a
                                    }
                                },
                                gunma: {
                                    $: 1,
                                    succ: {
                                        annaka: a,
                                        chiyoda: a,
                                        fujioka: a,
                                        higashiagatsuma: a,
                                        isesaki: a,
                                        itakura: a,
                                        kanna: a,
                                        kanra: a,
                                        katashina: a,
                                        kawaba: a,
                                        kiryu: a,
                                        kusatsu: a,
                                        maebashi: a,
                                        meiwa: a,
                                        midori: a,
                                        minakami: a,
                                        naganohara: a,
                                        nakanojo: a,
                                        nanmoku: a,
                                        numata: a,
                                        oizumi: a,
                                        ora: a,
                                        ota: a,
                                        shibukawa: a,
                                        shimonita: a,
                                        shinto: a,
                                        showa: a,
                                        takasaki: a,
                                        takayama: a,
                                        tamamura: a,
                                        tatebayashi: a,
                                        tomioka: a,
                                        tsukiyono: a,
                                        tsumagoi: a,
                                        ueno: a,
                                        yoshioka: a
                                    }
                                },
                                hiroshima: {
                                    $: 1,
                                    succ: {
                                        asaminami: a,
                                        daiwa: a,
                                        etajima: a,
                                        fuchu: a,
                                        fukuyama: a,
                                        hatsukaichi: a,
                                        higashihiroshima: a,
                                        hongo: a,
                                        jinsekikogen: a,
                                        kaita: a,
                                        kui: a,
                                        kumano: a,
                                        kure: a,
                                        mihara: a,
                                        miyoshi: a,
                                        naka: a,
                                        onomichi: a,
                                        osakikamijima: a,
                                        otake: a,
                                        saka: a,
                                        sera: a,
                                        seranishi: a,
                                        shinichi: a,
                                        shobara: a,
                                        takehara: a
                                    }
                                },
                                hokkaido: {
                                    $: 1,
                                    succ: {
                                        abashiri: a,
                                        abira: a,
                                        aibetsu: a,
                                        akabira: a,
                                        akkeshi: a,
                                        asahikawa: a,
                                        ashibetsu: a,
                                        ashoro: a,
                                        assabu: a,
                                        atsuma: a,
                                        bibai: a,
                                        biei: a,
                                        bifuka: a,
                                        bihoro: a,
                                        biratori: a,
                                        chippubetsu: a,
                                        chitose: a,
                                        date: a,
                                        ebetsu: a,
                                        embetsu: a,
                                        eniwa: a,
                                        erimo: a,
                                        esan: a,
                                        esashi: a,
                                        fukagawa: a,
                                        fukushima: a,
                                        furano: a,
                                        furubira: a,
                                        haboro: a,
                                        hakodate: a,
                                        hamatonbetsu: a,
                                        hidaka: a,
                                        higashikagura: a,
                                        higashikawa: a,
                                        hiroo: a,
                                        hokuryu: a,
                                        hokuto: a,
                                        honbetsu: a,
                                        horokanai: a,
                                        horonobe: a,
                                        ikeda: a,
                                        imakane: a,
                                        ishikari: a,
                                        iwamizawa: a,
                                        iwanai: a,
                                        kamifurano: a,
                                        kamikawa: a,
                                        kamishihoro: a,
                                        kamisunagawa: a,
                                        kamoenai: a,
                                        kayabe: a,
                                        kembuchi: a,
                                        kikonai: a,
                                        kimobetsu: a,
                                        kitahiroshima: a,
                                        kitami: a,
                                        kiyosato: a,
                                        koshimizu: a,
                                        kunneppu: a,
                                        kuriyama: a,
                                        kuromatsunai: a,
                                        kushiro: a,
                                        kutchan: a,
                                        kyowa: a,
                                        mashike: a,
                                        matsumae: a,
                                        mikasa: a,
                                        minamifurano: a,
                                        mombetsu: a,
                                        moseushi: a,
                                        mukawa: a,
                                        muroran: a,
                                        naie: a,
                                        nakagawa: a,
                                        nakasatsunai: a,
                                        nakatombetsu: a,
                                        nanae: a,
                                        nanporo: a,
                                        nayoro: a,
                                        nemuro: a,
                                        niikappu: a,
                                        niki: a,
                                        nishiokoppe: a,
                                        noboribetsu: a,
                                        numata: a,
                                        obihiro: a,
                                        obira: a,
                                        oketo: a,
                                        okoppe: a,
                                        otaru: a,
                                        otobe: a,
                                        otofuke: a,
                                        otoineppu: a,
                                        oumu: a,
                                        ozora: a,
                                        pippu: a,
                                        rankoshi: a,
                                        rebun: a,
                                        rikubetsu: a,
                                        rishiri: a,
                                        rishirifuji: a,
                                        saroma: a,
                                        sarufutsu: a,
                                        shakotan: a,
                                        shari: a,
                                        shibecha: a,
                                        shibetsu: a,
                                        shikabe: a,
                                        shikaoi: a,
                                        shimamaki: a,
                                        shimizu: a,
                                        shimokawa: a,
                                        shinshinotsu: a,
                                        shintoku: a,
                                        shiranuka: a,
                                        shiraoi: a,
                                        shiriuchi: a,
                                        sobetsu: a,
                                        sunagawa: a,
                                        taiki: a,
                                        takasu: a,
                                        takikawa: a,
                                        takinoue: a,
                                        teshikaga: a,
                                        tobetsu: a,
                                        tohma: a,
                                        tomakomai: a,
                                        tomari: a,
                                        toya: a,
                                        toyako: a,
                                        toyotomi: a,
                                        toyoura: a,
                                        tsubetsu: a,
                                        tsukigata: a,
                                        urakawa: a,
                                        urausu: a,
                                        uryu: a,
                                        utashinai: a,
                                        wakkanai: a,
                                        wassamu: a,
                                        yakumo: a,
                                        yoichi: a
                                    }
                                },
                                hyogo: {
                                    $: 1,
                                    succ: {
                                        aioi: a,
                                        akashi: a,
                                        ako: a,
                                        amagasaki: a,
                                        aogaki: a,
                                        asago: a,
                                        ashiya: a,
                                        awaji: a,
                                        fukusaki: a,
                                        goshiki: a,
                                        harima: a,
                                        himeji: a,
                                        ichikawa: a,
                                        inagawa: a,
                                        itami: a,
                                        kakogawa: a,
                                        kamigori: a,
                                        kamikawa: a,
                                        kasai: a,
                                        kasuga: a,
                                        kawanishi: a,
                                        miki: a,
                                        minamiawaji: a,
                                        nishinomiya: a,
                                        nishiwaki: a,
                                        ono: a,
                                        sanda: a,
                                        sannan: a,
                                        sasayama: a,
                                        sayo: a,
                                        shingu: a,
                                        shinonsen: a,
                                        shiso: a,
                                        sumoto: a,
                                        taishi: a,
                                        taka: a,
                                        takarazuka: a,
                                        takasago: a,
                                        takino: a,
                                        tamba: a,
                                        tatsuno: a,
                                        toyooka: a,
                                        yabu: a,
                                        yashiro: a,
                                        yoka: a,
                                        yokawa: a
                                    }
                                },
                                ibaraki: {
                                    $: 1,
                                    succ: {
                                        ami: a,
                                        asahi: a,
                                        bando: a,
                                        chikusei: a,
                                        daigo: a,
                                        fujishiro: a,
                                        hitachi: a,
                                        hitachinaka: a,
                                        hitachiomiya: a,
                                        hitachiota: a,
                                        ibaraki: a,
                                        ina: a,
                                        inashiki: a,
                                        itako: a,
                                        iwama: a,
                                        joso: a,
                                        kamisu: a,
                                        kasama: a,
                                        kashima: a,
                                        kasumigaura: a,
                                        koga: a,
                                        miho: a,
                                        mito: a,
                                        moriya: a,
                                        naka: a,
                                        namegata: a,
                                        oarai: a,
                                        ogawa: a,
                                        omitama: a,
                                        ryugasaki: a,
                                        sakai: a,
                                        sakuragawa: a,
                                        shimodate: a,
                                        shimotsuma: a,
                                        shirosato: a,
                                        sowa: a,
                                        suifu: a,
                                        takahagi: a,
                                        tamatsukuri: a,
                                        tokai: a,
                                        tomobe: a,
                                        tone: a,
                                        toride: a,
                                        tsuchiura: a,
                                        tsukuba: a,
                                        uchihara: a,
                                        ushiku: a,
                                        yachiyo: a,
                                        yamagata: a,
                                        yawara: a,
                                        yuki: a
                                    }
                                },
                                ishikawa: {
                                    $: 1,
                                    succ: {
                                        anamizu: a,
                                        hakui: a,
                                        hakusan: a,
                                        kaga: a,
                                        kahoku: a,
                                        kanazawa: a,
                                        kawakita: a,
                                        komatsu: a,
                                        nakanoto: a,
                                        nanao: a,
                                        nomi: a,
                                        nonoichi: a,
                                        noto: a,
                                        shika: a,
                                        suzu: a,
                                        tsubata: a,
                                        tsurugi: a,
                                        uchinada: a,
                                        wajima: a
                                    }
                                },
                                iwate: {
                                    $: 1,
                                    succ: {
                                        fudai: a,
                                        fujisawa: a,
                                        hanamaki: a,
                                        hiraizumi: a,
                                        hirono: a,
                                        ichinohe: a,
                                        ichinoseki: a,
                                        iwaizumi: a,
                                        iwate: a,
                                        joboji: a,
                                        kamaishi: a,
                                        kanegasaki: a,
                                        karumai: a,
                                        kawai: a,
                                        kitakami: a,
                                        kuji: a,
                                        kunohe: a,
                                        kuzumaki: a,
                                        miyako: a,
                                        mizusawa: a,
                                        morioka: a,
                                        ninohe: a,
                                        noda: a,
                                        ofunato: a,
                                        oshu: a,
                                        otsuchi: a,
                                        rikuzentakata: a,
                                        shiwa: a,
                                        shizukuishi: a,
                                        sumita: a,
                                        tanohata: a,
                                        tono: a,
                                        yahaba: a,
                                        yamada: a
                                    }
                                },
                                kagawa: {
                                    $: 1,
                                    succ: {
                                        ayagawa: a,
                                        higashikagawa: a,
                                        kanonji: a,
                                        kotohira: a,
                                        manno: a,
                                        marugame: a,
                                        mitoyo: a,
                                        naoshima: a,
                                        sanuki: a,
                                        tadotsu: a,
                                        takamatsu: a,
                                        tonosho: a,
                                        uchinomi: a,
                                        utazu: a,
                                        zentsuji: a
                                    }
                                },
                                kagoshima: {
                                    $: 1,
                                    succ: {
                                        akune: a,
                                        amami: a,
                                        hioki: a,
                                        isa: a,
                                        isen: a,
                                        izumi: a,
                                        kagoshima: a,
                                        kanoya: a,
                                        kawanabe: a,
                                        kinko: a,
                                        kouyama: a,
                                        makurazaki: a,
                                        matsumoto: a,
                                        minamitane: a,
                                        nakatane: a,
                                        nishinoomote: a,
                                        satsumasendai: a,
                                        soo: a,
                                        tarumizu: a,
                                        yusui: a
                                    }
                                },
                                kanagawa: {
                                    $: 1,
                                    succ: {
                                        aikawa: a,
                                        atsugi: a,
                                        ayase: a,
                                        chigasaki: a,
                                        ebina: a,
                                        fujisawa: a,
                                        hadano: a,
                                        hakone: a,
                                        hiratsuka: a,
                                        isehara: a,
                                        kaisei: a,
                                        kamakura: a,
                                        kiyokawa: a,
                                        matsuda: a,
                                        minamiashigara: a,
                                        miura: a,
                                        nakai: a,
                                        ninomiya: a,
                                        odawara: a,
                                        oi: a,
                                        oiso: a,
                                        sagamihara: a,
                                        samukawa: a,
                                        tsukui: a,
                                        yamakita: a,
                                        yamato: a,
                                        yokosuka: a,
                                        yugawara: a,
                                        zama: a,
                                        zushi: a
                                    }
                                },
                                kochi: {
                                    $: 1,
                                    succ: {
                                        aki: a,
                                        geisei: a,
                                        hidaka: a,
                                        higashitsuno: a,
                                        ino: a,
                                        kagami: a,
                                        kami: a,
                                        kitagawa: a,
                                        kochi: a,
                                        mihara: a,
                                        motoyama: a,
                                        muroto: a,
                                        nahari: a,
                                        nakamura: a,
                                        nankoku: a,
                                        nishitosa: a,
                                        niyodogawa: a,
                                        ochi: a,
                                        okawa: a,
                                        otoyo: a,
                                        otsuki: a,
                                        sakawa: a,
                                        sukumo: a,
                                        susaki: a,
                                        tosa: a,
                                        tosashimizu: a,
                                        toyo: a,
                                        tsuno: a,
                                        umaji: a,
                                        yasuda: a,
                                        yusuhara: a
                                    }
                                },
                                kumamoto: {
                                    $: 1,
                                    succ: {
                                        amakusa: a,
                                        arao: a,
                                        aso: a,
                                        choyo: a,
                                        gyokuto: a,
                                        kamiamakusa: a,
                                        kikuchi: a,
                                        kumamoto: a,
                                        mashiki: a,
                                        mifune: a,
                                        minamata: a,
                                        minamioguni: a,
                                        nagasu: a,
                                        nishihara: a,
                                        oguni: a,
                                        ozu: a,
                                        sumoto: a,
                                        takamori: a,
                                        uki: a,
                                        uto: a,
                                        yamaga: a,
                                        yamato: a,
                                        yatsushiro: a
                                    }
                                },
                                kyoto: {
                                    $: 1,
                                    succ: {
                                        ayabe: a,
                                        fukuchiyama: a,
                                        higashiyama: a,
                                        ide: a,
                                        ine: a,
                                        joyo: a,
                                        kameoka: a,
                                        kamo: a,
                                        kita: a,
                                        kizu: a,
                                        kumiyama: a,
                                        kyotamba: a,
                                        kyotanabe: a,
                                        kyotango: a,
                                        maizuru: a,
                                        minami: a,
                                        minamiyamashiro: a,
                                        miyazu: a,
                                        muko: a,
                                        nagaokakyo: a,
                                        nakagyo: a,
                                        nantan: a,
                                        oyamazaki: a,
                                        sakyo: a,
                                        seika: a,
                                        tanabe: a,
                                        uji: a,
                                        ujitawara: a,
                                        wazuka: a,
                                        yamashina: a,
                                        yawata: a
                                    }
                                },
                                mie: {
                                    $: 1,
                                    succ: {
                                        asahi: a,
                                        inabe: a,
                                        ise: a,
                                        kameyama: a,
                                        kawagoe: a,
                                        kiho: a,
                                        kisosaki: a,
                                        kiwa: a,
                                        komono: a,
                                        kumano: a,
                                        kuwana: a,
                                        matsusaka: a,
                                        meiwa: a,
                                        mihama: a,
                                        minamiise: a,
                                        misugi: a,
                                        miyama: a,
                                        nabari: a,
                                        shima: a,
                                        suzuka: a,
                                        tado: a,
                                        taiki: a,
                                        taki: a,
                                        tamaki: a,
                                        toba: a,
                                        tsu: a,
                                        udono: a,
                                        ureshino: a,
                                        watarai: a,
                                        yokkaichi: a
                                    }
                                },
                                miyagi: {
                                    $: 1,
                                    succ: {
                                        furukawa: a,
                                        higashimatsushima: a,
                                        ishinomaki: a,
                                        iwanuma: a,
                                        kakuda: a,
                                        kami: a,
                                        kawasaki: a,
                                        marumori: a,
                                        matsushima: a,
                                        minamisanriku: a,
                                        misato: a,
                                        murata: a,
                                        natori: a,
                                        ogawara: a,
                                        ohira: a,
                                        onagawa: a,
                                        osaki: a,
                                        rifu: a,
                                        semine: a,
                                        shibata: a,
                                        shichikashuku: a,
                                        shikama: a,
                                        shiogama: a,
                                        shiroishi: a,
                                        tagajo: a,
                                        taiwa: a,
                                        tome: a,
                                        tomiya: a,
                                        wakuya: a,
                                        watari: a,
                                        yamamoto: a,
                                        zao: a
                                    }
                                },
                                miyazaki: {
                                    $: 1,
                                    succ: {
                                        aya: a,
                                        ebino: a,
                                        gokase: a,
                                        hyuga: a,
                                        kadogawa: a,
                                        kawaminami: a,
                                        kijo: a,
                                        kitagawa: a,
                                        kitakata: a,
                                        kitaura: a,
                                        kobayashi: a,
                                        kunitomi: a,
                                        kushima: a,
                                        mimata: a,
                                        miyakonojo: a,
                                        miyazaki: a,
                                        morotsuka: a,
                                        nichinan: a,
                                        nishimera: a,
                                        nobeoka: a,
                                        saito: a,
                                        shiiba: a,
                                        shintomi: a,
                                        takaharu: a,
                                        takanabe: a,
                                        takazaki: a,
                                        tsuno: a
                                    }
                                },
                                nagano: {
                                    $: 1,
                                    succ: {
                                        achi: a,
                                        agematsu: a,
                                        anan: a,
                                        aoki: a,
                                        asahi: a,
                                        azumino: a,
                                        chikuhoku: a,
                                        chikuma: a,
                                        chino: a,
                                        fujimi: a,
                                        hakuba: a,
                                        hara: a,
                                        hiraya: a,
                                        iida: a,
                                        iijima: a,
                                        iiyama: a,
                                        iizuna: a,
                                        ikeda: a,
                                        ikusaka: a,
                                        ina: a,
                                        karuizawa: a,
                                        kawakami: a,
                                        kiso: a,
                                        kisofukushima: a,
                                        kitaaiki: a,
                                        komagane: a,
                                        komoro: a,
                                        matsukawa: a,
                                        matsumoto: a,
                                        miasa: a,
                                        minamiaiki: a,
                                        minamimaki: a,
                                        minamiminowa: a,
                                        minowa: a,
                                        miyada: a,
                                        miyota: a,
                                        mochizuki: a,
                                        nagano: a,
                                        nagawa: a,
                                        nagiso: a,
                                        nakagawa: a,
                                        nakano: a,
                                        nozawaonsen: a,
                                        obuse: a,
                                        ogawa: a,
                                        okaya: a,
                                        omachi: a,
                                        omi: a,
                                        ookuwa: a,
                                        ooshika: a,
                                        otaki: a,
                                        otari: a,
                                        sakae: a,
                                        sakaki: a,
                                        saku: a,
                                        sakuho: a,
                                        shimosuwa: a,
                                        shinanomachi: a,
                                        shiojiri: a,
                                        suwa: a,
                                        suzaka: a,
                                        takagi: a,
                                        takamori: a,
                                        takayama: a,
                                        tateshina: a,
                                        tatsuno: a,
                                        togakushi: a,
                                        togura: a,
                                        tomi: a,
                                        ueda: a,
                                        wada: a,
                                        yamagata: a,
                                        yamanouchi: a,
                                        yasaka: a,
                                        yasuoka: a
                                    }
                                },
                                nagasaki: {
                                    $: 1,
                                    succ: {
                                        chijiwa: a,
                                        futsu: a,
                                        goto: a,
                                        hasami: a,
                                        hirado: a,
                                        iki: a,
                                        isahaya: a,
                                        kawatana: a,
                                        kuchinotsu: a,
                                        matsuura: a,
                                        nagasaki: a,
                                        obama: a,
                                        omura: a,
                                        oseto: a,
                                        saikai: a,
                                        sasebo: a,
                                        seihi: a,
                                        shimabara: a,
                                        shinkamigoto: a,
                                        togitsu: a,
                                        tsushima: a,
                                        unzen: a
                                    }
                                },
                                nara: {
                                    $: 1,
                                    succ: {
                                        ando: a,
                                        gose: a,
                                        heguri: a,
                                        higashiyoshino: a,
                                        ikaruga: a,
                                        ikoma: a,
                                        kamikitayama: a,
                                        kanmaki: a,
                                        kashiba: a,
                                        kashihara: a,
                                        katsuragi: a,
                                        kawai: a,
                                        kawakami: a,
                                        kawanishi: a,
                                        koryo: a,
                                        kurotaki: a,
                                        mitsue: a,
                                        miyake: a,
                                        nara: a,
                                        nosegawa: a,
                                        oji: a,
                                        ouda: a,
                                        oyodo: a,
                                        sakurai: a,
                                        sango: a,
                                        shimoichi: a,
                                        shimokitayama: a,
                                        shinjo: a,
                                        soni: a,
                                        takatori: a,
                                        tawaramoto: a,
                                        tenkawa: a,
                                        tenri: a,
                                        uda: a,
                                        yamatokoriyama: a,
                                        yamatotakada: a,
                                        yamazoe: a,
                                        yoshino: a
                                    }
                                },
                                niigata: {
                                    $: 1,
                                    succ: {
                                        aga: a,
                                        agano: a,
                                        gosen: a,
                                        itoigawa: a,
                                        izumozaki: a,
                                        joetsu: a,
                                        kamo: a,
                                        kariwa: a,
                                        kashiwazaki: a,
                                        minamiuonuma: a,
                                        mitsuke: a,
                                        muika: a,
                                        murakami: a,
                                        myoko: a,
                                        nagaoka: a,
                                        niigata: a,
                                        ojiya: a,
                                        omi: a,
                                        sado: a,
                                        sanjo: a,
                                        seiro: a,
                                        seirou: a,
                                        sekikawa: a,
                                        shibata: a,
                                        tagami: a,
                                        tainai: a,
                                        tochio: a,
                                        tokamachi: a,
                                        tsubame: a,
                                        tsunan: a,
                                        uonuma: a,
                                        yahiko: a,
                                        yoita: a,
                                        yuzawa: a
                                    }
                                },
                                oita: {
                                    $: 1,
                                    succ: {
                                        beppu: a,
                                        bungoono: a,
                                        bungotakada: a,
                                        hasama: a,
                                        hiji: a,
                                        himeshima: a,
                                        hita: a,
                                        kamitsue: a,
                                        kokonoe: a,
                                        kuju: a,
                                        kunisaki: a,
                                        kusu: a,
                                        oita: a,
                                        saiki: a,
                                        taketa: a,
                                        tsukumi: a,
                                        usa: a,
                                        usuki: a,
                                        yufu: a
                                    }
                                },
                                okayama: {
                                    $: 1,
                                    succ: {
                                        akaiwa: a,
                                        asakuchi: a,
                                        bizen: a,
                                        hayashima: a,
                                        ibara: a,
                                        kagamino: a,
                                        kasaoka: a,
                                        kibichuo: a,
                                        kumenan: a,
                                        kurashiki: a,
                                        maniwa: a,
                                        misaki: a,
                                        nagi: a,
                                        niimi: a,
                                        nishiawakura: a,
                                        okayama: a,
                                        satosho: a,
                                        setouchi: a,
                                        shinjo: a,
                                        shoo: a,
                                        soja: a,
                                        takahashi: a,
                                        tamano: a,
                                        tsuyama: a,
                                        wake: a,
                                        yakage: a
                                    }
                                },
                                okinawa: {
                                    $: 1,
                                    succ: {
                                        aguni: a,
                                        ginowan: a,
                                        ginoza: a,
                                        gushikami: a,
                                        haebaru: a,
                                        higashi: a,
                                        hirara: a,
                                        iheya: a,
                                        ishigaki: a,
                                        ishikawa: a,
                                        itoman: a,
                                        izena: a,
                                        kadena: a,
                                        kin: a,
                                        kitadaito: a,
                                        kitanakagusuku: a,
                                        kumejima: a,
                                        kunigami: a,
                                        minamidaito: a,
                                        motobu: a,
                                        nago: a,
                                        naha: a,
                                        nakagusuku: a,
                                        nakijin: a,
                                        nanjo: a,
                                        nishihara: a,
                                        ogimi: a,
                                        okinawa: a,
                                        onna: a,
                                        shimoji: a,
                                        taketomi: a,
                                        tarama: a,
                                        tokashiki: a,
                                        tomigusuku: a,
                                        tonaki: a,
                                        urasoe: a,
                                        uruma: a,
                                        yaese: a,
                                        yomitan: a,
                                        yonabaru: a,
                                        yonaguni: a,
                                        zamami: a
                                    }
                                },
                                osaka: {
                                    $: 1,
                                    succ: {
                                        abeno: a,
                                        chihayaakasaka: a,
                                        chuo: a,
                                        daito: a,
                                        fujiidera: a,
                                        habikino: a,
                                        hannan: a,
                                        higashiosaka: a,
                                        higashisumiyoshi: a,
                                        higashiyodogawa: a,
                                        hirakata: a,
                                        ibaraki: a,
                                        ikeda: a,
                                        izumi: a,
                                        izumiotsu: a,
                                        izumisano: a,
                                        kadoma: a,
                                        kaizuka: a,
                                        kanan: a,
                                        kashiwara: a,
                                        katano: a,
                                        kawachinagano: a,
                                        kishiwada: a,
                                        kita: a,
                                        kumatori: a,
                                        matsubara: a,
                                        minato: a,
                                        minoh: a,
                                        misaki: a,
                                        moriguchi: a,
                                        neyagawa: a,
                                        nishi: a,
                                        nose: a,
                                        osakasayama: a,
                                        sakai: a,
                                        sayama: a,
                                        sennan: a,
                                        settsu: a,
                                        shijonawate: a,
                                        shimamoto: a,
                                        suita: a,
                                        tadaoka: a,
                                        taishi: a,
                                        tajiri: a,
                                        takaishi: a,
                                        takatsuki: a,
                                        tondabayashi: a,
                                        toyonaka: a,
                                        toyono: a,
                                        yao: a
                                    }
                                },
                                saga: {
                                    $: 1,
                                    succ: {
                                        ariake: a,
                                        arita: a,
                                        fukudomi: a,
                                        genkai: a,
                                        hamatama: a,
                                        hizen: a,
                                        imari: a,
                                        kamimine: a,
                                        kanzaki: a,
                                        karatsu: a,
                                        kashima: a,
                                        kitagata: a,
                                        kitahata: a,
                                        kiyama: a,
                                        kouhoku: a,
                                        kyuragi: a,
                                        nishiarita: a,
                                        ogi: a,
                                        omachi: a,
                                        ouchi: a,
                                        saga: a,
                                        shiroishi: a,
                                        taku: a,
                                        tara: a,
                                        tosu: a,
                                        yoshinogari: a
                                    }
                                },
                                saitama: {
                                    $: 1,
                                    succ: {
                                        arakawa: a,
                                        asaka: a,
                                        chichibu: a,
                                        fujimi: a,
                                        fujimino: a,
                                        fukaya: a,
                                        hanno: a,
                                        hanyu: a,
                                        hasuda: a,
                                        hatogaya: a,
                                        hatoyama: a,
                                        hidaka: a,
                                        higashichichibu: a,
                                        higashimatsuyama: a,
                                        honjo: a,
                                        ina: a,
                                        iruma: a,
                                        iwatsuki: a,
                                        kamiizumi: a,
                                        kamikawa: a,
                                        kamisato: a,
                                        kasukabe: a,
                                        kawagoe: a,
                                        kawaguchi: a,
                                        kawajima: a,
                                        kazo: a,
                                        kitamoto: a,
                                        koshigaya: a,
                                        kounosu: a,
                                        kuki: a,
                                        kumagaya: a,
                                        matsubushi: a,
                                        minano: a,
                                        misato: a,
                                        miyashiro: a,
                                        miyoshi: a,
                                        moroyama: a,
                                        nagatoro: a,
                                        namegawa: a,
                                        niiza: a,
                                        ogano: a,
                                        ogawa: a,
                                        ogose: a,
                                        okegawa: a,
                                        omiya: a,
                                        otaki: a,
                                        ranzan: a,
                                        ryokami: a,
                                        saitama: a,
                                        sakado: a,
                                        satte: a,
                                        sayama: a,
                                        shiki: a,
                                        shiraoka: a,
                                        soka: a,
                                        sugito: a,
                                        toda: a,
                                        tokigawa: a,
                                        tokorozawa: a,
                                        tsurugashima: a,
                                        urawa: a,
                                        warabi: a,
                                        yashio: a,
                                        yokoze: a,
                                        yono: a,
                                        yorii: a,
                                        yoshida: a,
                                        yoshikawa: a,
                                        yoshimi: a
                                    }
                                },
                                shiga: {
                                    $: 1,
                                    succ: {
                                        aisho: a,
                                        gamo: a,
                                        higashiomi: a,
                                        hikone: a,
                                        koka: a,
                                        konan: a,
                                        kosei: a,
                                        koto: a,
                                        kusatsu: a,
                                        maibara: a,
                                        moriyama: a,
                                        nagahama: a,
                                        nishiazai: a,
                                        notogawa: a,
                                        omihachiman: a,
                                        otsu: a,
                                        ritto: a,
                                        ryuoh: a,
                                        takashima: a,
                                        takatsuki: a,
                                        torahime: a,
                                        toyosato: a,
                                        yasu: a
                                    }
                                },
                                shimane: {
                                    $: 1,
                                    succ: {
                                        akagi: a,
                                        ama: a,
                                        gotsu: a,
                                        hamada: a,
                                        higashiizumo: a,
                                        hikawa: a,
                                        hikimi: a,
                                        izumo: a,
                                        kakinoki: a,
                                        masuda: a,
                                        matsue: a,
                                        misato: a,
                                        nishinoshima: a,
                                        ohda: a,
                                        okinoshima: a,
                                        okuizumo: a,
                                        shimane: a,
                                        tamayu: a,
                                        tsuwano: a,
                                        unnan: a,
                                        yakumo: a,
                                        yasugi: a,
                                        yatsuka: a
                                    }
                                },
                                shizuoka: {
                                    $: 1,
                                    succ: {
                                        arai: a,
                                        atami: a,
                                        fuji: a,
                                        fujieda: a,
                                        fujikawa: a,
                                        fujinomiya: a,
                                        fukuroi: a,
                                        gotemba: a,
                                        haibara: a,
                                        hamamatsu: a,
                                        higashiizu: a,
                                        ito: a,
                                        iwata: a,
                                        izu: a,
                                        izunokuni: a,
                                        kakegawa: a,
                                        kannami: a,
                                        kawanehon: a,
                                        kawazu: a,
                                        kikugawa: a,
                                        kosai: a,
                                        makinohara: a,
                                        matsuzaki: a,
                                        minamiizu: a,
                                        mishima: a,
                                        morimachi: a,
                                        nishiizu: a,
                                        numazu: a,
                                        omaezaki: a,
                                        shimada: a,
                                        shimizu: a,
                                        shimoda: a,
                                        shizuoka: a,
                                        susono: a,
                                        yaizu: a,
                                        yoshida: a
                                    }
                                },
                                tochigi: {
                                    $: 1,
                                    succ: {
                                        ashikaga: a,
                                        bato: a,
                                        haga: a,
                                        ichikai: a,
                                        iwafune: a,
                                        kaminokawa: a,
                                        kanuma: a,
                                        karasuyama: a,
                                        kuroiso: a,
                                        mashiko: a,
                                        mibu: a,
                                        moka: a,
                                        motegi: a,
                                        nasu: a,
                                        nasushiobara: a,
                                        nikko: a,
                                        nishikata: a,
                                        nogi: a,
                                        ohira: a,
                                        ohtawara: a,
                                        oyama: a,
                                        sakura: a,
                                        sano: a,
                                        shimotsuke: a,
                                        shioya: a,
                                        takanezawa: a,
                                        tochigi: a,
                                        tsuga: a,
                                        ujiie: a,
                                        utsunomiya: a,
                                        yaita: a
                                    }
                                },
                                tokushima: {
                                    $: 1,
                                    succ: {
                                        aizumi: a,
                                        anan: a,
                                        ichiba: a,
                                        itano: a,
                                        kainan: a,
                                        komatsushima: a,
                                        matsushige: a,
                                        mima: a,
                                        minami: a,
                                        miyoshi: a,
                                        mugi: a,
                                        nakagawa: a,
                                        naruto: a,
                                        sanagochi: a,
                                        shishikui: a,
                                        tokushima: a,
                                        wajiki: a
                                    }
                                },
                                tokyo: {
                                    $: 1,
                                    succ: {
                                        adachi: a,
                                        akiruno: a,
                                        akishima: a,
                                        aogashima: a,
                                        arakawa: a,
                                        bunkyo: a,
                                        chiyoda: a,
                                        chofu: a,
                                        chuo: a,
                                        edogawa: a,
                                        fuchu: a,
                                        fussa: a,
                                        hachijo: a,
                                        hachioji: a,
                                        hamura: a,
                                        higashikurume: a,
                                        higashimurayama: a,
                                        higashiyamato: a,
                                        hino: a,
                                        hinode: a,
                                        hinohara: a,
                                        inagi: a,
                                        itabashi: a,
                                        katsushika: a,
                                        kita: a,
                                        kiyose: a,
                                        kodaira: a,
                                        koganei: a,
                                        kokubunji: a,
                                        komae: a,
                                        koto: a,
                                        kouzushima: a,
                                        kunitachi: a,
                                        machida: a,
                                        meguro: a,
                                        minato: a,
                                        mitaka: a,
                                        mizuho: a,
                                        musashimurayama: a,
                                        musashino: a,
                                        nakano: a,
                                        nerima: a,
                                        ogasawara: a,
                                        okutama: a,
                                        ome: a,
                                        oshima: a,
                                        ota: a,
                                        setagaya: a,
                                        shibuya: a,
                                        shinagawa: a,
                                        shinjuku: a,
                                        suginami: a,
                                        sumida: a,
                                        tachikawa: a,
                                        taito: a,
                                        tama: a,
                                        toshima: a
                                    }
                                },
                                tottori: {
                                    $: 1,
                                    succ: {
                                        chizu: a,
                                        hino: a,
                                        kawahara: a,
                                        koge: a,
                                        kotoura: a,
                                        misasa: a,
                                        nanbu: a,
                                        nichinan: a,
                                        sakaiminato: a,
                                        tottori: a,
                                        wakasa: a,
                                        yazu: a,
                                        yonago: a
                                    }
                                },
                                toyama: {
                                    $: 1,
                                    succ: {
                                        asahi: a,
                                        fuchu: a,
                                        fukumitsu: a,
                                        funahashi: a,
                                        himi: a,
                                        imizu: a,
                                        inami: a,
                                        johana: a,
                                        kamiichi: a,
                                        kurobe: a,
                                        nakaniikawa: a,
                                        namerikawa: a,
                                        nanto: a,
                                        nyuzen: a,
                                        oyabe: a,
                                        taira: a,
                                        takaoka: a,
                                        tateyama: a,
                                        toga: a,
                                        tonami: a,
                                        toyama: a,
                                        unazuki: a,
                                        uozu: a,
                                        yamada: a
                                    }
                                },
                                wakayama: {
                                    $: 1,
                                    succ: {
                                        arida: a,
                                        aridagawa: a,
                                        gobo: a,
                                        hashimoto: a,
                                        hidaka: a,
                                        hirogawa: a,
                                        inami: a,
                                        iwade: a,
                                        kainan: a,
                                        kamitonda: a,
                                        katsuragi: a,
                                        kimino: a,
                                        kinokawa: a,
                                        kitayama: a,
                                        koya: a,
                                        koza: a,
                                        kozagawa: a,
                                        kudoyama: a,
                                        kushimoto: a,
                                        mihama: a,
                                        misato: a,
                                        nachikatsuura: a,
                                        shingu: a,
                                        shirahama: a,
                                        taiji: a,
                                        tanabe: a,
                                        wakayama: a,
                                        yuasa: a,
                                        yura: a
                                    }
                                },
                                yamagata: {
                                    $: 1,
                                    succ: {
                                        asahi: a,
                                        funagata: a,
                                        higashine: a,
                                        iide: a,
                                        kahoku: a,
                                        kaminoyama: a,
                                        kaneyama: a,
                                        kawanishi: a,
                                        mamurogawa: a,
                                        mikawa: a,
                                        murayama: a,
                                        nagai: a,
                                        nakayama: a,
                                        nanyo: a,
                                        nishikawa: a,
                                        obanazawa: a,
                                        oe: a,
                                        oguni: a,
                                        ohkura: a,
                                        oishida: a,
                                        sagae: a,
                                        sakata: a,
                                        sakegawa: a,
                                        shinjo: a,
                                        shirataka: a,
                                        shonai: a,
                                        takahata: a,
                                        tendo: a,
                                        tozawa: a,
                                        tsuruoka: a,
                                        yamagata: a,
                                        yamanobe: a,
                                        yonezawa: a,
                                        yuza: a
                                    }
                                },
                                yamaguchi: {
                                    $: 1,
                                    succ: {
                                        abu: a,
                                        hagi: a,
                                        hikari: a,
                                        hofu: a,
                                        iwakuni: a,
                                        kudamatsu: a,
                                        mitou: a,
                                        nagato: a,
                                        oshima: a,
                                        shimonoseki: a,
                                        shunan: a,
                                        tabuse: a,
                                        tokuyama: a,
                                        toyota: a,
                                        ube: a,
                                        yuu: a
                                    }
                                },
                                yamanashi: {
                                    $: 1,
                                    succ: {
                                        chuo: a,
                                        doshi: a,
                                        fuefuki: a,
                                        fujikawa: a,
                                        fujikawaguchiko: a,
                                        fujiyoshida: a,
                                        hayakawa: a,
                                        hokuto: a,
                                        ichikawamisato: a,
                                        kai: a,
                                        kofu: a,
                                        koshu: a,
                                        kosuge: a,
                                        "minami-alps": a,
                                        minobu: a,
                                        nakamichi: a,
                                        nanbu: a,
                                        narusawa: a,
                                        nirasaki: a,
                                        nishikatsura: a,
                                        oshino: a,
                                        otsuki: a,
                                        showa: a,
                                        tabayama: a,
                                        tsuru: a,
                                        uenohara: a,
                                        yamanakako: a,
                                        yamanashi: a
                                    }
                                },
                                "xn--4pvxs": a,
                                "栃木": a,
                                "xn--vgu402c": a,
                                "愛知": a,
                                "xn--c3s14m": a,
                                "愛媛": a,
                                "xn--f6qx53a": a,
                                "兵庫": a,
                                "xn--8pvr4u": a,
                                "熊本": a,
                                "xn--uist22h": a,
                                "茨城": a,
                                "xn--djrs72d6uy": a,
                                "北海道": a,
                                "xn--mkru45i": a,
                                "千葉": a,
                                "xn--0trq7p7nn": a,
                                "和歌山": a,
                                "xn--8ltr62k": a,
                                "長崎": a,
                                "xn--2m4a15e": a,
                                "長野": a,
                                "xn--efvn9s": a,
                                "新潟": a,
                                "xn--32vp30h": a,
                                "青森": a,
                                "xn--4it797k": a,
                                "静岡": a,
                                "xn--1lqs71d": a,
                                "東京": a,
                                "xn--5rtp49c": a,
                                "石川": a,
                                "xn--5js045d": a,
                                "埼玉": a,
                                "xn--ehqz56n": a,
                                "三重": a,
                                "xn--1lqs03n": a,
                                "京都": a,
                                "xn--qqqt11m": a,
                                "佐賀": a,
                                "xn--kbrq7o": a,
                                "大分": a,
                                "xn--pssu33l": a,
                                "大阪": a,
                                "xn--ntsq17g": a,
                                "奈良": a,
                                "xn--uisz3g": a,
                                "宮城": a,
                                "xn--6btw5a": a,
                                "宮崎": a,
                                "xn--1ctwo": a,
                                "富山": a,
                                "xn--6orx2r": a,
                                "山口": a,
                                "xn--rht61e": a,
                                "山形": a,
                                "xn--rht27z": a,
                                "山梨": a,
                                "xn--djty4k": a,
                                "岩手": a,
                                "xn--nit225k": a,
                                "岐阜": a,
                                "xn--rht3d": a,
                                "岡山": a,
                                "xn--klty5x": a,
                                "島根": a,
                                "xn--kltx9a": a,
                                "広島": a,
                                "xn--kltp7d": a,
                                "徳島": a,
                                "xn--uuwu58a": a,
                                "沖縄": a,
                                "xn--zbx025d": a,
                                "滋賀": a,
                                "xn--ntso0iqx3a": a,
                                "神奈川": a,
                                "xn--elqq16h": a,
                                "福井": a,
                                "xn--4it168d": a,
                                "福岡": a,
                                "xn--klt787d": a,
                                "福島": a,
                                "xn--rny31h": a,
                                "秋田": a,
                                "xn--7t0a264c": a,
                                "群馬": a,
                                "xn--5rtq34k": a,
                                "香川": a,
                                "xn--k7yn95e": a,
                                "高知": a,
                                "xn--tor131o": a,
                                "鳥取": a,
                                "xn--d5qv7z876c": a,
                                "鹿児島": a,
                                kawasaki: r,
                                kitakyushu: r,
                                kobe: r,
                                nagoya: r,
                                sapporo: r,
                                sendai: r,
                                yokohama: r,
                                usercontent: e,
                                blogspot: e
                            }
                        },
                        ke: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: s,
                                go: a,
                                info: a,
                                me: a,
                                mobi: a,
                                ne: a,
                                or: a,
                                sc: a
                            }
                        },
                        kg: {
                            $: 1,
                            succ: {
                                org: a,
                                net: a,
                                com: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                blog: e,
                                io: e,
                                jp: e,
                                tv: e,
                                uk: e,
                                us: e
                            }
                        },
                        kh: r,
                        ki: j,
                        km: {
                            $: 1,
                            succ: {
                                org: a,
                                nom: a,
                                gov: a,
                                prd: a,
                                tm: a,
                                edu: a,
                                mil: a,
                                ass: a,
                                com: a,
                                coop: a,
                                asso: a,
                                presse: a,
                                medecin: a,
                                notaires: a,
                                pharmaciens: a,
                                veterinaire: a,
                                gouv: a
                            }
                        },
                        kn: {
                            $: 1,
                            succ: {
                                net: a,
                                org: a,
                                edu: a,
                                gov: a
                            }
                        },
                        kp: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                rep: a,
                                tra: a
                            }
                        },
                        kr: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                es: a,
                                go: a,
                                hs: a,
                                kg: a,
                                mil: a,
                                ms: a,
                                ne: a,
                                or: a,
                                pe: a,
                                re: a,
                                sc: a,
                                busan: a,
                                chungbuk: a,
                                chungnam: a,
                                daegu: a,
                                daejeon: a,
                                gangwon: a,
                                gwangju: a,
                                gyeongbuk: a,
                                gyeonggi: a,
                                gyeongnam: a,
                                incheon: a,
                                jeju: a,
                                jeonbuk: a,
                                jeonnam: a,
                                seoul: a,
                                ulsan: a,
                                blogspot: e
                            }
                        },
                        kw: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                emb: a,
                                gov: a,
                                ind: a,
                                net: a,
                                org: a
                            }
                        },
                        ky: o,
                        kz: {
                            $: 1,
                            succ: {
                                org: a,
                                edu: a,
                                net: a,
                                gov: a,
                                mil: a,
                                com: a,
                                jcloud: e,
                                kazteleport: {
                                    $: 0,
                                    succ: {
                                        upaas: e
                                    }
                                }
                            }
                        },
                        la: {
                            $: 1,
                            succ: {
                                int: a,
                                net: a,
                                info: a,
                                edu: a,
                                gov: a,
                                per: a,
                                com: a,
                                org: a,
                                bnr: e,
                                c: e
                            }
                        },
                        lb: o,
                        lc: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                co: a,
                                org: a,
                                edu: a,
                                gov: a,
                                oy: e
                            }
                        },
                        li: {
                            $: 1,
                            succ: {
                                blogspot: e,
                                caa: e
                            }
                        },
                        lk: {
                            $: 1,
                            succ: {
                                gov: a,
                                sch: a,
                                net: a,
                                int: a,
                                com: a,
                                org: a,
                                edu: a,
                                ngo: a,
                                soc: a,
                                web: a,
                                ltd: a,
                                assn: a,
                                grp: a,
                                hotel: a,
                                ac: a
                            }
                        },
                        lr: o,
                        ls: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: a,
                                edu: a,
                                gov: a,
                                info: a,
                                net: a,
                                org: a,
                                sc: a,
                                de: e
                            }
                        },
                        lt: z,
                        lu: s,
                        lv: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                org: a,
                                mil: a,
                                id: a,
                                net: a,
                                asn: a,
                                conf: a
                            }
                        },
                        ly: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                gov: a,
                                plc: a,
                                edu: a,
                                sch: a,
                                med: a,
                                org: a,
                                id: a
                            }
                        },
                        ma: {
                            $: 1,
                            succ: {
                                co: a,
                                net: a,
                                gov: a,
                                org: a,
                                ac: a,
                                press: a
                            }
                        },
                        mc: {
                            $: 1,
                            succ: {
                                tm: a,
                                asso: a
                            }
                        },
                        md: {
                            $: 1,
                            succ: {
                                blogspot: e,
                                at: e,
                                de: e,
                                jp: e,
                                to: e
                            }
                        },
                        me: {
                            $: 1,
                            succ: {
                                co: a,
                                net: a,
                                org: a,
                                edu: a,
                                ac: a,
                                gov: a,
                                its: a,
                                priv: a,
                                c66: e,
                                daplie: {
                                    $: 2,
                                    succ: {
                                        localhost: e
                                    }
                                },
                                edgestack: e,
                                couk: e,
                                ukco: e,
                                filegear: e,
                                "filegear-au": e,
                                "filegear-de": e,
                                "filegear-gb": e,
                                "filegear-ie": e,
                                "filegear-jp": e,
                                "filegear-sg": e,
                                glitch: e,
                                ravendb: e,
                                lohmus: e,
                                barsy: e,
                                mcpe: e,
                                mcdir: e,
                                soundcast: e,
                                tcp4: e,
                                brasilia: e,
                                ddns: e,
                                dnsfor: e,
                                hopto: e,
                                loginto: e,
                                noip: e,
                                webhop: e,
                                vp4: e,
                                diskstation: e,
                                dscloud: e,
                                i234: e,
                                myds: e,
                                synology: e,
                                tbits: e,
                                wbq: e,
                                wedeploy: e,
                                yombo: e,
                                nohost: e
                            }
                        },
                        mg: {
                            $: 1,
                            succ: {
                                org: a,
                                nom: a,
                                gov: a,
                                prd: a,
                                tm: a,
                                edu: a,
                                mil: a,
                                com: a,
                                co: a
                            }
                        },
                        mh: a,
                        mil: a,
                        mk: {
                            $: 1,
                            succ: {
                                com: a,
                                org: a,
                                net: a,
                                edu: a,
                                gov: a,
                                inf: a,
                                name: a,
                                blogspot: e
                            }
                        },
                        ml: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gouv: a,
                                gov: a,
                                net: a,
                                org: a,
                                presse: a
                            }
                        },
                        mm: r,
                        mn: {
                            $: 1,
                            succ: {
                                gov: a,
                                edu: a,
                                org: a,
                                nyc: e
                            }
                        },
                        mo: o,
                        mobi: {
                            $: 1,
                            succ: {
                                barsy: e,
                                dscloud: e
                            }
                        },
                        mp: {
                            $: 1,
                            succ: {
                                ju: e
                            }
                        },
                        mq: a,
                        mr: z,
                        ms: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                net: a,
                                org: a,
                                lab: e,
                                minisite: e
                            }
                        },
                        mt: {
                            $: 1,
                            succ: {
                                com: s,
                                edu: a,
                                net: a,
                                org: a
                            }
                        },
                        mu: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                ac: a,
                                co: a,
                                or: a
                            }
                        },
                        museum: {
                            $: 1,
                            succ: {
                                academy: a,
                                agriculture: a,
                                air: a,
                                airguard: a,
                                alabama: a,
                                alaska: a,
                                amber: a,
                                ambulance: a,
                                american: a,
                                americana: a,
                                americanantiques: a,
                                americanart: a,
                                amsterdam: a,
                                and: a,
                                annefrank: a,
                                anthro: a,
                                anthropology: a,
                                antiques: a,
                                aquarium: a,
                                arboretum: a,
                                archaeological: a,
                                archaeology: a,
                                architecture: a,
                                art: a,
                                artanddesign: a,
                                artcenter: a,
                                artdeco: a,
                                arteducation: a,
                                artgallery: a,
                                arts: a,
                                artsandcrafts: a,
                                asmatart: a,
                                assassination: a,
                                assisi: a,
                                association: a,
                                astronomy: a,
                                atlanta: a,
                                austin: a,
                                australia: a,
                                automotive: a,
                                aviation: a,
                                axis: a,
                                badajoz: a,
                                baghdad: a,
                                bahn: a,
                                bale: a,
                                baltimore: a,
                                barcelona: a,
                                baseball: a,
                                basel: a,
                                baths: a,
                                bauern: a,
                                beauxarts: a,
                                beeldengeluid: a,
                                bellevue: a,
                                bergbau: a,
                                berkeley: a,
                                berlin: a,
                                bern: a,
                                bible: a,
                                bilbao: a,
                                bill: a,
                                birdart: a,
                                birthplace: a,
                                bonn: a,
                                boston: a,
                                botanical: a,
                                botanicalgarden: a,
                                botanicgarden: a,
                                botany: a,
                                brandywinevalley: a,
                                brasil: a,
                                bristol: a,
                                british: a,
                                britishcolumbia: a,
                                broadcast: a,
                                brunel: a,
                                brussel: a,
                                brussels: a,
                                bruxelles: a,
                                building: a,
                                burghof: a,
                                bus: a,
                                bushey: a,
                                cadaques: a,
                                california: a,
                                cambridge: a,
                                can: a,
                                canada: a,
                                capebreton: a,
                                carrier: a,
                                cartoonart: a,
                                casadelamoneda: a,
                                castle: a,
                                castres: a,
                                celtic: a,
                                center: a,
                                chattanooga: a,
                                cheltenham: a,
                                chesapeakebay: a,
                                chicago: a,
                                children: a,
                                childrens: a,
                                childrensgarden: a,
                                chiropractic: a,
                                chocolate: a,
                                christiansburg: a,
                                cincinnati: a,
                                cinema: a,
                                circus: a,
                                civilisation: a,
                                civilization: a,
                                civilwar: a,
                                clinton: a,
                                clock: a,
                                coal: a,
                                coastaldefence: a,
                                cody: a,
                                coldwar: a,
                                collection: a,
                                colonialwilliamsburg: a,
                                coloradoplateau: a,
                                columbia: a,
                                columbus: a,
                                communication: a,
                                communications: a,
                                community: a,
                                computer: a,
                                computerhistory: a,
                                "xn--comunicaes-v6a2o": a,
                                "comunicações": a,
                                contemporary: a,
                                contemporaryart: a,
                                convent: a,
                                copenhagen: a,
                                corporation: a,
                                "xn--correios-e-telecomunicaes-ghc29a": a,
                                "correios-e-telecomunicações": a,
                                corvette: a,
                                costume: a,
                                countryestate: a,
                                county: a,
                                crafts: a,
                                cranbrook: a,
                                creation: a,
                                cultural: a,
                                culturalcenter: a,
                                culture: a,
                                cyber: a,
                                cymru: a,
                                dali: a,
                                dallas: a,
                                database: a,
                                ddr: a,
                                decorativearts: a,
                                delaware: a,
                                delmenhorst: a,
                                denmark: a,
                                depot: a,
                                design: a,
                                detroit: a,
                                dinosaur: a,
                                discovery: a,
                                dolls: a,
                                donostia: a,
                                durham: a,
                                eastafrica: a,
                                eastcoast: a,
                                education: a,
                                educational: a,
                                egyptian: a,
                                eisenbahn: a,
                                elburg: a,
                                elvendrell: a,
                                embroidery: a,
                                encyclopedic: a,
                                england: a,
                                entomology: a,
                                environment: a,
                                environmentalconservation: a,
                                epilepsy: a,
                                essex: a,
                                estate: a,
                                ethnology: a,
                                exeter: a,
                                exhibition: a,
                                family: a,
                                farm: a,
                                farmequipment: a,
                                farmers: a,
                                farmstead: a,
                                field: a,
                                figueres: a,
                                filatelia: a,
                                film: a,
                                fineart: a,
                                finearts: a,
                                finland: a,
                                flanders: a,
                                florida: a,
                                force: a,
                                fortmissoula: a,
                                fortworth: a,
                                foundation: a,
                                francaise: a,
                                frankfurt: a,
                                franziskaner: a,
                                freemasonry: a,
                                freiburg: a,
                                fribourg: a,
                                frog: a,
                                fundacio: a,
                                furniture: a,
                                gallery: a,
                                garden: a,
                                gateway: a,
                                geelvinck: a,
                                gemological: a,
                                geology: a,
                                georgia: a,
                                giessen: a,
                                glas: a,
                                glass: a,
                                gorge: a,
                                grandrapids: a,
                                graz: a,
                                guernsey: a,
                                halloffame: a,
                                hamburg: a,
                                handson: a,
                                harvestcelebration: a,
                                hawaii: a,
                                health: a,
                                heimatunduhren: a,
                                hellas: a,
                                helsinki: a,
                                hembygdsforbund: a,
                                heritage: a,
                                histoire: a,
                                historical: a,
                                historicalsociety: a,
                                historichouses: a,
                                historisch: a,
                                historisches: a,
                                history: a,
                                historyofscience: a,
                                horology: a,
                                house: a,
                                humanities: a,
                                illustration: a,
                                imageandsound: a,
                                indian: a,
                                indiana: a,
                                indianapolis: a,
                                indianmarket: a,
                                intelligence: a,
                                interactive: a,
                                iraq: a,
                                iron: a,
                                isleofman: a,
                                jamison: a,
                                jefferson: a,
                                jerusalem: a,
                                jewelry: a,
                                jewish: a,
                                jewishart: a,
                                jfk: a,
                                journalism: a,
                                judaica: a,
                                judygarland: a,
                                juedisches: a,
                                juif: a,
                                karate: a,
                                karikatur: a,
                                kids: a,
                                koebenhavn: a,
                                koeln: a,
                                kunst: a,
                                kunstsammlung: a,
                                kunstunddesign: a,
                                labor: a,
                                labour: a,
                                lajolla: a,
                                lancashire: a,
                                landes: a,
                                lans: a,
                                "xn--lns-qla": a,
                                "läns": a,
                                larsson: a,
                                lewismiller: a,
                                lincoln: a,
                                linz: a,
                                living: a,
                                livinghistory: a,
                                localhistory: a,
                                london: a,
                                losangeles: a,
                                louvre: a,
                                loyalist: a,
                                lucerne: a,
                                luxembourg: a,
                                luzern: a,
                                mad: a,
                                madrid: a,
                                mallorca: a,
                                manchester: a,
                                mansion: a,
                                mansions: a,
                                manx: a,
                                marburg: a,
                                maritime: a,
                                maritimo: a,
                                maryland: a,
                                marylhurst: a,
                                media: a,
                                medical: a,
                                medizinhistorisches: a,
                                meeres: a,
                                memorial: a,
                                mesaverde: a,
                                michigan: a,
                                midatlantic: a,
                                military: a,
                                mill: a,
                                miners: a,
                                mining: a,
                                minnesota: a,
                                missile: a,
                                missoula: a,
                                modern: a,
                                moma: a,
                                money: a,
                                monmouth: a,
                                monticello: a,
                                montreal: a,
                                moscow: a,
                                motorcycle: a,
                                muenchen: a,
                                muenster: a,
                                mulhouse: a,
                                muncie: a,
                                museet: a,
                                museumcenter: a,
                                museumvereniging: a,
                                music: a,
                                national: a,
                                nationalfirearms: a,
                                nationalheritage: a,
                                nativeamerican: a,
                                naturalhistory: a,
                                naturalhistorymuseum: a,
                                naturalsciences: a,
                                nature: a,
                                naturhistorisches: a,
                                natuurwetenschappen: a,
                                naumburg: a,
                                naval: a,
                                nebraska: a,
                                neues: a,
                                newhampshire: a,
                                newjersey: a,
                                newmexico: a,
                                newport: a,
                                newspaper: a,
                                newyork: a,
                                niepce: a,
                                norfolk: a,
                                north: a,
                                nrw: a,
                                nyc: a,
                                nyny: a,
                                oceanographic: a,
                                oceanographique: a,
                                omaha: a,
                                online: a,
                                ontario: a,
                                openair: a,
                                oregon: a,
                                oregontrail: a,
                                otago: a,
                                oxford: a,
                                pacific: a,
                                paderborn: a,
                                palace: a,
                                paleo: a,
                                palmsprings: a,
                                panama: a,
                                paris: a,
                                pasadena: a,
                                pharmacy: a,
                                philadelphia: a,
                                philadelphiaarea: a,
                                philately: a,
                                phoenix: a,
                                photography: a,
                                pilots: a,
                                pittsburgh: a,
                                planetarium: a,
                                plantation: a,
                                plants: a,
                                plaza: a,
                                portal: a,
                                portland: a,
                                portlligat: a,
                                "posts-and-telecommunications": a,
                                preservation: a,
                                presidio: a,
                                press: a,
                                project: a,
                                public: a,
                                pubol: a,
                                quebec: a,
                                railroad: a,
                                railway: a,
                                research: a,
                                resistance: a,
                                riodejaneiro: a,
                                rochester: a,
                                rockart: a,
                                roma: a,
                                russia: a,
                                saintlouis: a,
                                salem: a,
                                salvadordali: a,
                                salzburg: a,
                                sandiego: a,
                                sanfrancisco: a,
                                santabarbara: a,
                                santacruz: a,
                                santafe: a,
                                saskatchewan: a,
                                satx: a,
                                savannahga: a,
                                schlesisches: a,
                                schoenbrunn: a,
                                schokoladen: a,
                                school: a,
                                schweiz: a,
                                science: a,
                                scienceandhistory: a,
                                scienceandindustry: a,
                                sciencecenter: a,
                                sciencecenters: a,
                                "science-fiction": a,
                                sciencehistory: a,
                                sciences: a,
                                sciencesnaturelles: a,
                                scotland: a,
                                seaport: a,
                                settlement: a,
                                settlers: a,
                                shell: a,
                                sherbrooke: a,
                                sibenik: a,
                                silk: a,
                                ski: a,
                                skole: a,
                                society: a,
                                sologne: a,
                                soundandvision: a,
                                southcarolina: a,
                                southwest: a,
                                space: a,
                                spy: a,
                                square: a,
                                stadt: a,
                                stalbans: a,
                                starnberg: a,
                                state: a,
                                stateofdelaware: a,
                                station: a,
                                steam: a,
                                steiermark: a,
                                stjohn: a,
                                stockholm: a,
                                stpetersburg: a,
                                stuttgart: a,
                                suisse: a,
                                surgeonshall: a,
                                surrey: a,
                                svizzera: a,
                                sweden: a,
                                sydney: a,
                                tank: a,
                                tcm: a,
                                technology: a,
                                telekommunikation: a,
                                television: a,
                                texas: a,
                                textile: a,
                                theater: a,
                                time: a,
                                timekeeping: a,
                                topology: a,
                                torino: a,
                                touch: a,
                                town: a,
                                transport: a,
                                tree: a,
                                trolley: a,
                                trust: a,
                                trustee: a,
                                uhren: a,
                                ulm: a,
                                undersea: a,
                                university: a,
                                usa: a,
                                usantiques: a,
                                usarts: a,
                                uscountryestate: a,
                                usculture: a,
                                usdecorativearts: a,
                                usgarden: a,
                                ushistory: a,
                                ushuaia: a,
                                uslivinghistory: a,
                                utah: a,
                                uvic: a,
                                valley: a,
                                vantaa: a,
                                versailles: a,
                                viking: a,
                                village: a,
                                virginia: a,
                                virtual: a,
                                virtuel: a,
                                vlaanderen: a,
                                volkenkunde: a,
                                wales: a,
                                wallonie: a,
                                war: a,
                                washingtondc: a,
                                watchandclock: a,
                                "watch-and-clock": a,
                                western: a,
                                westfalen: a,
                                whaling: a,
                                wildlife: a,
                                williamsburg: a,
                                windmill: a,
                                workshop: a,
                                york: a,
                                yorkshire: a,
                                yosemite: a,
                                youth: a,
                                zoological: a,
                                zoology: a,
                                "xn--9dbhblg6di": a,
                                "ירושלים": a,
                                "xn--h1aegh": a,
                                "иком": a
                            }
                        },
                        mv: {
                            $: 1,
                            succ: {
                                aero: a,
                                biz: a,
                                com: a,
                                coop: a,
                                edu: a,
                                gov: a,
                                info: a,
                                int: a,
                                mil: a,
                                museum: a,
                                name: a,
                                net: a,
                                org: a,
                                pro: a
                            }
                        },
                        mw: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: a,
                                com: a,
                                coop: a,
                                edu: a,
                                gov: a,
                                int: a,
                                museum: a,
                                net: a,
                                org: a
                            }
                        },
                        mx: {
                            $: 1,
                            succ: {
                                com: a,
                                org: a,
                                gob: a,
                                edu: a,
                                net: a,
                                blogspot: e
                            }
                        },
                        my: {
                            $: 1,
                            succ: {
                                biz: a,
                                com: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                name: a,
                                net: a,
                                org: a,
                                blogspot: e
                            }
                        },
                        mz: {
                            $: 1,
                            succ: {
                                ac: a,
                                adv: a,
                                co: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a
                            }
                        },
                        na: {
                            $: 1,
                            succ: {
                                info: a,
                                pro: a,
                                name: a,
                                school: a,
                                or: a,
                                dr: a,
                                us: a,
                                mx: a,
                                ca: a,
                                in: a,
                                cc: a,
                                tv: a,
                                ws: a,
                                mobi: a,
                                co: a,
                                com: a,
                                org: a
                            }
                        },
                        name: {
                            $: 1,
                            succ: {
                                her: q,
                                his: q
                            }
                        },
                        nc: {
                            $: 1,
                            succ: {
                                asso: a,
                                nom: a
                            }
                        },
                        ne: a,
                        net: {
                            $: 1,
                            succ: {
                                adobeaemcloud: e,
                                alwaysdata: e,
                                cloudfront: e,
                                t3l3p0rt: e,
                                appudo: e,
                                "atlassian-dev": {
                                    $: 0,
                                    succ: {
                                        prod: {
                                            $: 0,
                                            succ: {
                                                cdn: e
                                            }
                                        }
                                    }
                                },
                                myfritz: e,
                                onavstack: e,
                                blackbaudcdn: e,
                                boomla: e,
                                bplaced: e,
                                square7: e,
                                gb: e,
                                hu: e,
                                jp: e,
                                se: e,
                                uk: e,
                                in: e,
                                clic2000: e,
                                clickrising: e,
                                cloudaccess: e,
                                "cdn77-ssl": e,
                                cdn77: {
                                    $: 0,
                                    succ: {
                                        r: e
                                    }
                                },
                                "feste-ip": e,
                                "knx-server": e,
                                "static-access": e,
                                cryptonomic: n,
                                dattolocal: e,
                                mydatto: e,
                                debian: e,
                                bitbridge: e,
                                "at-band-camp": e,
                                blogdns: e,
                                "broke-it": e,
                                buyshouses: e,
                                dnsalias: e,
                                dnsdojo: e,
                                "does-it": e,
                                dontexist: e,
                                dynalias: e,
                                dynathome: e,
                                endofinternet: e,
                                "from-az": e,
                                "from-co": e,
                                "from-la": e,
                                "from-ny": e,
                                "gets-it": e,
                                "ham-radio-op": e,
                                homeftp: e,
                                homeip: e,
                                homelinux: e,
                                homeunix: e,
                                "in-the-band": e,
                                "is-a-chef": e,
                                "is-a-geek": e,
                                "isa-geek": e,
                                "kicks-ass": e,
                                "office-on-the": e,
                                podzone: e,
                                "scrapper-site": e,
                                selfip: e,
                                "sells-it": e,
                                servebbs: e,
                                serveftp: e,
                                thruhere: e,
                                webhop: e,
                                definima: e,
                                casacam: e,
                                dynu: e,
                                dynv6: e,
                                twmail: e,
                                ru: e,
                                channelsdvr: {
                                    $: 2,
                                    succ: {
                                        u: e
                                    }
                                },
                                fastlylb: {
                                    $: 2,
                                    succ: {
                                        map: e
                                    }
                                },
                                fastly: {
                                    $: 0,
                                    succ: {
                                        freetls: e,
                                        map: e,
                                        prod: {
                                            $: 0,
                                            succ: {
                                                a: e,
                                                global: e
                                            }
                                        },
                                        ssl: {
                                            $: 0,
                                            succ: {
                                                a: e,
                                                b: e,
                                                global: e
                                            }
                                        }
                                    }
                                },
                                edgeapp: e,
                                flynnhosting: e,
                                "cdn-edges": e,
                                cloudfunctions: e,
                                moonscale: e,
                                "in-dsl": e,
                                "in-vpn": e,
                                ipifony: e,
                                iobb: e,
                                cloudjiffy: {
                                    $: 2,
                                    succ: {
                                        "fra1-de": e,
                                        "west1-us": e
                                    }
                                },
                                elastx: {
                                    $: 0,
                                    succ: {
                                        "jls-sto1": e,
                                        "jls-sto2": e,
                                        "jls-sto3": e
                                    }
                                },
                                faststacks: e,
                                massivegrid: {
                                    $: 0,
                                    succ: {
                                        paas: {
                                            $: 0,
                                            succ: {
                                                "fr-1": e,
                                                "lon-1": e,
                                                "lon-2": e,
                                                "ny-1": e,
                                                "ny-2": e,
                                                "sg-1": e
                                            }
                                        }
                                    }
                                },
                                saveincloud: {
                                    $: 0,
                                    succ: {
                                        jelastic: e,
                                        "nordeste-idc": e
                                    }
                                },
                                scaleforce: b,
                                tsukaeru: f,
                                kinghost: e,
                                uni5: e,
                                krellian: e,
                                barsy: e,
                                memset: e,
                                azurewebsites: e,
                                "azure-mobile": e,
                                cloudapp: e,
                                azurestaticapps: {
                                    $: 2,
                                    succ: {
                                        centralus: e,
                                        eastasia: e,
                                        eastus2: e,
                                        westeurope: e,
                                        westus2: e
                                    }
                                },
                                dnsup: e,
                                hicam: e,
                                "now-dns": e,
                                ownip: e,
                                vpndns: e,
                                "eating-organic": e,
                                mydissent: e,
                                myeffect: e,
                                mymediapc: e,
                                mypsx: e,
                                mysecuritycamera: e,
                                nhlfan: e,
                                "no-ip": e,
                                pgafan: e,
                                privatizehealthinsurance: e,
                                bounceme: e,
                                ddns: e,
                                redirectme: e,
                                serveblog: e,
                                serveminecraft: e,
                                sytes: e,
                                cloudycluster: e,
                                ovh: {
                                    $: 0,
                                    succ: {
                                        webpaas: n,
                                        hosting: n
                                    }
                                },
                                bar0: e,
                                bar1: e,
                                bar2: e,
                                rackmaze: e,
                                schokokeks: e,
                                "firewall-gateway": e,
                                seidat: e,
                                senseering: e,
                                siteleaf: e,
                                "vps-host": {
                                    $: 2,
                                    succ: {
                                        jelastic: {
                                            $: 0,
                                            succ: {
                                                atl: e,
                                                njs: e,
                                                ric: e
                                            }
                                        }
                                    }
                                },
                                myspreadshop: e,
                                srcf: {
                                    $: 0,
                                    succ: {
                                        soc: e,
                                        user: e
                                    }
                                },
                                supabase: e,
                                dsmynas: e,
                                familyds: e,
                                torproject: {
                                    $: 2,
                                    succ: {
                                        pages: e
                                    }
                                },
                                fastblog: e,
                                "reserve-online": e,
                                "community-pro": e,
                                meinforum: e,
                                yandexcloud: {
                                    $: 2,
                                    succ: {
                                        storage: e,
                                        website: e
                                    }
                                },
                                za: e
                            }
                        },
                        nf: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                per: a,
                                rec: a,
                                web: a,
                                arts: a,
                                firm: a,
                                info: a,
                                other: a,
                                store: a
                            }
                        },
                        ng: {
                            $: 1,
                            succ: {
                                com: s,
                                edu: a,
                                gov: a,
                                i: a,
                                mil: a,
                                mobi: a,
                                name: a,
                                net: a,
                                org: a,
                                sch: a,
                                col: e,
                                firm: e,
                                gen: e,
                                ltd: e,
                                ngo: e
                            }
                        },
                        ni: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: a,
                                com: a,
                                edu: a,
                                gob: a,
                                in: a,
                                info: a,
                                int: a,
                                mil: a,
                                net: a,
                                nom: a,
                                org: a,
                                web: a
                            }
                        },
                        nl: {
                            $: 1,
                            succ: {
                                amsw: e,
                                virtueeldomein: e,
                                co: e,
                                "hosting-cluster": e,
                                blogspot: e,
                                khplay: e,
                                myspreadshop: e,
                                transurl: n,
                                cistron: e,
                                demon: e
                            }
                        },
                        no: {
                            $: 1,
                            succ: {
                                fhs: a,
                                vgs: a,
                                fylkesbibl: a,
                                folkebibl: a,
                                museum: a,
                                idrett: a,
                                priv: a,
                                mil: a,
                                stat: a,
                                dep: a,
                                kommune: a,
                                herad: a,
                                aa: C,
                                ah: C,
                                bu: C,
                                fm: C,
                                hl: C,
                                hm: C,
                                "jan-mayen": C,
                                mr: C,
                                nl: C,
                                nt: C,
                                of: C,
                                ol: C,
                                oslo: C,
                                rl: C,
                                sf: C,
                                st: C,
                                svalbard: C,
                                tm: C,
                                tr: C,
                                va: C,
                                vf: C,
                                akrehamn: a,
                                "xn--krehamn-dxa": a,
                                "åkrehamn": a,
                                algard: a,
                                "xn--lgrd-poac": a,
                                "ålgård": a,
                                arna: a,
                                brumunddal: a,
                                bryne: a,
                                bronnoysund: a,
                                "xn--brnnysund-m8ac": a,
                                "brønnøysund": a,
                                drobak: a,
                                "xn--drbak-wua": a,
                                "drøbak": a,
                                egersund: a,
                                fetsund: a,
                                floro: a,
                                "xn--flor-jra": a,
                                "florø": a,
                                fredrikstad: a,
                                hokksund: a,
                                honefoss: a,
                                "xn--hnefoss-q1a": a,
                                "hønefoss": a,
                                jessheim: a,
                                jorpeland: a,
                                "xn--jrpeland-54a": a,
                                "jørpeland": a,
                                kirkenes: a,
                                kopervik: a,
                                krokstadelva: a,
                                langevag: a,
                                "xn--langevg-jxa": a,
                                "langevåg": a,
                                leirvik: a,
                                mjondalen: a,
                                "xn--mjndalen-64a": a,
                                "mjøndalen": a,
                                "mo-i-rana": a,
                                mosjoen: a,
                                "xn--mosjen-eya": a,
                                "mosjøen": a,
                                nesoddtangen: a,
                                orkanger: a,
                                osoyro: a,
                                "xn--osyro-wua": a,
                                "osøyro": a,
                                raholt: a,
                                "xn--rholt-mra": a,
                                "råholt": a,
                                sandnessjoen: a,
                                "xn--sandnessjen-ogb": a,
                                "sandnessjøen": a,
                                skedsmokorset: a,
                                slattum: a,
                                spjelkavik: a,
                                stathelle: a,
                                stavern: a,
                                stjordalshalsen: a,
                                "xn--stjrdalshalsen-sqb": a,
                                "stjørdalshalsen": a,
                                tananger: a,
                                tranby: a,
                                vossevangen: a,
                                afjord: a,
                                "xn--fjord-lra": a,
                                "åfjord": a,
                                agdenes: a,
                                al: a,
                                "xn--l-1fa": a,
                                "ål": a,
                                alesund: a,
                                "xn--lesund-hua": a,
                                "ålesund": a,
                                alstahaug: a,
                                alta: a,
                                "xn--lt-liac": a,
                                "áltá": a,
                                alaheadju: a,
                                "xn--laheadju-7ya": a,
                                "álaheadju": a,
                                alvdal: a,
                                amli: a,
                                "xn--mli-tla": a,
                                "åmli": a,
                                amot: a,
                                "xn--mot-tla": a,
                                "åmot": a,
                                andebu: a,
                                andoy: a,
                                "xn--andy-ira": a,
                                "andøy": a,
                                andasuolo: a,
                                ardal: a,
                                "xn--rdal-poa": a,
                                "årdal": a,
                                aremark: a,
                                arendal: a,
                                "xn--s-1fa": a,
                                "ås": a,
                                aseral: a,
                                "xn--seral-lra": a,
                                "åseral": a,
                                asker: a,
                                askim: a,
                                askvoll: a,
                                askoy: a,
                                "xn--asky-ira": a,
                                "askøy": a,
                                asnes: a,
                                "xn--snes-poa": a,
                                "åsnes": a,
                                audnedaln: a,
                                aukra: a,
                                aure: a,
                                aurland: a,
                                "aurskog-holand": a,
                                "xn--aurskog-hland-jnb": a,
                                "aurskog-høland": a,
                                austevoll: a,
                                austrheim: a,
                                averoy: a,
                                "xn--avery-yua": a,
                                "averøy": a,
                                balestrand: a,
                                ballangen: a,
                                balat: a,
                                "xn--blt-elab": a,
                                "bálát": a,
                                balsfjord: a,
                                bahccavuotna: a,
                                "xn--bhccavuotna-k7a": a,
                                "báhccavuotna": a,
                                bamble: a,
                                bardu: a,
                                beardu: a,
                                beiarn: a,
                                bajddar: a,
                                "xn--bjddar-pta": a,
                                "bájddar": a,
                                baidar: a,
                                "xn--bidr-5nac": a,
                                "báidár": a,
                                berg: a,
                                bergen: a,
                                berlevag: a,
                                "xn--berlevg-jxa": a,
                                "berlevåg": a,
                                bearalvahki: a,
                                "xn--bearalvhki-y4a": a,
                                "bearalváhki": a,
                                bindal: a,
                                birkenes: a,
                                bjarkoy: a,
                                "xn--bjarky-fya": a,
                                "bjarkøy": a,
                                bjerkreim: a,
                                bjugn: a,
                                bodo: a,
                                "xn--bod-2na": a,
                                "bodø": a,
                                badaddja: a,
                                "xn--bdddj-mrabd": a,
                                "bådåddjå": a,
                                budejju: a,
                                bokn: a,
                                bremanger: a,
                                bronnoy: a,
                                "xn--brnny-wuac": a,
                                "brønnøy": a,
                                bygland: a,
                                bykle: a,
                                barum: a,
                                "xn--brum-voa": a,
                                "bærum": a,
                                telemark: {
                                    $: 0,
                                    succ: {
                                        bo: a,
                                        "xn--b-5ga": a,
                                        "bø": a
                                    }
                                },
                                nordland: {
                                    $: 0,
                                    succ: {
                                        bo: a,
                                        "xn--b-5ga": a,
                                        "bø": a,
                                        heroy: a,
                                        "xn--hery-ira": a,
                                        "herøy": a
                                    }
                                },
                                bievat: a,
                                "xn--bievt-0qa": a,
                                "bievát": a,
                                bomlo: a,
                                "xn--bmlo-gra": a,
                                "bømlo": a,
                                batsfjord: a,
                                "xn--btsfjord-9za": a,
                                "båtsfjord": a,
                                bahcavuotna: a,
                                "xn--bhcavuotna-s4a": a,
                                "báhcavuotna": a,
                                dovre: a,
                                drammen: a,
                                drangedal: a,
                                dyroy: a,
                                "xn--dyry-ira": a,
                                "dyrøy": a,
                                donna: a,
                                "xn--dnna-gra": a,
                                "dønna": a,
                                eid: a,
                                eidfjord: a,
                                eidsberg: a,
                                eidskog: a,
                                eidsvoll: a,
                                eigersund: a,
                                elverum: a,
                                enebakk: a,
                                engerdal: a,
                                etne: a,
                                etnedal: a,
                                evenes: a,
                                evenassi: a,
                                "xn--eveni-0qa01ga": a,
                                "evenášši": a,
                                "evje-og-hornnes": a,
                                farsund: a,
                                fauske: a,
                                fuossko: a,
                                fuoisku: a,
                                fedje: a,
                                fet: a,
                                finnoy: a,
                                "xn--finny-yua": a,
                                "finnøy": a,
                                fitjar: a,
                                fjaler: a,
                                fjell: a,
                                flakstad: a,
                                flatanger: a,
                                flekkefjord: a,
                                flesberg: a,
                                flora: a,
                                fla: a,
                                "xn--fl-zia": a,
                                "flå": a,
                                folldal: a,
                                forsand: a,
                                fosnes: a,
                                frei: a,
                                frogn: a,
                                froland: a,
                                frosta: a,
                                frana: a,
                                "xn--frna-woa": a,
                                "fræna": a,
                                froya: a,
                                "xn--frya-hra": a,
                                "frøya": a,
                                fusa: a,
                                fyresdal: a,
                                forde: a,
                                "xn--frde-gra": a,
                                "førde": a,
                                gamvik: a,
                                gangaviika: a,
                                "xn--ggaviika-8ya47h": a,
                                "gáŋgaviika": a,
                                gaular: a,
                                gausdal: a,
                                gildeskal: a,
                                "xn--gildeskl-g0a": a,
                                "gildeskål": a,
                                giske: a,
                                gjemnes: a,
                                gjerdrum: a,
                                gjerstad: a,
                                gjesdal: a,
                                gjovik: a,
                                "xn--gjvik-wua": a,
                                "gjøvik": a,
                                gloppen: a,
                                gol: a,
                                gran: a,
                                grane: a,
                                granvin: a,
                                gratangen: a,
                                grimstad: a,
                                grong: a,
                                kraanghke: a,
                                "xn--kranghke-b0a": a,
                                "kråanghke": a,
                                grue: a,
                                gulen: a,
                                hadsel: a,
                                halden: a,
                                halsa: a,
                                hamar: a,
                                hamaroy: a,
                                habmer: a,
                                "xn--hbmer-xqa": a,
                                "hábmer": a,
                                hapmir: a,
                                "xn--hpmir-xqa": a,
                                "hápmir": a,
                                hammerfest: a,
                                hammarfeasta: a,
                                "xn--hmmrfeasta-s4ac": a,
                                "hámmárfeasta": a,
                                haram: a,
                                hareid: a,
                                harstad: a,
                                hasvik: a,
                                aknoluokta: a,
                                "xn--koluokta-7ya57h": a,
                                "ákŋoluokta": a,
                                hattfjelldal: a,
                                aarborte: a,
                                haugesund: a,
                                hemne: a,
                                hemnes: a,
                                hemsedal: a,
                                "more-og-romsdal": {
                                    $: 0,
                                    succ: {
                                        heroy: a,
                                        sande: a
                                    }
                                },
                                "xn--mre-og-romsdal-qqb": {
                                    $: 0,
                                    succ: {
                                        "xn--hery-ira": a,
                                        sande: a
                                    }
                                },
                                "møre-og-romsdal": {
                                    $: 0,
                                    succ: {
                                        "herøy": a,
                                        sande: a
                                    }
                                },
                                hitra: a,
                                hjartdal: a,
                                hjelmeland: a,
                                hobol: a,
                                "xn--hobl-ira": a,
                                "hobøl": a,
                                hof: a,
                                hol: a,
                                hole: a,
                                holmestrand: a,
                                holtalen: a,
                                "xn--holtlen-hxa": a,
                                "holtålen": a,
                                hornindal: a,
                                horten: a,
                                hurdal: a,
                                hurum: a,
                                hvaler: a,
                                hyllestad: a,
                                hagebostad: a,
                                "xn--hgebostad-g3a": a,
                                "hægebostad": a,
                                hoyanger: a,
                                "xn--hyanger-q1a": a,
                                "høyanger": a,
                                hoylandet: a,
                                "xn--hylandet-54a": a,
                                "høylandet": a,
                                ha: a,
                                "xn--h-2fa": a,
                                "hå": a,
                                ibestad: a,
                                inderoy: a,
                                "xn--indery-fya": a,
                                "inderøy": a,
                                iveland: a,
                                jevnaker: a,
                                jondal: a,
                                jolster: a,
                                "xn--jlster-bya": a,
                                "jølster": a,
                                karasjok: a,
                                karasjohka: a,
                                "xn--krjohka-hwab49j": a,
                                "kárášjohka": a,
                                karlsoy: a,
                                galsa: a,
                                "xn--gls-elac": a,
                                "gálsá": a,
                                karmoy: a,
                                "xn--karmy-yua": a,
                                "karmøy": a,
                                kautokeino: a,
                                guovdageaidnu: a,
                                klepp: a,
                                klabu: a,
                                "xn--klbu-woa": a,
                                "klæbu": a,
                                kongsberg: a,
                                kongsvinger: a,
                                kragero: a,
                                "xn--krager-gya": a,
                                "kragerø": a,
                                kristiansand: a,
                                kristiansund: a,
                                krodsherad: a,
                                "xn--krdsherad-m8a": a,
                                "krødsherad": a,
                                kvalsund: a,
                                rahkkeravju: a,
                                "xn--rhkkervju-01af": a,
                                "ráhkkerávju": a,
                                kvam: a,
                                kvinesdal: a,
                                kvinnherad: a,
                                kviteseid: a,
                                kvitsoy: a,
                                "xn--kvitsy-fya": a,
                                "kvitsøy": a,
                                kvafjord: a,
                                "xn--kvfjord-nxa": a,
                                "kvæfjord": a,
                                giehtavuoatna: a,
                                kvanangen: a,
                                "xn--kvnangen-k0a": a,
                                "kvænangen": a,
                                navuotna: a,
                                "xn--nvuotna-hwa": a,
                                "návuotna": a,
                                kafjord: a,
                                "xn--kfjord-iua": a,
                                "kåfjord": a,
                                gaivuotna: a,
                                "xn--givuotna-8ya": a,
                                "gáivuotna": a,
                                larvik: a,
                                lavangen: a,
                                lavagis: a,
                                loabat: a,
                                "xn--loabt-0qa": a,
                                "loabát": a,
                                lebesby: a,
                                davvesiida: a,
                                leikanger: a,
                                leirfjord: a,
                                leka: a,
                                leksvik: a,
                                lenvik: a,
                                leangaviika: a,
                                "xn--leagaviika-52b": a,
                                "leaŋgaviika": a,
                                lesja: a,
                                levanger: a,
                                lier: a,
                                lierne: a,
                                lillehammer: a,
                                lillesand: a,
                                lindesnes: a,
                                lindas: a,
                                "xn--linds-pra": a,
                                "lindås": a,
                                lom: a,
                                loppa: a,
                                lahppi: a,
                                "xn--lhppi-xqa": a,
                                "láhppi": a,
                                lund: a,
                                lunner: a,
                                luroy: a,
                                "xn--lury-ira": a,
                                "lurøy": a,
                                luster: a,
                                lyngdal: a,
                                lyngen: a,
                                ivgu: a,
                                lardal: a,
                                lerdal: a,
                                "xn--lrdal-sra": a,
                                "lærdal": a,
                                lodingen: a,
                                "xn--ldingen-q1a": a,
                                "lødingen": a,
                                lorenskog: a,
                                "xn--lrenskog-54a": a,
                                "lørenskog": a,
                                loten: a,
                                "xn--lten-gra": a,
                                "løten": a,
                                malvik: a,
                                masoy: a,
                                "xn--msy-ula0h": a,
                                "måsøy": a,
                                muosat: a,
                                "xn--muost-0qa": a,
                                "muosát": a,
                                mandal: a,
                                marker: a,
                                marnardal: a,
                                masfjorden: a,
                                meland: a,
                                meldal: a,
                                melhus: a,
                                meloy: a,
                                "xn--mely-ira": a,
                                "meløy": a,
                                meraker: a,
                                "xn--merker-kua": a,
                                "meråker": a,
                                moareke: a,
                                "xn--moreke-jua": a,
                                "moåreke": a,
                                midsund: a,
                                "midtre-gauldal": a,
                                modalen: a,
                                modum: a,
                                molde: a,
                                moskenes: a,
                                moss: a,
                                mosvik: a,
                                malselv: a,
                                "xn--mlselv-iua": a,
                                "målselv": a,
                                malatvuopmi: a,
                                "xn--mlatvuopmi-s4a": a,
                                "málatvuopmi": a,
                                namdalseid: a,
                                aejrie: a,
                                namsos: a,
                                namsskogan: a,
                                naamesjevuemie: a,
                                "xn--nmesjevuemie-tcba": a,
                                "nååmesjevuemie": a,
                                laakesvuemie: a,
                                nannestad: a,
                                narvik: a,
                                narviika: a,
                                naustdal: a,
                                "nedre-eiker": a,
                                akershus: P,
                                buskerud: P,
                                nesna: a,
                                nesodden: a,
                                nesseby: a,
                                unjarga: a,
                                "xn--unjrga-rta": a,
                                "unjárga": a,
                                nesset: a,
                                nissedal: a,
                                nittedal: a,
                                "nord-aurdal": a,
                                "nord-fron": a,
                                "nord-odal": a,
                                norddal: a,
                                nordkapp: a,
                                davvenjarga: a,
                                "xn--davvenjrga-y4a": a,
                                "davvenjárga": a,
                                "nordre-land": a,
                                nordreisa: a,
                                raisa: a,
                                "xn--risa-5na": a,
                                "ráisa": a,
                                "nore-og-uvdal": a,
                                notodden: a,
                                naroy: a,
                                "xn--nry-yla5g": a,
                                "nærøy": a,
                                notteroy: a,
                                "xn--nttery-byae": a,
                                "nøtterøy": a,
                                odda: a,
                                oksnes: a,
                                "xn--ksnes-uua": a,
                                "øksnes": a,
                                oppdal: a,
                                oppegard: a,
                                "xn--oppegrd-ixa": a,
                                "oppegård": a,
                                orkdal: a,
                                orland: a,
                                "xn--rland-uua": a,
                                "ørland": a,
                                orskog: a,
                                "xn--rskog-uua": a,
                                "ørskog": a,
                                orsta: a,
                                "xn--rsta-fra": a,
                                "ørsta": a,
                                hedmark: {
                                    $: 0,
                                    succ: {
                                        os: a,
                                        valer: a,
                                        "xn--vler-qoa": a,
                                        "våler": a
                                    }
                                },
                                hordaland: {
                                    $: 0,
                                    succ: {
                                        os: a
                                    }
                                },
                                osen: a,
                                osteroy: a,
                                "xn--ostery-fya": a,
                                "osterøy": a,
                                "ostre-toten": a,
                                "xn--stre-toten-zcb": a,
                                "østre-toten": a,
                                overhalla: a,
                                "ovre-eiker": a,
                                "xn--vre-eiker-k8a": a,
                                "øvre-eiker": a,
                                oyer: a,
                                "xn--yer-zna": a,
                                "øyer": a,
                                oygarden: a,
                                "xn--ygarden-p1a": a,
                                "øygarden": a,
                                "oystre-slidre": a,
                                "xn--ystre-slidre-ujb": a,
                                "øystre-slidre": a,
                                porsanger: a,
                                porsangu: a,
                                "xn--porsgu-sta26f": a,
                                "porsáŋgu": a,
                                porsgrunn: a,
                                radoy: a,
                                "xn--rady-ira": a,
                                "radøy": a,
                                rakkestad: a,
                                rana: a,
                                ruovat: a,
                                randaberg: a,
                                rauma: a,
                                rendalen: a,
                                rennebu: a,
                                rennesoy: a,
                                "xn--rennesy-v1a": a,
                                "rennesøy": a,
                                rindal: a,
                                ringebu: a,
                                ringerike: a,
                                ringsaker: a,
                                rissa: a,
                                risor: a,
                                "xn--risr-ira": a,
                                "risør": a,
                                roan: a,
                                rollag: a,
                                rygge: a,
                                ralingen: a,
                                "xn--rlingen-mxa": a,
                                "rælingen": a,
                                rodoy: a,
                                "xn--rdy-0nab": a,
                                "rødøy": a,
                                romskog: a,
                                "xn--rmskog-bya": a,
                                "rømskog": a,
                                roros: a,
                                "xn--rros-gra": a,
                                "røros": a,
                                rost: a,
                                "xn--rst-0na": a,
                                "røst": a,
                                royken: a,
                                "xn--ryken-vua": a,
                                "røyken": a,
                                royrvik: a,
                                "xn--ryrvik-bya": a,
                                "røyrvik": a,
                                rade: a,
                                "xn--rde-ula": a,
                                "råde": a,
                                salangen: a,
                                siellak: a,
                                saltdal: a,
                                salat: a,
                                "xn--slt-elab": a,
                                "sálát": a,
                                "xn--slat-5na": a,
                                "sálat": a,
                                samnanger: a,
                                vestfold: {
                                    $: 0,
                                    succ: {
                                        sande: a
                                    }
                                },
                                sandefjord: a,
                                sandnes: a,
                                sandoy: a,
                                "xn--sandy-yua": a,
                                "sandøy": a,
                                sarpsborg: a,
                                sauda: a,
                                sauherad: a,
                                sel: a,
                                selbu: a,
                                selje: a,
                                seljord: a,
                                sigdal: a,
                                siljan: a,
                                sirdal: a,
                                skaun: a,
                                skedsmo: a,
                                ski: a,
                                skien: a,
                                skiptvet: a,
                                skjervoy: a,
                                "xn--skjervy-v1a": a,
                                "skjervøy": a,
                                skierva: a,
                                "xn--skierv-uta": a,
                                "skiervá": a,
                                skjak: a,
                                "xn--skjk-soa": a,
                                "skjåk": a,
                                skodje: a,
                                skanland: a,
                                "xn--sknland-fxa": a,
                                "skånland": a,
                                skanit: a,
                                "xn--sknit-yqa": a,
                                "skánit": a,
                                smola: a,
                                "xn--smla-hra": a,
                                "smøla": a,
                                snillfjord: a,
                                snasa: a,
                                "xn--snsa-roa": a,
                                "snåsa": a,
                                snoasa: a,
                                snaase: a,
                                "xn--snase-nra": a,
                                "snåase": a,
                                sogndal: a,
                                sokndal: a,
                                sola: a,
                                solund: a,
                                songdalen: a,
                                sortland: a,
                                spydeberg: a,
                                stange: a,
                                stavanger: a,
                                steigen: a,
                                steinkjer: a,
                                stjordal: a,
                                "xn--stjrdal-s1a": a,
                                "stjørdal": a,
                                stokke: a,
                                "stor-elvdal": a,
                                stord: a,
                                stordal: a,
                                storfjord: a,
                                omasvuotna: a,
                                strand: a,
                                stranda: a,
                                stryn: a,
                                sula: a,
                                suldal: a,
                                sund: a,
                                sunndal: a,
                                surnadal: a,
                                sveio: a,
                                svelvik: a,
                                sykkylven: a,
                                sogne: a,
                                "xn--sgne-gra": a,
                                "søgne": a,
                                somna: a,
                                "xn--smna-gra": a,
                                "sømna": a,
                                "sondre-land": a,
                                "xn--sndre-land-0cb": a,
                                "søndre-land": a,
                                "sor-aurdal": a,
                                "xn--sr-aurdal-l8a": a,
                                "sør-aurdal": a,
                                "sor-fron": a,
                                "xn--sr-fron-q1a": a,
                                "sør-fron": a,
                                "sor-odal": a,
                                "xn--sr-odal-q1a": a,
                                "sør-odal": a,
                                "sor-varanger": a,
                                "xn--sr-varanger-ggb": a,
                                "sør-varanger": a,
                                "matta-varjjat": a,
                                "xn--mtta-vrjjat-k7af": a,
                                "mátta-várjjat": a,
                                sorfold: a,
                                "xn--srfold-bya": a,
                                "sørfold": a,
                                sorreisa: a,
                                "xn--srreisa-q1a": a,
                                "sørreisa": a,
                                sorum: a,
                                "xn--srum-gra": a,
                                "sørum": a,
                                tana: a,
                                deatnu: a,
                                time: a,
                                tingvoll: a,
                                tinn: a,
                                tjeldsund: a,
                                dielddanuorri: a,
                                tjome: a,
                                "xn--tjme-hra": a,
                                "tjøme": a,
                                tokke: a,
                                tolga: a,
                                torsken: a,
                                tranoy: a,
                                "xn--trany-yua": a,
                                "tranøy": a,
                                tromso: a,
                                "xn--troms-zua": a,
                                "tromsø": a,
                                tromsa: a,
                                romsa: a,
                                trondheim: a,
                                troandin: a,
                                trysil: a,
                                trana: a,
                                "xn--trna-woa": a,
                                "træna": a,
                                trogstad: a,
                                "xn--trgstad-r1a": a,
                                "trøgstad": a,
                                tvedestrand: a,
                                tydal: a,
                                tynset: a,
                                tysfjord: a,
                                divtasvuodna: a,
                                divttasvuotna: a,
                                tysnes: a,
                                tysvar: a,
                                "xn--tysvr-vra": a,
                                "tysvær": a,
                                tonsberg: a,
                                "xn--tnsberg-q1a": a,
                                "tønsberg": a,
                                ullensaker: a,
                                ullensvang: a,
                                ulvik: a,
                                utsira: a,
                                vadso: a,
                                "xn--vads-jra": a,
                                "vadsø": a,
                                cahcesuolo: a,
                                "xn--hcesuolo-7ya35b": a,
                                "čáhcesuolo": a,
                                vaksdal: a,
                                valle: a,
                                vang: a,
                                vanylven: a,
                                vardo: a,
                                "xn--vard-jra": a,
                                "vardø": a,
                                varggat: a,
                                "xn--vrggt-xqad": a,
                                "várggát": a,
                                vefsn: a,
                                vaapste: a,
                                vega: a,
                                vegarshei: a,
                                "xn--vegrshei-c0a": a,
                                "vegårshei": a,
                                vennesla: a,
                                verdal: a,
                                verran: a,
                                vestby: a,
                                vestnes: a,
                                "vestre-slidre": a,
                                "vestre-toten": a,
                                vestvagoy: a,
                                "xn--vestvgy-ixa6o": a,
                                "vestvågøy": a,
                                vevelstad: a,
                                vik: a,
                                vikna: a,
                                vindafjord: a,
                                volda: a,
                                voss: a,
                                varoy: a,
                                "xn--vry-yla5g": a,
                                "værøy": a,
                                vagan: a,
                                "xn--vgan-qoa": a,
                                "vågan": a,
                                voagat: a,
                                vagsoy: a,
                                "xn--vgsy-qoa0j": a,
                                "vågsøy": a,
                                vaga: a,
                                "xn--vg-yiab": a,
                                "vågå": a,
                                ostfold: {
                                    $: 0,
                                    succ: {
                                        valer: a
                                    }
                                },
                                "xn--stfold-9xa": {
                                    $: 0,
                                    succ: {
                                        "xn--vler-qoa": a
                                    }
                                },
                                "østfold": {
                                    $: 0,
                                    succ: {
                                        "våler": a
                                    }
                                },
                                co: e,
                                blogspot: e,
                                myspreadshop: e
                            }
                        },
                        np: r,
                        nr: j,
                        nu: {
                            $: 1,
                            succ: {
                                merseine: e,
                                mine: e,
                                shacknet: e,
                                enterprisecloud: e
                            }
                        },
                        nz: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: s,
                                cri: a,
                                geek: a,
                                gen: a,
                                govt: a,
                                health: a,
                                iwi: a,
                                kiwi: a,
                                maori: a,
                                mil: a,
                                "xn--mori-qsa": a,
                                "māori": a,
                                net: a,
                                org: a,
                                parliament: a,
                                school: a
                            }
                        },
                        om: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                edu: a,
                                gov: a,
                                med: a,
                                museum: a,
                                net: a,
                                org: a,
                                pro: a
                            }
                        },
                        onion: a,
                        org: {
                            $: 1,
                            succ: {
                                altervista: e,
                                amune: {
                                    $: 0,
                                    succ: {
                                        tele: e
                                    }
                                },
                                pimienta: e,
                                poivron: e,
                                potager: e,
                                sweetpepper: e,
                                ae: e,
                                us: e,
                                certmgr: e,
                                cdn77: {
                                    $: 0,
                                    succ: {
                                        c: e,
                                        rsc: e
                                    }
                                },
                                "cdn77-secure": {
                                    $: 0,
                                    succ: {
                                        origin: {
                                            $: 0,
                                            succ: {
                                                ssl: e
                                            }
                                        }
                                    }
                                },
                                cloudns: e,
                                duckdns: e,
                                tunk: e,
                                dyndns: {
                                    $: 2,
                                    succ: {
                                        go: e,
                                        home: e
                                    }
                                },
                                blogdns: e,
                                blogsite: e,
                                boldlygoingnowhere: e,
                                dnsalias: e,
                                dnsdojo: e,
                                doesntexist: e,
                                dontexist: e,
                                doomdns: e,
                                dvrdns: e,
                                dynalias: e,
                                endofinternet: e,
                                endoftheinternet: e,
                                "from-me": e,
                                "game-host": e,
                                gotdns: e,
                                "hobby-site": e,
                                homedns: e,
                                homeftp: e,
                                homelinux: e,
                                homeunix: e,
                                "is-a-bruinsfan": e,
                                "is-a-candidate": e,
                                "is-a-celticsfan": e,
                                "is-a-chef": e,
                                "is-a-geek": e,
                                "is-a-knight": e,
                                "is-a-linux-user": e,
                                "is-a-patsfan": e,
                                "is-a-soxfan": e,
                                "is-found": e,
                                "is-lost": e,
                                "is-saved": e,
                                "is-very-bad": e,
                                "is-very-evil": e,
                                "is-very-good": e,
                                "is-very-nice": e,
                                "is-very-sweet": e,
                                "isa-geek": e,
                                "kicks-ass": e,
                                misconfused: e,
                                podzone: e,
                                readmyblog: e,
                                selfip: e,
                                sellsyourhome: e,
                                servebbs: e,
                                serveftp: e,
                                servegame: e,
                                "stuff-4-sale": e,
                                webhop: e,
                                ddnss: e,
                                accesscam: e,
                                camdvr: e,
                                freeddns: e,
                                mywire: e,
                                webredirect: e,
                                eu: {
                                    $: 2,
                                    succ: {
                                        al: e,
                                        asso: e,
                                        at: e,
                                        au: e,
                                        be: e,
                                        bg: e,
                                        ca: e,
                                        cd: e,
                                        ch: e,
                                        cn: e,
                                        cy: e,
                                        cz: e,
                                        de: e,
                                        dk: e,
                                        edu: e,
                                        ee: e,
                                        es: e,
                                        fi: e,
                                        fr: e,
                                        gr: e,
                                        hr: e,
                                        hu: e,
                                        ie: e,
                                        il: e,
                                        in: e,
                                        int: e,
                                        is: e,
                                        it: e,
                                        jp: e,
                                        kr: e,
                                        lt: e,
                                        lu: e,
                                        lv: e,
                                        mc: e,
                                        me: e,
                                        mk: e,
                                        mt: e,
                                        my: e,
                                        net: e,
                                        ng: e,
                                        nl: e,
                                        no: e,
                                        nz: e,
                                        paris: e,
                                        pl: e,
                                        pt: e,
                                        "q-a": e,
                                        ro: e,
                                        ru: e,
                                        se: e,
                                        si: e,
                                        sk: e,
                                        tr: e,
                                        uk: e,
                                        us: e
                                    }
                                },
                                twmail: e,
                                fedorainfracloud: e,
                                fedorapeople: e,
                                fedoraproject: {
                                    $: 0,
                                    succ: {
                                        cloud: e,
                                        os: h,
                                        stg: {
                                            $: 0,
                                            succ: {
                                                os: h
                                            }
                                        }
                                    }
                                },
                                freedesktop: e,
                                hepforge: e,
                                "in-dsl": e,
                                "in-vpn": e,
                                js: e,
                                barsy: e,
                                mayfirst: e,
                                "mozilla-iot": e,
                                bmoattachments: e,
                                dynserv: e,
                                "now-dns": e,
                                "cable-modem": e,
                                collegefan: e,
                                couchpotatofries: e,
                                mlbfan: e,
                                mysecuritycamera: e,
                                nflfan: e,
                                "read-books": e,
                                ufcfan: e,
                                hopto: e,
                                myftp: e,
                                "no-ip": e,
                                zapto: e,
                                httpbin: e,
                                pubtls: e,
                                "my-firewall": e,
                                myfirewall: e,
                                spdns: e,
                                "small-web": e,
                                dsmynas: e,
                                familyds: e,
                                edugit: e,
                                tuxfamily: e,
                                diskstation: e,
                                hk: e,
                                wmflabs: e,
                                toolforge: e,
                                wmcloud: e,
                                za: e
                            }
                        },
                        pa: {
                            $: 1,
                            succ: {
                                ac: a,
                                gob: a,
                                com: a,
                                org: a,
                                sld: a,
                                edu: a,
                                net: a,
                                ing: a,
                                abo: a,
                                med: a,
                                nom: a
                            }
                        },
                        pe: {
                            $: 1,
                            succ: {
                                edu: a,
                                gob: a,
                                nom: a,
                                mil: a,
                                org: a,
                                com: a,
                                net: a,
                                blogspot: e
                            }
                        },
                        pf: {
                            $: 1,
                            succ: {
                                com: a,
                                org: a,
                                edu: a
                            }
                        },
                        pg: r,
                        ph: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                edu: a,
                                ngo: a,
                                mil: a,
                                i: a
                            }
                        },
                        pk: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                edu: a,
                                org: a,
                                fam: a,
                                biz: a,
                                web: a,
                                gov: a,
                                gob: a,
                                gok: a,
                                gon: a,
                                gop: a,
                                gos: a,
                                info: a
                            }
                        },
                        pl: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                aid: a,
                                agro: a,
                                atm: a,
                                auto: a,
                                biz: a,
                                edu: a,
                                gmina: a,
                                gsm: a,
                                info: a,
                                mail: a,
                                miasta: a,
                                media: a,
                                mil: a,
                                nieruchomosci: a,
                                nom: a,
                                pc: a,
                                powiat: a,
                                priv: a,
                                realestate: a,
                                rel: a,
                                sex: a,
                                shop: a,
                                sklep: a,
                                sos: a,
                                szkola: a,
                                targi: a,
                                tm: a,
                                tourism: a,
                                travel: a,
                                turystyka: a,
                                gov: {
                                    $: 1,
                                    succ: {
                                        ap: a,
                                        ic: a,
                                        is: a,
                                        us: a,
                                        kmpsp: a,
                                        kppsp: a,
                                        kwpsp: a,
                                        psp: a,
                                        wskr: a,
                                        kwp: a,
                                        mw: a,
                                        ug: a,
                                        um: a,
                                        umig: a,
                                        ugim: a,
                                        upow: a,
                                        uw: a,
                                        starostwo: a,
                                        pa: a,
                                        po: a,
                                        psse: a,
                                        pup: a,
                                        rzgw: a,
                                        sa: a,
                                        so: a,
                                        sr: a,
                                        wsa: a,
                                        sko: a,
                                        uzs: a,
                                        wiih: a,
                                        winb: a,
                                        pinb: a,
                                        wios: a,
                                        witd: a,
                                        wzmiuw: a,
                                        piw: a,
                                        wiw: a,
                                        griw: a,
                                        wif: a,
                                        oum: a,
                                        sdn: a,
                                        zp: a,
                                        uppo: a,
                                        mup: a,
                                        wuoz: a,
                                        konsulat: a,
                                        oirm: a
                                    }
                                },
                                augustow: a,
                                "babia-gora": a,
                                bedzin: a,
                                beskidy: a,
                                bialowieza: a,
                                bialystok: a,
                                bielawa: a,
                                bieszczady: a,
                                boleslawiec: a,
                                bydgoszcz: a,
                                bytom: a,
                                cieszyn: a,
                                czeladz: a,
                                czest: a,
                                dlugoleka: a,
                                elblag: a,
                                elk: a,
                                glogow: a,
                                gniezno: a,
                                gorlice: a,
                                grajewo: a,
                                ilawa: a,
                                jaworzno: a,
                                "jelenia-gora": a,
                                jgora: a,
                                kalisz: a,
                                "kazimierz-dolny": a,
                                karpacz: a,
                                kartuzy: a,
                                kaszuby: a,
                                katowice: a,
                                kepno: a,
                                ketrzyn: a,
                                klodzko: a,
                                kobierzyce: a,
                                kolobrzeg: a,
                                konin: a,
                                konskowola: a,
                                kutno: a,
                                lapy: a,
                                lebork: a,
                                legnica: a,
                                lezajsk: a,
                                limanowa: a,
                                lomza: a,
                                lowicz: a,
                                lubin: a,
                                lukow: a,
                                malbork: a,
                                malopolska: a,
                                mazowsze: a,
                                mazury: a,
                                mielec: a,
                                mielno: a,
                                mragowo: a,
                                naklo: a,
                                nowaruda: a,
                                nysa: a,
                                olawa: a,
                                olecko: a,
                                olkusz: a,
                                olsztyn: a,
                                opoczno: a,
                                opole: a,
                                ostroda: a,
                                ostroleka: a,
                                ostrowiec: a,
                                ostrowwlkp: a,
                                pila: a,
                                pisz: a,
                                podhale: a,
                                podlasie: a,
                                polkowice: a,
                                pomorze: a,
                                pomorskie: a,
                                prochowice: a,
                                pruszkow: a,
                                przeworsk: a,
                                pulawy: a,
                                radom: a,
                                "rawa-maz": a,
                                rybnik: a,
                                rzeszow: a,
                                sanok: a,
                                sejny: a,
                                slask: a,
                                slupsk: a,
                                sosnowiec: a,
                                "stalowa-wola": a,
                                skoczow: a,
                                starachowice: a,
                                stargard: a,
                                suwalki: a,
                                swidnica: a,
                                swiebodzin: a,
                                swinoujscie: a,
                                szczecin: a,
                                szczytno: a,
                                tarnobrzeg: a,
                                tgory: a,
                                turek: a,
                                tychy: a,
                                ustka: a,
                                walbrzych: a,
                                warmia: a,
                                warszawa: a,
                                waw: a,
                                wegrow: a,
                                wielun: a,
                                wlocl: a,
                                wloclawek: a,
                                wodzislaw: a,
                                wolomin: a,
                                wroclaw: a,
                                zachpomor: a,
                                zagan: a,
                                zarow: a,
                                zgora: a,
                                zgorzelec: a,
                                beep: e,
                                "ecommerce-shop": e,
                                shoparena: e,
                                homesklep: e,
                                sdscloud: e,
                                unicloud: e,
                                krasnik: e,
                                leczna: e,
                                lubartow: e,
                                lublin: e,
                                poniatowa: e,
                                swidnik: e,
                                co: e,
                                art: e,
                                gliwice: e,
                                krakow: e,
                                poznan: e,
                                wroc: e,
                                zakopane: e,
                                myspreadshop: e,
                                gda: e,
                                gdansk: e,
                                gdynia: e,
                                med: e,
                                sopot: e
                            }
                        },
                        pm: {
                            $: 1,
                            succ: {
                                own: e
                            }
                        },
                        pn: {
                            $: 1,
                            succ: {
                                gov: a,
                                co: a,
                                org: a,
                                edu: a,
                                net: a
                            }
                        },
                        post: a,
                        pr: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                edu: a,
                                isla: a,
                                pro: a,
                                biz: a,
                                info: a,
                                name: a,
                                est: a,
                                prof: a,
                                ac: a
                            }
                        },
                        pro: {
                            $: 1,
                            succ: {
                                aaa: a,
                                aca: a,
                                acct: a,
                                avocat: a,
                                bar: a,
                                cpa: a,
                                eng: a,
                                jur: a,
                                law: a,
                                med: a,
                                recht: a,
                                cloudns: e,
                                dnstrace: {
                                    $: 0,
                                    succ: {
                                        bci: e
                                    }
                                },
                                barsy: e
                            }
                        },
                        ps: {
                            $: 1,
                            succ: {
                                edu: a,
                                gov: a,
                                sec: a,
                                plo: a,
                                com: a,
                                org: a,
                                net: a
                            }
                        },
                        pt: {
                            $: 1,
                            succ: {
                                net: a,
                                gov: a,
                                org: a,
                                edu: a,
                                int: a,
                                publ: a,
                                com: a,
                                nome: a,
                                blogspot: e
                            }
                        },
                        pw: {
                            $: 1,
                            succ: {
                                co: a,
                                ne: a,
                                or: a,
                                ed: a,
                                go: a,
                                belau: a,
                                cloudns: e,
                                x443: e
                            }
                        },
                        py: {
                            $: 1,
                            succ: {
                                com: a,
                                coop: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a
                            }
                        },
                        qa: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                mil: a,
                                name: a,
                                net: a,
                                org: a,
                                sch: a,
                                blogspot: e
                            }
                        },
                        re: {
                            $: 1,
                            succ: {
                                asso: a,
                                com: a,
                                nom: a,
                                blogspot: e
                            }
                        },
                        ro: {
                            $: 1,
                            succ: {
                                arts: a,
                                com: a,
                                firm: a,
                                info: a,
                                nom: a,
                                nt: a,
                                org: a,
                                rec: a,
                                store: a,
                                tm: a,
                                www: a,
                                co: e,
                                shop: e,
                                blogspot: e,
                                barsy: e
                            }
                        },
                        rs: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                edu: a,
                                gov: a,
                                in: a,
                                org: a,
                                brendly: {
                                    $: 0,
                                    succ: {
                                        shop: e
                                    }
                                },
                                blogspot: e,
                                ua: e,
                                ox: e
                            }
                        },
                        ru: {
                            $: 1,
                            succ: {
                                ac: e,
                                edu: e,
                                gov: e,
                                int: e,
                                mil: e,
                                test: e,
                                eurodir: e,
                                adygeya: e,
                                bashkiria: e,
                                bir: e,
                                cbg: e,
                                com: e,
                                dagestan: e,
                                grozny: e,
                                kalmykia: e,
                                kustanai: e,
                                marine: e,
                                mordovia: e,
                                msk: e,
                                mytis: e,
                                nalchik: e,
                                nov: e,
                                pyatigorsk: e,
                                spb: e,
                                vladikavkaz: e,
                                vladimir: e,
                                blogspot: e,
                                na4u: e,
                                mircloud: e,
                                regruhosting: f,
                                myjino: {
                                    $: 2,
                                    succ: {
                                        hosting: n,
                                        landing: n,
                                        spectrum: n,
                                        vps: n
                                    }
                                },
                                cldmail: {
                                    $: 0,
                                    succ: {
                                        hb: e
                                    }
                                },
                                mcdir: {
                                    $: 2,
                                    succ: {
                                        vps: e
                                    }
                                },
                                mcpre: e,
                                net: e,
                                org: e,
                                pp: e,
                                lk3: e,
                                ras: e
                            }
                        },
                        rw: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                coop: a,
                                gov: a,
                                mil: a,
                                net: a,
                                org: a
                            }
                        },
                        sa: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                med: a,
                                pub: a,
                                edu: a,
                                sch: a
                            }
                        },
                        sb: o,
                        sc: o,
                        sd: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                edu: a,
                                med: a,
                                tv: a,
                                gov: a,
                                info: a
                            }
                        },
                        se: {
                            $: 1,
                            succ: {
                                a: a,
                                ac: a,
                                b: a,
                                bd: a,
                                brand: a,
                                c: a,
                                d: a,
                                e: a,
                                f: a,
                                fh: a,
                                fhsk: a,
                                fhv: a,
                                g: a,
                                h: a,
                                i: a,
                                k: a,
                                komforb: a,
                                kommunalforbund: a,
                                komvux: a,
                                l: a,
                                lanbib: a,
                                m: a,
                                n: a,
                                naturbruksgymn: a,
                                o: a,
                                org: a,
                                p: a,
                                parti: a,
                                pp: a,
                                press: a,
                                r: a,
                                s: a,
                                t: a,
                                tm: a,
                                u: a,
                                w: a,
                                x: a,
                                y: a,
                                z: a,
                                com: e,
                                blogspot: e,
                                conf: e,
                                iopsys: e,
                                itcouldbewor: e,
                                myspreadshop: e,
                                paba: {
                                    $: 0,
                                    succ: {
                                        su: e
                                    }
                                }
                            }
                        },
                        sg: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                edu: a,
                                per: a,
                                blogspot: e,
                                enscaled: e
                            }
                        },
                        sh: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                gov: a,
                                org: a,
                                mil: a,
                                bip: e,
                                hashbang: e,
                                platform: {
                                    $: 0,
                                    succ: {
                                        bc: e,
                                        ent: e,
                                        eu: e,
                                        us: e
                                    }
                                },
                                now: e,
                                vxl: e,
                                wedeploy: e
                            }
                        },
                        si: {
                            $: 1,
                            succ: {
                                gitapp: e,
                                gitpage: e,
                                blogspot: e
                            }
                        },
                        sj: a,
                        sk: s,
                        sl: o,
                        sm: a,
                        sn: {
                            $: 1,
                            succ: {
                                art: a,
                                com: a,
                                edu: a,
                                gouv: a,
                                org: a,
                                perso: a,
                                univ: a,
                                blogspot: e
                            }
                        },
                        so: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                me: a,
                                net: a,
                                org: a,
                                sch: e
                            }
                        },
                        sr: a,
                        ss: {
                            $: 1,
                            succ: {
                                biz: a,
                                com: a,
                                edu: a,
                                gov: a,
                                me: a,
                                net: a,
                                org: a,
                                sch: a
                            }
                        },
                        st: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                consulado: a,
                                edu: a,
                                embaixada: a,
                                mil: a,
                                net: a,
                                org: a,
                                principe: a,
                                saotome: a,
                                store: a,
                                noho: e
                            }
                        },
                        su: {
                            $: 1,
                            succ: {
                                abkhazia: e,
                                adygeya: e,
                                aktyubinsk: e,
                                arkhangelsk: e,
                                armenia: e,
                                ashgabad: e,
                                azerbaijan: e,
                                balashov: e,
                                bashkiria: e,
                                bryansk: e,
                                bukhara: e,
                                chimkent: e,
                                dagestan: e,
                                "east-kazakhstan": e,
                                exnet: e,
                                georgia: e,
                                grozny: e,
                                ivanovo: e,
                                jambyl: e,
                                kalmykia: e,
                                kaluga: e,
                                karacol: e,
                                karaganda: e,
                                karelia: e,
                                khakassia: e,
                                krasnodar: e,
                                kurgan: e,
                                kustanai: e,
                                lenug: e,
                                mangyshlak: e,
                                mordovia: e,
                                msk: e,
                                murmansk: e,
                                nalchik: e,
                                navoi: e,
                                "north-kazakhstan": e,
                                nov: e,
                                obninsk: e,
                                penza: e,
                                pokrovsk: e,
                                sochi: e,
                                spb: e,
                                tashkent: e,
                                termez: e,
                                togliatti: e,
                                troitsk: e,
                                tselinograd: e,
                                tula: e,
                                tuva: e,
                                vladikavkaz: e,
                                vladimir: e,
                                vologda: e
                            }
                        },
                        sv: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gob: a,
                                org: a,
                                red: a
                            }
                        },
                        sx: i,
                        sy: $,
                        sz: {
                            $: 1,
                            succ: {
                                co: a,
                                ac: a,
                                org: a
                            }
                        },
                        tc: {
                            $: 1,
                            succ: {
                                ch: e,
                                me: e,
                                we: e
                            }
                        },
                        td: s,
                        tel: a,
                        tf: a,
                        tg: a,
                        th: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                go: a,
                                in: a,
                                mi: a,
                                net: a,
                                or: a,
                                online: e,
                                shop: e
                            }
                        },
                        tj: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: a,
                                com: a,
                                edu: a,
                                go: a,
                                gov: a,
                                int: a,
                                mil: a,
                                name: a,
                                net: a,
                                nic: a,
                                org: a,
                                test: a,
                                web: a
                            }
                        },
                        tk: a,
                        tl: i,
                        tm: {
                            $: 1,
                            succ: {
                                com: a,
                                co: a,
                                org: a,
                                net: a,
                                nom: a,
                                gov: a,
                                mil: a,
                                edu: a
                            }
                        },
                        tn: {
                            $: 1,
                            succ: {
                                com: a,
                                ens: a,
                                fin: a,
                                gov: a,
                                ind: a,
                                intl: a,
                                nat: a,
                                net: a,
                                org: a,
                                info: a,
                                perso: a,
                                tourism: a,
                                edunet: a,
                                rnrt: a,
                                rns: a,
                                rnu: a,
                                mincom: a,
                                agrinet: a,
                                defense: a,
                                turen: a,
                                orangecloud: e
                            }
                        },
                        to: {
                            $: 1,
                            succ: {
                                611: e,
                                com: a,
                                gov: a,
                                net: a,
                                org: a,
                                edu: a,
                                mil: a,
                                oya: e,
                                rdv: e,
                                vpnplus: e,
                                quickconnect: {
                                    $: 0,
                                    succ: {
                                        direct: e
                                    }
                                },
                                nyan: e
                            }
                        },
                        tr: {
                            $: 1,
                            succ: {
                                av: a,
                                bbs: a,
                                bel: a,
                                biz: a,
                                com: s,
                                dr: a,
                                edu: a,
                                gen: a,
                                gov: a,
                                info: a,
                                mil: a,
                                k12: a,
                                kep: a,
                                name: a,
                                net: a,
                                org: a,
                                pol: a,
                                tel: a,
                                tsk: a,
                                tv: a,
                                web: a,
                                nc: i
                            }
                        },
                        tt: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                org: a,
                                net: a,
                                biz: a,
                                info: a,
                                pro: a,
                                int: a,
                                coop: a,
                                jobs: a,
                                mobi: a,
                                travel: a,
                                museum: a,
                                aero: a,
                                name: a,
                                gov: a,
                                edu: a
                            }
                        },
                        tv: {
                            $: 1,
                            succ: {
                                dyndns: e,
                                "better-than": e,
                                "on-the-web": e,
                                "worse-than": e
                            }
                        },
                        tw: {
                            $: 1,
                            succ: {
                                edu: a,
                                gov: a,
                                mil: a,
                                com: {
                                    $: 1,
                                    succ: {
                                        mymailer: e
                                    }
                                },
                                net: a,
                                org: a,
                                idv: a,
                                game: a,
                                ebiz: a,
                                club: a,
                                "xn--zf0ao64a": a,
                                "網路": a,
                                "xn--uc0atv": a,
                                "組織": a,
                                "xn--czrw28b": a,
                                "商業": a,
                                url: e,
                                blogspot: e
                            }
                        },
                        tz: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                go: a,
                                hotel: a,
                                info: a,
                                me: a,
                                mil: a,
                                mobi: a,
                                ne: a,
                                or: a,
                                sc: a,
                                tv: a
                            }
                        },
                        ua: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                gov: a,
                                in: a,
                                net: a,
                                org: a,
                                cherkassy: a,
                                cherkasy: a,
                                chernigov: a,
                                chernihiv: a,
                                chernivtsi: a,
                                chernovtsy: a,
                                ck: a,
                                cn: a,
                                cr: a,
                                crimea: a,
                                cv: a,
                                dn: a,
                                dnepropetrovsk: a,
                                dnipropetrovsk: a,
                                donetsk: a,
                                dp: a,
                                if: a,
                                "ivano-frankivsk": a,
                                kh: a,
                                kharkiv: a,
                                kharkov: a,
                                kherson: a,
                                khmelnitskiy: a,
                                khmelnytskyi: a,
                                kiev: a,
                                kirovograd: a,
                                km: a,
                                kr: a,
                                krym: a,
                                ks: a,
                                kv: a,
                                kyiv: a,
                                lg: a,
                                lt: a,
                                lugansk: a,
                                lutsk: a,
                                lv: a,
                                lviv: a,
                                mk: a,
                                mykolaiv: a,
                                nikolaev: a,
                                od: a,
                                odesa: a,
                                odessa: a,
                                pl: a,
                                poltava: a,
                                rivne: a,
                                rovno: a,
                                rv: a,
                                sb: a,
                                sebastopol: a,
                                sevastopol: a,
                                sm: a,
                                sumy: a,
                                te: a,
                                ternopil: a,
                                uz: a,
                                uzhgorod: a,
                                vinnica: a,
                                vinnytsia: a,
                                vn: a,
                                volyn: a,
                                yalta: a,
                                zaporizhzhe: a,
                                zaporizhzhia: a,
                                zhitomir: a,
                                zhytomyr: a,
                                zp: a,
                                zt: a,
                                cc: e,
                                inf: e,
                                ltd: e,
                                cx: e,
                                biz: e,
                                co: e,
                                pp: e,
                                v: e
                            }
                        },
                        ug: {
                            $: 1,
                            succ: {
                                co: a,
                                or: a,
                                ac: a,
                                sc: a,
                                go: a,
                                ne: a,
                                com: a,
                                org: a,
                                blogspot: e
                            }
                        },
                        uk: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: {
                                    $: 1,
                                    succ: {
                                        bytemark: {
                                            $: 0,
                                            succ: {
                                                dh: e,
                                                vm: e
                                            }
                                        },
                                        blogspot: e,
                                        layershift: b,
                                        barsy: e,
                                        barsyonline: e,
                                        retrosnub: w,
                                        "nh-serv": e,
                                        "no-ip": e,
                                        wellbeingzone: e,
                                        adimo: e,
                                        myspreadshop: e,
                                        gwiddle: e
                                    }
                                },
                                gov: {
                                    $: 1,
                                    succ: {
                                        service: e,
                                        homeoffice: e
                                    }
                                },
                                ltd: a,
                                me: a,
                                net: a,
                                nhs: a,
                                org: {
                                    $: 1,
                                    succ: {
                                        glug: e,
                                        lug: e,
                                        lugs: e,
                                        affinitylottery: e,
                                        raffleentry: e,
                                        weeklylottery: e
                                    }
                                },
                                plc: a,
                                police: a,
                                sch: r,
                                conn: e,
                                copro: e,
                                hosp: e,
                                pymnt: e,
                                barsy: e
                            }
                        },
                        us: {
                            $: 1,
                            succ: {
                                dni: a,
                                fed: a,
                                isa: a,
                                kids: a,
                                nsn: a,
                                ak: E,
                                al: E,
                                ar: E,
                                as: E,
                                az: E,
                                ca: E,
                                co: E,
                                ct: E,
                                dc: E,
                                de: {
                                    $: 1,
                                    succ: {
                                        k12: a,
                                        cc: a,
                                        lib: e
                                    }
                                },
                                fl: E,
                                ga: E,
                                gu: E,
                                hi: S,
                                ia: E,
                                id: E,
                                il: E,
                                in: E,
                                ks: E,
                                ky: E,
                                la: E,
                                ma: {
                                    $: 1,
                                    succ: {
                                        k12: {
                                            $: 1,
                                            succ: {
                                                pvt: a,
                                                chtr: a,
                                                paroch: a
                                            }
                                        },
                                        cc: a,
                                        lib: a
                                    }
                                },
                                md: E,
                                me: E,
                                mi: {
                                    $: 1,
                                    succ: {
                                        k12: a,
                                        cc: a,
                                        lib: a,
                                        "ann-arbor": a,
                                        cog: a,
                                        dst: a,
                                        eaton: a,
                                        gen: a,
                                        mus: a,
                                        tec: a,
                                        washtenaw: a
                                    }
                                },
                                mn: E,
                                mo: E,
                                ms: E,
                                mt: E,
                                nc: E,
                                nd: S,
                                ne: E,
                                nh: E,
                                nj: E,
                                nm: E,
                                nv: E,
                                ny: E,
                                oh: E,
                                ok: E,
                                or: E,
                                pa: E,
                                pr: E,
                                ri: S,
                                sc: E,
                                sd: S,
                                tn: E,
                                tx: E,
                                ut: E,
                                vi: E,
                                vt: E,
                                va: E,
                                wa: E,
                                wi: E,
                                wv: {
                                    $: 1,
                                    succ: {
                                        cc: a
                                    }
                                },
                                wy: E,
                                graphox: e,
                                cloudns: e,
                                drud: e,
                                "is-by": e,
                                "land-4-sale": e,
                                "stuff-4-sale": e,
                                enscaled: {
                                    $: 0,
                                    succ: {
                                        phx: e
                                    }
                                },
                                mircloud: e,
                                freeddns: e,
                                golffan: e,
                                noip: e,
                                pointto: e,
                                platterp: e
                            }
                        },
                        uy: {
                            $: 1,
                            succ: {
                                com: s,
                                edu: a,
                                gub: a,
                                mil: a,
                                net: a,
                                org: a
                            }
                        },
                        uz: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                net: a,
                                org: a
                            }
                        },
                        va: a,
                        vc: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                mil: a,
                                edu: a,
                                gv: {
                                    $: 2,
                                    succ: {
                                        d: e
                                    }
                                },
                                "0e": e
                            }
                        },
                        ve: {
                            $: 1,
                            succ: {
                                arts: a,
                                bib: a,
                                co: a,
                                com: a,
                                e12: a,
                                edu: a,
                                firm: a,
                                gob: a,
                                gov: a,
                                info: a,
                                int: a,
                                mil: a,
                                net: a,
                                nom: a,
                                org: a,
                                rar: a,
                                rec: a,
                                store: a,
                                tec: a,
                                web: a
                            }
                        },
                        vg: {
                            $: 1,
                            succ: {
                                at: e
                            }
                        },
                        vi: {
                            $: 1,
                            succ: {
                                co: a,
                                com: a,
                                k12: a,
                                net: a,
                                org: a
                            }
                        },
                        vn: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                edu: a,
                                gov: a,
                                int: a,
                                ac: a,
                                biz: a,
                                info: a,
                                name: a,
                                pro: a,
                                health: a,
                                blogspot: e
                            }
                        },
                        vu: {
                            $: 1,
                            succ: {
                                com: a,
                                edu: a,
                                net: a,
                                org: a,
                                cn: e,
                                blog: e,
                                dev: e,
                                me: e
                            }
                        },
                        wf: a,
                        ws: {
                            $: 1,
                            succ: {
                                com: a,
                                net: a,
                                org: a,
                                gov: a,
                                edu: a,
                                advisor: n,
                                cloud66: e,
                                dyndns: e,
                                mypets: e
                            }
                        },
                        yt: {
                            $: 1,
                            succ: {
                                org: e
                            }
                        },
                        "xn--mgbaam7a8h": a,
                        "امارات": a,
                        "xn--y9a3aq": a,
                        "հայ": a,
                        "xn--54b7fta0cc": a,
                        "বাংলা": a,
                        "xn--90ae": a,
                        "бг": a,
                        "xn--mgbcpq6gpa1a": a,
                        "البحرين": a,
                        "xn--90ais": a,
                        "бел": a,
                        "xn--fiqs8s": a,
                        "中国": a,
                        "xn--fiqz9s": a,
                        "中國": a,
                        "xn--lgbbat1ad8j": a,
                        "الجزائر": a,
                        "xn--wgbh1c": a,
                        "مصر": a,
                        "xn--e1a4c": a,
                        "ею": a,
                        "xn--qxa6a": a,
                        "ευ": a,
                        "xn--mgbah1a3hjkrd": a,
                        "موريتانيا": a,
                        "xn--node": a,
                        "გე": a,
                        "xn--qxam": a,
                        "ελ": a,
                        "xn--j6w193g": {
                            $: 1,
                            succ: {
                                "xn--55qx5d": a,
                                "xn--wcvs22d": a,
                                "xn--mxtq1m": a,
                                "xn--gmqw5a": a,
                                "xn--od0alg": a,
                                "xn--uc0atv": a
                            }
                        },
                        "香港": {
                            $: 1,
                            succ: {
                                "公司": a,
                                "教育": a,
                                "政府": a,
                                "個人": a,
                                "網絡": a,
                                "組織": a
                            }
                        },
                        "xn--2scrj9c": a,
                        "ಭಾರತ": a,
                        "xn--3hcrj9c": a,
                        "ଭାରତ": a,
                        "xn--45br5cyl": a,
                        "ভাৰত": a,
                        "xn--h2breg3eve": a,
                        "भारतम्": a,
                        "xn--h2brj9c8c": a,
                        "भारोत": a,
                        "xn--mgbgu82a": a,
                        "ڀارت": a,
                        "xn--rvc1e0am3e": a,
                        "ഭാരതം": a,
                        "xn--h2brj9c": a,
                        "भारत": a,
                        "xn--mgbbh1a": a,
                        "بارت": a,
                        "xn--mgbbh1a71e": a,
                        "بھارت": a,
                        "xn--fpcrj9c3d": a,
                        "భారత్": a,
                        "xn--gecrj9c": a,
                        "ભારત": a,
                        "xn--s9brj9c": a,
                        "ਭਾਰਤ": a,
                        "xn--45brj9c": a,
                        "ভারত": a,
                        "xn--xkc2dl3a5ee0h": a,
                        "இந்தியா": a,
                        "xn--mgba3a4f16a": a,
                        "ایران": a,
                        "xn--mgba3a4fra": a,
                        "ايران": a,
                        "xn--mgbtx2b": a,
                        "عراق": a,
                        "xn--mgbayh7gpa": a,
                        "الاردن": a,
                        "xn--3e0b707e": a,
                        "한국": a,
                        "xn--80ao21a": a,
                        "қаз": a,
                        "xn--q7ce6a": a,
                        "ລາວ": a,
                        "xn--fzc2c9e2c": a,
                        "ලංකා": a,
                        "xn--xkc2al3hye2a": a,
                        "இலங்கை": a,
                        "xn--mgbc0a9azcg": a,
                        "المغرب": a,
                        "xn--d1alf": a,
                        "мкд": a,
                        "xn--l1acc": a,
                        "мон": a,
                        "xn--mix891f": a,
                        "澳門": a,
                        "xn--mix082f": a,
                        "澳门": a,
                        "xn--mgbx4cd0ab": a,
                        "مليسيا": a,
                        "xn--mgb9awbf": a,
                        "عمان": a,
                        "xn--mgbai9azgqp6j": a,
                        "پاکستان": a,
                        "xn--mgbai9a5eva00b": a,
                        "پاكستان": a,
                        "xn--ygbi2ammx": a,
                        "فلسطين": a,
                        "xn--90a3ac": {
                            $: 1,
                            succ: {
                                "xn--o1ac": a,
                                "xn--c1avg": a,
                                "xn--90azh": a,
                                "xn--d1at": a,
                                "xn--o1ach": a,
                                "xn--80au": a
                            }
                        },
                        "срб": {
                            $: 1,
                            succ: {
                                "пр": a,
                                "орг": a,
                                "обр": a,
                                "од": a,
                                "упр": a,
                                "ак": a
                            }
                        },
                        "xn--p1ai": a,
                        "рф": a,
                        "xn--wgbl6a": a,
                        "قطر": a,
                        "xn--mgberp4a5d4ar": a,
                        "السعودية": a,
                        "xn--mgberp4a5d4a87g": a,
                        "السعودیة": a,
                        "xn--mgbqly7c0a67fbc": a,
                        "السعودیۃ": a,
                        "xn--mgbqly7cvafr": a,
                        "السعوديه": a,
                        "xn--mgbpl2fh": a,
                        "سودان": a,
                        "xn--yfro4i67o": a,
                        "新加坡": a,
                        "xn--clchc0ea0b2g2a9gcd": a,
                        "சிங்கப்பூர்": a,
                        "xn--ogbpf8fl": a,
                        "سورية": a,
                        "xn--mgbtf8fl": a,
                        "سوريا": a,
                        "xn--o3cw4h": {
                            $: 1,
                            succ: {
                                "xn--12c1fe0br": a,
                                "xn--12co0c3b4eva": a,
                                "xn--h3cuzk1di": a,
                                "xn--o3cyx2a": a,
                                "xn--m3ch0j3a": a,
                                "xn--12cfi8ixb8l": a
                            }
                        },
                        "ไทย": {
                            $: 1,
                            succ: {
                                "ศึกษา": a,
                                "ธุรกิจ": a,
                                "รัฐบาล": a,
                                "ทหาร": a,
                                "เน็ต": a,
                                "องค์กร": a
                            }
                        },
                        "xn--pgbs0dh": a,
                        "تونس": a,
                        "xn--kpry57d": a,
                        "台灣": a,
                        "xn--kprw13d": a,
                        "台湾": a,
                        "xn--nnx388a": a,
                        "臺灣": a,
                        "xn--j1amh": a,
                        "укр": a,
                        "xn--mgb2ddes": a,
                        "اليمن": a,
                        xxx: a,
                        ye: $,
                        za: {
                            $: 0,
                            succ: {
                                ac: a,
                                agric: a,
                                alt: a,
                                co: s,
                                edu: a,
                                gov: a,
                                grondar: a,
                                law: a,
                                mil: a,
                                net: a,
                                ngo: a,
                                nic: a,
                                nis: a,
                                nom: a,
                                org: a,
                                school: a,
                                tm: a,
                                web: a
                            }
                        },
                        zm: {
                            $: 1,
                            succ: {
                                ac: a,
                                biz: a,
                                co: a,
                                com: a,
                                edu: a,
                                gov: a,
                                info: a,
                                mil: a,
                                net: a,
                                org: a,
                                sch: a
                            }
                        },
                        zw: {
                            $: 1,
                            succ: {
                                ac: a,
                                co: a,
                                gov: a,
                                mil: a,
                                org: a
                            }
                        },
                        aaa: a,
                        aarp: a,
                        abarth: a,
                        abb: a,
                        abbott: a,
                        abbvie: a,
                        abc: a,
                        able: a,
                        abogado: a,
                        abudhabi: a,
                        academy: {
                            $: 1,
                            succ: {
                                official: e
                            }
                        },
                        accenture: a,
                        accountant: a,
                        accountants: a,
                        aco: a,
                        actor: a,
                        adac: a,
                        ads: a,
                        adult: a,
                        aeg: a,
                        aetna: a,
                        afamilycompany: a,
                        afl: a,
                        africa: a,
                        agakhan: a,
                        agency: a,
                        aig: a,
                        airbus: a,
                        airforce: a,
                        airtel: a,
                        akdn: a,
                        alfaromeo: a,
                        alibaba: a,
                        alipay: a,
                        allfinanz: a,
                        allstate: a,
                        ally: a,
                        alsace: a,
                        alstom: a,
                        amazon: a,
                        americanexpress: a,
                        americanfamily: a,
                        amex: a,
                        amfam: a,
                        amica: a,
                        amsterdam: a,
                        analytics: a,
                        android: a,
                        anquan: a,
                        anz: a,
                        aol: a,
                        apartments: a,
                        app: {
                            $: 1,
                            succ: {
                                clerk: e,
                                clerkstage: e,
                                wnext: e,
                                platform0: e,
                                ondigitalocean: e,
                                edgecompute: e,
                                fireweb: e,
                                framer: e,
                                run: {
                                    $: 2,
                                    succ: {
                                        a: e
                                    }
                                },
                                web: e,
                                hasura: e,
                                loginline: e,
                                netlify: e,
                                developer: n,
                                noop: e,
                                northflank: n,
                                telebit: e,
                                vercel: e,
                                bookonline: e
                            }
                        },
                        apple: a,
                        aquarelle: a,
                        arab: a,
                        aramco: a,
                        archi: a,
                        army: a,
                        art: a,
                        arte: a,
                        asda: a,
                        associates: a,
                        athleta: a,
                        attorney: a,
                        auction: a,
                        audi: a,
                        audible: a,
                        audio: a,
                        auspost: a,
                        author: a,
                        auto: a,
                        autos: a,
                        avianca: a,
                        aws: a,
                        axa: a,
                        azure: a,
                        baby: a,
                        baidu: a,
                        banamex: a,
                        bananarepublic: a,
                        band: a,
                        bank: a,
                        bar: a,
                        barcelona: a,
                        barclaycard: a,
                        barclays: a,
                        barefoot: a,
                        bargains: a,
                        baseball: a,
                        basketball: {
                            $: 1,
                            succ: {
                                aus: e,
                                nz: e
                            }
                        },
                        bauhaus: a,
                        bayern: a,
                        bbc: a,
                        bbt: a,
                        bbva: a,
                        bcg: a,
                        bcn: a,
                        beats: a,
                        beauty: a,
                        beer: a,
                        bentley: a,
                        berlin: a,
                        best: a,
                        bestbuy: a,
                        bet: a,
                        bharti: a,
                        bible: a,
                        bid: a,
                        bike: a,
                        bing: a,
                        bingo: a,
                        bio: a,
                        black: a,
                        blackfriday: a,
                        blockbuster: a,
                        blog: a,
                        bloomberg: a,
                        blue: a,
                        bms: a,
                        bmw: a,
                        bnpparibas: a,
                        boats: a,
                        boehringer: a,
                        bofa: a,
                        bom: a,
                        bond: a,
                        boo: a,
                        book: a,
                        booking: a,
                        bosch: a,
                        bostik: a,
                        boston: a,
                        bot: a,
                        boutique: a,
                        box: a,
                        bradesco: a,
                        bridgestone: a,
                        broadway: a,
                        broker: a,
                        brother: a,
                        brussels: a,
                        budapest: a,
                        bugatti: a,
                        build: a,
                        builders: {
                            $: 1,
                            succ: {
                                cloudsite: e
                            }
                        },
                        business: c,
                        buy: a,
                        buzz: a,
                        bzh: a,
                        cab: a,
                        cafe: a,
                        cal: a,
                        call: a,
                        calvinklein: a,
                        cam: a,
                        camera: a,
                        camp: a,
                        cancerresearch: a,
                        canon: a,
                        capetown: a,
                        capital: a,
                        capitalone: a,
                        car: a,
                        caravan: a,
                        cards: a,
                        care: a,
                        career: a,
                        careers: a,
                        cars: a,
                        casa: {
                            $: 1,
                            succ: {
                                nabu: {
                                    $: 0,
                                    succ: {
                                        ui: e
                                    }
                                }
                            }
                        },
                        case: a,
                        cash: a,
                        casino: a,
                        catering: a,
                        catholic: a,
                        cba: a,
                        cbn: a,
                        cbre: a,
                        cbs: a,
                        center: a,
                        ceo: a,
                        cern: a,
                        cfa: a,
                        cfd: a,
                        chanel: a,
                        channel: a,
                        charity: a,
                        chase: a,
                        chat: a,
                        cheap: a,
                        chintai: a,
                        christmas: a,
                        chrome: a,
                        church: a,
                        cipriani: a,
                        circle: a,
                        cisco: a,
                        citadel: a,
                        citi: a,
                        citic: a,
                        city: a,
                        cityeats: a,
                        claims: a,
                        cleaning: a,
                        click: a,
                        clinic: a,
                        clinique: a,
                        clothing: a,
                        cloud: {
                            $: 1,
                            succ: {
                                banzai: n,
                                elementor: e,
                                statics: n,
                                axarnet: {
                                    $: 0,
                                    succ: {
                                        "es-1": e
                                    }
                                },
                                diadem: e,
                                jelastic: {
                                    $: 0,
                                    succ: {
                                        vip: e
                                    }
                                },
                                jele: e,
                                "jenv-aruba": {
                                    $: 0,
                                    succ: {
                                        aruba: {
                                            $: 0,
                                            succ: {
                                                eur: {
                                                    $: 0,
                                                    succ: {
                                                        it1: e
                                                    }
                                                }
                                            }
                                        },
                                        it1: e
                                    }
                                },
                                keliweb: {
                                    $: 2,
                                    succ: {
                                        cs: e
                                    }
                                },
                                oxa: {
                                    $: 2,
                                    succ: {
                                        tn: e,
                                        uk: e
                                    }
                                },
                                primetel: {
                                    $: 2,
                                    succ: {
                                        uk: e
                                    }
                                },
                                reclaim: {
                                    $: 0,
                                    succ: {
                                        ca: e,
                                        uk: e,
                                        us: e
                                    }
                                },
                                trendhosting: {
                                    $: 0,
                                    succ: {
                                        ch: e,
                                        de: e
                                    }
                                },
                                jotelulu: e,
                                kuleuven: e,
                                linkyard: e,
                                magentosite: n,
                                perspecta: e,
                                vapor: e,
                                "on-rancher": n,
                                sensiosite: n,
                                trafficplex: e,
                                urown: e,
                                voorloper: e
                            }
                        },
                        club: {
                            $: 1,
                            succ: {
                                cloudns: e,
                                jele: e,
                                barsy: e,
                                pony: e
                            }
                        },
                        clubmed: a,
                        coach: a,
                        codes: {
                            $: 1,
                            succ: {
                                owo: n
                            }
                        },
                        coffee: a,
                        college: a,
                        cologne: a,
                        comcast: a,
                        commbank: a,
                        community: {
                            $: 1,
                            succ: {
                                nog: e,
                                ravendb: e,
                                myforum: e
                            }
                        },
                        company: a,
                        compare: a,
                        computer: a,
                        comsec: a,
                        condos: a,
                        construction: a,
                        consulting: a,
                        contact: a,
                        contractors: a,
                        cooking: a,
                        cookingchannel: a,
                        cool: {
                            $: 1,
                            succ: {
                                elementor: e,
                                de: e
                            }
                        },
                        corsica: a,
                        country: a,
                        coupon: a,
                        coupons: a,
                        courses: a,
                        cpa: a,
                        credit: a,
                        creditcard: a,
                        creditunion: a,
                        cricket: a,
                        crown: a,
                        crs: a,
                        cruise: a,
                        cruises: a,
                        csc: a,
                        cuisinella: a,
                        cymru: a,
                        cyou: a,
                        dabur: a,
                        dad: a,
                        dance: a,
                        data: a,
                        date: a,
                        dating: a,
                        datsun: a,
                        day: a,
                        dclk: a,
                        dds: a,
                        deal: a,
                        dealer: a,
                        deals: a,
                        degree: a,
                        delivery: a,
                        dell: a,
                        deloitte: a,
                        delta: a,
                        democrat: a,
                        dental: a,
                        dentist: a,
                        desi: a,
                        design: {
                            $: 1,
                            succ: {
                                bss: e
                            }
                        },
                        dev: {
                            $: 1,
                            succ: {
                                lcl: n,
                                lclstage: n,
                                stg: n,
                                stgstage: n,
                                pages: e,
                                workers: e,
                                curv: e,
                                deno: e,
                                "deno-staging": e,
                                fly: e,
                                githubpreview: e,
                                gateway: n,
                                iserv: e,
                                loginline: e,
                                mediatech: e,
                                "platter-app": e,
                                shiftcrypto: e,
                                vercel: e,
                                webhare: n
                            }
                        },
                        dhl: a,
                        diamonds: a,
                        diet: a,
                        digital: {
                            $: 1,
                            succ: {
                                cloudapps: {
                                    $: 2,
                                    succ: {
                                        london: e
                                    }
                                }
                            }
                        },
                        direct: a,
                        directory: a,
                        discount: a,
                        discover: a,
                        dish: a,
                        diy: a,
                        dnp: a,
                        docs: a,
                        doctor: a,
                        dog: a,
                        domains: a,
                        dot: a,
                        download: a,
                        drive: a,
                        dtv: a,
                        dubai: a,
                        duck: a,
                        dunlop: a,
                        dupont: a,
                        durban: a,
                        dvag: a,
                        dvr: a,
                        earth: {
                            $: 1,
                            succ: {
                                dapps: {
                                    $: 0,
                                    succ: {
                                        "*": e,
                                        bzz: n
                                    }
                                }
                            }
                        },
                        eat: a,
                        eco: a,
                        edeka: a,
                        education: c,
                        email: a,
                        emerck: a,
                        energy: a,
                        engineer: a,
                        engineering: a,
                        enterprises: a,
                        epson: a,
                        equipment: a,
                        ericsson: a,
                        erni: a,
                        esq: a,
                        estate: {
                            $: 1,
                            succ: {
                                compute: n
                            }
                        },
                        etisalat: a,
                        eurovision: a,
                        eus: {
                            $: 1,
                            succ: {
                                party: y
                            }
                        },
                        events: c,
                        exchange: a,
                        expert: a,
                        exposed: a,
                        express: a,
                        extraspace: a,
                        fage: a,
                        fail: a,
                        fairwinds: a,
                        faith: v,
                        family: a,
                        fan: a,
                        fans: a,
                        farm: {
                            $: 1,
                            succ: {
                                storj: e
                            }
                        },
                        farmers: a,
                        fashion: {
                            $: 1,
                            succ: {
                                of: e
                            }
                        },
                        fast: a,
                        fedex: a,
                        feedback: a,
                        ferrari: a,
                        ferrero: a,
                        fiat: a,
                        fidelity: a,
                        fido: a,
                        film: a,
                        final: a,
                        finance: a,
                        financial: c,
                        fire: a,
                        firestone: a,
                        firmdale: a,
                        fish: a,
                        fishing: a,
                        fit: a,
                        fitness: a,
                        flickr: a,
                        flights: a,
                        flir: a,
                        florist: a,
                        flowers: a,
                        fly: a,
                        foo: a,
                        food: a,
                        foodnetwork: a,
                        football: a,
                        ford: a,
                        forex: a,
                        forsale: a,
                        forum: a,
                        foundation: a,
                        fox: a,
                        free: a,
                        fresenius: a,
                        frl: a,
                        frogans: a,
                        frontdoor: a,
                        frontier: a,
                        ftr: a,
                        fujitsu: a,
                        fun: a,
                        fund: a,
                        furniture: a,
                        futbol: a,
                        fyi: a,
                        gal: a,
                        gallery: a,
                        gallo: a,
                        gallup: a,
                        game: a,
                        games: a,
                        gap: a,
                        garden: a,
                        gay: a,
                        gbiz: a,
                        gdn: {
                            $: 1,
                            succ: {
                                cnpy: e
                            }
                        },
                        gea: a,
                        gent: a,
                        genting: a,
                        george: a,
                        ggee: a,
                        gift: a,
                        gifts: a,
                        gives: a,
                        giving: a,
                        glade: a,
                        glass: a,
                        gle: a,
                        global: a,
                        globo: a,
                        gmail: a,
                        gmbh: a,
                        gmo: a,
                        gmx: a,
                        godaddy: a,
                        gold: a,
                        goldpoint: a,
                        golf: a,
                        goo: a,
                        goodyear: a,
                        goog: {
                            $: 1,
                            succ: {
                                cloud: e,
                                translate: e
                            }
                        },
                        google: a,
                        gop: a,
                        got: a,
                        grainger: a,
                        graphics: a,
                        gratis: a,
                        green: a,
                        gripe: a,
                        grocery: a,
                        group: {
                            $: 1,
                            succ: {
                                discourse: e
                            }
                        },
                        guardian: a,
                        gucci: a,
                        guge: a,
                        guide: a,
                        guitars: a,
                        guru: a,
                        hair: a,
                        hamburg: a,
                        hangout: a,
                        haus: a,
                        hbo: a,
                        hdfc: a,
                        hdfcbank: a,
                        health: {
                            $: 1,
                            succ: {
                                hra: e
                            }
                        },
                        healthcare: a,
                        help: a,
                        helsinki: a,
                        here: a,
                        hermes: a,
                        hgtv: a,
                        hiphop: a,
                        hisamitsu: a,
                        hitachi: a,
                        hiv: a,
                        hkt: a,
                        hockey: a,
                        holdings: a,
                        holiday: a,
                        homedepot: a,
                        homegoods: a,
                        homes: a,
                        homesense: a,
                        honda: a,
                        horse: a,
                        hospital: a,
                        host: {
                            $: 1,
                            succ: {
                                cloudaccess: e,
                                freesite: e,
                                fastvps: e,
                                myfast: e,
                                tempurl: e,
                                wpmudev: e,
                                jele: e,
                                mircloud: e,
                                pcloud: e,
                                half: e
                            }
                        },
                        hosting: {
                            $: 1,
                            succ: {
                                opencraft: e
                            }
                        },
                        hot: a,
                        hoteles: a,
                        hotels: a,
                        hotmail: a,
                        house: a,
                        how: a,
                        hsbc: a,
                        hughes: a,
                        hyatt: a,
                        hyundai: a,
                        ibm: a,
                        icbc: a,
                        ice: a,
                        icu: a,
                        ieee: a,
                        ifm: a,
                        ikano: a,
                        imamat: a,
                        imdb: a,
                        immo: a,
                        immobilien: a,
                        inc: a,
                        industries: a,
                        infiniti: a,
                        ing: a,
                        ink: a,
                        institute: a,
                        insurance: a,
                        insure: a,
                        international: a,
                        intuit: a,
                        investments: a,
                        ipiranga: a,
                        irish: a,
                        ismaili: a,
                        ist: a,
                        istanbul: a,
                        itau: a,
                        itv: a,
                        jaguar: a,
                        java: a,
                        jcb: a,
                        jeep: a,
                        jetzt: a,
                        jewelry: a,
                        jio: a,
                        jll: a,
                        jmp: a,
                        jnj: a,
                        joburg: a,
                        jot: a,
                        joy: a,
                        jpmorgan: a,
                        jprs: a,
                        juegos: a,
                        juniper: a,
                        kaufen: a,
                        kddi: a,
                        kerryhotels: a,
                        kerrylogistics: a,
                        kerryproperties: a,
                        kfh: a,
                        kia: a,
                        kids: a,
                        kim: a,
                        kinder: a,
                        kindle: a,
                        kitchen: a,
                        kiwi: a,
                        koeln: a,
                        komatsu: a,
                        kosher: a,
                        kpmg: a,
                        kpn: a,
                        krd: {
                            $: 1,
                            succ: {
                                co: e,
                                edu: e
                            }
                        },
                        kred: a,
                        kuokgroup: a,
                        kyoto: a,
                        lacaixa: a,
                        lamborghini: a,
                        lamer: a,
                        lancaster: a,
                        lancia: a,
                        land: {
                            $: 1,
                            succ: {
                                static: {
                                    $: 2,
                                    succ: {
                                        dev: e,
                                        sites: e
                                    }
                                }
                            }
                        },
                        landrover: a,
                        lanxess: a,
                        lasalle: a,
                        lat: a,
                        latino: a,
                        latrobe: a,
                        law: a,
                        lawyer: a,
                        lds: a,
                        lease: a,
                        leclerc: a,
                        lefrak: a,
                        legal: a,
                        lego: a,
                        lexus: a,
                        lgbt: a,
                        lidl: a,
                        life: a,
                        lifeinsurance: a,
                        lifestyle: a,
                        lighting: a,
                        like: a,
                        lilly: a,
                        limited: a,
                        limo: a,
                        lincoln: a,
                        linde: a,
                        link: {
                            $: 1,
                            succ: {
                                cyon: e,
                                mypep: e,
                                dweb: n
                            }
                        },
                        lipsy: a,
                        live: {
                            $: 1,
                            succ: {
                                hlx: e
                            }
                        },
                        living: a,
                        lixil: a,
                        llc: a,
                        llp: a,
                        loan: a,
                        loans: a,
                        locker: a,
                        locus: a,
                        loft: a,
                        lol: {
                            $: 1,
                            succ: {
                                omg: e
                            }
                        },
                        london: {
                            $: 1,
                            succ: {
                                in: e,
                                of: e
                            }
                        },
                        lotte: a,
                        lotto: a,
                        love: a,
                        lpl: a,
                        lplfinancial: a,
                        ltd: a,
                        ltda: a,
                        lundbeck: a,
                        luxe: a,
                        luxury: a,
                        macys: a,
                        madrid: a,
                        maif: a,
                        maison: a,
                        makeup: a,
                        man: a,
                        management: {
                            $: 1,
                            succ: {
                                router: e
                            }
                        },
                        mango: a,
                        map: a,
                        market: a,
                        marketing: {
                            $: 1,
                            succ: {
                                from: e,
                                with: e
                            }
                        },
                        markets: a,
                        marriott: a,
                        marshalls: a,
                        maserati: a,
                        mattel: a,
                        mba: a,
                        mckinsey: a,
                        med: a,
                        media: a,
                        meet: a,
                        melbourne: a,
                        meme: a,
                        memorial: a,
                        men: {
                            $: 1,
                            succ: {
                                for: e,
                                repair: e
                            }
                        },
                        menu: A,
                        merckmsd: a,
                        miami: a,
                        microsoft: a,
                        mini: a,
                        mint: a,
                        mit: a,
                        mitsubishi: a,
                        mlb: a,
                        mls: a,
                        mma: a,
                        mobile: a,
                        moda: a,
                        moe: a,
                        moi: a,
                        mom: {
                            $: 1,
                            succ: {
                                and: e,
                                for: e
                            }
                        },
                        monash: a,
                        money: a,
                        monster: a,
                        mormon: a,
                        mortgage: a,
                        moscow: a,
                        moto: a,
                        motorcycles: a,
                        mov: a,
                        movie: a,
                        msd: a,
                        mtn: a,
                        mtr: a,
                        music: a,
                        mutual: a,
                        nab: a,
                        nagoya: a,
                        natura: a,
                        navy: a,
                        nba: a,
                        nec: a,
                        netbank: a,
                        netflix: a,
                        network: {
                            $: 1,
                            succ: {
                                alces: n,
                                co: e,
                                arvo: e,
                                azimuth: e,
                                tlon: e
                            }
                        },
                        neustar: a,
                        new: a,
                        news: {
                            $: 1,
                            succ: {
                                noticeable: e
                            }
                        },
                        next: a,
                        nextdirect: a,
                        nexus: a,
                        nfl: a,
                        ngo: a,
                        nhk: a,
                        nico: a,
                        nike: a,
                        nikon: a,
                        ninja: a,
                        nissan: a,
                        nissay: a,
                        nokia: a,
                        northwesternmutual: a,
                        norton: a,
                        now: a,
                        nowruz: a,
                        nowtv: a,
                        nra: a,
                        nrw: a,
                        ntt: a,
                        nyc: a,
                        obi: a,
                        observer: a,
                        off: a,
                        office: a,
                        okinawa: a,
                        olayan: a,
                        olayangroup: a,
                        oldnavy: a,
                        ollo: a,
                        omega: a,
                        one: {
                            $: 1,
                            succ: {
                                onred: {
                                    $: 2,
                                    succ: {
                                        staging: e
                                    }
                                },
                                service: e,
                                for: e,
                                under: e,
                                homelink: e
                            }
                        },
                        ong: a,
                        onl: a,
                        online: {
                            $: 1,
                            succ: {
                                eero: e,
                                "eero-stage": e,
                                barsy: e
                            }
                        },
                        ooo: a,
                        open: a,
                        oracle: a,
                        orange: a,
                        organic: a,
                        origins: a,
                        osaka: a,
                        otsuka: a,
                        ott: a,
                        ovh: {
                            $: 1,
                            succ: {
                                nerdpol: e
                            }
                        },
                        page: {
                            $: 1,
                            succ: {
                                hlx: e,
                                hlx3: e,
                                pdns: e,
                                plesk: e,
                                prvcy: e,
                                magnet: e
                            }
                        },
                        panasonic: a,
                        paris: a,
                        pars: a,
                        partners: a,
                        parts: a,
                        party: v,
                        passagens: a,
                        pay: a,
                        pccw: a,
                        pet: a,
                        pfizer: a,
                        pharmacy: a,
                        phd: a,
                        philips: a,
                        phone: a,
                        photo: a,
                        photography: a,
                        photos: a,
                        physio: a,
                        pics: a,
                        pictet: a,
                        pictures: {
                            $: 1,
                            succ: {
                                1337: e
                            }
                        },
                        pid: a,
                        pin: a,
                        ping: a,
                        pink: a,
                        pioneer: a,
                        pizza: a,
                        place: c,
                        play: a,
                        playstation: a,
                        plumbing: a,
                        plus: a,
                        pnc: a,
                        pohl: a,
                        poker: a,
                        politie: a,
                        porn: {
                            $: 1,
                            succ: {
                                indie: e
                            }
                        },
                        pramerica: a,
                        praxi: a,
                        press: a,
                        prime: a,
                        prod: a,
                        productions: a,
                        prof: a,
                        progressive: a,
                        promo: a,
                        properties: a,
                        property: a,
                        protection: a,
                        pru: a,
                        prudential: a,
                        pub: A,
                        pwc: a,
                        qpon: a,
                        quebec: a,
                        quest: a,
                        qvc: a,
                        racing: a,
                        radio: a,
                        raid: a,
                        read: a,
                        realestate: a,
                        realtor: a,
                        realty: a,
                        recipes: a,
                        red: a,
                        redstone: a,
                        redumbrella: a,
                        rehab: a,
                        reise: a,
                        reisen: a,
                        reit: a,
                        reliance: a,
                        ren: a,
                        rent: a,
                        rentals: a,
                        repair: a,
                        report: a,
                        republican: a,
                        rest: a,
                        restaurant: a,
                        review: v,
                        reviews: a,
                        rexroth: a,
                        rich: a,
                        richardli: a,
                        ricoh: a,
                        ril: a,
                        rio: a,
                        rip: {
                            $: 1,
                            succ: {
                                clan: e
                            }
                        },
                        rmit: a,
                        rocher: a,
                        rocks: {
                            $: 1,
                            succ: {
                                myddns: e,
                                "lima-city": e,
                                webspace: e
                            }
                        },
                        rodeo: a,
                        rogers: a,
                        room: a,
                        rsvp: a,
                        rugby: a,
                        ruhr: a,
                        run: {
                            $: 1,
                            succ: {
                                hs: e,
                                development: e,
                                ravendb: e,
                                servers: e,
                                code: n,
                                repl: e
                            }
                        },
                        rwe: a,
                        ryukyu: a,
                        saarland: a,
                        safe: a,
                        safety: a,
                        sakura: a,
                        sale: {
                            $: 1,
                            succ: {
                                for: e
                            }
                        },
                        salon: a,
                        samsclub: a,
                        samsung: a,
                        sandvik: a,
                        sandvikcoromant: a,
                        sanofi: a,
                        sap: a,
                        sarl: a,
                        sas: a,
                        save: a,
                        saxo: a,
                        sbi: a,
                        sbs: a,
                        sca: a,
                        scb: a,
                        schaeffler: a,
                        schmidt: a,
                        scholarships: a,
                        school: a,
                        schule: a,
                        schwarz: a,
                        science: v,
                        scjohnson: a,
                        scot: {
                            $: 1,
                            succ: {
                                edu: e,
                                gov: {
                                    $: 2,
                                    succ: {
                                        service: e
                                    }
                                }
                            }
                        },
                        search: a,
                        seat: a,
                        secure: a,
                        security: a,
                        seek: a,
                        select: a,
                        sener: a,
                        services: {
                            $: 1,
                            succ: {
                                loginline: e
                            }
                        },
                        ses: a,
                        seven: a,
                        sew: a,
                        sex: a,
                        sexy: a,
                        sfr: a,
                        shangrila: a,
                        sharp: a,
                        shaw: a,
                        shell: a,
                        shia: a,
                        shiksha: a,
                        shoes: a,
                        shop: A,
                        shopping: a,
                        shouji: a,
                        show: a,
                        showtime: a,
                        silk: a,
                        sina: a,
                        singles: a,
                        site: {
                            $: 1,
                            succ: {
                                cloudera: n,
                                cyon: e,
                                fnwk: e,
                                folionetwork: e,
                                fastvps: e,
                                jele: e,
                                lelux: e,
                                loginline: e,
                                barsy: e,
                                mintere: e,
                                omniwe: e,
                                opensocial: e,
                                platformsh: n,
                                tst: n,
                                byen: e,
                                srht: e,
                                novecore: e
                            }
                        },
                        ski: a,
                        skin: a,
                        sky: a,
                        skype: a,
                        sling: a,
                        smart: a,
                        smile: a,
                        sncf: a,
                        soccer: a,
                        social: a,
                        softbank: a,
                        software: a,
                        sohu: a,
                        solar: a,
                        solutions: {
                            $: 1,
                            succ: {
                                diher: n
                            }
                        },
                        song: a,
                        sony: a,
                        soy: a,
                        spa: a,
                        space: {
                            $: 1,
                            succ: {
                                myfast: e,
                                uber: e,
                                xs4all: e
                            }
                        },
                        sport: a,
                        spot: a,
                        srl: a,
                        stada: a,
                        staples: a,
                        star: a,
                        statebank: a,
                        statefarm: a,
                        stc: a,
                        stcgroup: a,
                        stockholm: a,
                        storage: a,
                        store: {
                            $: 1,
                            succ: {
                                sellfy: e,
                                shopware: e,
                                storebase: e
                            }
                        },
                        stream: a,
                        studio: a,
                        study: a,
                        style: a,
                        sucks: a,
                        supplies: a,
                        supply: a,
                        support: A,
                        surf: a,
                        surgery: a,
                        suzuki: a,
                        swatch: a,
                        swiftcover: a,
                        swiss: a,
                        sydney: a,
                        systems: {
                            $: 1,
                            succ: {
                                knightpoint: e
                            }
                        },
                        tab: a,
                        taipei: a,
                        talk: a,
                        taobao: a,
                        target: a,
                        tatamotors: a,
                        tatar: a,
                        tattoo: a,
                        tax: a,
                        taxi: a,
                        tci: a,
                        tdk: a,
                        team: {
                            $: 1,
                            succ: {
                                discourse: e,
                                jelastic: e
                            }
                        },
                        tech: a,
                        technology: c,
                        temasek: a,
                        tennis: a,
                        teva: a,
                        thd: a,
                        theater: a,
                        theatre: a,
                        tiaa: a,
                        tickets: a,
                        tienda: a,
                        tiffany: a,
                        tips: a,
                        tires: a,
                        tirol: a,
                        tjmaxx: a,
                        tjx: a,
                        tkmaxx: a,
                        tmall: a,
                        today: a,
                        tokyo: a,
                        tools: a,
                        top: {
                            $: 1,
                            succ: {
                                "now-dns": e,
                                ntdll: e
                            }
                        },
                        toray: a,
                        toshiba: a,
                        total: a,
                        tours: a,
                        town: a,
                        toyota: a,
                        toys: a,
                        trade: v,
                        trading: a,
                        training: a,
                        travel: a,
                        travelchannel: a,
                        travelers: a,
                        travelersinsurance: a,
                        trust: a,
                        trv: a,
                        tube: a,
                        tui: a,
                        tunes: a,
                        tushu: a,
                        tvs: a,
                        ubank: a,
                        ubs: a,
                        unicom: a,
                        university: a,
                        uno: a,
                        uol: a,
                        ups: a,
                        vacations: a,
                        vana: a,
                        vanguard: a,
                        vegas: a,
                        ventures: a,
                        verisign: a,
                        versicherung: a,
                        vet: a,
                        viajes: a,
                        video: a,
                        vig: a,
                        viking: a,
                        villas: a,
                        vin: a,
                        vip: a,
                        virgin: a,
                        visa: a,
                        vision: a,
                        viva: a,
                        vivo: a,
                        vlaanderen: a,
                        vodka: a,
                        volkswagen: a,
                        volvo: a,
                        vote: a,
                        voting: a,
                        voto: a,
                        voyage: a,
                        vuelos: a,
                        wales: a,
                        walmart: a,
                        walter: a,
                        wang: a,
                        wanggou: a,
                        watch: a,
                        watches: a,
                        weather: a,
                        weatherchannel: a,
                        webcam: a,
                        weber: a,
                        website: a,
                        wedding: a,
                        weibo: a,
                        weir: a,
                        whoswho: a,
                        wien: a,
                        wiki: a,
                        williamhill: a,
                        win: {
                            $: 1,
                            succ: {
                                that: e
                            }
                        },
                        windows: a,
                        wine: a,
                        winners: a,
                        wme: a,
                        wolterskluwer: a,
                        woodside: a,
                        work: {
                            $: 1,
                            succ: {
                                from: e,
                                to: e
                            }
                        },
                        works: a,
                        world: a,
                        wow: a,
                        wtc: a,
                        wtf: a,
                        xbox: a,
                        xerox: a,
                        xfinity: a,
                        xihuan: a,
                        xin: a,
                        "xn--11b4c3d": a,
                        "कॉम": a,
                        "xn--1ck2e1b": a,
                        "セール": a,
                        "xn--1qqw23a": a,
                        "佛山": a,
                        "xn--30rr7y": a,
                        "慈善": a,
                        "xn--3bst00m": a,
                        "集团": a,
                        "xn--3ds443g": a,
                        "在线": a,
                        "xn--3oq18vl8pn36a": a,
                        "大众汽车": a,
                        "xn--3pxu8k": a,
                        "点看": a,
                        "xn--42c2d9a": a,
                        "คอม": a,
                        "xn--45q11c": a,
                        "八卦": a,
                        "xn--4gbrim": a,
                        "موقع": a,
                        "xn--55qw42g": a,
                        "公益": a,
                        "xn--55qx5d": a,
                        "公司": a,
                        "xn--5su34j936bgsg": a,
                        "香格里拉": a,
                        "xn--5tzm5g": a,
                        "网站": a,
                        "xn--6frz82g": a,
                        "移动": a,
                        "xn--6qq986b3xl": a,
                        "我爱你": a,
                        "xn--80adxhks": a,
                        "москва": a,
                        "xn--80aqecdr1a": a,
                        "католик": a,
                        "xn--80asehdb": a,
                        "онлайн": a,
                        "xn--80aswg": a,
                        "сайт": a,
                        "xn--8y0a063a": a,
                        "联通": a,
                        "xn--9dbq2a": a,
                        "קום": a,
                        "xn--9et52u": a,
                        "时尚": a,
                        "xn--9krt00a": a,
                        "微博": a,
                        "xn--b4w605ferd": a,
                        "淡马锡": a,
                        "xn--bck1b9a5dre4c": a,
                        "ファッション": a,
                        "xn--c1avg": a,
                        "орг": a,
                        "xn--c2br7g": a,
                        "नेट": a,
                        "xn--cck2b3b": a,
                        "ストア": a,
                        "xn--cckwcxetd": a,
                        "アマゾン": a,
                        "xn--cg4bki": a,
                        "삼성": a,
                        "xn--czr694b": a,
                        "商标": a,
                        "xn--czrs0t": a,
                        "商店": a,
                        "xn--czru2d": a,
                        "商城": a,
                        "xn--d1acj3b": a,
                        "дети": a,
                        "xn--eckvdtc9d": a,
                        "ポイント": a,
                        "xn--efvy88h": a,
                        "新闻": a,
                        "xn--fct429k": a,
                        "家電": a,
                        "xn--fhbei": a,
                        "كوم": a,
                        "xn--fiq228c5hs": a,
                        "中文网": a,
                        "xn--fiq64b": a,
                        "中信": a,
                        "xn--fjq720a": a,
                        "娱乐": a,
                        "xn--flw351e": a,
                        "谷歌": a,
                        "xn--fzys8d69uvgm": a,
                        "電訊盈科": a,
                        "xn--g2xx48c": a,
                        "购物": a,
                        "xn--gckr3f0f": a,
                        "クラウド": a,
                        "xn--gk3at1e": a,
                        "通販": a,
                        "xn--hxt814e": a,
                        "网店": a,
                        "xn--i1b6b1a6a2e": a,
                        "संगठन": a,
                        "xn--imr513n": a,
                        "餐厅": a,
                        "xn--io0a7i": a,
                        "网络": a,
                        "xn--j1aef": a,
                        "ком": a,
                        "xn--jlq480n2rg": a,
                        "亚马逊": a,
                        "xn--jlq61u9w7b": a,
                        "诺基亚": a,
                        "xn--jvr189m": a,
                        "食品": a,
                        "xn--kcrx77d1x4a": a,
                        "飞利浦": a,
                        "xn--kput3i": a,
                        "手机": a,
                        "xn--mgba3a3ejt": a,
                        "ارامكو": a,
                        "xn--mgba7c0bbn0a": a,
                        "العليان": a,
                        "xn--mgbaakc7dvf": a,
                        "اتصالات": a,
                        "xn--mgbab2bd": a,
                        "بازار": a,
                        "xn--mgbca7dzdo": a,
                        "ابوظبي": a,
                        "xn--mgbi4ecexp": a,
                        "كاثوليك": a,
                        "xn--mgbt3dhd": a,
                        "همراه": a,
                        "xn--mk1bu44c": a,
                        "닷컴": a,
                        "xn--mxtq1m": a,
                        "政府": a,
                        "xn--ngbc5azd": a,
                        "شبكة": a,
                        "xn--ngbe9e0a": a,
                        "بيتك": a,
                        "xn--ngbrx": a,
                        "عرب": a,
                        "xn--nqv7f": a,
                        "机构": a,
                        "xn--nqv7fs00ema": a,
                        "组织机构": a,
                        "xn--nyqy26a": a,
                        "健康": a,
                        "xn--otu796d": a,
                        "招聘": a,
                        "xn--p1acf": {
                            $: 1,
                            succ: {
                                "xn--90amc": e,
                                "xn--j1aef": e,
                                "xn--j1ael8b": e,
                                "xn--h1ahn": e,
                                "xn--j1adp": e,
                                "xn--c1avg": e,
                                "xn--80aaa0cvac": e,
                                "xn--h1aliz": e,
                                "xn--90a1af": e,
                                "xn--41a": e
                            }
                        },
                        "рус": {
                            $: 1,
                            succ: {
                                "биз": e,
                                "ком": e,
                                "крым": e,
                                "мир": e,
                                "мск": e,
                                "орг": e,
                                "самара": e,
                                "сочи": e,
                                "спб": e,
                                "я": e
                            }
                        },
                        "xn--pssy2u": a,
                        "大拿": a,
                        "xn--q9jyb4c": a,
                        "みんな": a,
                        "xn--qcka1pmc": a,
                        "グーグル": a,
                        "xn--rhqv96g": a,
                        "世界": a,
                        "xn--rovu88b": a,
                        "書籍": a,
                        "xn--ses554g": a,
                        "网址": a,
                        "xn--t60b56a": a,
                        "닷넷": a,
                        "xn--tckwe": a,
                        "コム": a,
                        "xn--tiq49xqyj": a,
                        "天主教": a,
                        "xn--unup4y": a,
                        "游戏": a,
                        "xn--vermgensberater-ctb": a,
                        "vermögensberater": a,
                        "xn--vermgensberatung-pwb": a,
                        "vermögensberatung": a,
                        "xn--vhquv": a,
                        "企业": a,
                        "xn--vuq861b": a,
                        "信息": a,
                        "xn--w4r85el8fhu5dnra": a,
                        "嘉里大酒店": a,
                        "xn--w4rs40l": a,
                        "嘉里": a,
                        "xn--xhq521b": a,
                        "广东": a,
                        "xn--zfr164b": a,
                        "政务": a,
                        xyz: {
                            $: 1,
                            succ: {
                                blogsite: e,
                                localzone: e,
                                crafting: e,
                                zapto: e,
                                telebit: n
                            }
                        },
                        yachts: a,
                        yahoo: a,
                        yamaxun: a,
                        yandex: a,
                        yodobashi: a,
                        yoga: a,
                        yokohama: a,
                        you: a,
                        youtube: a,
                        yun: a,
                        zappos: a,
                        zara: a,
                        zero: a,
                        zip: a,
                        zone: {
                            $: 1,
                            succ: {
                                cloud66: e,
                                hs: e,
                                triton: n,
                                lima: e
                            }
                        },
                        zuerich: a
                    }
                }
            }();

        function v(a, e, o, n) {
            let s = null,
                i = e;
            for (; void 0 !== i && (0 != (i.$ & n) && (s = {
                    index: o + 1,
                    isIcann: 1 === i.$,
                    isPrivate: 2 === i.$
                }), -1 !== o);) {
                const e = i.succ;
                i = e && (e[a[o]] || e["*"]), o -= 1
            }
            return s
        }

        function x(a, e, o) {
            if (!0 === function(a, e, o) {
                    if (!1 === e.allowPrivateDomains && a.length > 3) {
                        const e = a.length - 1,
                            n = a.charCodeAt(e),
                            s = a.charCodeAt(e - 1),
                            i = a.charCodeAt(e - 2),
                            r = a.charCodeAt(e - 3);
                        if (109 === n && 111 === s && 99 === i && 46 === r) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "com", !0;
                        if (103 === n && 114 === s && 111 === i && 46 === r) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "org", !0;
                        if (117 === n && 100 === s && 101 === i && 46 === r) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "edu", !0;
                        if (118 === n && 111 === s && 103 === i && 46 === r) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "gov", !0;
                        if (116 === n && 101 === s && 110 === i && 46 === r) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "net", !0;
                        if (101 === n && 100 === s && 46 === i) return o.isIcann = !0, o.isPrivate = !1, o.publicSuffix = "de", !0
                    }
                    return !1
                }(a, e, o)) return;
            const n = a.split("."),
                s = (!0 === e.allowPrivateDomains ? 2 : 0) | (!0 === e.allowIcannDomains ? 1 : 0),
                i = v(n, f, n.length - 1, s);
            if (null !== i) return o.isIcann = i.isIcann, o.isPrivate = i.isPrivate, void(o.publicSuffix = n.slice(i.index + 1).join("."));
            const r = v(n, y, n.length - 1, s);
            if (null !== r) return o.isIcann = r.isIcann, o.isPrivate = r.isPrivate, void(o.publicSuffix = n.slice(r.index).join("."));
            o.isIcann = !1, o.isPrivate = !1, o.publicSuffix = n[n.length - 1]
        }

        function w(a, e = {}) {
            return b(a, 5, x, e, {
                domain: null,
                domainWithoutSuffix: null,
                hostname: null,
                isIcann: null,
                isIp: null,
                isPrivate: null,
                publicSuffix: null,
                subdomain: null
            })
        }
        var $ = function(a) {
                if (null != a) return w(a).domain
            },
            j = function(a) {
                if (null == a) return [];
                var e = w(a);
                return e.subdomain ? e.subdomain.split(".").map((function(a, o, n) {
                    return "".concat(n.slice(o).join("."), ".").concat(e.domain)
                })) : []
            };

        function z(a) {
            return z = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
                return typeof a
            } : function(a) {
                return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
            }, z(a)
        }

        function A(a, e) {
            var o = "undefined" != typeof Symbol && a[Symbol.iterator] || a["@@iterator"];
            if (!o) {
                if (Array.isArray(a) || (o = function(a, e) {
                        if (!a) return;
                        if ("string" == typeof a) return q(a, e);
                        var o = Object.prototype.toString.call(a).slice(8, -1);
                        "Object" === o && a.constructor && (o = a.constructor.name);
                        if ("Map" === o || "Set" === o) return Array.from(a);
                        if ("Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)) return q(a, e)
                    }(a)) || e && a && "number" == typeof a.length) {
                    o && (a = o);
                    var n = 0,
                        s = function() {};
                    return {
                        s: s,
                        n: function() {
                            return n >= a.length ? {
                                done: !0
                            } : {
                                done: !1,
                                value: a[n++]
                            }
                        },
                        e: function(a) {
                            throw a
                        },
                        f: s
                    }
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }
            var i, r = !0,
                t = !1;
            return {
                s: function() {
                    o = o.call(a)
                },
                n: function() {
                    var a = o.next();
                    return r = a.done, a
                },
                e: function(a) {
                    t = !0, i = a
                },
                f: function() {
                    try {
                        r || null == o.return || o.return()
                    } finally {
                        if (t) throw i
                    }
                }
            }
        }

        function q(a, e) {
            (null == e || e > a.length) && (e = a.length);
            for (var o = 0, n = new Array(e); o < e; o++) n[o] = a[o];
            return n
        }
        var C = function(a, e, o) {
            var n, s, i = null !== (n = a.documentUrl) && void 0 !== n ? n : a.initiator,
                r = $(i),
                t = j(i).concat([r]),
                c = $(a.url),
                u = j(a.url).concat([c]);
            if (r === c) return !1;
            if (Array.isArray(o) && o.includes(r)) return !1;
            var l, m = A(u);
            try {
                for (m.s(); !(l = m.n()).done;) {
                    var g = l.value;
                    if (e[g]) {
                        s = e[g];
                        break
                    }
                }
            } catch (a) {
                m.e(a)
            } finally {
                m.f()
            }
            if (void 0 === s) return !1;
            if (void 0 === s.rules || !Array.isArray(s.rules) || Array.isArray(s.rules) && 0 === s.rules.length) return "block" === s.default;
            var d, h = !1,
                k = A(s.rules);
            try {
                var p = function() {
                    var e, o, n, s, i, r, c, u, l, m, g, k, p = d.value;
                    if (!a.url.match(p.rule)) return "continue";
                    if (h = !0, !(null !== (e = p.options) && void 0 !== e && e.domains || null !== (o = p.options) && void 0 !== o && o.types || null !== (n = p.exceptions) && void 0 !== n && n.domains || null !== (s = p.exceptions) && void 0 !== s && s.types)) return {
                        v: !0
                    };
                    var b, f, y = t.some((function(a) {
                            var e, o, n;
                            return null === (e = p.options) || void 0 === e || null === (o = e.domains) || void 0 === o || null === (n = o.includes) || void 0 === n ? void 0 : n.call(o, a)
                        })),
                        v = null === (i = p.options) || void 0 === i || null === (r = i.types) || void 0 === r || null === (c = r.includes) || void 0 === c ? void 0 : c.call(r, a.type),
                        x = t.some((function(a) {
                            var e, o, n;
                            return null === (e = p.exceptions) || void 0 === e || null === (o = e.domains) || void 0 === o || null === (n = o.includes) || void 0 === n ? void 0 : n.call(o, a)
                        })),
                        w = null === (u = p.exceptions) || void 0 === u || null === (l = u.types) || void 0 === l || null === (m = l.includes) || void 0 === m ? void 0 : m.call(l, a.type);
                    if ((void 0 !== (null === (g = p.options) || void 0 === g ? void 0 : g.domains) || void 0 !== (null === (k = p.options) || void 0 === k ? void 0 : k.types)) && !(void 0 !== (null === (b = p.options) || void 0 === b ? void 0 : b.domains) && !1 !== y || void 0 !== (null === (f = p.options) || void 0 === f ? void 0 : f.types) && !1 !== v)) return "continue";
                    return !0 === x || !0 === w ? "continue" : {
                        v: !0
                    }
                };
                for (k.s(); !(d = k.n()).done;) {
                    var b = p();
                    if ("continue" !== b && "object" === z(b)) return b.v
                }
            } catch (a) {
                k.e(a)
            } finally {
                k.f()
            }
            return !1 === h && "block" === s.default
        };

        function P(a, e, o) {
            return e in a ? Object.defineProperty(a, e, {
                value: o,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : a[e] = o, a
        }

        function E(a, e, o, n, s, i, r) {
            try {
                var t = a[i](r),
                    c = t.value
            } catch (a) {
                return void o(a)
            }
            t.done ? e(c) : Promise.resolve(c).then(n, s)
        }

        function S(a) {
            return function() {
                var e = this,
                    o = arguments;
                return new Promise((function(n, s) {
                    var i = a.apply(e, o);

                    function r(a) {
                        E(i, n, s, r, t, "next", a)
                    }

                    function t(a) {
                        E(i, n, s, r, t, "throw", a)
                    }
                    r(void 0)
                }))
            }
        }

        function L(a, e) {
            for (var o = 0; o < e.length; o++) {
                var n = e[o];
                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(a, n.key, n)
            }
        }
        var I, T = function() {
                function a() {
                    ! function(a, e) {
                        if (!(a instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this._trackerList = {}, this.updateTrackerList()
                }
                var e, o, t, c, u, l, m, d;
                return e = a, o = [{
                    key: "getTrackerList",
                    value: function() {
                        return this._trackerList
                    }
                }, {
                    key: "getBlockedTrackers",
                    value: (d = S(regeneratorRuntime.mark((function a(e) {
                        var o;
                        return regeneratorRuntime.wrap((function(a) {
                            for (;;) switch (a.prev = a.next) {
                                case 0:
                                    return a.next = 2, s(r);
                                case 2:
                                    if (o = a.sent) {
                                        a.next = 5;
                                        break
                                    }
                                    return a.abrupt("return", {});
                                case 5:
                                    if (!e) {
                                        a.next = 7;
                                        break
                                    }
                                    return a.abrupt("return", o[e]);
                                case 7:
                                    return a.abrupt("return", o);
                                case 8:
                                case "end":
                                    return a.stop()
                            }
                        }), a)
                    }))), function(a) {
                        return d.apply(this, arguments)
                    })
                }, {
                    key: "updateTrackerList",
                    value: (m = S(regeneratorRuntime.mark((function a() {
                        var e;
                        return regeneratorRuntime.wrap((function(a) {
                            for (;;) switch (a.prev = a.next) {
                                case 0:
                                    return a.next = 2, fetch("https://sharmad-nachnolkar.github.io/tracker-blocking-browser-extension/trackers.json");
                                case 2:
                                    return e = a.sent, a.next = 5, e.json();
                                case 5:
                                    this._trackerList = a.sent;
                                case 6:
                                case "end":
                                    return a.stop()
                            }
                        }), a, this)
                    }))), function() {
                        return m.apply(this, arguments)
                    })
                }, {
                    key: "checkTrackerBlocking",
                    value: (l = S(regeneratorRuntime.mark((function a(e) {
                        var o, n;
                        return regeneratorRuntime.wrap((function(a) {
                            for (;;) switch (a.prev = a.next) {
                                case 0:
                                    return a.next = 2, s(i);
                                case 2:
                                    return o = a.sent, (n = C(e, this._trackerList, o)) && this.updateBlockedTrackersLog(e), a.abrupt("return", n);
                                case 6:
                                case "end":
                                    return a.stop()
                            }
                        }), a, this)
                    }))), function(a) {
                        return l.apply(this, arguments)
                    })
                }, {
                    key: "updateBlockedTrackersLog",
                    value: (u = S(regeneratorRuntime.mark((function a(e) {
                        var o, i, t, c;
                        return regeneratorRuntime.wrap((function(a) {
                            for (;;) switch (a.prev = a.next) {
                                case 0:
                                    return a.next = 2, g();
                                case 2:
                                    return i = a.sent, t = $(e.url), a.next = 6, s(r);
                                case 6:
                                    (c = a.sent) || (c = {}), c[i.id] || (c[i.id] = {}), c[i.id][t] || (c[i.id][t] = []), c[i.id][t].push({
                                        url: e.url,
                                        documentDomain: $(null !== (o = e.documentUrl) && void 0 !== o ? o : e.initiator)
                                    }), n(P({}, r, c));
                                case 12:
                                case "end":
                                    return a.stop()
                            }
                        }), a)
                    }))), function(a) {
                        return u.apply(this, arguments)
                    })
                }, {
                    key: "clearTabLogs",
                    value: (c = S(regeneratorRuntime.mark((function a(e) {
                        var o;
                        return regeneratorRuntime.wrap((function(a) {
                            for (;;) switch (a.prev = a.next) {
                                case 0:
                                    return a.next = 2, s(r);
                                case 2:
                                    null != (o = a.sent) && o[e] && (delete o[e], n(P({}, r, o)));
                                case 4:
                                case "end":
                                    return a.stop()
                            }
                        }), a)
                    }))), function(a) {
                        return c.apply(this, arguments)
                    })
                }], o && L(e.prototype, o), t && L(e, t), a
            }(),
            O = function() {
                return void 0 !== I ? I : I = new T
            };

        function R(a, e, o, n, s, i, r) {
            try {
                var t = a[i](r),
                    c = t.value
            } catch (a) {
                return void o(a)
            }
            t.done ? e(c) : Promise.resolve(c).then(n, s)
        }

        function _(a) {
            return function() {
                var e = this,
                    o = arguments;
                return new Promise((function(n, s) {
                    var i = a.apply(e, o);

                    function r(a) {
                        R(i, n, s, r, t, "next", a)
                    }

                    function t(a) {
                        R(i, n, s, r, t, "throw", a)
                    }
                    r(void 0)
                }))
            }
        }
        var N = function() {
                var a = _(regeneratorRuntime.mark((function a(e) {
                    var o, r, t, c;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                return a.next = 2, s(i);
                            case 2:
                                return (o = a.sent) || (o = []), a.next = 6, g();
                            case 6:
                                return r = a.sent, t = $(r.url), "true" === e.target.value ? o.push(t) : (c = o.indexOf(t), o.splice(c, 1)), a.next = 11, n((m = o, (l = i) in (u = {}) ? Object.defineProperty(u, l, {
                                    value: m,
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0
                                }) : u[l] = m, u));
                            case 11:
                                return a.next = 13, d(r.id, !0);
                            case 13:
                                window.close();
                            case 14:
                            case "end":
                                return a.stop()
                        }
                        var u, l, m
                    }), a)
                })));
                return function(e) {
                    return a.apply(this, arguments)
                }
            }(),
            M = function(a) {
                var e = [];
                for (var o in a) Object.prototype.hasOwnProperty.call(a, o) && e.push("<span>".concat(o, "</span><br>"));
                return e.join("")
            },
            D = function(a) {
                document.querySelectorAll('input[type=radio][name="preventTracking"]').forEach((function(e) {
                    e.addEventListener("change", N), e.id === "preventTracking_".concat(String(a)) && (e.checked = !0)
                }))
            },
            H = function(a) {
                var e = null;
                a && (e = a.map((function(a) {
                    return "<span>".concat(a, "</span><br>")
                })).join(""), document.querySelector('div[id="whitelistedDomains"]').innerHTML = "" === e ? "NONE" : e)
            },
            B = function() {
                var a = _(regeneratorRuntime.mark((function a(e) {
                    var o;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                o = M(e), document.querySelector('div[id="blockedTrackers"]').innerHTML = "" === o ? "NONE" : o;
                            case 3:
                            case "end":
                                return a.stop()
                        }
                    }), a)
                })));
                return function(e) {
                    return a.apply(this, arguments)
                }
            }(),
            F = function() {
                var a = _(regeneratorRuntime.mark((function a() {
                    var e, o, n, r, t, c;
                    return regeneratorRuntime.wrap((function(a) {
                        for (;;) switch (a.prev = a.next) {
                            case 0:
                                return a.next = 2, s(i);
                            case 2:
                                return e = a.sent, a.next = 5, g();
                            case 5:
                                return o = a.sent, n = $(o.url), r = !(!e || !e.includes(n)), t = O(), a.next = 11, t.getBlockedTrackers(o.id);
                            case 11:
                                c = a.sent, D(r), H(e), r || B(c);
                            case 15:
                            case "end":
                                return a.stop()
                        }
                    }), a)
                })));
                return function() {
                    return a.apply(this, arguments)
                }
            }();
        F()
    }()
}();
//# sourceMappingURL=popup.js.map
//Tracker ends