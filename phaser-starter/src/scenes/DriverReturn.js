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
    
    // Create passengers
    this.createPassengers();
    
    // Create driver
    this.driver = this.add.image(250, 250, "driver").setOrigin(0.5);
    
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
  
  createPassengers(){
    this.passengerSprites = [];
    this.runState.passengers.forEach(passenger => {
      const seat = BUS_SEATS[passenger.seatIndex];
      
      // Create passenger sprite using the same kid.png spritesheet
      const sprite = this.add.sprite(seat.x, seat.y, "player")
        .setScale(2) // Same scale as player
        .setData("passenger", passenger);
      
      // Set initial idle animation (facing down)
      sprite.play("player_idle_down");
      
      this.passengerSprites.push(sprite);
    });
  }
} 