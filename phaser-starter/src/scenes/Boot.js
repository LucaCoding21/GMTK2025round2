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
    
    // Load bus interior image
    this.load.image("bus_interior", "/bus1.png");
    
    // Load passenger sprite sheet (kid.png) for most NPCs
    this.load.spritesheet("passenger", "/kid.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Load grandma sprite sheet (grandma.png) for grandma character
    this.load.spritesheet("grandma", "/grandma.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Load Mr. Lane sprite sheet (mrlane.png) for Mr. Lane character
    this.load.spritesheet("mrlane", "/mrlane.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Load Ari sprite sheet (girl.png) for Ari character
    this.load.spritesheet("girl", "/girl.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Load Dex sprite sheet (busi.png) for Dex character
    this.load.spritesheet("busi", "/busi.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Load driver sprite sheet (busman.png) for the main character
    this.load.spritesheet("driver", "/busman.png", {
      frameWidth: 16,
      frameHeight: 32,
      spacing: 0,
      margin: 0
    });
    
    // Set texture filtering to NEAREST for pixel-perfect rendering
    this.load.on('complete', () => {
      this.textures.get('passenger').setFilter('NEAREST');
      this.textures.get('grandma').setFilter('NEAREST');
      this.textures.get('mrlane').setFilter('NEAREST');
      this.textures.get('girl').setFilter('NEAREST');
      this.textures.get('busi').setFilter('NEAREST');
      this.textures.get('driver').setFilter('NEAREST');
      this.textures.get('background').setFilter('NEAREST');
      this.textures.get('bus_interior').setFilter('NEAREST');
    });
    
    // Generate "textures" using graphics so we don't need external assets.
    const g = this.make.graphics({ x:0, y:0, add:false });
    
    // Bus driver (simple rectangle for now)
    g.fillStyle(0x3498db, 1).fillRoundedRect(0,0, 32,32, 4);
    g.generateTexture("driver_placeholder", 32,32);
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
    const characters = ['grandma', 'man', 'kid', 'dog', 'punk'];
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
    
    // Create grandma animations (same pattern as passenger animations)
    this.createGrandmaAnimations();
    
    // Create Mr. Lane animations (same pattern as passenger animations)
    this.createMrLaneAnimations();
    
    // Create Ari animations (same pattern as passenger animations)
    this.createGirlAnimations();
    
    // Create Dex animations (same pattern as passenger animations)
    this.createBusiAnimations();
    
    // Load passengers and initialize run state
    const passengers = this.cache.json.get("passengers");
    this.game.runState.initialize(passengers);
    
    this.scene.start("DaySplash", { day: 1 });
  }
  
  createGrandmaAnimations(){
    // Grandma idle animations using frame 290 (5th row, 10th column)
    
    this.anims.create({
      key: "grandma_idle_right",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_idle_up",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_idle_left",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_idle_down",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    // Grandma walking animations using frames from row 2 (frames 112-135)
    // Each direction has 6 frames of walking animation
    
    this.anims.create({
      key: "grandma_walk_right",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_walk_up",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_walk_left",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "grandma_walk_down",
      frames: this.anims.generateFrameNumbers("grandma", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
  }
  
  createMrLaneAnimations(){
    // Mr. Lane idle animations using frame 290 (5th row, 10th column)
    
    this.anims.create({
      key: "mrlane_idle_right",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_idle_up",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_idle_left",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_idle_down",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    // Mr. Lane walking animations using frames from row 2 (frames 112-135)
    // Each direction has 6 frames of walking animation
    
    this.anims.create({
      key: "mrlane_walk_right",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_walk_up",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_walk_left",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "mrlane_walk_down",
      frames: this.anims.generateFrameNumbers("mrlane", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
  }
  
  createGirlAnimations(){
    // Ari idle animations using frame 290 (5th row, 10th column)
    
    this.anims.create({
      key: "girl_idle_right",
      frames: this.anims.generateFrameNumbers("girl", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_idle_up",
      frames: this.anims.generateFrameNumbers("girl", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_idle_left",
      frames: this.anims.generateFrameNumbers("girl", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_idle_down",
      frames: this.anims.generateFrameNumbers("girl", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    // Ari walking animations using frames from row 2 (frames 112-135)
    // Each direction has 6 frames of walking animation
    
    this.anims.create({
      key: "girl_walk_right",
      frames: this.anims.generateFrameNumbers("girl", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_walk_up",
      frames: this.anims.generateFrameNumbers("girl", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_walk_left",
      frames: this.anims.generateFrameNumbers("girl", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "girl_walk_down",
      frames: this.anims.generateFrameNumbers("girl", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
  }
  
  createBusiAnimations(){
    // Dex idle animations using frame 290 (5th row, 10th column)
    
    this.anims.create({
      key: "busi_idle_right",
      frames: this.anims.generateFrameNumbers("busi", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_idle_up",
      frames: this.anims.generateFrameNumbers("busi", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_idle_left",
      frames: this.anims.generateFrameNumbers("busi", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_idle_down",
      frames: this.anims.generateFrameNumbers("busi", { frames: [290] }), // 5th row, 10th column
      frameRate: 1,
      repeat: -1
    });
    
    // Dex walking animations using frames from row 2 (frames 112-135)
    // Each direction has 6 frames of walking animation
    
    this.anims.create({
      key: "busi_walk_right",
      frames: this.anims.generateFrameNumbers("busi", { frames: [112, 113, 114, 115, 116, 117] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_walk_up",
      frames: this.anims.generateFrameNumbers("busi", { frames: [118, 119, 120, 121, 122, 123] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_walk_left",
      frames: this.anims.generateFrameNumbers("busi", { frames: [124, 125, 126, 127, 128, 129] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
    
    this.anims.create({
      key: "busi_walk_down",
      frames: this.anims.generateFrameNumbers("busi", { frames: [130, 131, 132, 133, 134, 135] }),
      frameRate: 12, // Increased for smoother animation
      repeat: -1
    });
  }
} 