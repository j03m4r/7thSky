import { clsx } from "clsx";
import React from "react";

type Props = Omit<React.ComponentProps<"button">, "className"> & {};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={clsx(
        "inline-flex select-none items-center justify-center px-10 py-5 text-sm font-medium",
        "bg-white text-gray-700 hover:bg-gray-50",
        "shadow-md",
        "hover:bg-gray-50",
        "focus:outline-none focus-visible:ring focus-visible:ring-transparent focus-visible:ring-opacity-75",
        // Register all radix states
        "group",
        "radix-state-open:bg-white",
        "radix-state-on:bg-white",
        "radix-state-instant-open:bg-white radix-state-delayed-open:bg-white"
      )}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;