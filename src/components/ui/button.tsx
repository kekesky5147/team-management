import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border-0 bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-1 focus-visible:ring-white/15 active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover-hover:bg-primary/90",
        outline:
          "border-0 bg-white/8 text-neutral-200 hover-hover:bg-white/12",
        secondary:
          "bg-secondary text-secondary-foreground hover-hover:bg-white/12",
        ghost:
          "bg-transparent text-neutral-200 hover-hover:bg-white/8",
        destructive:
          "bg-destructive/10 text-destructive hover-hover:bg-destructive/20 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover-hover:underline",
      },
      size: {
        default:
          "min-h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "min-h-9 gap-1 rounded-lg px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-10 gap-1 rounded-lg px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 gap-1.5 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11 min-h-11 min-w-11",
        "icon-xs": "size-9 min-h-9 min-w-9 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10 min-h-10 min-w-10 rounded-lg",
        "icon-lg": "size-12 min-h-12 min-w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
