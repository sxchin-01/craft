import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "glass-card-gold rounded-2xl p-6 md:p-8 group cursor-pointer",
        "hover:scale-105 hover:border-gold/40 transition-all duration-500",
        "opacity-0 animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center group-hover:from-gold group-hover:to-gold-dark transition-all duration-500 shadow-lg">
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 w-14 h-14 rounded-xl bg-terracotta/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-gold transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>

      {/* Decorative line */}
      <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-terracotta to-gold group-hover:w-full transition-all duration-500" />
    </div>
  );
}
