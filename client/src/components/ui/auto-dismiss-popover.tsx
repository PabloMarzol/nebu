import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { useAutoWidgetDismiss } from "@/hooks/use-auto-dismiss";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

interface AutoDismissPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  autoDismissDelay?: number;
  disableAutoDismiss?: boolean;
}

const AutoDismissPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  AutoDismissPopoverContentProps
>(({
  className,
  align = "center",
  sideOffset = 4,
  autoDismissDelay = 5000,
  disableAutoDismiss = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Auto-dismiss popover after specified delay
  useAutoWidgetDismiss(isOpen, () => setIsOpen(false), {
    delay: autoDismissDelay,
    enabled: !disableAutoDismiss,
  });

  React.useEffect(() => {
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };

    // Listen for open state changes
    const element = ref as React.RefObject<HTMLElement>;
    if (element?.current) {
      const observer = new MutationObserver(() => {
        const isCurrentlyOpen = element.current?.getAttribute('data-state') === 'open';
        setIsOpen(isCurrentlyOpen);
      });

      observer.observe(element.current, {
        attributes: true,
        attributeFilter: ['data-state']
      });

      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
});
AutoDismissPopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, AutoDismissPopoverContent as PopoverContent };