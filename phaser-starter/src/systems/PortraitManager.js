export class PortraitManager {
  constructor(scene) {
    this.scene = scene;
    this.currentPortrait = null;
    this.isConfirming = false;
    
    // Create portrait container (centered)
    this.container = scene.add.container(625, 345).setDepth(1000).setVisible(false);
    
    // Create beautiful background overlay with gradient effect
    this.createBackgroundOverlay();
    
    // Create modern portrait frame
    this.createPortraitFrame();
    
    // Create modern text elements
    this.createTextElements();
    
    // Create modern buttons
    this.createButtons();
    
    // Add all elements to container
    this.container.add([
      this.bgOverlay, this.bgPanel, this.portraitFrame, this.portraitImage,
      this.nameLabel, this.dialogueText, this.accuseButton, this.closeButton,
      this.yesButton, this.noButton
    ]);
    
    // Set up button handlers
    this.setupButtonHandlers();
  }

  createBackgroundOverlay() {
    // Semi-transparent overlay
    this.bgOverlay = this.scene.add.rectangle(0, 0, 1250, 690, 0x000000, 0.7);
    
    // Main panel with rounded corners and gradient
    this.bgPanel = this.scene.add.graphics();
    this.bgPanel.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 1);
    this.bgPanel.fillRoundedRect(-400, -200, 800, 400, 20);
    this.bgPanel.lineStyle(3, 0x3498db, 1);
    this.bgPanel.strokeRoundedRect(-400, -200, 800, 400, 20);
  }

  createPortraitFrame() {
    // Portrait background with glow effect
    this.portraitFrame = this.scene.add.graphics();
    this.portraitFrame.fillStyle(0x3498db, 0.3);
    this.portraitFrame.fillRoundedRect(-120, -120, 240, 240, 15);
    this.portraitFrame.lineStyle(4, 0x3498db, 1);
    this.portraitFrame.strokeRoundedRect(-120, -120, 240, 240, 15);
    
    // Portrait image (placeholder rectangle)
    this.portraitImage = this.scene.add.rectangle(0, 0, 200, 200, 0x8888ff, 1);
    this.portraitImage.setStrokeStyle(2, 0xffffff);
  }

  createTextElements() {
    // Character name with modern styling
    this.nameLabel = this.scene.add.text(0, -180, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#2c3e50",
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Dialogue text with better typography
    this.dialogueText = this.scene.add.text(0, 80, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ecf0f1",
      wordWrap: { width: 600 },
      align: "center",
      lineSpacing: 5
    }).setOrigin(0.5);
  }

  createButtons() {
    // Modern button styling function
    const createModernButton = (x, y, text, color, bgColor) => {
      const button = this.scene.add.graphics();
      button.fillStyle(bgColor, 1);
      button.fillRoundedRect(x - 80, y - 25, 160, 50, 10);
      button.lineStyle(2, color, 1);
      button.strokeRoundedRect(x - 80, y - 25, 160, 50, 10);
      
      const textObj = this.scene.add.text(x, y, text, {
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        fontStyle: "bold",
        color: color
      }).setOrigin(0.5);
      
      const group = this.scene.add.container(0, 0, [button, textObj]);
      group.setInteractive(new Phaser.Geom.Rectangle(x - 80, y - 25, 160, 50), Phaser.Geom.Rectangle.Contains);
      group.setData("text", textObj);
      group.setData("background", button);
      
      return group;
    };
    
    // Create buttons
    this.accuseButton = createModernButton(200, 120, "ACCUSE", "#e74c3c", "#2c3e50");
    this.closeButton = createModernButton(-200, 120, "CLOSE", "#95a5a6", "#2c3e50");
    this.yesButton = createModernButton(-100, 120, "YES, GET OFF", "#e74c3c", "#2c3e50");
    this.noButton = createModernButton(100, 120, "NEVER MIND", "#95a5a6", "#2c3e50");
    
    // Initially hide confirmation buttons
    this.yesButton.setVisible(false);
    this.noButton.setVisible(false);
  }

  setupButtonHandlers() {
    // Add hover effects
    this.addButtonHoverEffects(this.closeButton, "#7f8c8d", "#34495e");
    this.addButtonHoverEffects(this.accuseButton, "#c0392b", "#2c3e50");
    this.addButtonHoverEffects(this.yesButton, "#c0392b", "#2c3e50");
    this.addButtonHoverEffects(this.noButton, "#7f8c8d", "#34495e");
    
    this.closeButton.on("pointerdown", () => {
      this.hide();
    });
    
    this.accuseButton.on("pointerdown", () => {
      const runState = this.scene.game.runState;
      if (runState.day === 1) {
        this.showDay1Message();
      } else {
        this.showConfirmation();
      }
    });
    
    this.yesButton.on("pointerdown", () => {
      if (this.currentPassenger) {
        this.scene.events.emit("passengerAccused", this.currentPassenger.id);
        this.hide();
      }
    });
    
    this.noButton.on("pointerdown", () => {
      this.hideConfirmation();
    });
  }

  addButtonHoverEffects(button, hoverColor, hoverBgColor) {
    button.on("pointerover", () => {
      button.getData("text").setColor(hoverColor);
      button.getData("background").clear();
      button.getData("background").fillStyle(hoverBgColor, 1);
      button.getData("background").fillRoundedRect(-80, -25, 160, 50, 10);
      button.getData("background").lineStyle(2, hoverColor, 1);
      button.getData("background").strokeRoundedRect(-80, -25, 160, 50, 10);
    });
    
    button.on("pointerout", () => {
      const isAccuse = button.getData("text").text === "ACCUSE";
      const isYes = button.getData("text").text === "YES, GET OFF";
      const color = isAccuse || isYes ? "#e74c3c" : "#95a5a6";
      const bgColor = "#2c3e50";
      
      button.getData("text").setColor(color);
      button.getData("background").clear();
      button.getData("background").fillStyle(bgColor, 1);
      button.getData("background").fillRoundedRect(-80, -25, 160, 50, 10);
      button.getData("background").lineStyle(2, color, 1);
      button.getData("background").strokeRoundedRect(-80, -25, 160, 50, 10);
    });
  }

  showDay1Message() {
    this.dialogueText.setText("This is Day 1 - there are no anomalies on the bus today. Everyone is innocent.");
    
    this.accuseButton.getData("text").setText("DAY 1 - NO ANOMALIES");
    this.accuseButton.getData("text").setColor("#27ae60");
    this.accuseButton.getData("background").clear();
    this.accuseButton.getData("background").fillStyle("#27ae60", 1);
    this.accuseButton.getData("background").fillRoundedRect(-80, -25, 160, 50, 10);
    this.accuseButton.getData("background").lineStyle(2, "#27ae60", 1);
    this.accuseButton.getData("background").strokeRoundedRect(-80, -25, 160, 50, 10);
    
    this.scene.time.delayedCall(3000, () => {
      this.hide();
    });
  }

  show(passenger, runState, dialogueData) {
    this.currentPassenger = passenger;
    this.isConfirming = false;
    this.container.setVisible(true);
    
    const isAnomaly = runState.isAnomaly(passenger.id);
    const variant = isAnomaly ? "anomaly" : "normal";
    
    // Update portrait appearance
    this.portraitImage.setFillStyle(variant === "anomaly" ? 0xff4466 : 0x8888ff);
    this.nameLabel.setText(`${passenger.displayName} – ${variant.toUpperCase()}`);
    
    // Show dialogue
    const dialogue = dialogueData[passenger.id];
    if (dialogue && dialogue[variant]) {
      this.dialogueText.setText(dialogue[variant]);
    } else {
      this.dialogueText.setText("...");
    }
    
    // Reset accuse button
    this.accuseButton.getData("text").setText("ACCUSE");
    this.accuseButton.getData("text").setColor("#e74c3c");
    this.accuseButton.getData("background").clear();
    this.accuseButton.getData("background").fillStyle("#2c3e50", 1);
    this.accuseButton.getData("background").fillRoundedRect(-80, -25, 160, 50, 10);
    this.accuseButton.getData("background").lineStyle(2, "#e74c3c", 1);
    this.accuseButton.getData("background").strokeRoundedRect(-80, -25, 160, 50, 10);
    
    this.showNormalButtons();
  }

  showConfirmation() {
    this.isConfirming = true;
    
    const dialogue = this.scene.cache.json.get("dialogue")[this.currentPassenger.id];
    if (dialogue && dialogue.confirm) {
      this.dialogueText.setText(dialogue.confirm);
    } else {
      this.dialogueText.setText("Are you serious right now?");
    }
    
    this.showConfirmationButtons();
  }

  hideConfirmation() {
    this.isConfirming = false;
    
    const isAnomaly = this.scene.game.runState.isAnomaly(this.currentPassenger.id);
    const variant = isAnomaly ? "anomaly" : "normal";
    const dialogue = this.scene.cache.json.get("dialogue")[this.currentPassenger.id];
    
    if (dialogue && dialogue[variant]) {
      this.dialogueText.setText(dialogue[variant]);
    }
    
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