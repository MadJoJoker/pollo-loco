// div-visibility-manager.js
// Zentrale Steuerung für Sichtbarkeit der Seiten-Divs in index.html

const PAGE_DIV_IDS = [
  "div-datenschutz",
  "div-game-over",
  "div-highscore",
  "div-start-screen",
  "div-settings",
  "div-overlay-highscore",
  "div-main-menu",
  "div-impressum",
  "div-how-to-play",
  "div-win",
];

/**
 * Zeigt nur das gewünschte Div an, lädt bei Bedarf den Inhalt aus der zugehörigen HTML-Datei.
 * @param {string} pageName z.B. "start-screen" (ohne .html)
 */
async function showPageDiv(pageName) {
  const pageDivsSection = document.getElementById("page-divs");
  if (pageDivsSection) pageDivsSection.style.display = "block";
  // Alle Divs verstecken
  PAGE_DIV_IDS.forEach((id) => {
    const div = document.getElementById(id);
    if (div) div.style.display = "none";
  });
  // Canvas selbst verstecken
  const canvas = document.getElementById("canvas");
  if (canvas) canvas.style.display = "none";
  // Auch die Button-Bars verstecken
  const canvasFullscreenBtn = document.getElementById("canvasFullscreenBtn");
  if (canvasFullscreenBtn) canvasFullscreenBtn.style.display = "none";
  const mobileButtonsBar = document.getElementById("mobileButtonsBar");
  if (mobileButtonsBar) mobileButtonsBar.style.display = "none";
  // Ziel-Div bestimmen
  const divId = `div-${pageName}`;
  const div = document.getElementById(divId);
  if (!div) return;
  // Falls leer, Inhalt laden
  if (!div.hasAttribute("data-loaded")) {
    const url = `pages/${pageName.replace(/_/g, "-")}.html`;
    const resp = await fetch(url);
    const html = await resp.text();
    // Body extrahieren
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    div.innerHTML = bodyHtml;
    // CSS/JS einbinden
    const cssLinks = [
      ...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi),
    ].map((m) => m[1]);
    cssLinks.forEach((href) => {
      if (!document.querySelector(`link[href='${href}']`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });
    const jsLinks = [
      ...html.matchAll(
        /<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi,
      ),
    ].map((m) => m[1]);
    jsLinks.forEach((src) => {
      if (!document.querySelector(`script[src='${src}']`)) {
        const script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script);
      }
    });
    div.setAttribute("data-loaded", "1");
  }
  // Div anzeigen
  div.style.display = "block";
}

// Export für globale Nutzung
window.showPageDiv = showPageDiv;
