/**
 * List of all page div IDs used for navigation and visibility control.
 */
const PAGE_DIV_IDS = [
  "div-datenschutz",
  "div-game-over",
  "div-highscore",
  "div-start-screen",
  "div-settings",
  "div-overlay-highscore",
  "div-impressum",
  "div-how-to-play",
  "div-win",
];

/**
 * Hides all page divs listed in PAGE_DIV_IDS.
 */
function hideAllPageDivs() {
  /**
   * Hide all page divs listed in PAGE_DIV_IDS.
   */
  PAGE_DIV_IDS.forEach(hideDivById);
}

function hideDivById(id) {
  /**
   * Hide a div by its ID if it exists.
   * @param {string} id - The element ID
   */
  const div = document.getElementById(id);
  if (div) div.style.display = "none";
}

/**
 * Hides the canvas and both button bars.
 */
function hideCanvasAndBars() {
  /**
   * Hide the canvas and both button bars.
   */
  ["canvas", "canvasFullscreenBtn", "mobileButtonsBar"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

/**
 * Returns the div id for a given page name.
 * @param {string} pageName - The name of the page
 * @returns {string} The div id
 */
function getDivId(pageName) {
  /**
   * Get the div ID for a given page name.
   * @param {string} pageName - The name of the page
   * @returns {string} The div ID
   */
  return `div-${pageName}`;
}

/**
 * Returns the div element for a given div id.
 * @param {string} divId - The id of the div
 * @returns {HTMLElement|null} The div element or null
 */
function getPageDiv(divId) {
  /**
   * Get the div element for a given div ID.
   * @param {string} divId - The div ID
   * @returns {HTMLElement|null} The div element or null
   */
  return document.getElementById(divId);
}

/**
 * Sets the given div visible (display block).
 * @param {HTMLElement} div - The div to show
 */
function setPageDivVisible(div) {
  /**
   * Set the given div visible (display: block).
   * @param {HTMLElement} div - The div to show
   */
  div.style.display = "block";
}

/**
 * Sets the page-divs section visible if it exists.
 */
function setPageDivsSectionVisible() {
  /**
   * Set the page-divs section visible if it exists.
   */
  const pageDivsSection = document.getElementById("page-divs");
  if (pageDivsSection) pageDivsSection.style.display = "block";
}

/**
 * Extracts the body content from HTML string.
 * @param {string} html - The HTML string
 * @returns {string} The body content or the full HTML
 */
function getHtmlBody(html) {
  /**
   * Extract the body content from an HTML string.
   * @param {string} html - The HTML string
   * @returns {string} The body content or the full HTML
   */
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

/**
 * Extracts all CSS link hrefs from HTML string.
 * @param {string} html - The HTML string
 * @returns {string[]} Array of CSS hrefs
 */
function extractCssLinks(html) {
  /**
   * Extract all CSS link hrefs from an HTML string.
   * @param {string} html - The HTML string
   * @returns {string[]} Array of CSS hrefs
   */
  return [...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi)].map(
    (m) => m[1],
  );
}

/**
 * Extracts all JS script srcs from HTML string.
 * @param {string} html - The HTML string
 * @returns {string[]} Array of JS srcs
 */
function extractJsLinks(html) {
  /**
   * Extract all JS script srcs from an HTML string.
   * @param {string} html - The HTML string
   * @returns {string[]} Array of JS srcs
   */
  return [
    ...html.matchAll(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi),
  ].map((m) => m[1]);
}

/**
 * Adds CSS link elements to the document head if not already present.
 * @param {string[]} cssLinks - Array of CSS hrefs
 */
function addCssLinks(cssLinks) {
  /**
   * Add CSS link elements to the document head if not already present.
   * @param {string[]} cssLinks - Array of CSS hrefs
   */
  cssLinks.forEach(addCssLinkIfMissing);
}

function addCssLinkIfMissing(href) {
  /**
   * Add a single CSS link to the document head if missing.
   * @param {string} href - The CSS file href
   */
  if (!document.querySelector(`link[href='${href}']`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}

/**
 * Adds JS script elements to the document body if not already present.
 * @param {string[]} jsLinks - Array of JS srcs
 */
function addJsLinks(jsLinks) {
  /**
   * Add JS script elements to the document body if not already present.
   * @param {string[]} jsLinks - Array of JS srcs
   */
  jsLinks.forEach(addJsLinkIfMissing);
}

function addJsLinkIfMissing(src) {
  /**
   * Add a single JS script to the document body if missing.
   * @param {string} src - The JS file src
   */
  if (!document.querySelector(`script[src='${src}']`)) {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
  }
}

/**
 * Loads HTML content for a page and injects it into the div.
 * @param {string} pageName - The name of the page
 * @param {HTMLElement} div - The div to inject content into
 */

// --- Functions moved to part 2 ---
// See js/div-visibility-manager-part2.js for the rest of the implementation.
