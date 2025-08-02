# Character Sprite Sheet Guide

## Sprite Sheet Information

- **File**: `kid.png`
- **Dimensions**: 896 x 640 pixels
- **Frame Size**: 16 x 32 pixels
- **Frames per Row**: 56 (896 ÷ 16 = 56)
- **Total Rows**: 20 (640 ÷ 32 = 20)

## Frame Calculation Formula

### Basic Math

```
Frames per row = 56
Row N starts at frame = N * 56
Frame X in row N = (N * 56) + X
```

### Row Reference

| Row | Frame Range | Description                    |
| --- | ----------- | ------------------------------ |
| 0   | 0-55        | Idle animations (4 frames)     |
| 1   | 56-111      | -                              |
| 2   | 112-167     | Walking animations (24 frames) |
| 3   | 168-223     | -                              |
| 4   | 224-279     | -                              |
| 5   | 280-335     | -                              |
| 6   | 336-391     | -                              |
| 7   | 392-447     | -                              |
| 8   | 448-503     | -                              |
| 9   | 504-559     | -                              |
| 10  | 560-615     | -                              |
| 11  | 616-671     | -                              |
| 12  | 672-727     | -                              |
| 13  | 728-783     | -                              |
| 14  | 784-839     | -                              |
| 15  | 840-895     | -                              |
| 16  | 896-951     | -                              |
| 17  | 952-1007    | -                              |
| 18  | 1008-1063   | -                              |
| 19  | 1064-1119   | -                              |

## Animation Dictionary

### Row 0 - Idle Animations (4 frames)

```javascript
// Idle animations - single frame each
player_idle_right: [0]; // Looking right
player_idle_up: [1]; // Looking up
player_idle_left: [2]; // Looking left
player_idle_down: [3]; // Looking down
```

### Row 2 - Walking Animations (24 frames)

```javascript
// Walking animations - 6 frames each
player_walk_right: [112, 113, 114, 115, 116, 117]; // 6 frames
player_walk_down: [118, 119, 120, 121, 122, 123]; // 6 frames
player_walk_left: [124, 125, 126, 127, 128, 129]; // 6 frames
player_walk_up: [130, 131, 132, 133, 134, 135]; // 6 frames
```

## How to Create New Animations

### Example: Row 5, frames 10-20

```javascript
// Calculate frame numbers
// Row 5 starts at: 5 * 56 = 280
// Frames 10-20 in row 5 = frames 290-300

this.anims.create({
  key: "player_example_animation",
  frames: this.anims.generateFrameNumbers("player", {
    frames: [290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300],
  }),
  frameRate: 8, // 8 frames per second
  repeat: -1, // -1 = loop forever, 0 = play once
});
```

### Example: Row 7, frames 15-25

```javascript
// Calculate frame numbers
// Row 7 starts at: 7 * 56 = 392
// Frames 15-25 in row 7 = frames 407-417

this.anims.create({
  key: "player_another_animation",
  frames: this.anims.generateFrameNumbers("player", {
    frames: [407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417],
  }),
  frameRate: 12, // 12 frames per second
  repeat: 0, // Play once
});
```

## Quick Reference Calculator

### For any row N, frames A-B:

```javascript
// Start frame = (N * 56) + A
// End frame = (N * 56) + B

// Example: Row 3, frames 5-15
// Start = (3 * 56) + 5 = 168 + 5 = 173
// End = (3 * 56) + 15 = 168 + 15 = 183
// Frames: [173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183]
```

## Animation Settings

### Frame Rate Options

- **1**: Static (for idle poses)
- **4**: Slow animation
- **8**: Normal walking speed
- **12**: Fast animation
- **16**: Very fast animation

### Repeat Options

- **-1**: Loop forever
- **0**: Play once
- **1**: Play twice
- **N**: Play N+1 times

## Loading the Sprite Sheet

```javascript
// In Boot.js or scene preload
this.load.spritesheet("player", "/kid.png", {
  frameWidth: 16,
  frameHeight: 32,
  spacing: 0,
  margin: 0,
});
```

## Playing Animations

```javascript
// In your scene
this.driver.play("player_walk_right"); // Play walking right
this.driver.play("player_idle_down"); // Play idle down
```

## Current Implementation

The current game uses:

- **Idle animations** from Row 0 (frames 0-3)
- **Walking animations** from Row 2 (frames 112-135)
- **8 FPS** for walking animations
- **1 FPS** for idle animations (static poses)

## Tips

1. **Test frame ranges** by creating simple animations first
2. **Use console.log** to debug frame numbers
3. **Check sprite sheet visually** to confirm frame boundaries
4. **Start with small frame ranges** before creating complex animations
5. **Use consistent naming** for animation keys
