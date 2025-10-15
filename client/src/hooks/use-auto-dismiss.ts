import { useEffect, useRef } from 'react';

interface AutoDismissOptions {
  delay?: number;
  enabled?: boolean;
}

/**
 * Hook for auto-dismissing popup components after a specified delay
 * Default: 5 seconds
 */
export function useAutoDismiss(
  onDismiss: () => void,
  options: AutoDismissOptions = {}
) {
  const { delay = 5000, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !onDismiss) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-dismiss
    timeoutRef.current = setTimeout(() => {
      onDismiss();
    }, delay);

    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onDismiss, delay, enabled]);

  // Return cleanup function for manual use
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
}

/**
 * Enhanced version that also handles dialog/modal states
 */
export function useAutoDialogDismiss(
  isOpen: boolean,
  onClose: () => void,
  options: AutoDismissOptions = {}
) {
  const { delay = 5000, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isOpen || !onClose) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-dismiss
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, delay);

    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onClose, delay, enabled]);

  // Manual cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}

/**
 * Hook for auto-dismissing notification/widget components
 */
export function useAutoWidgetDismiss(
  isVisible: boolean,
  onHide: () => void,
  options: AutoDismissOptions = {}
) {
  const { delay = 5000, enabled = true } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !isVisible || !onHide) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-dismiss
    timeoutRef.current = setTimeout(() => {
      onHide();
    }, delay);

    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, onHide, delay, enabled]);

  // Manual cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}