# Bus Boarding Animation Guide

## Overview

When you get your real bus image:
Identify door position in your bus
Map seat positions to your bus layout
Update coordinates in the walking paths
Remove the rectangle door and use your bus's door
Adjust timing if needed

This guide explains how the passenger boarding animations work in the game, including the coordinate system, walking paths, and how to adapt it for a real bus background.

## Current Implementation

### Coordinate System

```
Game Viewport: 1200x600 pixels
Bus Layout: Horizontal (3x2 grid)

Seat Positions:
┌─────────────────────────────────────┐
│  (300,200)  (400,200)  (500,200)  │  Row 1
│  (300,300)  (400,300)  (500,300)  │  Row 2
└─────────────────────────────────────┘

Door Position: (500, 150)
Passenger Start: (600, 100)
```

### Walking Path Algorithm

#### Step 1: Walk to Door (Horizontal)

```javascript
// Passenger starts at (600, 100)
// Walks horizontally to door at (500, 100)
sprite.play("player_walk_left");
this.tweens.add({
  targets: sprite,
  x: 500, // Door X position
  y: 100, // Same Y (horizontal movement)
  duration: 800,
  ease: "Power2",
});
```

#### Step 2: Enter Bus (Vertical)

```javascript
// Door sound plays
// Walks vertically from (500, 100) to (500, seat.y)
sprite.play("player_walk_down");
this.tweens.add({
  targets: sprite,
  x: 500, // Stay at door X
  y: BUS_SEATS[passenger.seatIndex].y, // Move to seat Y
  duration: 600,
  ease: "Power2",
});
```

#### Step 3: Walk to Seat (Horizontal)

```javascript
// Determine direction based on seat position
if (BUS_SEATS[passenger.seatIndex].x > 500) {
  sprite.play("player_walk_right");
} else {
  sprite.play("player_walk_left");
}

// Walk to final seat position
this.tweens.add({
  targets: sprite,
  x: BUS_SEATS[passenger.seatIndex].x,
  y: BUS_SEATS[passenger.seatIndex].y,
  duration: 400,
  ease: "Power2",
});
```

## Visual Elements

### Door Visualization

```javascript
createDoor(){
  const doorX = 500;
  const doorY = 150;

  // Door frame (brown rectangle)
  this.add.rectangle(doorX, doorY, 20, 40, 0x8B4513).setOrigin(0.5);

  // Door label
  this.add.text(doorX, doorY - 30, "DOOR", {
    fontFamily: "monospace", fontSize: 12, color: "#ffffff"
  }).setOrigin(0.5);
}
```

### Animation States

```javascript
// Walking animations (from row 2 of sprite sheet)
player_walk_left: frames[(124, 125, 126, 127, 128, 129)];
player_walk_right: frames[(112, 113, 114, 115, 116, 117)];
player_walk_up: frames[(118, 119, 120, 121, 122, 123)];
player_walk_down: frames[(130, 131, 132, 133, 134, 135)];

// Idle animations (from row 0 of sprite sheet)
player_idle_left: frame[2];
player_idle_right: frame[0];
player_idle_up: frame[1];
player_idle_down: frame[3];
```

## Adapting for Real Bus Background

### When You Have a Real Bus Image

#### 1. Identify Bus Elements

```javascript
// You'll need to identify these positions in your real bus image:
const BUS_ELEMENTS = {
  door: { x: 500, y: 150 }, // Bus entrance
  seats: [
    // All seat positions
    { x: 300, y: 200 },
    { x: 400, y: 200 },
    { x: 500, y: 200 },
    { x: 300, y: 300 },
    { x: 400, y: 300 },
    { x: 500, y: 300 },
  ],
  aisle: { x: 400, y: 250 }, // Center aisle position
  driverSeat: { x: 250, y: 150 }, // Driver's position
};
```

#### 2. Update Walking Paths

```javascript
// For a real bus, you might want:
// 1. Walk to bus door (horizontal)
// 2. Enter through door (vertical)
// 3. Walk down aisle (vertical)
// 4. Turn to seat (horizontal)

const REALISTIC_PATH = {
  step1: {
    // Walk to door
    from: { x: 600, y: 100 },
    to: { x: door.x, y: 100 },
    animation: "player_walk_left",
  },
  step2: {
    // Enter bus
    from: { x: door.x, y: 100 },
    to: { x: door.x, y: aisle.y },
    animation: "player_walk_down",
  },
  step3: {
    // Walk to seat
    from: { x: door.x, y: aisle.y },
    to: { x: seat.x, y: seat.y },
    animation: seat.x > door.x ? "player_walk_right" : "player_walk_left",
  },
};
```

#### 3. Door Integration

```javascript
// Instead of a rectangle, use your bus image
// The door should be part of your bus background
// Just mark the door position for walking calculations

const DOOR_POSITION = {
  x: 500, // Adjust based on your bus image
  y: 150, // Adjust based on your bus image
};
```

## Key Concepts

### Straight-Line Movement

- **Never walk diagonally** - it looks unrealistic
- **Break movement into steps**: horizontal → vertical → horizontal
- **Use appropriate animations** for each direction

### Timing

```javascript
const TIMING = {
  walkToDoor: 800, // Slower for approach
  enterBus: 600, // Medium for entry
  walkToSeat: 400, // Faster for final movement
  delayBetween: 300, // Pause between passengers
};
```

### Sound Integration

```javascript
// Play sounds at appropriate moments
this.game.sfx.door(); // When reaching door
this.game.sfx.seat(); // When reaching seat
```

## Customization Options

### Different Bus Layouts

```javascript
// Vertical bus layout
const VERTICAL_BUS_SEATS = [
  { x: 400, y: 150 },
  { x: 400, y: 200 },
  { x: 400, y: 250 },
  { x: 500, y: 150 },
  { x: 500, y: 200 },
  { x: 500, y: 250 },
];

// Double-decker bus
const DOUBLE_DECKER_SEATS = [
  // Lower deck
  { x: 300, y: 300 },
  { x: 400, y: 300 },
  { x: 500, y: 300 },
  // Upper deck
  { x: 300, y: 150 },
  { x: 400, y: 150 },
  { x: 500, y: 150 },
];
```

### Multiple Doors

```javascript
const MULTIPLE_DOORS = {
  front: { x: 500, y: 150 },
  middle: { x: 400, y: 150 },
  rear: { x: 300, y: 150 },
};

// Choose closest door to passenger
function getClosestDoor(passengerX, passengerY) {
  // Calculate distance to each door
  // Return closest door position
}
```

## Troubleshooting

### Common Issues

1. **Diagonal movement**: Break into horizontal/vertical steps
2. **Wrong animations**: Ensure animation key matches direction
3. **Timing issues**: Adjust duration values for realistic speed
4. **Door positioning**: Align with your bus image

### Debug Tips

```javascript
// Add visual path markers
this.add.circle(500, 100, 5, 0xff0000); // Door position
this.add.circle(seat.x, seat.y, 5, 0x00ff00); // Seat position

// Log walking steps
console.log(
  `Passenger walking from (${startX}, ${startY}) to (${endX}, ${endY})`
);
```

## Future Enhancements

### Realistic Features

- **Multiple passengers** boarding simultaneously
- **Queue system** for boarding
- **Different walking speeds** based on passenger type
- **Obstacle avoidance** (other passengers)
- **Realistic bus sounds** (engine, brakes, etc.)

### Animation Improvements

- **Smoother transitions** between walking directions
- **Different walking styles** (old person, child, etc.)
- **Carrying animations** (luggage, bags)
- **Sitting animations** (adjusting in seat)

This system provides a solid foundation for realistic bus boarding animations that you can adapt to any bus background image!
