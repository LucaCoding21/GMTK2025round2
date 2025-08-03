import { CorruptionController } from '../systems/CorruptionController.js';
import { RunState } from '../systems/RunState.js';

const BUS_SEATS = [
  {x: 600, y: 110}, {x: 665, y: 110}, {x: 725, y: 110},
  {x: 600, y: 235}, {x: 665, y: 235}, {x: 725, y: 235}
];

const DRIVER_SEAT = {x: 250, y: 275}; // Driver's seat position moved down by 125 pixels

export default class Dropoff extends Phaser.Scene {
  constructor(){ super("Dropoff"); }
  
  create(data){
    this.day = data?.day ?? 1;
    this.runState = this.game.runState;
    this.currentPassengerIndex = 0;
    
    // Apply corruption level
    this.corruptionController = new CorruptionController(this);
    this.corruptionController.setLevel(this.day);
    
    // Create background
    this.createBackground();
    
    // Create driver animations
    this.createDriverAnimations();
    
    // Create passenger animations
    this.createPlayerAnimations();
    
    // Create remaining passengers (excluding the one that was already accused)
    this.createRemainingPassengers();
    
    // Create driver
    this.driver = this.add.sprite(DRIVER_SEAT.x, DRIVER_SEAT.y, "driver").setOrigin(0.5).setScale(3).setDepth(2);
    this.driver.play("driver_idle_down");
    
    // Create status text (will be updated)
    this.statusText = this.add.text(625, 50, "", {
      fontFamily: "monospace", fontSize: 20, color: "#ffffff"
    }).setOrigin(0.5);
    
    // Start dropoff sequence
    this.dropoffNextPassenger();
  }
  
  createBackground(){
    // Create a tileSprite for smooth infinite scrolling
    // tileSprite automatically tiles the texture for seamless scrolling
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
    
    // Start background scrolling to simulate bus movement
    this.startBackgroundScrolling();
  }
  
  startBackgroundScrolling(){
    // For tileSprite, we scroll the tilePositionX instead of moving the sprite
    // This creates truly seamless infinite scrolling
    this.backgroundScrollTween = this.tweens.add({
      targets: this.background,
      tilePositionX: this.background.tilePositionX - 200, // Scroll the texture
      duration: 3000,
      ease: "Linear",
      repeat: -1, // Loop forever
      onComplete: () => {
        // Reset tile position for seamless looping
        this.background.tilePositionX = this.background.tilePositionX + 200;
      }
    });
  }
  
  pauseBackgroundScrolling(){
    // Pause the background scrolling
    if (this.backgroundScrollTween) {
      this.backgroundScrollTween.pause();
    }
  }
  
  resumeBackgroundScrolling(){
    // Resume the background scrolling
    if (this.backgroundScrollTween) {
      this.backgroundScrollTween.resume();
    }
  }
  
  createDriverAnimations(){
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
  }
  
  createPlayerAnimations(){
    // Create passenger idle animations for each direction using frames from the first row (row 0)
    // Frames 0-29 are in the first row, we want frames 0, 1, 2, 3 for the 4 directions
    
    this.anims.create({
      key: "passenger_idle_right",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [0] }), // First frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_up",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [1] }), // Second frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_left",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [2] }), // Third frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "passenger_idle_down",
      frames: this.anims.generateFrameNumbers("passenger", { frames: [3] }), // Fourth frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    // Create passenger walking animations from row 2
    // Row 2 starts at frame 112
    // Walking right: frames 112-117 (6 frames)
    // Walking up: frames 118-123 (6 frames) - SWAPPED
    // Walking left: frames 124-129 (6 frames)
    // Walking down: frames 130-135 (6 frames) - SWAPPED
    
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
  }
  
  createRemainingPassengers(){
    this.passengerSprites = [];
    
    // Get remaining passengers (excluding the one that was already accused)
    const remainingPassengers = this.runState.passengers.filter(passenger => 
      passenger.id !== this.runState.playerGuess
    );
    
    remainingPassengers.forEach(passenger => {
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
        .setData("passenger", passenger);
      
      // Set initial idle animation (facing down)
      sprite.play(idleAnimKey);
      
      this.passengerSprites.push(sprite);
    });
    
    // Update dropoff order to exclude the accused passenger
    this.runState.dropoffOrder = this.runState.dropoffOrder.filter(id => 
      id !== this.runState.playerGuess
    );
  }
  
  dropoffNextPassenger(){
    if(this.currentPassengerIndex >= this.runState.dropoffOrder.length){
      // All remaining passengers processed
      this.evaluateResult();
      return;
    }
    
    const passengerId = this.runState.dropoffOrder[this.currentPassengerIndex];
    const passenger = this.runState.getPassenger(passengerId);
    const sprite = this.passengerSprites.find(s => s.getData("passenger").id === passengerId);
    
    // Check if this is the anomaly (for wrong guesses)
    const isAnomaly = this.runState.isAnomaly(passengerId);
    const isCorrect = this.runState.isCorrect();
    
    if(!isCorrect && isAnomaly){
      // Skip anomaly for now - they'll be revealed at the end
      this.currentPassengerIndex++;
      this.dropoffNextPassenger();
    } else {
      // Normal passenger gets off
      this.statusText.setText(`${passenger.displayName} gets off at the next stop`);
      this.statusText.setColor("#2ecc71");
      
      // Pause background scrolling when passenger starts getting off
      this.pauseBackgroundScrolling();
      
      // Play dropoff sound
      this.game.sfx.dropoff();
      
      // Define door position for walking out
      const doorX = 500;
      const doorY = 150;
      
      // Step 1: Walk from seat to door (horizontal)
      const passenger = sprite.getData("passenger");
      if (sprite.x > doorX) {
        let walkLeftAnimKey = "passenger_walk_left";
        if (passenger.id === "grandma") {
          walkLeftAnimKey = "grandma_walk_left";
        } else if (passenger.id === "man") {
          walkLeftAnimKey = "mrlane_walk_left";
        } else if (passenger.id === "kid") {
          walkLeftAnimKey = "girl_walk_left";
        } else if (passenger.id === "dog") {
          walkLeftAnimKey = "busi_walk_left";
        }
        sprite.play(walkLeftAnimKey);
      } else {
        let walkRightAnimKey = "passenger_walk_right";
        if (passenger.id === "grandma") {
          walkRightAnimKey = "grandma_walk_right";
        } else if (passenger.id === "man") {
          walkRightAnimKey = "mrlane_walk_right";
        } else if (passenger.id === "kid") {
          walkRightAnimKey = "girl_walk_right";
        } else if (passenger.id === "dog") {
          walkRightAnimKey = "busi_walk_right";
        }
        sprite.play(walkRightAnimKey);
      }
      
      // Walk to door
      this.tweens.add({
        targets: sprite,
        x: doorX,
        y: sprite.y, // Stay at same Y (horizontal movement)
        duration: 800,
        ease: "Power2",
        onComplete: () => {
          // Step 2: Walk out of bus (vertical)
          let walkUpAnimKey = "passenger_walk_up";
          if (passenger.id === "grandma") {
            walkUpAnimKey = "grandma_walk_up";
          } else if (passenger.id === "man") {
            walkUpAnimKey = "mrlane_walk_up";
          } else if (passenger.id === "kid") {
            walkUpAnimKey = "girl_walk_up";
          } else if (passenger.id === "dog") {
            walkUpAnimKey = "busi_walk_up";
          }
          sprite.play(walkUpAnimKey);
          
          this.tweens.add({
            targets: sprite,
            x: doorX,
            y: doorY,
            duration: 600,
            ease: "Power2",
            onComplete: () => {
              // Step 3: Walk away from bus (horizontal)
              let walkLeftAnimKey = "passenger_walk_left";
              if (passenger.id === "grandma") {
                walkLeftAnimKey = "grandma_walk_left";
              } else if (passenger.id === "man") {
                walkLeftAnimKey = "mrlane_walk_left";
              } else if (passenger.id === "kid") {
                walkLeftAnimKey = "girl_walk_left";
              } else if (passenger.id === "dog") {
                walkLeftAnimKey = "busi_walk_left";
              }
              sprite.play(walkLeftAnimKey);
              
              this.tweens.add({
                targets: sprite,
                x: 800,
                y: doorY,
                alpha: 0,
                duration: 800,
                ease: "Power2",
                onComplete: () => {
                  // Resume background scrolling after passenger is gone
                  this.resumeBackgroundScrolling();
                  
                  this.currentPassengerIndex++;
                  this.dropoffNextPassenger();
                }
              });
            }
          });
        }
      });
    }
  }
  
  evaluateResult() {
    const isCorrect = this.runState.isCorrect();
    
    if (isCorrect) {
      // Correct guess - proceed to next day
      this.statusText.setText("All passengers processed");
      this.statusText.setColor("#2ecc71");
      
      this.time.delayedCall(1000, () => {
        const nextDay = this.day + 1;
        if(nextDay <= 6){
          // Create new run state for next day
          this.game.runState = new RunState(nextDay);
          this.game.runState.initialize(this.runState.passengers);
          
          const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DaySplash", { day: nextDay });
          guardedTransition();
        } else {
          // Game completed - loop back to day 1
          this.game.runState = new RunState(1);
          this.game.runState.initialize(this.runState.passengers);
          
          const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DaySplash", { day: 1 });
          guardedTransition();
        }
      });
    } else {
      // Wrong guess - universal death sequence
      this.playDeathSequence();
    }
  }
  
  playDeathSequence() {
    // Get the anomaly passenger data (always available from RunState)
    const anomalyPassenger = this.runState.getAnomalyPassenger();
    
    if (!anomalyPassenger) {
      // Fallback if anomaly passenger is somehow null
      this.statusText.setText("An anomaly is still on the bus...");
      this.statusText.setColor("#e74c3c");
    } else {
      // Show that anomaly is still on bus (suspense)
      this.statusText.setText(`${anomalyPassenger.displayName} is still on the bus...`);
      this.statusText.setColor("#e74c3c");
    }
    
    // Play death sting
    this.game.sfx.death();
    
    // Pause for suspense
    this.time.delayedCall(2000, () => {
      if (anomalyPassenger) {
        // Reveal true nature
        this.statusText.setText(`${anomalyPassenger.displayName} reveals their true nature...`);
      } else {
        this.statusText.setText("The anomaly reveals their true nature...");
      }
      this.statusText.setColor("#ff0000");
      
      // Find anomaly sprite (might not exist if they were already accused)
      const anomalySprite = this.passengerSprites.find(s => s.getData("passenger").id === this.runState.anomalyId);
      
      if (anomalySprite) {
        // Animate anomaly moving toward driver
        this.tweens.add({
          targets: anomalySprite,
          x: DRIVER_SEAT.x,
          y: DRIVER_SEAT.y,
          duration: 2000,
          ease: "Power2",
          onComplete: () => {
            this.completeDeathSequence();
          }
        });
      } else {
        // Anomaly was already accused, just complete death sequence
        this.time.delayedCall(2000, () => {
          this.completeDeathSequence();
        });
      }
    });
  }
  
  completeDeathSequence() {
    // Universal death sequence
    this.statusText.setText("GAME OVER - You were wrong!");
    this.statusText.setColor("#ff0000");
    
    // Play corruption death effect
    this.corruptionController.playDeathEffect();
    
    // Animate driver death
    this.tweens.add({
      targets: this.driver,
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        this.time.delayedCall(3000, () => {
          // Game over - restart from day 1
          this.game.runState = new RunState(1);
          this.game.runState.initialize(this.runState.passengers);
          
          const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "DaySplash", { day: 1 });
          guardedTransition();
        });
      }
    });
  }
} 