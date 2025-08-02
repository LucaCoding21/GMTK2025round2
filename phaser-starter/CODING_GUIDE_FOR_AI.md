# Bus Driver Mystery Game - Coding Guide for AI

## PROJECT OVERVIEW

This is a **top-down bus driver mystery game** built with **Phaser 3** (a JavaScript game framework). The player is a bus driver who must identify anomalies among passengers. Wrong guesses result in dramatic death sequences.

**Game Flow**: DaySplash → Pickup → Investigation → DriverReturn → Dropoff

---

## TECHNICAL ARCHITECTURE

### 🎮 Game Engine: Phaser 3

- **What it is**: A JavaScript game framework for making 2D games
- **How it works**: Uses scenes (like game levels), sprites (game objects), and tweens (animations)
- **Main file**: `src/main.js` - Game configuration and scene registration

### 📁 Project Structure

```
phaser-starter/
├── src/
│   ├── main.js                 # Game configuration
│   ├── scenes/                 # Game levels/states
│   │   ├── Boot.js            # Asset loading
│   │   ├── DaySplash.js       # Day display
│   │   ├── Pickup.js          # Passenger boarding
│   │   ├── Investigation.js   # Main gameplay
│   │   ├── DriverReturn.js    # Return to seat
│   │   └── Dropoff.js         # Passenger exit
│   ├── systems/               # Game logic modules
│   │   ├── RunState.js        # Game state management
│   │   ├── PortraitManager.js # Visual novel system
│   │   ├── CorruptionController.js # Visual effects
│   │   ├── Sfx.js            # Sound effects
│   │   └── TransitionGuard.js # Input protection
│   └── data/                  # Game data files
│       ├── passengers.json    # Character data
│       ├── dialogue.json      # Character dialogue
│       ├── stops.json         # Bus stop data
│       └── progression.json   # Game progression
├── public/                    # Static assets
│   ├── kid.png               # Character sprite sheet
│   └── map-game (1).png      # Background image
└── package.json              # Dependencies
```

---

## CORE SYSTEMS EXPLAINED

### 1. 🎯 Game State Management (`RunState.js`)

**Purpose**: Manages the entire game state (day, passengers, anomalies, etc.)

**Key Features**:

- **Deterministic randomization**: Same day = same results every time
- **Seeded RNG**: Uses `mulberry32` algorithm for consistent randomness
- **Passenger management**: Tracks all passengers and their states

**How to use**:

```javascript
// Access from any scene
this.game.runState.day; // Current day (1-6)
this.game.runState.anomalyId; // Current anomaly (null for Day 1)
this.game.runState.isCorrect(); // Check if player's guess is right
```

**To extend**:

- Add new game state variables to the constructor
- Add new methods for game logic
- Modify anomaly selection logic

### 2. 🖼️ Visual Novel System (`PortraitManager.js`)

**Purpose**: Shows character portraits and dialogue when clicking passengers

**Key Features**:

- **Portrait display**: Shows character image with dialogue
- **Confirmation system**: "Are you serious?" with Yes/No buttons
- **Accuse functionality**: Direct accusation from portrait view

**How it works**:

```javascript
// Show portrait for a passenger
this.portraitManager.show(passenger, runState, dialogueData);

// Hide portrait
this.portraitManager.hide();
```

**To extend**:

- Add new UI elements to the portrait overlay
- Modify dialogue display logic
- Add new button types

### 3. 🎨 Visual Effects (`CorruptionController.js`)

**Purpose**: Applies visual corruption effects that increase with each day

**Key Features**:

- **Tint overlay**: Red tint that gets stronger each day
- **Flicker effects**: Screen flickering for higher corruption
- **Death sequence**: Universal red flash and camera shake

**How to use**:

```javascript
// Set corruption level based on day
this.corruptionController.setLevel(this.day);

// Play death effect
this.corruptionController.playDeathEffect();
```

**To extend**:

- Add new visual effects (screen shake, color shifts)
- Modify corruption intensity
- Add sound effects to visual events

### 4. 🔊 Sound System (`Sfx.js`)

**Purpose**: Manages all sound effects in the game

**Current state**: Placeholder system that logs sound names

**How to use**:

```javascript
// Play sound effects
this.game.sfx.door(); // Door opening sound
this.game.sfx.seat(); // Sitting down sound
this.game.sfx.accuse(); // Accusation sound
```

**To extend**:

- Replace console.log with actual audio files
- Add background music system
- Add volume controls

### 5. 🛡️ Input Protection (`TransitionGuard.js`)

**Purpose**: Prevents double-clicking and rapid scene transitions

**How to use**:

```javascript
// Guard a function from being called multiple times
const guardedFunction = this.game.transitionGuard.guard(myFunction);

// Guard scene transitions
const transition = this.game.transitionGuard.guardSceneTransition(
  this,
  "NextScene",
  data
);
transition();
```

---

## SCENE SYSTEM EXPLAINED

### 🎬 What are Scenes?

Scenes are like "levels" or "screens" in the game. Each scene handles a different part of the game flow.

### 📋 Scene Flow

1. **Boot** → Loads assets and initializes systems
2. **DaySplash** → Shows current day and corruption level
3. **Pickup** → Passengers board the bus
4. **Investigation** → Main gameplay - walk around and talk to passengers
5. **DriverReturn** → Driver walks back to seat
6. **Dropoff** → Passengers exit, evaluate results

### 🔧 How to Modify Scenes

**Adding new UI elements**:

```javascript
// In any scene's create() method
this.add
  .text(625, 50, "Your text here", {
    fontFamily: "monospace",
    fontSize: 20,
    color: "#ffffff",
  })
  .setOrigin(0.5);
```

**Adding new sprites**:

```javascript
// Create a new sprite
const mySprite = this.add.sprite(300, 200, "texture_name");
mySprite.setScale(2); // Make it bigger
```

**Adding animations**:

```javascript
// Create animation
this.anims.create({
  key: "my_animation",
  frames: this.anims.generateFrameNumbers("sprite_sheet", {
    frames: [0, 1, 2],
  }),
  frameRate: 8,
  repeat: -1,
});

// Play animation
sprite.play("my_animation");
```

---

## SPRITE SYSTEM EXPLAINED

### 🎭 Character Sprites

- **All characters** use the same `kid.png` sprite sheet
- **16x32 pixel frames** with 56 frames per row
- **Walking animations** from row 2 (frames 112-135)
- **Idle animations** from row 0 (frames 0-3)

### 📐 Sprite Sheet Layout

```
Row 0 (frames 0-55):   Idle poses (4 frames used)
Row 1 (frames 56-111): Unused
Row 2 (frames 112-167): Walking animations (24 frames used)
Row 3+ (frames 168+):  Available for future animations
```

### 🔢 Frame Calculation Formula

```javascript
// For any row N, frames A-B:
// Start frame = (N * 56) + A
// End frame = (N * 56) + B

// Example: Row 5, frames 10-20
// Start = (5 * 56) + 10 = 290
// End = (5 * 56) + 20 = 300
```

### 🎬 How to Add New Animations

```javascript
// In createPlayerAnimations() method
this.anims.create({
  key: "player_new_animation",
  frames: this.anims.generateFrameNumbers("player", {
    frames: [290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300],
  }),
  frameRate: 12,
  repeat: -1,
});
```

---

## BACKGROUND SYSTEM EXPLAINED

### 🚌 Infinite Scrolling Background

- **Uses tileSprite**: Automatically tiles the texture for seamless scrolling
- **Scrolling method**: Changes `tilePositionX` instead of moving the sprite
- **Seamless looping**: Resets position when reaching the end

### 🎯 How Scrolling Works

```javascript
// Create tileSprite
this.background = this.add.tileSprite(625, 345, 1250, 690, "background");

// Scroll the texture (not the sprite)
this.background.tilePositionX -= 5; // Move left

// For animations, use tweens
this.tweens.add({
  targets: this.background,
  tilePositionX: this.background.tilePositionX - 1000,
  duration: 500,
  ease: "Linear",
});
```

### ⏸️ Pause/Resume System

```javascript
// Pause scrolling
this.backgroundScrollTween.pause();

// Resume scrolling
this.backgroundScrollTween.resume();
```

---

## DATA SYSTEM EXPLAINED

### 📊 JSON Data Files

All game data is stored in JSON files for easy modification:

**passengers.json** - Character data:

```json
{
  "id": "grandma",
  "name": "Grandma June",
  "displayName": "Grandma June",
  "colorHex": 11908533,
  "seatIndex": 0,
  "stopId": "stop1",
  "anomalyType": "no_glasses"
}
```

**dialogue.json** - Character dialogue:

```json
{
  "grandma": {
    "normal": "Oh dear, I should finish this scarf before winter.",
    "anomaly": "The yarn won't touch the light.",
    "confirm": "Are you accusing me, young man?"
  }
}
```

### 🔧 How to Modify Data

- **Add new passengers**: Add entries to `passengers.json`
- **Add new dialogue**: Add entries to `dialogue.json`
- **Add new stops**: Modify `stops.json`
- **Change game progression**: Modify `progression.json`

---

## COMMON TASKS & HOW TO DO THEM

### 🎨 Adding New Visual Elements

**Add a new button**:

```javascript
// In any scene's create() method
const button = this.add.rectangle(625, 500, 200, 50, 0x3498db);
button.setInteractive({ useHandCursor: true });
button.on("pointerdown", () => {
  // Button click logic here
});
```

**Add new text**:

```javascript
this.add
  .text(625, 100, "Your text here", {
    fontFamily: "monospace",
    fontSize: 20,
    color: "#ffffff",
  })
  .setOrigin(0.5);
```

**Add new sprites**:

```javascript
const sprite = this.add.sprite(300, 200, "texture_name");
sprite.setScale(2);
sprite.setTint(0xff0000); // Red tint
```

### 🎬 Adding New Animations

**Create new animation**:

```javascript
this.anims.create({
  key: "new_animation",
  frames: this.anims.generateFrameNumbers("sprite_sheet", {
    frames: [0, 1, 2, 3],
  }),
  frameRate: 8,
  repeat: -1,
});
```

**Play animation**:

```javascript
sprite.play("new_animation");
```

### 🎵 Adding Sound Effects

**Current system** (placeholders):

```javascript
// In Sfx.js, add new method
newSound() {
  console.log("Playing new sound");
  // Replace with actual audio
}
```

**To add real audio**:

```javascript
// In Boot.js preload()
this.load.audio("new_sound", "/path/to/sound.mp3");

// In Sfx.js
newSound() {
  this.scene.sound.play("new_sound");
}
```

### 🎮 Adding New Game Mechanics

**Add new game state**:

```javascript
// In RunState.js constructor
this.newGameState = "default_value";

// Add method to check state
isNewState() {
  return this.newGameState === "specific_value";
}
```

**Add new scene**:

```javascript
// Create new scene file: src/scenes/NewScene.js
export default class NewScene extends Phaser.Scene {
  constructor() {
    super("NewScene");
  }

  create(data) {
    // Scene logic here
  }
}

// Add to main.js scene list
scene: [
  Boot,
  DaySplash,
  Pickup,
  Investigation,
  DriverReturn,
  Dropoff,
  NewScene,
];
```

---

## DEBUGGING & TROUBLESHOOTING

### 🔍 Common Issues

**Sprite not showing**:

- Check if texture is loaded in Boot.js
- Verify frame numbers are correct
- Check if sprite is positioned off-screen

**Animation not playing**:

- Verify animation key matches exactly
- Check if animation was created in createPlayerAnimations()
- Ensure sprite is using the correct texture

**Background not scrolling**:

- Check if tileSprite is created correctly
- Verify tilePositionX is being modified
- Ensure tween is not paused

**Scene not transitioning**:

- Check scene name spelling
- Verify scene is registered in main.js
- Use TransitionGuard to prevent double transitions

### 🛠️ Debug Tools

**Console logging**:

```javascript
console.log("Debug info:", variable);
console.log("Sprite position:", sprite.x, sprite.y);
console.log("Animation playing:", sprite.anims.currentAnim?.key);
```

**Visual debugging**:

```javascript
// Show sprite bounds
this.add.rectangle(
  sprite.x,
  sprite.y,
  sprite.width,
  sprite.height,
  0xff0000,
  0.5
);

// Show clickable areas
sprite.setInteractive();
this.input.on("pointerdown", (pointer, gameObjects) => {
  console.log("Clicked:", gameObjects);
});
```

---

## EXTENSION IDEAS

### 🎨 Visual Improvements

- Replace placeholder portraits with real character art
- Add more character animations (sitting, carrying items)
- Create real bus background with seamless tiling
- Add visual door elements to the bus

### 🔊 Audio Enhancements

- Add background music that changes with corruption level
- Add character-specific voice lines
- Add ambient bus sounds (engine, brakes, etc.)
- Add sound effects for all interactions

### 🎮 Gameplay Extensions

- Add multiple bus routes with different passengers
- Add passenger relationships and interactions
- Add items that passengers can carry
- Add weather effects that affect gameplay

### 📊 Data Expansions

- Add more character dialogue variations
- Add character backstories and motivations
- Add different anomaly types
- Add seasonal events and special passengers

---

## QUICK REFERENCE

### 📍 Common Coordinates

- **Screen center**: (625, 345)
- **Bus seats**: Y=325 (row 1), Y=425 (row 2)
- **Door position**: (500, 275)
- **Driver seat**: (250, 275)

### 🎬 Animation Keys

- **Idle**: `player_idle_right`, `player_idle_left`, `player_idle_up`, `player_idle_down`
- **Walking**: `player_walk_right`, `player_walk_left`, `player_walk_up`, `player_walk_down`

### 🎮 Input Keys

- **Arrow keys**: Move driver around
- **Mouse click**: Interact with passengers
- **SPACE**: Accuse "no anomaly"

### 📊 Game State

- **Day 1**: No anomalies (tutorial)
- **Days 2-6**: Random anomaly with seeded selection
- **Wrong guess**: Universal death sequence and restart

This guide should help you understand the entire codebase and how to extend it effectively!
