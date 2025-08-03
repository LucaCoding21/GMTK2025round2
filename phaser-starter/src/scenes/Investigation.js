import { PortraitManager } from '../systems/PortraitManager.js';
import { CorruptionController } from '../systems/CorruptionController.js';

const BUS_SEATS = [
  {x: 600, y: 110}, {x: 665, y: 110}, {x: 725, y: 110},
  {x: 600, y: 235}, {x: 665, y: 235}, {x: 725, y: 235}
];

export default class Investigation extends Phaser.Scene {
  constructor(){ super("Investigation"); }
  
  create(data){
    this.day = data?.day ?? 1;
    this.runState = this.game.runState;
    this.dialogue = this.cache.json.get("dialogue");
    
    // Apply corruption level
    this.corruptionController = new CorruptionController(this);
    this.corruptionController.setLevel(this.day);
    
    // Create background
    this.createBackground();
    
    // Create player animations
    this.createPlayerAnimations();
    
    // Create driver with movement
    this.driver = this.add.sprite(470, 105, "driver").setOrigin(0.5).setScale(3).setDepth(2);
    this.driver.play("driver_idle_right");
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Create passengers
    this.createPassengers();
    
    // Create portrait manager
    this.portraitManager = new PortraitManager(this);
    
    // Set up accuse event handler
    this.events.on("accuse", this.handleAccuse, this);
    
    // Set up passenger accused event handler
    this.events.on("passengerAccused", this.handlePassengerAccused, this);
    
    // Set up SPACE key for "no anomaly" option
    this.input.keyboard.on("keydown-SPACE", () => {
      this.handleAccuse("NONE");
    });
    
    // Create modern UI
    this.createModernUI();
  }
  
  createModernUI() {
    // Create header panel
    this.createHeaderPanel();
    
    // Create instructions panel
    this.createInstructionsPanel();
    
    // Create status indicators
    this.createStatusIndicators();
  }
  
  createHeaderPanel() {
    // Header background
    this.headerBg = this.add.graphics();
    this.headerBg.fillGradientStyle(0x2c3e50, 0x34495e, 0x2c3e50, 0x34495e, 1);
    this.headerBg.fillRoundedRect(0, 0, 1250, 80, 0);
    this.headerBg.lineStyle(2, 0x3498db, 1);
    this.headerBg.strokeRoundedRect(0, 0, 1250, 80, 0);
    
    // Day indicator
    this.dayText = this.add.text(30, 25, `DAY ${this.day}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#2c3e50",
      strokeThickness: 3
    });
    
    // Game title
    this.titleText = this.add.text(625, 25, "BUS DRIVER MYSTERY", {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      fontStyle: "bold",
      color: "#3498db",
      stroke: "#2c3e50",
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Anomaly indicator
    this.anomalyText = this.add.text(1220, 25, this.day === 1 ? "NO ANOMALY" : "ANOMALY DETECTED", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
      color: this.day === 1 ? "#27ae60" : "#e74c3c",
      stroke: "#2c3e50",
      strokeThickness: 2
    }).setOrigin(1, 0.5);
  }
  
  createInstructionsPanel() {
    // Instructions background
    this.instructionsBg = this.add.graphics();
    this.instructionsBg.fillStyle(0x2c3e50, 0.9);
    this.instructionsBg.fillRoundedRect(20, 100, 400, 120, 10);
    this.instructionsBg.lineStyle(2, 0x3498db, 1);
    this.instructionsBg.strokeRoundedRect(20, 100, 400, 120, 10);
    
    // Instructions text
    this.instructionsText = this.add.text(40, 120, "INSTRUCTIONS:", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
      color: "#3498db"
    });
    
    this.instruction1 = this.add.text(40, 150, "• Walk around with arrow keys", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ecf0f1"
    });
    
    this.instruction2 = this.add.text(40, 170, "• Click passengers to investigate", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ecf0f1"
    });
    
    this.instruction3 = this.add.text(40, 190, "• Press SPACE to trust everyone", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ecf0f1"
    });
    
    // Day-specific instruction
    if (this.day === 1) {
      this.dayInstruction = this.add.text(40, 210, "• Day 1: Everyone is innocent!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#27ae60",
        fontStyle: "bold"
      });
    } else {
      this.dayInstruction = this.add.text(40, 210, "• Find the anomaly among passengers", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#e74c3c",
        fontStyle: "bold"
      });
    }
  }
  
  createStatusIndicators() {
    // Status panel
    this.statusBg = this.add.graphics();
    this.statusBg.fillStyle(0x2c3e50, 0.9);
    this.statusBg.fillRoundedRect(830, 100, 400, 120, 10);
    this.statusBg.lineStyle(2, 0x3498db, 1);
    this.statusBg.strokeRoundedRect(830, 100, 400, 120, 10);
    
    // Status title
    this.statusTitle = this.add.text(850, 120, "STATUS:", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      fontStyle: "bold",
      color: "#3498db"
    });
    
    // Passenger count
    this.passengerCount = this.add.text(850, 150, `Passengers: ${this.runState.passengers.length}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#ecf0f1"
    });
    
    // Current state
    this.currentState = this.add.text(850, 170, "State: Investigating", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: "#f39c12"
    });
    
    // Anomaly status
    this.anomalyStatus = this.add.text(850, 190, this.day === 1 ? "Anomaly: None (Day 1)" : "Anomaly: Unknown", {
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      color: this.day === 1 ? "#27ae60" : "#e74c3c"
    });
    
    // Controls reminder
    this.controlsReminder = this.add.text(850, 210, "Controls: Arrow Keys + Click + SPACE", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#95a5a6"
    });
  }
  
  createBackground(){
    // Create a tileSprite for consistent background rendering
    // This matches the Pickup scene approach but without scrolling
    this.background = this.add.tileSprite(625, 345, 1250, 690, "background");
    
    // Zoom in the background by scaling it up
    this.background.setScale(4); // Increased scale for more zoom
    
    // Adjust tile position to center the road on screen
    // Move the background up so the road appears in the center
    this.background.tilePositionY = -125; // Adjust this value to center the road
    
    // Set the background depth to be behind everything
    this.background.setDepth(0);
    
    // Add bus interior overlay
    this.busInterior = this.add.image(625, 155, "bus_interior");
    this.busInterior.setScale(1.5); // Standard bus scale
    this.busInterior.setDepth(0.5); // Above background, below characters
  }
  
  createPlayerAnimations(){
    // Create driver idle animations for each direction using frames from the first row (row 0)
    // Frames 0-29 are in the first row, we want frames 0, 1, 2, 3 for the 4 directions
    
    this.anims.create({
      key: "driver_idle_right",
      frames: this.anims.generateFrameNumbers("driver", { frames: [0] }), // First frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_idle_up",
      frames: this.anims.generateFrameNumbers("driver", { frames: [1] }), // Second frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_idle_left",
      frames: this.anims.generateFrameNumbers("driver", { frames: [2] }), // Third frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_idle_down",
      frames: this.anims.generateFrameNumbers("driver", { frames: [3] }), // Fourth frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    // Create driver walking animations from row 2
    // Row 2 starts at frame 112
    // Walking right: frames 112-117 (6 frames)
    // Walking up: frames 118-123 (6 frames) - SWAPPED
    // Walking left: frames 124-129 (6 frames)
    // Walking down: frames 130-135 (6 frames) - SWAPPED
    
    // Debug: Log animation creation
    console.log("Creating driver walking animations...");
    
    this.anims.create({
      key: "driver_walk_right",
      frames: this.anims.generateFrameNumbers("driver", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_walk_up",
      frames: this.anims.generateFrameNumbers("driver", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_walk_left",
      frames: this.anims.generateFrameNumbers("driver", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "driver_walk_down",
      frames: this.anims.generateFrameNumbers("driver", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    console.log("Driver walking animations created!");
    
    // Create passenger idle animations for each direction using frames from the first row (row 0)
    // Frames 0-29 are in the first row, we want frames 0, 1, 2, 3 for the 4 directions
    
    this.anims.create({
      key: "passenger_idle_right",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_up",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_left",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_down",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    // Create passenger walking animations from row 2
    // Row 2 starts at frame 112
    // Walking right: frames 112-117 (6 frames)
    // Walking up: frames 118-123 (6 frames) - SWAPPED
    // Walking left: frames 124-129 (6 frames)
    // Walking down: frames 130-135 (6 frames) - SWAPPED
    
    console.log("Creating passenger walking animations...");
    
    this.anims.create({
      key: "passenger_walk_right",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_walk_up",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_walk_left",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_walk_down",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    console.log("Passenger walking animations created!");
  }
  
  createPassengers(){
    this.passengerSprites = [];
    this.runState.passengers.forEach(passenger => {
      const seat = BUS_SEATS[passenger.seatIndex];
      
      // Use grandma sprite for grandma character, Mr. Lane sprite for Mr. Lane, Ari sprite for Ari, Dex sprite for Dex, otherwise use passenger sprite
      let spriteKey = "passenger";
      let idleAnimKey = "passenger_idle_down";
      
      if (passenger.id === "grandma") {
        spriteKey = "grandma";
        idleAnimKey = "grandma_idle_down";
      } else if (passenger.id === "man") {
        spriteKey = "mrlane";
        idleAnimKey = "mrlane_idle_down";
      } else if (passenger.id === "kid") {
        spriteKey = "girl";
        idleAnimKey = "girl_idle_down";
      } else if (passenger.id === "dog") {
        spriteKey = "busi";
        idleAnimKey = "busi_idle_down";
      }
      
      // Create passenger sprite using the appropriate spritesheet
      const sprite = this.add.sprite(seat.x, seat.y, spriteKey)
        .setScale(3) // Increased scale for bigger characters
        .setDepth(2) // Above bus interior
        .setData("passenger", passenger)
        .setInteractive({ useHandCursor: true });
      
      // Set initial idle animation (facing down)
      sprite.play(idleAnimKey);
      
      // Add click handler for portrait view
      sprite.on("pointerdown", () => {
        this.showPortrait(passenger);
      });
      
      this.passengerSprites.push(sprite);
    });
  }
  
  showPortrait(passenger) {
    this.portraitManager.show(passenger, this.runState, this.dialogue);
  }
  
  handlePassengerAccused(passengerId) {
    // Find the passenger sprite
    const passengerSprite = this.passengerSprites.find(sprite => 
      sprite.getData("passenger").id === passengerId
    );
    
    if (passengerSprite) {
      // Store the player's guess
      this.runState.playerGuess = passengerId;
      
      // Play accuse sound
      this.game.sfx.accuse();
      
      // Animate passenger getting off the bus
      this.tweens.add({
        targets: passengerSprite,
        x: 800,
        y: 300,
        alpha: 0,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          // Remove passenger from the list
          this.passengerSprites = this.passengerSprites.filter(sprite => sprite !== passengerSprite);
          
          // Check if this was the anomaly
          const isCorrect = this.runState.isCorrect();
          
          if (isCorrect) {
            // Correct guess - show success message
            this.add.text(625, 100, `${passengerSprite.getData("passenger").displayName} was the anomaly!`, {
              fontFamily: "monospace", fontSize: 20, color: "#2ecc71"
            }).setOrigin(0.5);
            
            // Continue to driver return after a delay
            this.time.delayedCall(2000, () => {
              const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DriverReturn", { 
                day: this.day 
              });
              guardedTransition();
            });
          } else {
            // Wrong guess - show failure message
            this.add.text(625, 100, `${passengerSprite.getData("passenger").displayName} was innocent!`, {
              fontFamily: "monospace", fontSize: 20, color: "#e74c3c"
            }).setOrigin(0.5);
            
            // Continue to driver return after a delay
            this.time.delayedCall(2000, () => {
              const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DriverReturn", { 
                day: this.day 
              });
              guardedTransition();
            });
          }
        }
      });
    }
  }
  
  handleAccuse(passengerId) {
    // Store the player's guess
    this.runState.playerGuess = passengerId;
    
    // Play accuse sound
    this.game.sfx.accuse();
    
    // Show message for "no anomaly" accusation
    if (passengerId === "NONE") {
      if (this.day === 1) {
        // Day 1: This is the correct choice
        this.add.text(625, 100, "You trust everyone - that's correct for Day 1!", {
          fontFamily: "monospace", fontSize: 20, color: "#44ff44"
        }).setOrigin(0.5);
      } else {
        // Other days: This is a risk
        this.add.text(625, 100, "You trust everyone on the bus", {
          fontFamily: "monospace", fontSize: 20, color: "#44ff44"
        }).setOrigin(0.5);
      }
      
      // Continue to driver return after a delay
      this.time.delayedCall(2000, () => {
        const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DriverReturn", { 
          day: this.day 
        });
        guardedTransition();
      });
    }
  }
  
  update(){
    // Driver movement
    const speed = 100;
    let isMoving = false;
    let direction = "right"; // Default direction
    
    if(this.cursors.left.isDown){
      this.driver.x -= speed * this.game.loop.delta / 1000;
      direction = "left";
      isMoving = true;
    }
    if(this.cursors.right.isDown){
      this.driver.x += speed * this.game.loop.delta / 1000;
      direction = "right";
      isMoving = true;
    }
    if(this.cursors.up.isDown){
      this.driver.y -= speed * this.game.loop.delta / 1000;
      direction = "up";
      isMoving = true;
    }
    if(this.cursors.down.isDown){
      this.driver.y += speed * this.game.loop.delta / 1000;
      direction = "down";
      isMoving = true;
    }
    
    // Update driver animation based on direction and movement
    const targetAnimation = isMoving ? `driver_walk_${direction}` : `driver_idle_${direction}`;
    
    // Only change animation if it's different from current
    if (this.driver.anims.currentAnim?.key !== targetAnimation) {
      this.driver.play(targetAnimation);
    }
    
    // Keep driver in bounds - updated for new bus layout
    this.driver.x = Phaser.Math.Clamp(this.driver.x, 475,800);
    this.driver.y = Phaser.Math.Clamp(this.driver.y, 90, 255);
  }
} 