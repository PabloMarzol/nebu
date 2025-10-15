/**
 * Global Auto-Dismiss Manager
 * Ensures all popup boxes and widgets auto-dismiss after 5 seconds
 */

export class AutoDismissManager {
  private static instance: AutoDismissManager;
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): AutoDismissManager {
    if (!AutoDismissManager.instance) {
      AutoDismissManager.instance = new AutoDismissManager();
    }
    return AutoDismissManager.instance;
  }

  /**
   * Register a popup/widget for auto-dismiss
   */
  register(id: string, dismissCallback: () => void, delay: number = 5000): void {
    // Clear existing timer if any
    this.clear(id);

    // Set new timer
    const timer = setTimeout(() => {
      console.log(`Auto-dismissing popup/widget: ${id} after ${delay}ms`);
      dismissCallback();
      this.activeTimers.delete(id);
    }, delay);

    this.activeTimers.set(id, timer);
  }

  /**
   * Clear timer for specific popup/widget
   */
  clear(id: string): void {
    const timer = this.activeTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(id);
    }
  }

  /**
   * Clear all active timers
   */
  clearAll(): void {
    this.activeTimers.forEach((timer) => clearTimeout(timer));
    this.activeTimers.clear();
  }

  /**
   * Get count of active auto-dismiss timers
   */
  getActiveCount(): number {
    return this.activeTimers.size;
  }
}

// Global instance
export const autoDismissManager = AutoDismissManager.getInstance();

/**
 * React hook for easy auto-dismiss integration
 */
export function useGlobalAutoDismiss(
  id: string,
  isActive: boolean,
  onDismiss: () => void,
  delay: number = 5000
): void {
  if (isActive) {
    autoDismissManager.register(id, onDismiss, delay);
  } else {
    autoDismissManager.clear(id);
  }
}