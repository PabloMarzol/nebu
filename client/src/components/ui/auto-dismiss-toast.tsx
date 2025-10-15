import * as React from "react";
import { useToast } from "@/hooks/use-toast";

// Enhanced toast with guaranteed 5-second auto-dismiss
export function useAutoDismissToast() {
  const { toast: originalToast, ...rest } = useToast();

  const toast = React.useCallback(
    ({ duration = 5000, ...props }: Parameters<typeof originalToast>[0]) => {
      return originalToast({
        duration,
        ...props,
      });
    },
    [originalToast]
  );

  return {
    toast,
    ...rest,
  };
}

// Quick toast function with 5-second auto-dismiss
export function showAutoDismissToast(title: string, description?: string) {
  const { toast } = useAutoDismissToast();
  return toast({
    title,
    description,
    duration: 5000,
  });
}