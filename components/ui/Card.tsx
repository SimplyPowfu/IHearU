import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        // Background scuro + Bordo sottile + Ombra colorata soffusa
        "bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden",
        "hover:border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(5,217,232,0.1)] transition-all duration-500",
        className
      )}
    >
      {children}
    </div>
  );
}