import Phaser from "phaser";
import Boot from "./scenes/Boot.js";
import DaySplash from "./scenes/DaySplash.js";
import Pickup from "./scenes/Pickup.js";
import Investigation from "./scenes/Investigation.js";
import DriverReturn from "./scenes/DriverReturn.js";
import Dropoff from "./scenes/Dropoff.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  width: 1250,
  height: 690,
  backgroundColor: "#111111",
  scale: { 
    mode: Phaser.Scale.FIT, 
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 1250, height: 690 },
    max: { width: 1250, height: 690 }
  },
  render: {
    pixelArt: true, // Prevents anti-aliasing for pixel art
    antialias: false, // Disables anti-aliasing
    roundPixels: true, // Ensures pixels are rendered at whole numbers
    powerPreference: "high-performance"
  },
  scene: [Boot, DaySplash, Pickup, Investigation, DriverReturn, Dropoff]
});
