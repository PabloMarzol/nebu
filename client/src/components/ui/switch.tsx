import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "bg-slate-600 data-[state=checked]:bg-purple-600",
      "hover:scale-105",
      className
    )}
    {...props}
    ref={ref}
    style={{
      backgroundColor: props.checked ? 'rgb(147 51 234)' : 'rgb(71 85 105)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid',
      borderColor: props.checked ? 'rgb(168 85 247)' : 'rgb(51 65 85)',
    }}
  >
    <SwitchPrimitives.Thumb
      className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
      style={{
        transform: props.checked ? 'translateX(20px)' : 'translateX(0px)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: 'white',
        boxShadow: props.checked ? '0 2px 8px rgba(147, 51, 234, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
