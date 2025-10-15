import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useAutoDialogDismiss } from "@/hooks/use-auto-dismiss";

interface AutoDismissDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  autoDismissDelay?: number;
  disableAutoDismiss?: boolean;
}

// Auto-dismissing Dialog wrapper
export function AutoDismissDialog({
  open,
  onOpenChange,
  children,
  autoDismissDelay = 5000,
  disableAutoDismiss = false,
  ...props
}: AutoDismissDialogProps) {
  // Auto-dismiss dialog after specified delay
  useAutoDialogDismiss(open, () => onOpenChange(false), {
    delay: autoDismissDelay,
    enabled: !disableAutoDismiss,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </Dialog>
  );
}

// Auto-dismissing AlertDialog wrapper
export function AutoDismissAlertDialog({
  open,
  onOpenChange,
  children,
  autoDismissDelay = 5000,
  disableAutoDismiss = false,
  ...props
}: AutoDismissDialogProps) {
  // Auto-dismiss alert dialog after specified delay
  useAutoDialogDismiss(open, () => onOpenChange(false), {
    delay: autoDismissDelay,
    enabled: !disableAutoDismiss,
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
      {children}
    </AlertDialog>
  );
}

// Export all original components for backward compatibility
export {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
};