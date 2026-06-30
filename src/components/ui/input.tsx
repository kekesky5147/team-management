import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-12 w-full min-w-0 rounded-xl border-0 bg-surface-3 px-4 py-2 text-base text-neutral-200 transition-colors outline-none file:inline-flex file:min-h-11 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
