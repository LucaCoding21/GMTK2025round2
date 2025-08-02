export class PortraitManager {
  constructor(scene) {
    this.scene = scene;
    this.currentPortrait = null;
    this.isConfirming = false;
    
    // Create portrait container (centered for now, can expand to L/R later)
    this.container = scene.add.container(480, 300).setDepth(1000).setVisible(false);
    
    // Background overlay
    this.bg = scene.add.rectangle(0, 140, 900, 160, 0x000000, 0.6);
    
    // Portrait frame (placeholder rectangle)
    this.face = scene.add.rectangle(0, -40, 220, 220, 0x8888ff, 1);
    
    // Character name and variant label
    this.label = scene.add.text(0, 100, "", { 
      fontFamily: "monospace", 
      fontSize: 18,
      color: "#ffffff"
    }).setOrigin(0.5);
    
    // Dialogue text
    this.dialogueText = scene.add.text(0, 60, "", {
      fontFamily: "monospace",
      fontSize: 16,
      color: "#ffffff",
      wordWrap: { width: 380 }
    }).setOrigin(0.5);
    
    // Accuse button
    this.accuseButton = scene.add.text(200, 120, "ACCUSE", {
      fontFamily: "monospace",
      fontSize: 16,
      color: "#ff4444",
      backgroundColor: "#000000"
    }).setOrigin(0.5).setPadding(8, 12).setInteractive({ useHandCursor: true });
    
    // Close button
    this.closeButton = scene.add.text(-200, 120, "CLOSE", {
      fontFamily: "monospace",
      fontSize: 16,
      color: "#cccccc",
      backgroundColor: "#000000"
    }).setOrigin(0.5).setPadding(8, 12).setInteractive({ useHandCursor: true });
    
    // Confirmation buttons (initially hidden)
    this.yesButton = scene.add.text(-100, 120, "YES, GET OFF", {
      fontFamily: "monospace",
      fontSize: 16,
      color: "#ff4444",
      backgroundColor: "#000000"
    }).setOrigin(0.5).setPadding(8, 12).setInteractive({ useHandCursor: true }).setVisible(false);
    
    this.noButton = scene.add.text(100, 120, "NEVER MIND", {
      fontFamily: "monospace",
      fontSize: 16,
      color: "#cccccc",
      backgroundColor: "#000000"
    }).setOrigin(0.5).setPadding(8, 12).setInteractive({ useHandCursor: true }).setVisible(false);
    
    this.container.add([this.bg, this.face, this.label, this.dialogueText, this.accuseButton, this.closeButton, this.yesButton, this.noButton]);
    
    // Set up button handlers
    this.setupButtonHandlers();
  }

  setupButtonHandlers() {
    this.closeButton.on("pointerdown", () => {
      this.hide();
    });
    
    this.accuseButton.on("pointerdown", () => {
      // Check if it's Day 1 (no anomalies)
      const runState = this.scene.game.runState;
      if (runState.day === 1) {
        this.showDay1Message();
      } else {
        this.showConfirmation();
      }
    });
    
    this.yesButton.on("pointerdown", () => {
      if (this.currentPassenger) {
        // Emit event to remove passenger from bus immediately
        this.scene.events.emit("passengerAccused", this.currentPassenger.id);
        this.hide();
      }
    });
    
    this.noButton.on("pointerdown", () => {
      this.hideConfirmation();
    });
  }

  showDay1Message() {
    // Show a message explaining that Day 1 has no anomalies
    this.dialogueText.setText("This is Day 1 - there are no anomalies on the bus today. Everyone is innocent.");
    
    // Hide accuse button and show a different message
    this.accuseButton.setText("DAY 1 - NO ANOMALIES");
    this.accuseButton.setColor("#44ff44");
    this.accuseButton.setBackgroundColor("#000000");
    
    // Auto-hide after 3 seconds
    this.scene.time.delayedCall(3000, () => {
      this.hide();
    });
  }

  show(passenger, runState, dialogueData) {
    this.currentPassenger = passenger;
    this.isConfirming = false;
    this.container.setVisible(true);
    
    // Determine if this passenger is the anomaly
    const isAnomaly = runState.isAnomaly(passenger.id);
    const variant = isAnomaly ? "anomaly" : "normal";
    
    // Update portrait appearance
    this.face.setFillStyle(variant === "anomaly" ? 0xff4466 : 0x8888ff);
    this.label.setText(`${passenger.displayName} – ${variant}`);
    
    // Show dialogue
    const dialogue = dialogueData[passenger.id];
    if (dialogue && dialogue[variant]) {
      this.dialogueText.setText(dialogue[variant]);
    } else {
      this.dialogueText.setText("...");
    }
    
    // Reset accuse button to normal state
    this.accuseButton.setText("ACCUSE");
    this.accuseButton.setColor("#ff4444");
    this.accuseButton.setBackgroundColor("#000000");
    
    // Show normal buttons
    this.showNormalButtons();
  }

  showConfirmation() {
    this.isConfirming = true;
    
    // Show confirmation dialogue
    const dialogue = this.scene.cache.json.get("dialogue")[this.currentPassenger.id];
    if (dialogue && dialogue.confirm) {
      this.dialogueText.setText(dialogue.confirm);
    } else {
      this.dialogueText.setText("Are you serious right now?");
    }
    
    // Show confirmation buttons
    this.showConfirmationButtons();
  }

  hideConfirmation() {
    this.isConfirming = false;
    
    // Return to normal dialogue
    const isAnomaly = this.scene.game.runState.isAnomaly(this.currentPassenger.id);
    const variant = isAnomaly ? "anomaly" : "normal";
    const dialogue = this.scene.cache.json.get("dialogue")[this.currentPassenger.id];
    
    if (dialogue && dialogue[variant]) {
      this.dialogueText.setText(dialogue[variant]);
    }
    
    // Show normal buttons
    this.showNormalButtons();
  }

  showNormalButtons() {
    this.accuseButton.setVisible(true);
    this.closeButton.setVisible(true);
    this.yesButton.setVisible(false);
    this.noButton.setVisible(false);
  }

  showConfirmationButtons() {
    this.accuseButton.setVisible(false);
    this.closeButton.setVisible(false);
    this.yesButton.setVisible(true);
    this.noButton.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
    this.currentPassenger = null;
    this.isConfirming = false;
  }

  fade(duration = 500) {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: duration,
      onComplete: () => {
        this.hide();
        this.container.setAlpha(1);
      }
    });
  }
} 