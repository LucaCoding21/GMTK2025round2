import { CorruptionController } from '../systems/CorruptionController.js';

export default class DaySplash extends Phaser.Scene {
  constructor(){ super("DaySplash"); }
  
  create(data){
    const day = data?.day ?? 1;
    
    // Set corruption level based on day
    this.corruptionController = new CorruptionController(this);
    this.corruptionController.setLevel(day);
    
    // Create beautiful background
    this.createBackground();
    
    // Create main content
    this.createMainContent(day);
    
    // Create interactive elements
    this.createInteractiveElements(day);
  }
  
  createBackground() {
    // Create gradient background
    this.bg = this.add.graphics();
    this.bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x1a1a2e, 0x16213e, 1);
    this.bg.fillRect(0, 0, 1250, 690);
    
    // Add some decorative elements
    this.createDecorativeElements();
  }
  
  createDecorativeElements() {
    // Add subtle grid pattern
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x3498db, 0.1);
    
    for (let x = 0; x < 1250; x += 50) {
      grid.moveTo(x, 0);
      grid.lineTo(x, 690);
    }
    for (let y = 0; y < 690; y += 50) {
      grid.moveTo(0, y);
      grid.lineTo(1250, y);
    }
    grid.strokePath();
  }
  
  createMainContent(day) {
    // Main panel
    this.mainPanel = this.add.graphics();
    this.mainPanel.fillStyle(0x2c3e50, 0.9);
    this.mainPanel.fillRoundedRect(200, 150, 850, 400, 20);
    this.mainPanel.lineStyle(3, 0x3498db, 1);
    this.mainPanel.strokeRoundedRect(200, 150, 850, 400, 20);
    
    // Game title
    this.titleText = this.add.text(625, 200, "BUS DRIVER MYSTERY", {
      fontFamily: "Arial, sans-serif",
      fontSize: "36px",
      fontStyle: "bold",
      color: "#3498db",
      stroke: "#2c3e50",
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Day indicator with glow effect
    this.dayText = this.add.text(625, 280, `DAY ${day}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "64px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#2c3e50",
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Subtitle
    this.subtitleText = this.add.text(625, 360, "Anomaly Detection Game", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#95a5a6"
    }).setOrigin(0.5);
    
    // Day-specific message
    if (day === 1) {
      this.dayMessage = this.add.text(625, 400, "Tutorial Day - No Anomalies", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#27ae60",
        fontStyle: "bold"
      }).setOrigin(0.5);
    } else {
      this.dayMessage = this.add.text(625, 400, "Find the Anomaly Among Passengers", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#e74c3c",
        fontStyle: "bold"
      }).setOrigin(0.5);
    }
    
    // Instructions
    this.instructionsText = this.add.text(625, 480, "Click anywhere to begin", {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#ecf0f1"
    }).setOrigin(0.5);
    
    // Add animations
    this.addAnimations();
  }
  
  createInteractiveElements(day) {
    // Create clickable area
    this.clickArea = this.add.rectangle(625, 345, 1250, 690, 0x000000, 0);
    this.clickArea.setInteractive();
    
    // Use transition guard to prevent double clicks
    const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "Pickup", { day });
    this.clickArea.on("pointerdown", guardedTransition);
    
    // Add hover effect
    this.clickArea.on("pointerover", () => {
      this.instructionsText.setColor("#3498db");
      this.instructionsText.setFontSize("18px");
    });
    
    this.clickArea.on("pointerout", () => {
      this.instructionsText.setColor("#ecf0f1");
      this.instructionsText.setFontSize("16px");
    });
  }
  
  addAnimations() {
    // Fade in animation for title
    this.titleText.setAlpha(0);
    this.tweens.add({
      targets: this.titleText,
      alpha: 1,
      duration: 1000,
      ease: "Power2"
    });
    
    // Scale animation for day text
    this.dayText.setScale(0.5);
    this.tweens.add({
      targets: this.dayText,
      scale: 1,
      duration: 800,
      delay: 500,
      ease: "Back.easeOut"
    });
    
    // Pulse animation for instructions
    this.tweens.add({
      targets: this.instructionsText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      delay: 1500
    });
  }
} 