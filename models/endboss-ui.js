/**
 * Handles UI logic for the Endboss class.
 * @param {Endboss} endboss - The endboss instance.
 */
class EndbossUI {
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Updates endboss status bar.
   */
  updateStatusBar(statusBar) {
    statusBar.setPercentage(this.endboss.energy);
  }
}

window.EndbossUI = EndbossUI;
