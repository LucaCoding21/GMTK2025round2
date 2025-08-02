// Seeded RNG for deterministic gameplay
export function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export class RunState {
  constructor(day = 1) {
    this.day = day;
    this.seed = 12345 + day; // Base seed + day for determinism
    this.rng = mulberry32(this.seed);
    this.passengers = [];
    this.anomalyId = null;
    this.dropoffOrder = [];
    this.playerGuess = null;
  }

  // Initialize with passengers and choose anomaly
  initialize(passengers) {
    this.passengers = [...passengers];
    
    // Day 1: no anomaly
    if (this.day === 1) {
      this.anomalyId = null;
    } else {
      // Days 2-6: choose random anomaly
      this.chooseAnomaly();
    }
    
    // Shuffle dropoff order
    this.shuffleDropoffOrder();
  }

  chooseAnomaly() {
    const passengerIds = this.passengers.map(p => p.id);
    const randomIndex = Math.floor(this.rng() * passengerIds.length);
    this.anomalyId = passengerIds[randomIndex];
  }

  shuffleDropoffOrder() {
    const passengerIds = this.passengers.map(p => p.id);
    this.dropoffOrder = [...passengerIds];
    
    // Fisher-Yates shuffle with seeded RNG
    for (let i = this.dropoffOrder.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [this.dropoffOrder[i], this.dropoffOrder[j]] = [this.dropoffOrder[j], this.dropoffOrder[i]];
    }
  }

  // Check if player's guess is correct
  isCorrect() {
    return (this.anomalyId === null && this.playerGuess === "NONE") ||
           (this.anomalyId !== null && this.playerGuess === this.anomalyId);
  }

  // Get passenger by ID
  getPassenger(id) {
    return this.passengers.find(p => p.id === id);
  }

  // Get anomaly passenger
  getAnomalyPassenger() {
    return this.anomalyId ? this.getPassenger(this.anomalyId) : null;
  }

  // Check if a passenger is the anomaly
  isAnomaly(id) {
    return this.anomalyId === id;
  }
} 