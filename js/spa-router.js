(function (window, document) {
  if (window.__spa_router_installed) return;
  window.__spa_router_installed = true;

  var routes = {};
  var currentPath = location.pathname;

  /**
   * Parses an HTML string into a Document object.
   * @param {string} htmlText - The HTML string to parse.
   * @returns {Document} The parsed HTML document.
   */
  function parseHTML(htmlText) {
    var parser = new DOMParser();
    return parser.parseFromString(htmlText, "text/html");
  }

  /**
   * Checks if a script with the given src is already loaded.
   * @param {string} src - The script source URL to check.
   * @returns {boolean} True if the script is already loaded, false otherwise.
   */
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

  /**
   * Executes all scripts from a parsed document in the target root element.
   * @param {Document} fromDoc - The document containing scripts to execute.
   * @param {HTMLElement} targetRoot - The target element to append scripts to.
   * @returns {Promise} A promise that resolves when all scripts are executed.
   */
  function executeScripts(fromDoc, targetRoot) {
    var scripts = Array.prototype.slice.call(
      fromDoc.querySelectorAll("script")
    );

    /**
     * Executes an inline script element.
     * @param {HTMLScriptElement} s - The script element to execute.
     */
    function runInlineScript(s) {
      var inline = document.createElement("script");
      if (s.type) inline.type = s.type;
      inline.text = s.textContent || s.innerText || "";
      targetRoot.appendChild(inline);
    }

    /**
     * Loads an external script element asynchronously.
     * @param {HTMLScriptElement} s - The script element to load.
     * @returns {Promise} A promise that resolves when the script is loaded.
     */
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

  /**
   * Checks if a stylesheet with the given href is already loaded.
   * @param {string} href - The stylesheet URL to check.
   * @returns {boolean} True if the stylesheet is already loaded, false otherwise.
   */
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

  /**
   * Ensures all stylesheets from the new document are loaded, removing old page-specific styles.
   * @param {Document} fromDoc - The document containing stylesheets to load.
   * @returns {Promise} A promise that resolves when all stylesheets are loaded.
   */
  function ensureStyles(fromDoc) {
    var headLinks = Array.prototype.slice.call(
      (fromDoc.head &&
        fromDoc.head.querySelectorAll('link[rel="stylesheet"]')) ||
        []
    );
    var headStyles = Array.prototype.slice.call(
      (fromDoc.head && fromDoc.head.querySelectorAll("style")) || []
    );

    // Remove old page-specific stylesheets and old shared-components (keep only root.css)
    var existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    existingLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href && !href.includes("root.css")) {
        link.remove();
      }
    });

    var promises = [];

    headLinks.forEach(function (lnk) {
      var href = lnk.getAttribute("href");
      if (!href) return;

      // Skip root.css if already loaded (never changes)
      if (href.includes("root.css") && styleAlreadyLoaded(href)) return;

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

  /**
   * Replaces the current body content with content from the new document.
   * @param {Document} newDoc - The new document containing the body to replace.
   * @returns {Promise<boolean>} A promise that resolves with true if successful, false otherwise.
   */
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
        // Copy all body attributes (including id, class, etc.)
        var attrs = newBody.attributes;
        // Remove all existing attributes first
        while (document.body.attributes.length > 0) {
          document.body.removeAttribute(document.body.attributes[0].name);
        }
        // Copy new attributes
        for (var i = 0; i < attrs.length; i++) {
          document.body.setAttribute(attrs[i].name, attrs[i].value);
        }

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
              } catch (e) {}
            }
            currentPath = next;
            try {
              document.dispatchEvent(
                new CustomEvent("spa:render", { detail: { path: next } })
              );
            } catch (e) {}
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

  /**
   * Fetches a page and renders it in the SPA.
   * @param {string} path - The path to fetch.
   * @param {boolean} replace - If true, replaces history state instead of pushing.
   * @returns {Promise} A promise that resolves when the page is rendered.
   */
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

  /**
   * Handles click events on links with data-link attribute for SPA navigation.
   * @param {MouseEvent} e - The click event.
   */
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
    } catch (e) {}

    e.preventDefault();
    fetchAndRender(href, false);
  }

  /**
   * Handles browser back/forward navigation.
   * @param {PopStateEvent} e - The popstate event.
   */
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
