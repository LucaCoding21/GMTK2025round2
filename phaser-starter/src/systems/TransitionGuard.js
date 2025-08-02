export class TransitionGuard {
  constructor() {
    this.isTransitioning = false;
    this.transitionTime = 0;
  }

  guard(fn) {
    return (...args) => {
      if (this.isTransitioning) {
        return;
      }
      
      this.isTransitioning = true;
      this.transitionTime = Date.now();
      
      // Reset after a short delay
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
      
      return fn(...args);
    };
  }

  // Guard scene transitions
  guardSceneTransition(scene, targetScene, data = {}) {
    return this.guard(() => {
      scene.scene.start(targetScene, data);
    });
  }

  // Guard button clicks
  guardButtonClick(fn) {
    return this.guard(fn);
  }

  // Check if currently transitioning
  isInTransition() {
    return this.isTransitioning;
  }

  // Force reset (for emergency cases)
  reset() {
    this.isTransitioning = false;
  }
} 