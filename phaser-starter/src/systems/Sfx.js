export class Sfx {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.enabled = true;
  }

  play(name) {
    if (!this.enabled) return;
    
    // Placeholder: log the sound effect for now
    console.log(`SFX: ${name}`);
    
    // Future: replace with actual audio files
    // this.sounds[name]?.play();
  }

  // Predefined sound effects
  door() { this.play("door"); }
  seat() { this.play("seat"); }
  step() { this.play("step"); }
  flicker() { this.play("flicker"); }
  sting() { this.play("sting"); }
  confirm() { this.play("confirm"); }
  cancel() { this.play("cancel"); }
  accuse() { this.play("accuse"); }
  death() { this.play("death"); }
  boarding() { this.play("boarding"); }
  dropoff() { this.play("dropoff"); }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
} 