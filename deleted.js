}, e).on("/projects/:id", function(e, t) {
                routes.project.checkIsProject(e.id) ? (routes.project.init(e.id), router.onRouteChange("project", e.id)) : (routes.home.init(), router.onRouteChange("home"))
            

ventures = about




project: {
            containerId: "project-container",
            checkIsProject: function(e) {
                var t = ["postly", "iris", "guess", "yapital"];
                return helpers.isStaging() && (t = ["postly", "iris", "guess", "yapital", "camparound", "metro-magazine", "telemedicine"]), helpers.contains(t, e)
            },
            clear: function() {
                helpers.removeStateById(routes.project.containerId, "route-on"), document.getElementById(routes.project.containerId).innerHTML = ""
            },
            init: function(e) {
                document.getElementById(routes.project.containerId).innerHTML = "";
                var t = document.getElementById("project-" + e).innerHTML,
                    n = Handlebars.compile(t);
                helpers.setStateById(routes.project.containerId, "route-on"), document.getElementById(routes.project.containerId).innerHTML = n()
            }
        },






 projects = {
        reset: function() {
            projects.postly.illustrationInterval && clearInterval(projects.postly.illustrationInterval), projects.iris.illustrationInterval && clearInterval(projects.iris.illustrationInterval), projects.postly.reset(), projects.iris.reset(), projects.guess.reset(), projects.yapital.reset()
        },
        onResize: function() {
            router.currentSubRoute && projects[router.currentSubRoute] && projects[router.currentSubRoute].onResize && (projects[router.currentSubRoute].onResize(), app.log("onResize: " + router.currentSubRoute))
        },
        postly: {
            illustrationInterval: null,
            currentAnimation: -1,
            animationsLength: 3,
            animContainer: null,
            toAnim: !1,
            currentAnimVideo: null,
            animVideoDurations: [6, 7, 3.5],
            playAnimVideoIfNeeded: function() {
                window.isDevice || (projects.postly.currentAnimVideo && projects.postly.currentAnimVideo.pause(), projects.postly.currentAnimVideo = document.getElementById("anim-video-" + projects.postly.currentAnimation), projects.postly.currentAnimVideo.currentTime = 0, projects.postly.currentAnimVideo.play())
            },
            getAnimDelayVideo: function() {
                var e = 3500;
                if (!window.isDevice) {
                    var t = projects.postly.currentAnimation;
                    e = projects.postly.animVideoDurations[t] ? 1e3 * projects.postly.animVideoDurations[t] : e
                }
                return e
            },
            init: function() {
                projects.postly.toAnim = !1, projects.postly.currentAnimation = -1;
                var e = document.getElementById("postly-anims-anchor"),
                    t = function() {
                        if (!projects.postly.toAnim && e && e.className.indexOf("animated") !== -1 && (projects.postly.toAnim = !0, projects.postly.illustrationInterval && clearInterval(projects.postly.illustrationInterval)), projects.postly.toAnim) {
                            var n = projects.postly.animationsLength - 1,
                                a = projects.postly.currentAnimation;
                            projects.postly.currentAnimation = a + 1 > n ? 0 : a + 1, projects.postly.animContainer.className = "anim-" + projects.postly.currentAnimation, projects.postly.playAnimVideoIfNeeded(), projects.postly.illustrationInterval && clearInterval(projects.postly.illustrationInterval), projects.postly.illustrationInterval = setInterval(t, projects.postly.getAnimDelayVideo())
                        }
                    },
                    n = document.getElementById("postly-anims-container");
                if (projects.postly.animContainer = n, n) {
                    var a = n.getElementsByClassName("title");
                    n.getElementsByClassName("animation");
                    projects.postly.animationsLength = a.length, helpers.foreach(a, function(e, a) {
                        e.onclick = function() {
                            projects.postly.currentAnimation = a, projects.postly.illustrationInterval && clearInterval(projects.postly.illustrationInterval), projects.postly.playAnimVideoIfNeeded();
                            var o = e.getAttribute("data-index");
                            n.className = "anim-" + o, projects.postly.illustrationInterval = setInterval(t, projects.postly.getAnimDelayVideo())
                        }
                    })
                }
                projects.postly.illustrationInterval = setInterval(t, 500), animation.launchLearnGraph.init()
            },
            onResize: function() {
                animation.launchLearnGraph.reset()
            },
            reset: function() {}
        },
        iris: {
            illustrationInterval: null,
            currentAnimation: -1,
            animationsLength: 3,
            animContainer: null,
            toAnim: !1,
            init: function() {
                projects.iris.currentAnimation = -1, projects.iris.toAnim = !1;
                var e = document.getElementById("iris-anims-anchor"),
                    t = function() {
                        if (!projects.iris.toAnim && e && e.className.indexOf("animated") !== -1 && (projects.iris.toAnim = !0, projects.iris.illustrationInterval && clearInterval(projects.iris.illustrationInterval), projects.iris.illustrationInterval = setInterval(t, 3500)), projects.iris.toAnim) {
                            var n = projects.iris.animationsLength - 1,
                                a = projects.iris.currentAnimation;
                            projects.iris.currentAnimation = a + 1 > n ? 0 : a + 1, projects.iris.animContainer.className = "anim-" + projects.iris.currentAnimation
                        }
                    },
                    n = document.getElementById("iris-anims-container");
                if (projects.iris.animContainer = n, n) {
                    var a = n.getElementsByClassName("title");
                    n.getElementsByClassName("animation");
                    projects.iris.animationsLength = a.length, helpers.foreach(a, function(e, a) {
                        e.onclick = function() {
                            projects.iris.currentAnimation = a, projects.iris.illustrationInterval && clearInterval(projects.iris.illustrationInterval);
                            var o = e.getAttribute("data-index");
                            n.className = "anim-" + o, projects.iris.illustrationInterval = setInterval(t, 3500)
                        }
                    })
                }
                projects.iris.illustrationInterval = setInterval(t, 500), animation.irisGraph.init()
            },
            onResize: function() {
                animation.irisGraph.reset()
            },
            reset: function() {}
        },
        guess: {
            currentProccessSlide: 1,
            numSlides: 6,
            init: function() {
                var e = document.getElementById("process-screens-wrapper"),
                    t = document.getElementById("next-step"),
                    n = document.getElementById("replay");
                projects.guess.numSlides = e.getAttribute("data-slides-num") || 6, t.onclick = function() {
                    projects.guess.currentProccessSlide += 1;
                    var t = "screen-" + projects.guess.currentProccessSlide;
                    projects.guess.currentProccessSlide == projects.guess.numSlides && (t += " last-screen"), e.className = t
                }, n.onclick = function() {
                    projects.guess.currentProccessSlide = 1;
                    var t = "screen-" + projects.guess.currentProccessSlide;
                    helpers.removeClass(e, "last-screen"), e.className = t
                }, animation.functionsLogoDrawing.init()
            },
            reset: function() {}
        },
        yapital: {
            illustrationInterval: null,
            currentTab: 0,
            numTabs: 3,
            tabs: null,
            screens: null,
            init: function() {
                projects.yapital.tabs = document.querySelectorAll(".merchant-out-wrapper .tab-item"), projects.yapital.screens = document.querySelectorAll(".merchant-out-wrapper .screen-item"), projects.guess.numSlides = projects.yapital.tabs.length || 3, helpers.foreach(projects.yapital.tabs, function(e, t) {
                    e.onclick = function() {
                        projects.yapital.illustrationInterval && clearInterval(projects.yapital.illustrationInterval), helpers.contains(e.className.split(" "), "active") || e.classList.add("active"), helpers.foreach(projects.yapital.screens, function(e, n) {
                            t != n && helpers.removeClass(e, "active"), t != n || helpers.contains(e.className.split(" "), "active") || e.classList.add("active")
                        }), helpers.foreach(projects.yapital.tabs, function(e, n) {
                            t != n && helpers.removeClass(e, "active")
                        }), projects.yapital.currentTab = t
                    }
                }), projects.yapital.illustrationInterval && clearInterval(projects.yapital.illustrationInterval), animation.yapitalRecommendNumber.init(), animation.yapitalNumberProgress.init(), animation.yapitalIconsDrawing.init(), animation.yapitalGraph.init()
            },
            onResize: function() {
                animation.yapitalGraph.reset()
            },
            autoSlideMerchant: function() {
                var e = function() {
                    projects.yapital.screens && projects.yapital.tabs && ! function() {
                        projects.yapital.currentTab = projects.yapital.currentTab + 1 > projects.yapital.numTabs - 1 ? 0 : projects.yapital.currentTab + 1;
                        var e = projects.yapital.tabs[projects.yapital.currentTab];
                        helpers.contains(e.className.split(" "), "active") || e.classList.add("active"), helpers.foreach(projects.yapital.screens, function(e, t) {
                            projects.yapital.currentTab != t && helpers.removeClass(e, "active"), projects.yapital.currentTab != t || helpers.contains(e.className.split(" "), "active") || e.classList.add("active")
                        }), helpers.foreach(projects.yapital.tabs, function(e, t) {
                            projects.yapital.currentTab != t && helpers.removeClass(e, "active")
                        })
                    }()
                };
                projects.yapital.illustrationInterval && clearInterval(projects.yapital.illustrationInterval), projects.yapital.illustrationInterval = setInterval(e, 4e3)
            },
            reset: function() {}
        }
    },







    