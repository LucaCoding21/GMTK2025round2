const BUS_SEATS = [
  {x: 300, y: 325}, {x: 400, y: 325}, {x: 500, y: 325},
  {x: 300, y: 425}, {x: 400, y: 425}, {x: 500, y: 425}
];

const DRIVER_SEAT = {x: 250, y: 275}; // Driver's seat position moved down by 125 pixels

export default class DriverReturn extends Phaser.Scene {
  constructor(){ super("DriverReturn"); }
  
  create(data){
    this.day = data?.day ?? 1;
    this.runState = this.game.runState;
    
    // Create background
    this.createBackground();
    
    // Create driver animations
    this.createDriverAnimations();
    
    // Create passengers
    this.createPassengers();
    
    // Create driver
    this.driver = this.add.sprite(250, 250, "driver").setOrigin(0.5).setScale(2);
    this.driver.play("driver_idle_down");
    
    // Create status text
    this.statusText = this.add.text(625, 50, "Returning to driver's seat...", {
      fontFamily: "monospace", fontSize: 20, color: "#ffffff"
    }).setOrigin(0.5);
    
    // Animate driver walking back to seat
    this.tweens.add({
      targets: this.driver,
      x: DRIVER_SEAT.x,
      y: DRIVER_SEAT.y,
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        this.statusText.setText("Starting passenger dropoff...");
        this.time.delayedCall(1000, () => {
          const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "Dropoff", { 
            day: this.day 
          });
          guardedTransition();
        });
      }
    });
  }
  
  createBackground(){
    // Create a tileSprite for consistent background rendering
    // This matches the other scenes approach but without scrolling
    this.background = this.add.tileSprite(625, 345, 1250, 690, "background");
    
    // Adjust tile position to center the road on screen
    // Move the background up so the road appears in the center
    this.background.tilePositionY = -125; // Adjust this value to center the road
    
    // Set the background depth to be behind everything
    this.background.setDepth(0);
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
  
  createPassengers(){
    this.passengerSprites = [];
    this.runState.passengers.forEach(passenger => {
      const seat = BUS_SEATS[passenger.seatIndex];
      
      // Create passenger sprite using the passenger spritesheet (kid.png)
      const sprite = this.add.sprite(seat.x, seat.y, "passenger")
        .setScale(2) // Same scale as driver
        .setData("passenger", passenger);
      
      // Set initial idle animation (facing down)
      sprite.play("passenger_idle_down");
      
      this.passengerSprites.push(sprite);
    });
  }
} 