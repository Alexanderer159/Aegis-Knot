import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  rangeClassName?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, rangeClassName, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className={cn("absolute h-full bg-primary", rangeClassName)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn("block h-4 w-4 rounded-full ring-offset-background transition-colors", rangeClassName)} />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };