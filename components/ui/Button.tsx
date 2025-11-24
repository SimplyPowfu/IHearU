'use client';

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "neon-pink" | "neon-cyan" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "neon-pink", size = "md", ...props }, ref) => {
    
    const variants = {
      // ROSA ELETTRICO (Action Primaria)
      "neon-pink": "bg-neon-pink text-white border-none shadow-[0_0_20px_rgba(255,42,109,0.4)] hover:shadow-[0_0_35px_rgba(255,42,109,0.6)] hover:bg-[#ff4d85]",
      
      // CIANO ELETTRICO (Action Secondaria)
      "neon-cyan": "bg-transparent border border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(5,217,232,0.2)] hover:bg-neon-cyan/10 hover:shadow-[0_0_25px_rgba(5,217,232,0.4)]",
      
      // VETRO (Neutro)
      "glass": "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md",
      
      // INVISIBILE
      "ghost": "bg-transparent text-gray-400 hover:text-white",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-10 py-4 text-lg tracking-wide",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-bold font-display transition-all duration-300 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };