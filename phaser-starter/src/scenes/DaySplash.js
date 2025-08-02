import { CorruptionController } from '../systems/CorruptionController.js';

export default class DaySplash extends Phaser.Scene {
  constructor(){ super("DaySplash"); }
  
  create(data){
    const day = data?.day ?? 1;
    
    // Set corruption level based on day
    this.corruptionController = new CorruptionController(this);
    this.corruptionController.setLevel(day);
    
    this.add.text(480, 220, `DAY ${day}`, { 
      fontFamily:"monospace", 
      fontSize: 48, 
      color:"#ffffff" 
    }).setOrigin(0.5);
    
    this.add.text(480, 300, "Click to start", { 
      fontFamily:"monospace", 
      fontSize: 18, 
      color:"#cccccc" 
    }).setOrigin(0.5);
    
    // Use transition guard to prevent double clicks
    const guardedTransition = this.game.transitionGuard.guardSceneTransition(this, "Pickup", { day });
    this.input.once("pointerdown", guardedTransition);
  }
} 