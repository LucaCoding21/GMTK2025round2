const BUS_SEATS = [
  {x: 300, y: 325}, {x: 400, y: 325}, {x: 500, y: 325},
  {x: 300, y: 425}, {x: 400, y: 425}, {x: 500, y: 425}
];

export default class Pickup extends Phaser.Scene {
  constructor(){ super("Pickup"); }
  
  create(data){
    this.day = data?.day ?? 1;
    this.runState = this.game.runState;
    this.stops = this.cache.json.get("stops");
    this.currentStopIndex = 0;
    this.boardedPassengers = [];
    
    // Create background
    this.createBackground();
    
    // Create player animations for walking
    this.createPlayerAnimations();
    
    // Create visual door
    this.createDoor();
    
    // Create driver
    this.driver = this.add.image(250, 250, "driver").setOrigin(0.5);
    
    // Start pickup sequence
    this.pickupNextPassenger();
  }
  
  createBackground(){
    // Create a tileSprite for smooth infinite scrolling
    // tileSprite automatically tiles the texture for seamless scrolling
    this.background = this.add.tileSprite(625, 345, 1250, 690, "background");
    
    // Adjust tile position to center the road on screen
    // Move the background up so the road appears in the center
    this.background.tilePositionY = -125; // Adjust this value to center the road
    
    // Set the background depth to be behind everything
    this.background.setDepth(0);
    
    // Start background scrolling to simulate bus movement
    this.startBackgroundScrolling();
  }
  
  startBackgroundScrolling(){
    // For tileSprite, we scroll the tilePositionX instead of moving the sprite
    // This creates truly seamless infinite scrolling
    this.backgroundScrollTween = this.tweens.add({
      targets: this.background,
      tilePositionX: this.background.tilePositionX - 1000, // Scroll the texture
      duration: 500,
      ease: "Linear",
      repeat: -1, // Loop forever
      onComplete: () => {
        // Reset tile position for seamless looping
        this.background.tilePositionX = this.background.tilePositionX + 1000;
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
  
  createPlayerAnimations(){
    // Create idle animations for each direction using frames from the first row (row 0)
    // Frames 0-29 are in the first row, we want frames 0, 1, 2, 3 for the 4 directions
    
    this.anims.create({
      key: "player_idle_right",
      frames: this.anims.generateFrameNumbers("player", { frames: [0] }), // First frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "player_idle_up",
      frames: this.anims.generateFrameNumbers("player", { frames: [1] }), // Second frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "player_idle_left",
      frames: this.anims.generateFrameNumbers("player", { frames: [2] }), // Third frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "player_idle_down",
      frames: this.anims.generateFrameNumbers("player", { frames: [3] }), // Fourth frame of first row
      frameRate: 1,
      repeat: -1
    });
    
    // Create walking animations from row 2
    // Row 2 starts at frame 112
    // Walking right: frames 112-117 (6 frames)
    // Walking up: frames 118-123 (6 frames) - SWAPPED
    // Walking left: frames 124-129 (6 frames)
    // Walking down: frames 130-135 (6 frames) - SWAPPED
    
    this.anims.create({
      key: "player_walk_right",
      frames: this.anims.generateFrameNumbers("player", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "player_walk_up",
      frames: this.anims.generateFrameNumbers("player", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "player_walk_left",
      frames: this.anims.generateFrameNumbers("player", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "player_walk_down",
      frames: this.anims.generateFrameNumbers("player", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
  }
  
  createDoor(){
    // Create a simple door visual at the bus entrance
    const doorX = 500;
    const doorY = 150;
    
    // Door frame (rectangle)
    this.add.rectangle(doorX, doorY, 20, 40, 0x8B4513).setOrigin(0.5);
    
    // Door text
    this.add.text(doorX, doorY - 30, "DOOR", {
      fontFamily: "monospace", fontSize: 12, color: "#ffffff"
    }).setOrigin(0.5);
  }
  
  pickupNextPassenger(){
    if(this.currentStopIndex >= this.stops.length){
      // All passengers boarded, go to investigation
      const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "Investigation", { day: this.day });
      guardedTransition();
      return;
    }
    
    const currentStop = this.stops[this.currentStopIndex];
    const stopPassengers = this.runState.passengers.filter(p => p.stopId === currentStop.id);
    
    // Clear previous stop text
    if(this.stopText) this.stopText.destroy();
    
    // Show stop name
    this.stopText = this.add.text(625, 50, `Arriving at: ${currentStop.name}`, {
      fontFamily: "monospace", fontSize: 24, color: "#ffffff"
    }).setOrigin(0.5);
    
    // If no passengers at this stop, move to next stop immediately
    if(stopPassengers.length === 0){
      // Pause briefly at empty stops
      this.pauseBackgroundScrolling();
      this.time.delayedCall(1000, () => {
        this.resumeBackgroundScrolling();
        this.currentStopIndex++;
        this.pickupNextPassenger();
      });
      return;
    }
    
    // Track how many passengers from this stop have boarded
    this.passengersBoardedThisStop = 0;
    
    // Show passengers waiting and board them sequentially
    this.boardPassengersSequentially(stopPassengers);
  }
  
  boardPassengersSequentially(passengers) {
    if (passengers.length === 0) {
      // All passengers from this stop boarded
      this.time.delayedCall(500, () => {
        this.currentStopIndex++;
        this.pickupNextPassenger();
      });
      return;
    }
    
    const passenger = passengers[0];
    const remainingPassengers = passengers.slice(1);
    
    // Pause background scrolling when passenger starts boarding
    this.pauseBackgroundScrolling();
    
    // Show passenger waiting
    const x = 600;
    const y = 225; // Moved down by 125 pixels
    const sprite = this.add.sprite(x, y, "player")
      .setScale(2) // Same scale as player
      .setData("passenger", passenger);
    
    // Set initial idle animation (facing down)
    sprite.play("player_idle_down");
    
    // Define door position (same Y as passenger, but at bus entrance)
    const doorX = 500;
    const doorY = 275; // Door position moved down by 125 pixels
    
    // Start walking left animation
    sprite.play("player_walk_left");
    
    // Step 1: Walk horizontally to the door
    this.tweens.add({
      targets: sprite,
      x: doorX,
      y: doorY, // Stay at same Y (horizontal movement)
      duration: 800,
      ease: "Power2",
      onComplete: () => {
        // Play door sound
        this.game.sfx.door();
        
        // Change to walking down animation
        sprite.play("player_walk_down");
        
        // Step 2: Walk vertically from door to seat (MUCH SLOWER)
        this.tweens.add({
          targets: sprite,
          x: doorX, // Stay at door X (vertical movement)
          y: BUS_SEATS[passenger.seatIndex].y,
          duration: 1500, // Increased from 600 to 1500 (2.5x slower)
          ease: "Power2",
          onComplete: () => {
            // Change to walking right/left to final seat position
            if (BUS_SEATS[passenger.seatIndex].x > doorX) {
              sprite.play("player_walk_right");
            } else {
              sprite.play("player_walk_left");
            }
            
            // Step 3: Walk horizontally to final seat position (MUCH SLOWER)
            this.tweens.add({
              targets: sprite,
              x: BUS_SEATS[passenger.seatIndex].x,
              y: BUS_SEATS[passenger.seatIndex].y,
              duration: 1200, // Increased from 400 to 1200 (3x slower)
              ease: "Power2",
              onComplete: () => {
                // Play seat sound
                this.game.sfx.seat();
                
                // Change to idle animation
                sprite.play("player_idle_down");
                
                this.boardedPassengers.push(passenger);
                this.passengersBoardedThisStop++;
                
                // Resume background scrolling after passenger is seated
                this.resumeBackgroundScrolling();
                
                // Board next passenger after a short delay
                this.time.delayedCall(300, () => {
                  this.boardPassengersSequentially(remainingPassengers);
                });
              }
            });
          }
        });
      }
    });
  }
} 