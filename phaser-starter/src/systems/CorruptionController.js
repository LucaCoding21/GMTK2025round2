export class CorruptionController {
  constructor(scene) {
    this.scene = scene;
    this.level = 1;
    this.overlay = null;
    this.flickerTimer = null;
  }

  setLevel(day) {
    this.level = Math.min(day, 6);
    this.applyCorruption();
  }

  applyCorruption() {
    // Remove existing overlay
    if (this.overlay) {
      this.overlay.destroy();
    }

    // Create corruption overlay based on level
    const intensity = (this.level - 1) / 5; // 0 to 1 scale
    const color = this.getCorruptionColor(intensity);
    
    this.overlay = this.scene.add.rectangle(480, 300, 960, 600, color, intensity * 0.3)
      .setDepth(500)
      .setVisible(false);

    // Apply CRT/flicker effect for higher levels
    if (this.level >= 4) {
      this.startFlicker();
    }
  }

  getCorruptionColor(intensity) {
    // Color progression: normal -> yellow -> orange -> red -> dark red
    if (intensity < 0.2) return 0xffffff; // Normal
    if (intensity < 0.4) return 0xffff00; // Yellow tint
    if (intensity < 0.6) return 0xff8800; // Orange tint
    if (intensity < 0.8) return 0xff4400; // Red tint
    return 0x880000; // Dark red
  }

  startFlicker() {
    if (this.flickerTimer) {
      this.flickerTimer.destroy();
    }

    this.flickerTimer = this.scene.time.addEvent({
      delay: 100 + (6 - this.level) * 50, // Faster flicker for higher corruption
      callback: () => {
        if (this.overlay) {
          this.overlay.setVisible(!this.overlay.visible);
        }
      },
      loop: true
    });
  }

  showOverlay() {
    if (this.overlay) {
      this.overlay.setVisible(true);
    }
  }

  hideOverlay() {
    if (this.overlay) {
      this.overlay.setVisible(false);
    }
  }

  // Death sequence corruption effect
  playDeathEffect() {
    if (!this.overlay) return;

    // Red flash
    this.overlay.setFillStyle(0xff0000, 0.8);
    this.overlay.setVisible(true);

    // Camera shake
    this.scene.cameras.main.shake(1000, 0.02);

    // Fade to black
    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 2000,
      onComplete: () => {
        // Reset to normal corruption level
        this.applyCorruption();
      }
    });
  }

  destroy() {
    if (this.overlay) {
      this.overlay.destroy();
    }
    if (this.flickerTimer) {
      this.flickerTimer.destroy();
    }
  }
} 