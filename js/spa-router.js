
(function (window, document) {
  if (window.__spa_router_installed) return;
  window.__spa_router_installed = true;

  var routes = {};
  var currentPath = location.pathname;

  function parseHTML(htmlText) {
    var parser = new DOMParser();
    return parser.parseFromString(htmlText, "text/html");
  }

  function scriptAlreadyLoaded(src) {
    if (!src) return false;
    try {
      var a = document.createElement("a");
      a.href = src;
      src = a.href;
    } catch (e) {}
    var scripts = document.querySelectorAll("script[src]");
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      try {
        var a2 = document.createElement("a");
        a2.href = s.getAttribute("src");
        if (a2.href === src) return true;
      } catch (e) {
        if (s.getAttribute("src") === src) return true;
      }
    }
    return false;
  }


  function executeScripts(fromDoc, targetRoot) {
    var scripts = Array.prototype.slice.call(
      fromDoc.querySelectorAll("script")
    );

    function runInlineScript(s) {
      var inline = document.createElement("script");
      if (s.type) inline.type = s.type;
      inline.text = s.textContent || s.innerText || "";
      targetRoot.appendChild(inline);

    }

    function loadExternalScript(s) {
      return new Promise(function (resolve, reject) {
        var src = s.getAttribute("src");
        if (!src) return resolve();
        if (scriptAlreadyLoaded(src)) return resolve();
        var ext = document.createElement("script");
        if (s.type) ext.type = s.type;
        ext.src = src;
        ext.onload = function () {
          resolve();
        };
        ext.onerror = function () {
          console.warn("Failed to load script", src);
          resolve();
        };
        (document.head || document.documentElement).appendChild(ext);
      });
    }

    return scripts.reduce(function (p, s) {
      return p.then(function () {
        if (s.src) {
          return loadExternalScript(s);
        } else {
          runInlineScript(s);
          return Promise.resolve();
        }
      });
    }, Promise.resolve());
  }

  function styleAlreadyLoaded(href) {
    if (!href) return false;
    try {
      var a = document.createElement("a");
      a.href = href;
      href = a.href;
    } catch (e) {}
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      try {
        var a2 = document.createElement("a");
        a2.href = links[i].getAttribute("href");
        if (a2.href === href) return true;
      } catch (e) {
        if (links[i].getAttribute("href") === href) return true;
      }
    }
    return false;
  }

  function ensureStyles(fromDoc) {
    var headLinks = Array.prototype.slice.call(
      (fromDoc.head &&
        fromDoc.head.querySelectorAll('link[rel="stylesheet"]')) ||
        []
    );
    var headStyles = Array.prototype.slice.call(
      (fromDoc.head && fromDoc.head.querySelectorAll("style")) || []
    );
    var promises = [];

    headLinks.forEach(function (lnk) {
      var href = lnk.getAttribute("href");
      if (!href) return;
      if (styleAlreadyLoaded(href)) return;
      promises.push(
        new Promise(function (resolve) {
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = href;
          link.onload = function () {
            resolve();
          };
          link.onerror = function () {
            console.warn("Failed to load stylesheet", href);
            resolve();
          };
          (document.head || document.documentElement).appendChild(link);
        })
      );
    });

    headStyles.forEach(function (st) {
      var style = document.createElement("style");
      if (st.textContent) style.textContent = st.textContent;
      (document.head || document.documentElement).appendChild(style);
    });

    return Promise.all(promises);
  }

  function replaceBody(newDoc) {
    var newBody = newDoc.body;
    if (!newBody) return Promise.resolve(false);

    if (
      routes[currentPath] &&
      typeof routes[currentPath].destroy === "function"
    ) {
      try {
        routes[currentPath].destroy();
      } catch (e) {
        console.error(e);
      }
    }

    return ensureStyles(newDoc)
      .then(function () {
        document.body.innerHTML = newBody.innerHTML;

        return executeScripts(newDoc, document.body)
          .then(function () {
            var next = location.pathname;
            if (routes[next] && typeof routes[next].init === "function") {
              try {
                routes[next].init();
              } catch (e) {
                console.error(e);
              }
            }
            if (typeof window.init === "function") {
              try {
                window.init();
              } catch (e) {
              }
            }
            currentPath = next;
            try {
              document.dispatchEvent(
                new CustomEvent("spa:render", { detail: { path: next } })
              );
            } catch (e) {
            }
            return true;
          })
          .catch(function (err) {
            console.error("Error executing scripts from fetched document", err);
            return false;
          });
      })
      .catch(function (err) {
        console.error("Error loading styles from fetched document", err);
        return false;
      });
  }

  function fetchAndRender(path, replace) {
    return fetch(path, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("Fetch failed: " + res.status);
        return res.text();
      })
      .then(function (htmlText) {
        var parsed = parseHTML(htmlText);
        if (replace) history.replaceState({ path: path }, "", path);
        else history.pushState({ path: path }, "", path);

        return replaceBody(parsed).then(function (ok) {
          if (!ok) throw new Error("No body in fetched document");
        });
      })
      .catch(function (err) {
        console.warn("SPA: fetch failed, falling back to full navigation", err);
        window.location.href = path;
      });
  }

  function onLinkClick(e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var el = e.target.closest("[data-link]");
    if (!el) return;
    var href = el.getAttribute("href") || el.dataset.link;
    if (!href) return;
    try {
      var p = href.replace(/#.*$/, "");
      if (/(^|\/)index\.html$/.test(p) || p === "/") {
        window.location.href = href;
        return;
      }
    } catch (e) {
    }

    e.preventDefault();
    fetchAndRender(href, false);
  }

  function onPopState(e) {
    var state = e.state || {};
    var path = state.path || location.pathname;
    fetchAndRender(path, true);
  }

  window.SPA = {
    register: function (path, opts) {
      routes[path] = opts || {};
    },
    navigate: function (path) {
      return fetchAndRender(path, false);
    },
    _internal: {
      routes: routes,
    },
  };

  document.addEventListener("click", onLinkClick);
  window.addEventListener("popstate", onPopState);

  currentPath = location.pathname;
})(window, document);
