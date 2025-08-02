# Development Log - Top-Down Bus Driver Mystery Game

## GAME OVERVIEW

**Title**: Bus Driver Mystery - Anomaly Detection Game
**Genre**: Mystery/Detective with dramatic consequences
**Platform**: Web browser (Phaser 3 + Vite)

### Core Gameplay:

You are a bus driver who must identify anomalies among your passengers. Each day, you pick up 6 passengers at different stops, walk around the bus to talk to them, then guess who the anomaly is (or if there are no anomalies). Wrong guesses result in dramatic death sequences.

### Game Flow:

1. **DaySplash** → Shows current day with corruption level
2. **Pickup** → Bus stops, passengers board with sequential animations
3. **Investigation** → Driver walks around, clicks passengers for VN portrait view
4. **DriverReturn** → Driver walks back to their seat
5. **Dropoff** → Passengers exit, anomaly attacks if wrong guess

### Key Features:

- **VN Portrait System**: Click passengers to see portrait + dialogue + accuse button
- **Confirmation Dialogue**: "Are you serious rn?" with Yes/No options
- **SPACE key option**: Press SPACE to accuse "no anomaly" (trust everyone)
- **Deterministic anomalies**: Days 2-6 have seeded random anomalies
- **Deterministic dropoff order**: Passengers leave in consistent order per day
- **Universal death sequence**: Wrong guesses = driver death, game restart
- **Corruption ramp**: Visual effects increase with each day
- **Day 1 tutorial**: Always no anomalies for learning
- **Immediate feedback**: Users know if they're right/wrong by whether all passengers leave safely
- **Character Sprite System**: All NPCs use same sprite sheet with walking animations
- **Infinite Scrolling Background**: Smooth tileSprite background with bus movement simulation
- **Realistic Boarding/Exit**: Passengers walk to door, enter bus, walk to seats
- **Pixel-Perfect Rendering**: Crisp sprites with NEAREST filtering and optimized scaling

---

## IMPLEMENTED FEATURES

### ✅ VN Portrait System:

- **PortraitManager**: Shows passenger portraits with dialogue and accuse button
- **Portrait view**: Click passengers to see their portrait + one dialogue line
- **Confirmation dialogue**: "Are you serious rn?" with Yes/No buttons
- **Accuse-on-current**: Accuse button directly in portrait view (no selection grid)
- **SPACE key**: Press SPACE to accuse "no anomaly" from anywhere
- **Placeholder portraits**: Generated rectangles with character names and variants

### ✅ Confirmation Dialogue System:

- **Three-stage dialogue**: Normal → Accuse → Confirmation
- **Confirmation lines**: Each character has unique "Are you serious?" response
- **Yes/No buttons**: "YES, GET OFF" or "NEVER MIND" options
- **Return to normal**: "Never mind" returns to original dialogue
- **Immediate accuse**: "Yes, get off" proceeds to accusation

### ✅ Deterministic Game State:

- **RunState system**: Manages day, seed, passengers, anomaly, dropoff order
- **Seeded RNG**: Consistent anomaly and dropoff order per day
- **Day 1**: No anomaly (tutorial)
- **Days 2-6**: Random anomaly with seeded selection

### ✅ Scene System:

- **Boot Scene**: Generates textures, loads data, initializes systems
- **DaySplash Scene**: Shows current day, sets corruption level
- **Pickup Scene**: Bus stops, passengers board one by one with SFX
- **Investigation Scene**: Top-down driver movement, VN portrait system
- **DriverReturn Scene**: Driver walks back to their seat
- **Dropoff Scene**: Passengers exit, universal death sequence if wrong

### ✅ Game Mechanics:

- **Top-down movement**: Driver walks around bus interior with arrow keys
- **VN dialogue system**: Click passengers to see portrait + dialogue + accuse
- **Confirmation system**: Three-stage dialogue with Yes/No options
- **SPACE key option**: Press SPACE to accuse "no anomaly" from anywhere
- **Bus stop system**: 4 stops with passenger assignments
- **Anomaly detection**: Direct accuse from portrait view or SPACE key
- **Consequence system**: Wrong guesses = universal death sequence
- **Deterministic randomization**: Both anomaly selection and dropoff order are seeded
- **Immediate feedback**: Outcome determined by dropoff sequence (no separate results screen)

### ✅ Visual & Audio Systems:

- **CorruptionController**: Visual corruption effects that increase with each day
- **Sfx system**: Placeholder sound effect hooks for future audio
- **TransitionGuard**: Prevents double scene transitions and input spam
- **Boarding animations**: Sequential passenger boarding with SFX
- **Death sequence**: Universal red flash, camera shake, fade to black
- **Character Sprite System**: All NPCs use kid.png sprite sheet with walking/idle animations
- **Infinite Scrolling Background**: tileSprite with seamless scrolling and pause/resume
- **Pixel-Perfect Rendering**: NEAREST filtering, roundPixels, optimized game config
- **Realistic Boarding/Exit**: 3-step walking animations (horizontal→vertical→horizontal)
- **Background Positioning**: Road centered on screen with tilePositionY adjustments

### ✅ Data Structure:

- **passengers.json**: 6 characters with portrait data and display names
- **stops.json**: 4 bus stops with passenger assignments
- **dialogue.json**: Character-specific dialogue (normal/anomaly/confirm)
- **progression.json**: Simple day count (anomaly chosen by RunState)

### ✅ Technical Implementation:

- **Generated textures**: Driver, passengers, seats, floor tiles, portrait placeholders
- **Movement system**: Smooth top-down movement with bounds checking
- **VN UI elements**: Portrait overlay, dialogue text, accuse/close buttons
- **Confirmation UI**: Yes/No buttons with dynamic visibility
- **Animation system**: Passenger boarding, dropoff animations
- **Seeded randomization**: Consistent gameplay per day
- **Sprite Sheet Integration**: kid.png with 16x32 frames, 56 frames per row
- **Walking Animations**: 6-frame animations from row 2 (frames 112-135)
- **Idle Animations**: Single-frame poses from row 0 (frames 0-3)
- **Infinite Scrolling**: tileSprite with tilePositionX scrolling and seamless looping
- **Aspect Ratio**: 1250x690 with consistent positioning across all scenes
- **Bus Area Positioning**: All coordinates moved down 125 pixels to align with centered road

---

## NEW SYSTEMS ARCHITECTURE

### RunState (Central Game State)

```javascript
- day: Current day (1-6)
- seed: Seeded RNG for determinism
- passengers: Array of passenger data
- anomalyId: Current anomaly ID (null for Day 1)
- dropoffOrder: Shuffled passenger IDs
- playerGuess: Player's current guess
```

### PortraitManager (VN System)

```javascript
- show(id, variant): Display passenger portrait
- hide(): Hide portrait overlay
- fade(duration): Animate portrait fade
- showConfirmation(): Show "Are you serious?" dialogue
- hideConfirmation(): Return to normal dialogue
- accuse/close/yes/no buttons
```

### CorruptionController (Visual Effects)

```javascript
- setLevel(day): Apply corruption based on day
- playDeathEffect(): Universal death sequence
- flicker/shake/red overlay effects
```

### Sfx (Audio System)

```javascript
- door(), seat(), step(), flicker(), sting()
- accuse(), death(), boarding(), dropoff()
- Placeholder logging for future audio
```

### TransitionGuard (Input Protection)

```javascript
- guard(fn): Prevent double execution
- guardSceneTransition(): Safe scene changes
- guardButtonClick(): Prevent input spam
```

---

## SCENE FLOW

### Boot → DaySplash → Pickup → Investigation → DriverReturn → Dropoff

1. **Boot**: Initialize systems, generate textures, load data
2. **DaySplash**: Show day, set corruption level, click to continue
3. **Pickup**: Board passengers sequentially with animations
4. **Investigation**: Walk around, click passengers for VN portraits, press SPACE for "no anomaly"
5. **DriverReturn**: Auto-walk back to driver seat
6. **Dropoff**: Process passengers, evaluate guess, death sequence if wrong

---

## DATA CONTRACTS

### passengers.json (Updated)

```json
{
  "id": "grandma",
  "displayName": "Grandma June",
  "portrait": {
    "normal": "grandma_normal",
    "anomaly": "grandma_no_glasses"
  }
}
```

### dialogue.json (Enhanced)

```json
{
  "grandma": {
    "normal": "Oh dear, I should finish this scarf before winter.",
    "anomaly": "The yarn won't touch the light.",
    "confirm": "Are you accusing me, young man? I've been riding this bus for years!"
  }
}
```

---

## GAME BALANCE & DESIGN

### Passenger Characters:

- **Grandma June**: "no_glasses" - forgot glasses
- **Mr. Lane**: "no_briefcase" - left briefcase at home
- **Ari (Kid)**: "no_lunch" - mom forgot to pack lunch
- **Dex (Dog)**: "nervous" - seems nervous and keeps looking around
- **Vale (Punk)**: "wrong_bus" - thinks they're on wrong bus
- **Paz (Tourist)**: "lost" - completely lost and confused

### Game Balance:

- **Day 1**: No anomaly - tutorial day
- **Days 2-6**: Random anomaly - keeps players guessing
- **Replayability**: Different experience each playthrough
- **Risk vs Reward**: SPACE key adds strategic depth
- **Confirmation system**: Prevents accidental accusations
- **Corruption ramp**: Visual tension increases with each day
- **Immediate feedback**: Outcome clear from dropoff sequence

### Technical Notes:

- **No external assets**: All graphics generated with Phaser
- **Deterministic gameplay**: Same day = same anomaly & dropoff order
- **VN-style interaction**: Click passengers for portrait view
- **Confirmation dialogue**: Three-stage dialogue system
- **SPACE key option**: Quick "no anomaly" accusation
- **Universal death**: Single death sequence for all wrong guesses
- **Performance**: Smooth animations and transitions

---

## RECENTLY COMPLETED (Latest Updates)

### ✅ Character Sprite System:

- **All NPCs use kid.png sprite sheet** with consistent animations
- **Walking animations** from row 2 (frames 112-135) with 6 frames each
- **Idle animations** from row 0 (frames 0-3) for 4 directions
- **No color tinting** - all characters look identical
- **Proper frame cycling** with 12 FPS animation speed

### ✅ Infinite Scrolling Background:

- **tileSprite implementation** for seamless infinite scrolling
- **Bus movement simulation** with pause/resume during passenger interactions
- **Seamless looping** with tilePositionX scrolling
- **Consistent across all scenes** (Pickup, Investigation, DriverReturn, Dropoff)

### ✅ Realistic Boarding/Exit System:

- **3-step walking animations**: horizontal→vertical→horizontal
- **Door positioning** at (500, 275) for realistic bus entrance
- **Walking to door** → **Entering bus** → **Walking to seat**
- **Proper animation states** for each direction (left, right, up, down)

### ✅ Pixel-Perfect Rendering:

- **NEAREST texture filtering** for crisp pixel art
- **Optimized game config** with pixelArt: true, antialias: false
- **Round pixels** and high-performance rendering
- **Fixed aspect ratio** 1250x690 with consistent scaling

### ✅ Background Positioning:

- **Road centered** on screen with tilePositionY = -125
- **Bus area moved down** 125 pixels to align with centered road
- **Consistent positioning** across all scenes and UI elements

### ✅ Sprite Sheet Guide:

- **SPRITE_SHEET_GUIDE.md** created with complete frame reference
- **Frame calculation formulas** for any row/frame range
- **Animation examples** and troubleshooting tips
- **Quick reference** for future sprite sheet integration

---

## NEXT STEPS (For Future Development)

1. **Replace placeholder portraits** with actual character art
2. **Add sound effects** and background music
3. **Implement save system** for progress tracking
4. **Add more dialogue variations** per character
5. **Expand corruption effects** with more visual variety
6. **Add accessibility features** for colorblind players
7. **Create real bus background** with seamless tiling for infinite scrolling
8. **Add more character animations** (sitting, carrying items, etc.)
9. **Implement different walking speeds** based on passenger type
10. **Add visual door elements** to the bus background
