import { RunState } from '../systems/RunState.js';
import { PortraitManager } from '../systems/PortraitManager.js';
import { CorruptionController } from '../systems/CorruptionController.js';
import { Sfx } from '../systems/Sfx.js';
import { TransitionGuard } from '../systems/TransitionGuard.js';

export default class Boot extends Phaser.Scene {
  constructor(){ super("Boot"); }
  
  preload(){
    // Load background image
    this.load.image("background", "/map-game (1).png");
    
    // Load player sprite sheet with pixel-perfect settings
    this.load.spritesheet("player", "/kid.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Set texture filtering to NEAREST for pixel-perfect rendering
    this.load.on('complete', () => {
      this.textures.get('player').setFilter('NEAREST');
      this.textures.get('background').setFilter('NEAREST');
    });
    
    // Generate "textures" using graphics so we don't need external assets.
    const g = this.make.graphics({ x:0, y:0, add:false });
    
    // Bus driver (simple rectangle for now)
    g.fillStyle(0x3498db, 1).fillRoundedRect(0,0, 32,32, 4);
    g.generateTexture("driver", 32,32);
    g.clear();

    // Passenger body (smaller for top-down view)
    g.fillStyle(0x999999, 1).fillRoundedRect(0,0, 24,24, 4);
    g.generateTexture("passenger_base", 24,24);
    g.clear();

    // Seat (for bus interior)
    g.fillStyle(0x2ecc71, 0.3).fillRect(0,0, 40,40);
    g.lineStyle(2, 0x27ae60, 1).strokeRect(0,0, 40,40);
    g.generateTexture("seat", 40,40);
    g.clear();

    // Bus floor tile
    g.fillStyle(0x34495e, 1).fillRect(0,0, 32,32);
    g.lineStyle(1, 0x2c3e50, 1).strokeRect(0,0, 32,32);
    g.generateTexture("floor", 32,32);
    g.clear();

    // Portrait placeholders for VN system
    this.generatePortraitTextures(g);

    // Load data
    this.load.json("passengers", "/src/data/passengers.json");
    this.load.json("stops", "/src/data/stops.json");
    this.load.json("progression", "/src/data/progression.json");
    this.load.json("dialogue", "/src/data/dialogue.json");
  }

  generatePortraitTextures(g) {
    // Generate placeholder portrait textures for each character
    const characters = ['grandma', 'man', 'kid', 'dog', 'punk', 'tourist'];
    const variants = ['normal', 'anomaly'];
    
    characters.forEach(char => {
      variants.forEach(variant => {
        const textureName = `${char}_${variant}`;
        const color = variant === 'anomaly' ? 0xff4466 : 0x8888ff;
        
        g.fillStyle(color, 1).fillRoundedRect(0, 0, 220, 220, 8);
        g.lineStyle(2, 0x000000, 1).strokeRoundedRect(0, 0, 220, 220, 8);
        g.generateTexture(textureName, 220, 220);
        g.clear();
      });
    });
  }
  
  create(){
    // Initialize global systems
    this.game.runState = new RunState(1);
    this.game.transitionGuard = new TransitionGuard();
    this.game.sfx = new Sfx(this);
    
    // Load passengers and initialize run state
    const passengers = this.cache.json.get("passengers");
    this.game.runState.initialize(passengers);
    
    this.scene.start("DaySplash", { day: 1 });
  }
} 