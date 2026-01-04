(function (window, document) {
  if (window.__spa_router_installed) return;
  window.__spa_router_installed = true;

  var routes = {};
  var currentPath = location.pathname;

  function showOverlayPage(path) {
    return fetchOverlayHtml(path).then(insertOverlayHtml);
  }
  function fetchOverlayHtml(path) {
    return fetch(path, { cache: "no-cache" })
      .then(checkResponse)
      .then((res) => res.text());
  }
  function checkResponse(res) {
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    return res;
  }
  function insertOverlayHtml(htmlText) {
    var parsed = parseHTML(htmlText);
    let overlay = getOrCreateOverlay();
    overlay.classList.remove("hidden");
    overlay.innerHTML = parsed.body ? parsed.body.innerHTML : htmlText;
    return Promise.all([ensureStyles(parsed), executeScripts(parsed, overlay)]);
  }

  function getOrCreateOverlay() {
    let overlay = document.getElementById("extrascreens");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "extrascreens";
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  /**
   * Parses an HTML string into a Document object.
   * @param {string} htmlText - The HTML string to parse.
   * @returns {Document} The parsed HTML document.
   */
  function parseHTML(htmlText) {
    return new DOMParser().parseFromString(htmlText, "text/html");
  }

  /**
   * Checks if a script with the given src is already loaded.
   * @param {string} src - The script source URL to check.
   * @returns {boolean} True if the script is already loaded, false otherwise.
   */
  function scriptAlreadyLoaded(src) {
    if (!src) return false;
    src = normalizeUrl(src);
    return Array.from(document.querySelectorAll("script[src]")).some((s) => {
      return normalizeUrl(s.getAttribute("src")) === src;
    });
  }
  function normalizeUrl(url) {
    var a = document.createElement("a");
    a.href = url;
    return a.href;
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
    return runAllScripts(scripts, targetRoot);
  }

  function runAllScripts(scripts, targetRoot) {
    return scripts.reduce(runScriptReducer(targetRoot), Promise.resolve());
  }
  function runScriptReducer(targetRoot) {
    return function (p, s) {
      return p.then(() => runScript(s, targetRoot));
    };
  }
  function runScript(s, targetRoot) {
    if (s.src) return loadExternalScript(s, targetRoot);
    runInlineScript(s, targetRoot);
    return Promise.resolve();
  }

  function runInlineScript(s, targetRoot) {
    var inline = document.createElement("script");
    if (s.type) inline.type = s.type;
    inline.text = s.textContent || s.innerText || "";
    targetRoot.appendChild(inline);
  }

  function loadExternalScript(s, targetRoot) {
    return new Promise(function (resolve) {
      var src = s.getAttribute("src");
      if (!src || scriptAlreadyLoaded(src)) return resolve();
      var ext = document.createElement("script");
      if (s.type) ext.type = s.type;
      ext.src = src;
      ext.onload = ext.onerror = () => resolve();
      (document.head || document.documentElement).appendChild(ext);
    });
  }

  /**
   * Checks if a stylesheet with the given href is already loaded.
   * @param {string} href - The stylesheet URL to check.
   * @returns {boolean} True if the stylesheet is already loaded, false otherwise.
   */
  function styleAlreadyLoaded(href) {
    if (!href) return false;
    href = normalizeUrl(href);
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (l) => {
        return normalizeUrl(l.getAttribute("href")) === href;
      }
    );
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
    removeOldStyles();
    var promises = headLinks.map(loadStylesheet);
    headStyles.forEach(addInlineStyle);
    return Promise.all(promises);
  }

  function removeOldStyles() {
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach(
      (link) => {
        var href = link.getAttribute("href");
        if (href && !href.includes("root.css")) link.remove();
      }
    );
  }

  function loadStylesheet(lnk) {
    var href = lnk.getAttribute("href");
    if (!href || (href.includes("root.css") && styleAlreadyLoaded(href)))
      return Promise.resolve();
    return new Promise(function (resolve) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = link.onerror = () => resolve();
      (document.head || document.documentElement).appendChild(link);
    });
  }

  function addInlineStyle(st) {
    var style = document.createElement("style");
    if (st.textContent) style.textContent = st.textContent;
    (document.head || document.documentElement).appendChild(style);
  }
  /**
   * Replaces the current body content with content from the new document.
   * @param {Document} newDoc - The new document containing the body to replace.
   * @returns {Promise<boolean>} A promise that resolves with true if successful, false otherwise.
   */
  function replaceBody(newDoc) {
    var newBody = newDoc.body;
    if (!newBody) return Promise.resolve(false);
    destroyCurrentRoute();
    return ensureStyles(newDoc)
      .then(() => {
        copyBodyAttributes(newBody);
        document.body.innerHTML = newBody.innerHTML;
        return executeScripts(newDoc, document.body);
      })
      .then(() => {
        afterBodyReplace();
        return true;
      });
  }

  function destroyCurrentRoute() {
    if (
      routes[currentPath] &&
      typeof routes[currentPath].destroy === "function"
    ) {
      routes[currentPath].destroy();
    }
  }

  function copyBodyAttributes(newBody) {
    var attrs = newBody.attributes;
    while (document.body.attributes.length > 0) {
      document.body.removeAttribute(document.body.attributes[0].name);
    }
    for (var i = 0; i < attrs.length; i++) {
      document.body.setAttribute(attrs[i].name, attrs[i].value);
    }
  }

  function afterBodyReplace() {
    var next = location.pathname;
    if (routes[next] && typeof routes[next].init === "function") {
      routes[next].init();
    }
    if (typeof window.init === "function") {
      window.init();
    }
    currentPath = next;
    document.dispatchEvent(
      new CustomEvent("spa:render", { detail: { path: next } })
    );
  }
  /**
   * Fetches a page and renders it in the SPA.
   * @param {string} path - The path to fetch.
   * @param {boolean} replace - If true, replaces history state instead of pushing.
   * @returns {Promise} A promise that resolves when the page is rendered.
   */
  function fetchAndRender(path, replace) {
    // Overlay-Fall
    if (path.includes("win.html") || path.includes("game-over.html")) {
      return showOverlayPage(path).catch(function (err) {
        console.error("Overlay fetch failed", err);
        throw err;
      });
    }
    // Standard SPA-Body-Replace
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
        console.error(
          "SPA: fetch failed, falling back to full navigation.",
          err
        );
        throw err;
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
