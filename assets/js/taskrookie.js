"use strict";
var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60)
    },
    helpers = {
        pageLoaded: !1,
        isDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        init: function() {
            helpers.isIEf(), window.pasiveEvent = !1;
            try {
                var e = Object.defineProperty({}, "passive", {
                    get: function() {
                        window.pasiveEvent = {
                            passive: !0
                        }
                    }
                });
                window.addEventListener("test", null, e)
            } catch (e) {}
        },
        ready: function(e) {
            "loading" != document.readyState ? e() : document.addEventListener ? document.addEventListener("DOMContentLoaded", e, window.pasiveEvent) : document.attachEvent("onreadystatechange", function() {
                "loading" != document.readyState && e()
            })
        },
        resize: function(e) {
            window.addEventListener ? window.addEventListener("resize", e, window.pasiveEvent) : window.attachEvent("onresize", e)
        },
        scroll: function(e) {
            window.addEventListener ? window.addEventListener("scroll", e, window.pasiveEvent) : window.attachEvent("onscroll", e)
        },
        orientationchange: function(e) {
            window.addEventListener("orientationchange", e, window.pasiveEvent)
        },
        window: {
            width: 0,
            height: 0,
            scroll: {
                y: 0,
                yF: function() {
                    return helpers.window.scroll.yMutatePromise = fastdom.measure(function() {
                        helpers.window.scroll.y = window.pageYOffset || (document.documentElement.clientHeight ? document.documentElement.scrollTop : document.body.scrollTop)
                    }), helpers.window.scroll.y
                }
            }
        },
        windowCalc: function() {
            var e = window,
                t = document,
                n = t.documentElement,
                a = t.getElementsByTagName("body")[0],
                o = e.innerWidth || n.clientWidth || a.clientWidth,
                r = e.innerHeight || n.clientHeight || a.clientHeight;
            helpers.window.width = o, helpers.window.height = r, helpers.window.scroll.yF()
        },
        getPosY: function(e) {
            for (var t = e, n = 0; t && "body" !== t.tagName.toLowerCase();) n += t.offsetTop, t = t.offsetParent;
            return n
        },
        isVisible: function(e, t) {
            var n = e.getBoundingClientRect().top,
                a = e.getBoundingClientRect().bottom,
                t = t ? t : -80;
            return n + t < helpers.window.height && a >= t
        },
        transform: function(e, t, n) {
            var a = "translateX(" + t + "px) translateY(" + n + "px) translateZ(0)";
            e.style["-webkit-transform"] = a, e.style["-moz-transform"] = a, e.style["-ms-transform"] = a, e.style["-o-transform"] = a, e.style.transform = a
        },
        transformOrigin: function(e, t, n) {
            e.style["-webkit-transform-origin"] = t + " " + n, e.style["-moz-transform-origin"] = t + " " + n, e.style["-ms-transform-origin"] = t + " " + n, e.style["-o-transform-origin"] = t + " " + n, e.style["transform-origin"] = t + " " + n
        },
        transformFactor: function(e, t, n) {
            var a = "";
            if (t.indexOf("translate") >= 0) {
                var o = 0,
                    r = 0;
                t.indexOf("Y") !== -1 && (r = n), t.indexOf("X") !== -1 && (o = n), a = "translate3d(" + o + "px, " + r + "px, 0)"
            } else if ("rotate" === t) a = "rotate(" + n + "deg) translateZ(0)";
            else if ("scale" === t) {
                var i = 1 + parseFloat(n);
                a = "scale(" + (i < 0 ? 0 : i) + ") translateZ(0)"
            }
            e.style["-webkit-transform"] = a, e.style["-moz-transform"] = a, e.style["-ms-transform"] = a, e.style["-o-transform"] = a, e.style.transform = a
        },
        getStyle: function(e, t) {
            return window.getComputedStyle ? getComputedStyle(e).getPropertyValue(t) : e.currentStyle ? e.currentStyle[t] : void 0
        },
        isEmail: function(e) {
            if (!e || e.length < 1) return !1;
            var t = e.split("@");
            return 2 === t.length && t[0].length > 0 && t[1].length > 0
        },
        isTelephone: function(e) {
            e = (e || "").replace(/^\s+|\s+$/g, "");
            var t = /^[0-9#+*\s]+$/;
            return 0 !== e.length && !!e.match(t)
        },
        contains: function(e, t) {
            for (var n = e.length; n--;)
                if (e[n] === t) return !0;
            return !1
        },
        checkValidField: function(e, t) {
            switch (t) {
                case "text":
                    return e && e.length > 0;
                case "email":
                    return e && helpers.isEmail(e);
                case "number":
                    return e && e.length > 0 && !isNaN(e);
                case "telephone":
                    return e && helpers.isTelephone(e)
            }
            return !1
        },
        scrollToTop: function(e) {
            if (e) {
                var t = document.getElementById(e);
                t && (t.scrollTop = 0)
            } else window.scrollTo(0, 0)
        },
        scrollTo: function(e, t, n) {
            if (!(n <= 0)) {
                var a = t - e.scrollTop,
                    o = a / n * 10;
                setTimeout(function() {
                    e.scrollTop = e.scrollTop + o, e.scrollTop !== t && scrollTo(e, t, n - 10)
                }, 10)
            }
        },
        scrollToY: function(e, t, n, a) {
            if (0 === n) return void(e ? e.scrollTop = t : window.scrollTo(0, t));
            var o = e ? e.scrollTop : window.scrollY || document.documentElement.scrollTop,
                r = t || 0,
                i = 0,
                s = Math.max(.1, Math.min(Math.abs(o - r) / (n ? n : 2e3), .8)),
                l = {
                    easeOutSine: function(e) {
                        return Math.sin(e * (Math.PI / 2))
                    },
                    easeInOutSine: function(e) {
                        return -.5 * (Math.cos(Math.PI * e) - 1)
                    },
                    easeInOutQuint: function(e) {
                        return (e /= .5) < 1 ? .5 * Math.pow(e, 5) : .5 * (Math.pow(e - 2, 5) + 2)
                    }
                },
                c = function() {
                    i += 1 / 60;
                    var t = i / s,
                        n = l[a ? a : "easeOutSine"](t);
                    t < 1 ? (animFrame(c), e ? e.scrollTop = o + (r - o) * n : window.scrollTo(0, o + (r - o) * n)) : e ? e.scrollTop = r : window.scrollTo(0, r)
                };
            c()
        },
        removeClass: function(e, t, n) {
            e && e.classList && t && e.classList.remove(t)
        },
        setState: function(e) {
            var t = document.getElementById("out-body-wrapper");
            t && t.classList && t.classList.add(e)
        },
        removeState: function(e) {
            helpers.removeClass(document.getElementById("out-body-wrapper"), e)
        },
        setStateById: function(e, t) {
            var n = document.getElementById(e);
            n && n.classList.add(t)
        },
        removeStateById: function(e, t) {
            helpers.removeClass(document.getElementById(e), t)
        },
        foreach: function(e, t) {
            if (e && e.length)
                for (var n = 0; n < e.length; n++) t(e[n], n)
        },
        throttle: function(e, t) {
            var n = Date.now();
            return function() {
                n + t - Date.now() < 0 && (e(), n = Date.now())
            }
        },
        cleanArray: function(e) {
            for (var t = new Array, n = 0; n < e.length; n++) e[n] && t.push(e[n]);
            return t
        },
        adjustSelectColor: function(e) {
            e.selectedIndex > 0 ? e.classList.add("filled") : helpers.removeClass(e, "filled")
        },
        getMouseXY: function(e, t) {
            var n = e.pageX - t.left,
                a = e.pageY - t.top;
            return n < 0 && (n = 0), a < 0 && (a = 0), {
                x: n,
                y: a
            }
        },
        isIE: !1,
        isIEf: function() {
            var e = window.navigator.userAgent,
                t = e ? e.indexOf("MSIE ") : null;
            return t && t > 0 || navigator.userAgent.match(/Trident.*rv\:11\./) ? (helpers.isIE = !0, app.log("Is IE: true"), document.documentElement.classList.add("isIE"), !0) : (app.log("Is IE: false"), helpers.isIE = !1, !1)
        },
        isRetina: function() {
            if (window.matchMedia) {
                var e = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                return e && e.matches || window.devicePixelRatio > 1
            }
            return !1
        },
        isStaging: function() {
            var e = document.getElementById("out-body-wrapper");
            return !!e && "true" === e.getAttribute("data-isstaging")
        }
    },
    
    router = {
        r: null,
        current: null,
        currentSubRoute: null,
        changingRoute: !1,
        newRouteWhileChanging: null,
        currentProjectId: null,
        hook: {
            before: function(e) {
                if (router.currentProjectId = null, app.layout.resizeEventPaused = !0, app.layout.scrollSpy.paused = !0, helpers.pageLoaded) {
                    var t = helpers.window.scroll.y;
                    t || (t = 0), helpers.scrollToY(null, t, 0, null)
                }
                var n = 0;
                if (app.layout.navbar.forceHide(), router.changingRoute) {
                    e(!1);
                    var a = location.hash.split("#")[1];
                    router.newRouteWhileChanging && clearTimeout(router.newRouteWhileChanging), router.newRouteWhileChanging = setTimeout(function() {
                        window.location.reload()
                    }, 2e3)
                } else {
                    if (router.changingRoute = !0, router.current && !helpers.isIE && (n = 950, animation.masks.show()), router.current) {
                        var a = location.hash.split("#")[1];
                        a && a.indexOf("projects") !== -1 && (router.currentProjectId = a.split("/projects/")[1])
                    }
                    n > 0 ? setTimeout(function() {
                        toggles.closeMenu(!0), helpers.scrollToY(null, 0, 0), e()
                    }, n) : (helpers.scrollToY(null, 0, 0), e())
                }
            },
            after: function() {
                setTimeout(function() {
                    router.changingRoute = !1
                }, 350)
            }
        },
        init: function() {
            router.r = new Navigo(null, (!0));
            var e = router.hook;
            router.r.on("/", function() {
                routes.home.init(), router.onRouteChange("home")
            }, e).on("/about", function() {
                routes.about.init(), router.onRouteChange("about")
            }, e).on("/comingsoon", function() {
                routes.comingsoon.init(), router.onRouteChange("comingsoon")
            }, e).on("/careers", function() {
                routes.careers.init(), router.onRouteChange("careers")
            }, e).on("/careers/:id", function(e, t) {
                var n = routes.career.init(e.id);
                n ? router.onRouteChange("career", e.id) : (routes.home.init(), router.onRouteChange("home"))
            }, e).on("/contact", function() {
                routes.contact.init(), router.onRouteChange("contact")
            }, e).on("/impressum", function() {
                routes.impressum.init(), router.onRouteChange("impressum")
            }, e).on("*", function() {
                routes.home.init(), router.onRouteChange("home")
            }, e).resolve()
        },
        cleanOtherViews: function() {
            "home" !== router.current && routes.home.clear(), "about" !== router.current && routes.about.clear(), "contact" !== router.current && routes.contact.clear(), "comingsoon" !== router.current && routes.comingsoon.clear(), "careers" !== router.current && routes.careers.clear(), "career" !== router.current && routes.career.clear(), "impressum" !== router.current && routes.impressum.clear()
        },
        onRouteChange: function(e, t) {
            if (helpers.window.scroll.yF(), router.current = e, router.currentSubRoute = t ? t : null, router.cleanOtherViews(), router.r.updatePageLinks(), app.layout.reset(), forms.reset(), app.layout.scrollSpy.paused = !1, setTimeout(function() {
                    return app.layout.resizeEventPaused = !1
                }, 1e3), "localhost" !== location.hostname && "127.0.0.1" !== location.hostname && "" !== location.hostname && window.ga) {
                var n = "/" + e + (t ? "/" + t : "");
                window.ga("set", "page", n), window.ga("send", "pageview")
            }
        }
    },
    routes = {
        home: {
            containerId: "home-container",
            clear: function() {
                helpers.removeStateById(routes.home.containerId, "route-on"), document.getElementById(routes.home.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.home.containerId).innerHTML = "";
                var e = document.getElementById("page-home").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.home.containerId, "route-on"), document.getElementById(routes.home.containerId).innerHTML = t()
            }
        },
        about: {
            containerId: "about-container",
            clear: function() {
                helpers.removeStateById(routes.about.containerId, "route-on"), document.getElementById(routes.about.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.about.containerId).innerHTML = "";
                var e = document.getElementById("page-about").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.about.containerId, "route-on"), document.getElementById(routes.about.containerId).innerHTML = t()
            }
        },
        contact: {
            containerId: "contact-container",
            clear: function() {
                helpers.removeStateById(routes.contact.containerId, "route-on"), document.getElementById(routes.contact.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.contact.containerId).innerHTML = "";
                var e = document.getElementById("page-contact").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.contact.containerId, "route-on"), document.getElementById(routes.contact.containerId).innerHTML = t()
            }
        },
        comingsoon: {
            containerId: "comingsoon-container",
            clear: function() {
                helpers.removeStateById(routes.comingsoon.containerId, "route-on"), document.getElementById(routes.comingsoon.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.comingsoon.containerId).innerHTML = "";
                var e = document.getElementById("page-comingsoon").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.comingsoon.containerId, "route-on"), document.getElementById(routes.comingsoon.containerId).innerHTML = t()
            }
        },
        careers: {
            containerId: "careers-container",
            clear: function() {
                helpers.removeStateById(routes.careers.containerId, "route-on"), document.getElementById(routes.careers.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.careers.containerId).innerHTML = "";
                var e = document.getElementById("page-careers").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.careers.containerId, "route-on"), document.getElementById(routes.careers.containerId).innerHTML = t()
            }
        },
        career: {
            containerId: "career-detail-container",
            clear: function() {
                helpers.removeStateById(routes.career.containerId, "route-on"), document.getElementById(routes.career.containerId).innerHTML = ""
            },
            init: function(e) {
                document.getElementById(routes.career.containerId).innerHTML = "";
                var t = document.getElementById("career-detail-" + e);
                if (t) {
                    var n = t.innerHTML,
                        a = Handlebars.compile(n);
                    return helpers.setStateById(routes.career.containerId, "route-on"), document.getElementById(routes.career.containerId).innerHTML = a(), forms.applyJob.init(), !0
                }
                return !1
            }
        },
        impressum: {
            containerId: "impressum-container",
            clear: function() {
                helpers.removeStateById(routes.impressum.containerId, "route-on"), document.getElementById(routes.impressum.containerId).innerHTML = ""
            },
            init: function() {
                document.getElementById(routes.impressum.containerId).innerHTML = "";
                var e = document.getElementById("page-impressum").innerHTML,
                    t = Handlebars.compile(e);
                helpers.setStateById(routes.impressum.containerId, "route-on"), document.getElementById(routes.impressum.containerId).innerHTML = t()
            }
        }
    },
    
    
    forms = {
        applyJob: {
            form: null,
            state: "",
            url: "https://mail.appico.com/appico.php",
            init: function() {
                forms.applyJob.form = document.getElementById("position-form");
                var e = forms.applyJob.form;
                e && ! function() {
                    var t = e.getElementsByClassName("form-control");
                    t && (helpers.foreach(t, function(t, n) {
                        t.onfocus = function(t) {
                            var n = t.target;
                            n && (helpers.removeClass(n, "error"), helpers.removeClass(n, "focused"), n.classList.add("focused")), helpers.removeClass(e, "error")
                        }, t.onchange = function(e) {
                            var t = e.target;
                            t && (t.value && t.value.length > 0 ? (helpers.removeClass(t, "filled"), t.classList.add("filled")) : helpers.removeClass(t, "filled"))
                        }, t.onblur = function(e) {
                            var t = e.target;
                            t && (helpers.removeClass(t, "focused"), t.value && t.value.length > 0 ? (helpers.removeClass(t, "filled"), t.classList.add("filled")) : helpers.removeClass(t, "filled"))
                        }
                    }), document.getElementById("apply-form-submit").onclick = function(n) {
                        if (n.preventDefault(), "success" !== forms.applyJob.state && "loading" !== forms.applyJob.state)
                            if (forms.applyJob.checkForm(e, t)) {
                                var a;
                                ! function() {
                                    forms.applyJob.state = "loading", forms.toggleFormState(e, forms.applyJob.state, "loading"), a = "", helpers.foreach(t, function(e, t) {
                                        !e.value || e.value.length < 1 || (a.length > 1 && (a += "&"), a += e.getAttribute("name") + "=" + e.value)
                                    });
                                    var n = new XMLHttpRequest;
                                    n.open("POST", forms.applyJob.url, !0), n.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), n.onreadystatechange = function() {
                                        4 == n.readyState && 200 == n.status && (n.responseText.indexOf("1") !== -1 ? forms.toggleFormState(e, forms.applyJob.state, "success") : forms.toggleFormState(e, forms.applyJob.state, "error"))
                                    }, n.send(a)
                                }()
                            } else forms.toggleFormState(e, forms.applyJob.state, "error")
                    })
                }()
            },
            checkForm: function(e, t) {
                var n = !0;
                return e && (helpers.removeClass(e, "error"), helpers.foreach(t, function(e, t) {
                    var a = e.value;
                    switch (e.id) {
                        case "apply-name":
                            (!a || a.length < 1) && (e.classList.add("error"), n = !1);
                            break;
                        case "apply-email":
                            a && helpers.isEmail(a) || (e.classList.add("error"), n = !1);
                            break;
                        case "apply-portfolio":
                            (!a || a.length < 1) && (e.classList.add("error"), n = !1);
                            break;
                        case "apply-behance-dribbble":
                        case "apply-github":
                        case "apply-message":
                    }
                })), n
            }
        },
        toggleFormState: function(e, t, n) {
            e && (helpers.removeClass(e, t), t = n, e.classList.add(t))
        },
        reset: function() {
            forms.applyJob.state = ""
        },
        init: function() {}
    },
    /*videos = {
        init: function() {
            Modernizr.on("videoautoplay", function(e) {
                if (e)
                    for (var t = document.querySelectorAll("video"), n = 0; n < t.length; n++) {
                        for (var a = t[n].querySelectorAll("source"), o = 0; o < a.length; o++) a[o].setAttribute("src", a[o].getAttribute("data-src"));
                        app.log("Load video"), t[n].load(), t[n].getAttribute("data-play-on-visible") && (t[n].pause(), app.log("Video paused"))
                    }
            });
            var e = document.getElementsByClassName("video-play");
            e.length && (app.log("Videos initiated"), helpers.foreach(e, function(e, t) {
                e.onclick = function() {
                    return videos.play(e)
                }
            }), document.addEventListener("keydown", function(e) {
                27 === e.which && videos.playing && videos.stop(videos.playing)
            }))
        },
        play: function(e) {
            videos.playing = e;
            var t = e.getAttribute("data-target"),
                n = e.getAttribute("data-parent"),
                a = document.getElementById(t),
                o = document.getElementById(n);
            a && ! function() {
                var t = a.getAttribute("data-src");
                t.indexOf("autoplay") < 0 && (t.indexOf("?") < 0 && (t += "?"), t += "&autoplay=1");
                var n = document.createElement("iframe");
                n.src = t, n.width = "100%", n.height = "100%", n.setAttribute("frameborder", 0), n.setAttribute("allowFullScreen", "");
                var r = a.parentElement.parentElement;
                r.classList.add("on"), setTimeout(function() {
                    r.classList.add("enabled")
                }, 150), setTimeout(function() {
                    a.appendChild(n)
                }, 475), o && o.classList.add("show-video");
                var i = a.parentElement.getElementsByClassName("video-close");
                i[0] && (i[0].onclick = function() {
                    return videos.stop(e)
                })
            }()
        },
        stop: function(e) {
            videos.playing = null;
            var t = e.getAttribute("data-target"),
                n = e.getAttribute("data-parent"),
                a = document.getElementById(t),
                o = document.getElementById(n);
            a && ! function() {
                a.children.length > 1 && (a.lastChild.style.display = "none", setTimeout(function() {
                    a.removeChild(a.lastChild)
                }, 250));
                var e = a.parentElement.parentElement;
                setTimeout(function() {
                    helpers.removeClass(e, "enabled"), setTimeout(function() {
                        helpers.removeClass(e, "on"), o && helpers.removeClass(o, "show-video")
                    }, 850)
                }, 0)
            }()
        }
    },
    */
    toggles = {
        animatingMenu: !1,
        menuHeight: 0,
        closeMenu: function(e) {
            var t = document.getElementById("out-body-wrapper");
            if (!e || e && t.className.indexOf("menu-opened") !== -1) {
                var n = function() {
                    var e = document.getElementById("menu-element");
                    return toggles.animatingMenu = !0, toggles.menuHeight > 0 || fastdom.measure(function() {
                        toggles.menuHeight = e.offsetHeight > 0 ? e.offsetHeight : 0
                    }), setTimeout(function() {
                        t.classList.add("menu-closing"), setTimeout(function() {
                            document.body.style.minHeight = toggles.menuHeight > 0 ? toggles.menuHeight + "px" : "100vh", helpers.removeClass(t, "menu-opening"), helpers.removeClass(t, "menu-opened"), helpers.removeClass(t, "menu-closing"), toggles.animatingMenu = !1
                        }, 550)
                    }, 200), {
                        v: !0
                    }
                }();
                if ("object" == typeof n) return n.v
            }
            return !1
        },
        openMenu: function() {
            fastdom.mutate(function() {
                return document.getElementById("menu-element").style.opacity = 1
            });
            var e = document.getElementById("out-body-wrapper");
            toggles.animatingMenu = !0, setTimeout(function() {
                e.classList.add("menu-opened"), setTimeout(function() {
                    toggles.animatingMenu = !1
                }, 550)
            }, 200)
        },
        init: function() {
            var e = document.getElementsByClassName("navbar-toggle");
            helpers.foreach(e, function(e) {
                e.onclick = function() {
                    var e = "menu-opened",
                        t = document.getElementById("out-body-wrapper");
                    t && !toggles.animatingMenu && (t.className.indexOf(e) !== -1 ? toggles.closeMenu() : toggles.openMenu())
                }
            });
            var t = document.querySelectorAll("a.menu-link");
            helpers.foreach(t, function(e) {
                e.addEventListener ? e.addEventListener("click", function(e) {
                    toggles.closeMenu(!0)
                }) : e.attachEvent("click", function(e) {
                    toggles.closeMenu(!0)
                })
            })
        }
    },
    toAnimate = {
        started: !1,
        toAnimateItems: [],
        elementsToMutate: [],
        mutatePromises: [],
        recheckTopLaps: 8,
        recheckTopCurrent: 0,
        init: function() {
            toAnimate.elementsToMutate = [], toAnimate.mutatePromises = [], toAnimate.recheckTopCurrent = toAnimate.recheckTopLaps;
            var e = document.getElementsByClassName("to-animate-group");
            e.length && (app.log("ToAnimate initiated"), helpers.foreach(e, function(e, t) {
                e.className.indexOf("animated") === -1 && toAnimate.toAnimateItems.push({
                    element: e,
                    top: null,
                    height: null,
                    minHeight: e.getAttribute("data-min-height") || 0
                })
            })), helpers.pageLoaded && toAnimate.check()
        },
        reset: function() {
            toAnimate.toAnimateItems = [], toAnimate.elementsToMutate = [], helpers.foreach(toAnimate.mutatePromises, function(e, t) {
                return fastdom.clear(e)
            }), toAnimate.mutatePromises = [], toAnimate.init()
        },
        check: function() {
            if (!toAnimate.toAnimateItems.length) return void app.log("ToAnimate stop");
            toAnimate.started = !0;
            var e = helpers.window,
                t = !1,
                n = e.scroll.y,
                a = null;
            toAnimate.recheckTopCurrent++;
            for (var o = toAnimate.toAnimateItems.length - 1; o >= 0; o--) ! function(o) {
                a = toAnimate.toAnimateItems[o], toAnimate.elementsToMutate[o] = a;
                var r = function(a) {
                    if (t = n + e.height > a.top && n < a.top || n + e.height > a.top + a.height && n < a.top + a.height) {
                        var r = a.element.getAttribute("data-custom-anime");
                        if (r && animation[r]) {
                            var i = a.element.getAttribute("data-custom-anime-delay");
                            i ? animation[r].show(a.element, i) : animation[r].show(a.element)
                        }
                        var s = a.element.getAttribute("data-play-video-on-scroll");
                        if (s) {
                            var l = document.getElementById(s);
                            if (l) {
                                var c = a.element.getAttribute("data-play-video-on-scroll-start-on");
                                l.play(), c && (l.currentTime = parseFloat(c)), app.log("Video played on scroll")
                            }
                        }
                        var u = a.element.getAttribute("data-project-trigger-on-scroll");
                        /*if (u) {
                            var p = u.split(".")[0],
                                m = u.split(".")[1];
                            projects[p] && projects[p][m] && projects[p][m]()
                        }*/
                        toAnimate.mutatePromises.push(fastdom.mutate(function() {
                            toAnimate.elementsToMutate[o].element.classList.add("animated")
                        })), toAnimate.toAnimateItems.splice(o, 1)
                    }
                };
                !a.top || !a.height || toAnimate.recheckTopCurrent > toAnimate.recheckTopLaps ? toAnimate.mutatePromises.push(fastdom.measure(function() {
                    var e = toAnimate.elementsToMutate[o];
                    e && e.element && (e.height = e.element.offsetHeight, e.top = helpers.getPosY(e.element), r(toAnimate.elementsToMutate[o]))
                })) : r(a)
            }(o);
            toAnimate.recheckTopCurrent > toAnimate.recheckTopLaps && (toAnimate.recheckTopCurrent = 0)
        }
    },
    parallax = {
        started: !1,
        parallaxItems: [],
        elementsToMutate: [],
        mutatePromises: [],
        offsetTrigger: 50,
        recheckTopLaps: 12,
        recheckTopCurrent: 0,
        init: function() {
            parallax.elementsToMutate = [], parallax.mutatePromises = [], parallax.recheckTopCurrent = parallax.recheckTopLaps, helpers.removeClass(document.documentElement, "with-parallax", !0), document.documentElement.classList.add("with-parallax");
            var e = document.getElementsByClassName("parallaxyeah");
            e.length && (app.log("parallax initiated"), helpers.foreach(e, function(e, t) {
                helpers.isIE && e.getAttribute("data-disable-ie") || parallax.parallaxItems.push({
                    element: e,
                    max: e.getAttribute("data-max"),
                    maxSm: e.getAttribute("data-max-sm"),
                    maxMd: e.getAttribute("data-max-md"),
                    speed: e.getAttribute("data-speed") || 1,
                    transform: e.getAttribute("data-transform"),
                    stop: e.getAttribute("data-stop"),
                    disableOn: e.getAttribute("data-disable"),
                    top: null,
                    height: null,
                    minHeight: e.getAttribute("data-min-height") || 0,
                    set: !1,
                    display: e.style.display,
                    appliedInvisibleCorrection: !1
                })
            })), helpers.pageLoaded && parallax.check()
        },
        reset: function() {
            parallax.parallaxItems = [], parallax.elementsToMutate = [], helpers.foreach(parallax.mutatePromises, function(e, t) {
                return fastdom.clear(e)
            }), parallax.mutatePromises = [], parallax.init()
        },
        check: function() {
            if (!parallax.parallaxItems.length) return void app.log("parallax stop");
            parallax.started = !0;
            var e = helpers.window,
                t = (e.scroll.y, null);
            parallax.recheckTopCurrent++;
            for (var n = parallax.parallaxItems.length - 1; n >= 0; n--) ! function(n) {
                t = parallax.parallaxItems[n], parallax.elementsToMutate[n] = t;
                var a = function(t) {
                    var a = void 0,
                        o = void 0,
                        r = void 0,
                        i = void 0,
                        s = void 0,
                        l = void 0,
                        c = void 0,
                        u = void 0,
                        p = void 0;
                    if (p = !1, u = e.scroll.y, t.disableOn && t.disableOn >= e.width) return void parallax.mutatePromises.push(fastdom.mutate(function() {
                        animation.parallax[t.transform ? t.transform : "translateY"](t, 0)
                    }));
                    if (c = u + e.height > t.top - parallax.offsetTrigger && u < t.top + t.height + parallax.offsetTrigger, c || (u = u + e.height < t.top - parallax.offsetTrigger ? t.top - parallax.offsetTrigger - e.height : t.top + t.height + parallax.offsetTrigger), c) t.scrollTopFix = null;
                    else {
                        if (t.scrollTopFix && t.scrollTopFix == u) return;
                        t.scrollTopFix = u
                    }
                    t.stop && (a = t.top + t.height / 2 - e.height / 2 + e.height * parseFloat(t.stop) / 100, a < u + e.height / 2) || (s = e.height * (t.stop ? parseFloat(t.stop) / 100 : 1), o = -1 * (t.top + t.height / 2 - s / 2 - u), r = 100 * o / s, l = e.width < 768 && t.maxMd ? t.maxMd : t.max, l = e.width < 480 && t.maxSm ? t.maxSm : l, i = r / 100 * l, parallax.mutatePromises.push(fastdom.mutate(function() {
                        var e = parallax.elementsToMutate[n];
                        animation.parallax[e.transform ? e.transform : "translateY"](e, (i * e.speed).toFixed(2)), e.set = !0
                    })))
                };
                !t.top || !t.height || parallax.recheckTopCurrent > parallax.recheckTopLaps ? parallax.mutatePromises.push(fastdom.measure(function() {
                    var e = parallax.elementsToMutate[n];
                    e && e.element && (e.top = helpers.getPosY(e.element), e.height = e.element.offsetHeight, a(parallax.elementsToMutate[n]))
                })) : a(t)
            }(n);
            parallax.recheckTopCurrent > parallax.recheckTopLaps && (parallax.recheckTopCurrent = 0)
        }
    },
    animation = {
        navbar: {
            animating: !1,
            toShow: !0,
            hiden: !0,
            shown: !1,
            el: document.querySelector(".nav-fixed nav"),
            anim: {
                show: anime({
                    targets: ".nav-fixed nav",
                    translateY: [0, 110],
                    delay: 0,
                    duration: 900,
                    elasticity: 0,
                    autoplay: !1
                }),
                hide: anime({
                    targets: ".nav-fixed nav",
                    translateY: [110, 0],
                    delay: 0,
                    duration: 900,
                    elasticity: 0,
                    autoplay: !1
                })
            },
            show: function() {
                animation.navbar.animating || animation.navbar.shown || (animation.navbar.shown = !0, animation.navbar.hiden = !1, animation.navbar.animating = !0, animation.navbar.el.style.display = "block", animation.navbar.anim.show.play(), setTimeout(function() {
                    animation.navbar.toShow = !1, animation.navbar.animating = !1
                }, 1e3))
            },
            hide: function() {
                animation.navbar.animating || animation.navbar.hiden || (animation.navbar.hiden = !0, animation.navbar.shown = !1, animation.navbar.animating = !0, animation.navbar.anim.hide.play(), setTimeout(function() {
                    animation.navbar.el.style.display = "none", animation.navbar.toShow = !0, animation.navbar.animating = !1
                }, 1e3))
            }
        },
        masks: {
            show: function() {
                var e = document.getElementById("trans-mask-shape-front"),
                    t = document.getElementById("trans-mask-shape-middle"),
                    n = document.getElementById("trans-mask-shape-back");
                e.style.display = "block", t.style.display = "block", n.style.display = "block", anime({
                    targets: e,
                    translateX: [0, 0],
                    scaleX: [0, 1],
                    delay: 0,
                    duration: 650,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                }), anime({
                    targets: t,
                    translateX: [0, 0],
                    scaleX: [0, 1],
                    delay: 135,
                    duration: 650,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                }), anime({
                    targets: n,
                    translateX: [0, 0],
                    scaleX: [0, 1],
                    delay: 350,
                    duration: 600,
                    autoplay: !0,
                    easing: "easeInOutQuad",
                    complete: function() {
                        anime({
                            targets: [e, t, n],
                            translateX: [0, helpers.window.width],
                            scaleX: [1, 1],
                            delay: 0,
                            duration: 650,
                            autoplay: !0,
                            easing: "easeInOutQuad",
                            complete: function() {
                                e.style.display = "none", t.style.display = "none", n.style.display = "none"
                            }
                        })
                    }
                })
            }
        },
        dropdown: {
            open: function(e, t, n) {
                var a = "M 0 0 L " + t + " 0 L " + t + " " + n + " L 0 " + n + " L0 0 Z";
                anime({
                    targets: "" + e + " path",
                    d: a,
                    delay: 0,
                    duration: 300,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                }), anime({
                    targets: e,
                    translateY: -55,
                    translateX: -30,
                    delay: 0,
                    duration: 320,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                })
            },
            close: function(e) {
                anime({
                    targets: "" + e + " path",
                    d: "M 0 0 L 60 0 L 60 3 L 0 3 L0 0 Z",
                    delay: 0,
                    duration: 300,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                }), anime({
                    targets: e,
                    translateY: 0,
                    translateX: 0,
                    delay: 0,
                    duration: 300,
                    autoplay: !0,
                    easing: "easeInOutQuad"
                })
            }
        },
        overlays: {
            open: function(e, t, n, a, o) {
                var r = t ? helpers.window.width : 200,
                    i = t ? 200 : helpers.window.height,
                    s = "M 0 0 L " + r + " 0 L " + r + " " + i + " L 0 " + i + " L0 0 Z";
                anime({
                    targets: e,
                    d: s,
                    translateY: 0,
                    translateX: 0,
                    fill: o,
                    delay: 0,
                    duration: 370,
                    autoplay: !0,
                    easing: "easeInOutCubic",
                    complete: function() {
                        s = "M 0 0 L " + n + " 0 L " + n + " " + a + " L 0 " + a + " L0 0 Z", anime({
                            targets: e,
                            d: s,
                            delay: 0,
                            duration: 380,
                            autoplay: !0,
                            easing: "easeInOutCubic"
                        })
                    }
                })
            }
        },
        arrow: {
            show: function(e) {
                helpers.isIE || anime({
                    targets: e,
                    scaleY: [1, 1.2, 1],
                    duration: 3e3,
                    autoplay: !0,
                    elasticity: 300,
                    easing: [.91, -.54, .29, 1.56]
                })
            }
        },
        mapDots: {
            show: function(e) {
                helpers.isIE || anime({
                    targets: e.querySelectorAll(".map-dots .dark"),
                    scale: [0, 1],
                    opacity: {
                        value: 1,
                        duration: 400
                    },
                    delay: function(e, t, n) {
                        return 135 * (t - 1)
                    },
                    duration: 1e3,
                    autoplay: !0,
                    elasticity: 900,
                    easing: [.91, -.54, .29, 1.56]
                })
            }
        },
        launchLearnGraph: {
            init: function() {
                if (!helpers.isIE) {
                    var e = document.querySelectorAll("#graph-block .graph-bar"),
                        t = document.querySelectorAll("#graph-block .graph-dot"),
                        n = document.querySelectorAll("#graph-block .graph-line");
                    helpers.foreach(e, function(e, t) {
                        fastdom.mutate(function() {
                            e.style.opacity = 0
                        })
                    }), helpers.foreach(t, function(e, t) {
                        fastdom.mutate(function() {
                            e.style.opacity = 0
                        })
                    }), helpers.foreach(n, function(e, t) {
                        fastdom.mutate(function() {
                            e.style.opacity = 0
                        })
                    })
                }
            },
            reset: function() {
                if (!helpers.isIE) {
                    var e = document.getElementById("launchLearnGraphAnimateGroup");
                    helpers.removeClass(e, "animated"), animation.launchLearnGraph.init()
                }
            },
            show: function(e, t) {
                if (!helpers.isIE) {
                    var n = e.querySelectorAll(".graph-bar"),
                        a = e.querySelectorAll(".graph-dot"),
                        o = e.querySelectorAll(".graph-line"),
                        r = parseInt(t);
                    setTimeout(function() {
                        anime.timeline().add({
                            targets: n,
                            scaleY: [0, 1],
                            opacity: {
                                value: 1,
                                duration: 25,
                                easing: "linear"
                            },
                            delay: function(e, t, n) {
                                return 185 * (t - 1)
                            },
                            duration: 1250,
                            autoplay: !0,
                            elasticity: 800,
                            easing: [.91, -.54, .29, 1.56],
                            offset: 0
                        }).add({
                            targets: a,
                            opacity: {
                                value: [0, 1],
                                duration: 350
                            },
                            delay: function(e, t, n) {
                                return 175 * t
                            },
                            duration: 800,
                            autoplay: !0,
                            elasticity: 2e3,
                            easing: [.91, -.54, .29, 1.56],
                            offset: 500
                        }).add({
                            targets: o,
                            strokeDashoffset: [anime.setDashoffset, 0],
                            delay: function(e, t, n) {
                                return 260 * t
                            },
                            opacity: {
                                value: 1,
                                duration: 200,
                                easing: "linear"
                            },
                            duration: 335,
                            autoplay: !0,
                            elasticity: 1e3,
                            easing: "easeInOutQuad",
                            offset: 650
                        })
                    }, r)
                }
            }
        },
        functionsLogoDrawing: {
            init: function() {
                if (!helpers.isIE) {
                    var e = document.querySelectorAll(".function.to-animate-group svg path");
                    helpers.foreach(e, function(e, t) {
                        fastdom.mutate(function() {
                            e.style.opacity = 0
                        })
                    })
                }
            },
            show: function(e, t) {
                helpers.isIE || anime({
                    targets: e.querySelectorAll("svg path"),
                    strokeDashoffset: [anime.setDashoffset, 0],
                    delay: function(e, t, n) {
                        return 95 * t
                    },
                    opacity: {
                        value: 1,
                        duration: 100,
                        easing: "linear"
                    },
                    duration: 1550,
                    autoplay: !0,
                    elasticity: 0,
                    easing: "easeInOutQuad",
                    offset: t ? t : 0
                })
            }
        },
        irisGraph: {
            init: function() {
                if (!helpers.isIE) {
                    var e = document.querySelectorAll(".graph-wrapper svg .iris-graph-line");
                    helpers.foreach(e, function(e, t) {
                        fastdom.mutate(function() {
                            e.style.opacity = 0
                        })
                    })
                }
            },
            reset: function() {
                if (!helpers.isIE) {
                    var e = document.getElementById("irisGraphToAnimateGroup");
                    helpers.removeClass(e, "animated"), animation.irisGraph.init()
                }
            },
            show: function(e, t) {
                helpers.isIE || anime({
                    targets: e.querySelectorAll("svg .iris-graph-line"),
                    strokeDashoffset: [anime.setDashoffset, 0],
                    opacity: {
                        value: 1,
                        duration: 50,
                        easing: "linear"
                    },
                    delay: 0,
                    duration: 750,
                    autoplay: !0,
                    elasticity: 1e3,
                    easing: "easeInOutQuad",
                    offset: t ? t : 0
                })
            }
        },
        yapitalRecommendNumber: {
            init: function() {
                if (!helpers.isIE) {
                    var e = document.querySelector(".recommend-num-selected .inner");
                    e.style.opacity = 0
                }
            },
            show: function(e) {
                if (!helpers.isIE) {
                    anime({
                        targets: e.querySelector(".recommend-num-selected .inner"),
                        scale: [0, 1],
                        opacity: {
                            value: [0, 1],
                            duration: 100,
                            easing: "linear"
                        },
                        autoplay: !0,
                        duration: 1e3,
                        delay: 250,
                        elasticity: 15e3,
                        easing: [.66, -.13, .11, 1.35],
                        complete: function() {
                            setTimeout(function() {
                                var e = document.getElementById("bottom-questions-wrapper");
                                e && e.classList.add("animated");
                                var t = document.getElementById("to-change-wrapper");
                                t && t.classList.add("animated"), setTimeout(function() {
                                    var e = document.getElementById("easy-to-use-wrapper");
                                    e && e.classList.add("animated"), animation.yapitalNumberProgress.show(document.querySelector(".easy-to-use-wrapper .no-wrapper"), 300), animation.yapitalNumberProgress.show(document.querySelector(".easy-to-use-wrapper .yes-wrapper"), 900)
                                }, 1550)
                            }, 250)
                        }
                    })
                }
            }
        },
        yapitalNumberProgress: {
            init: function() {
                if (!helpers.isIE) {
                    var e = document.querySelectorAll(".easy-to-use-wrapper .number-to-animate");
                    helpers.foreach(e, function(e, t) {
                        e.setAttribute("data-original-number", e.innerHTML), e.innerHTML = 0
                    })
                }
            },
            show: function(e, t) {
                if (!helpers.isIE) var n = e.querySelector(".number-to-animate"),
                    a = parseInt(n.getAttribute("data-original-number") || 100),
                    o = {
                        progress: 0
                    },
                    r = anime({
                        targets: o,
                        progress: a,
                        easing: "easeInOutQuad",
                        round: 1,
                        delay: 0,
                        duration: 650,
                        autoplay: !0,
                        offset: t ? t : 0,
                        update: function() {
                            n.innerHTML = o.progress, o.progress == a && r && r.pause()
                        }
                    })
            }
        },
        parallax: {
            translateY: function(e, t) {
                animFrame(function() {
                    helpers.transform(e.element, 0, t)
                })
            },
            translateX: function(e, t) {
                animFrame(function() {
                    helpers.transform(e.element, t, 0)
                })
            }
        }
    },
    app = {
        bLazy: null,
        data: {},
        config: {},
        layout: {
            resizeEventPaused: !1,
            resizeTimeout: null,
            init: function() {
                app.layout.scrollSpy.init(), app.layout.scrollSpy.needCheck() && (helpers.resize(function() {
                    helpers.pageLoaded && !app.layout.resizeEventPaused && (clearTimeout(app.layout.resizeTimeout), app.layout.resizeTimeout = setTimeout(function() {
                        fastdom.measure(function() {
                            return helpers.windowCalc()
                        }), projects.onResize(), "undefined" != typeof toAnimate && toAnimate.toAnimateItems.length && (toAnimate.reset(), toAnimate.recheckTopCurrent = toAnimate.recheckTopLaps + 1), "undefined" != typeof parallax && parallax.parallaxItems.length && (parallax.reset(), parallax.recheckTopCurrent = parallax.recheckTopLaps + 1), app.layout.scrollSpy.spyFunc()
                    }, 500))
                }), helpers.orientationchange(function() {
                    var e = document.querySelectorAll(".animated span.filler:not(.simple)");
                    fastdom.mutate(function() {
                        for (var t = e.length - 1; t >= 0; t--) e[t].style.display = "none"
                    }), "undefined" != typeof toAnimate && toAnimate.toAnimateItems.length && (toAnimate.reset(), toAnimate.recheckTopCurrent = toAnimate.recheckTopLaps + 1), "undefined" != typeof parallax && parallax.parallaxItems.length && (parallax.reset(), parallax.recheckTopCurrent = parallax.recheckTopLaps + 1), projects.onResize()
                }))
            },
            reset: function() {
                toggles.init(), /*videos.init(),*/ toAnimate.init(), parallax.init(), fastdom.measure(helpers.windowCalc), setTimeout(function() {
                    app.layout.navbar.init(), app.layout.scrollSpy.init(), dragscroll && dragscroll.reset()
                }, 300)
            },
            navbar: {
                toFix: !1,
                scrollOffset: 500,
                showing: !1,
                unhide: function() {
                    fastdom.mutate(function() {
                        var e = document.getElementById("nav-fixed");
                        e.style.opacity = 1, e.style.display = "inherit"
                    })
                },
                init: function() {
                    app.layout.navbar.toFix = !0, app.layout.navbar.unhide()
                },
                forceHide: function() {
                    animation.navbar.hide(), app.layout.navbar.showing = !1
                },
                check: function(e, t) {
                    t !== -1 && helpers.window.scroll.y > helpers.window.height && !app.layout.scrollSpy.paused && (app.layout.navbar.showing && e === app.layout.scrollSpy.lastYPos || e < app.layout.scrollSpy.lastYPos) ? (app.layout.navbar.unhide(), fastdom.mutate(function() {
                        animation.navbar.show(), app.layout.navbar.showing = !0
                    })) : fastdom.mutate(function() {
                        animation.navbar.hide(), app.layout.navbar.showing = !1
                    })
                }
            },
            scrollSpy: {
                spy: null,
                lastYPos: -1,
                toAnimateCycles: 2,
                toAnimateCyclesCurrent: 2,
                navCycles: 1,
                navCyclesCurrent: 1,
                needCheck: function() {
                    return !0
                },
                paused: !1,
                initiated: !1,
                hasScrolled: !1,
                checkingScroll: !1,
                init: function() {
                    app.layout.scrollSpy.needCheck() && !app.layout.scrollSpy.initiated && (app.layout.scrollSpy.initiated = !0, app.log("ScrollSpy initiated"), helpers.scroll(helpers.throttle(app.layout.scrollSpy.scrollFunc, 80)), app.layout.scrollSpy.spy = setInterval(app.layout.scrollSpy.spyFunc, 100))
                },
                scrollFunc: function() {
                    app.log("scrollFunc"), app.layout.scrollSpy.hasScrolled = !0, app.layout.scrollSpy.spyFunc()
                },
                spyFunc: function() {
                    if (app.log("spyFunc"), helpers.pageLoaded && !app.layout.scrollSpy.checkingScroll) {
                        app.layout.scrollSpy.checkingScroll = !0;
                        var e = helpers.window.scroll.yF(),
                            t = !1;
                        app.layout.scrollSpy.pause || (app.layout.scrollSpy.navCyclesCurrent <= 0 && app.layout.scrollSpy.hasScrolled && app.layout.navbar.toFix || e < helpers.window.height ? (app.layout.navbar.check(e, app.layout.scrollSpy.lastYPos), app.layout.scrollSpy.navCyclesCurrent = app.layout.scrollSpy.navCycles) : app.layout.scrollSpy.navCyclesCurrent -= 1, "undefined" != typeof toAnimate && toAnimate.toAnimateItems.length >= 1 && app.layout.scrollSpy.toAnimateCyclesCurrent <= 0 ? (toAnimate.check(), t = !0, app.layout.scrollSpy.toAnimateCyclesCurrent = app.layout.scrollSpy.toAnimateCycles) : app.layout.scrollSpy.toAnimateCyclesCurrent -= 1, app.layout.scrollSpy.hasScrolled && e != app.layout.scrollSpy.lastYPos ? (app.layout.scrollSpy.lastYPos = e, "undefined" != typeof parallax && parallax.parallaxItems.length >= 1 && parallax.check()) : !parallax.started && parallax.parallaxItems.length >= 1 && helpers.pageLoaded && parallax.check(), app.layout.scrollSpy.hasScrolled = !1, app.layout.scrollSpy.checkingScroll = !1)
                    }
                }
            },
            sliders: {
                animate: function(e) {
                    var t = document.getElementById(e);
                    t && (t.className.indexOf("animating") !== -1 ? app.log("slider already animating") : (fastdom.mutate(function() {
                        t.classList.add("animating")
                    }), setTimeout(function() {
                        helpers.removeClass(t, "animating")
                    }, 1300)))
                }
            }
        },
        plugins: {
            init: function() {
                document.addEventListener("lazybeforeunveil", function(e) {
                    var t = e.target.getAttribute("data-bg");
                    t && (e.target.style.backgroundImage = "url(" + t + ")")
                })
            }
        },
        log: function(e) {
            var t = !1;
            t && console.log(e)
        },
        init: function() {
            helpers.init(), app.layout.init(), app.plugins.init(), router.init(), forms.init(), fastdom.mutate(function() {
                document.documentElement.classList.add("loaded")
            }), setTimeout(function() {
                helpers.pageLoaded = !0
            }, 350)
        }
    },
    joinTaskrookie = function() {
        router.r.navigate("/careers/front-end-engineer", !1)
    };
app.init();