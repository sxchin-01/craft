import { Hexagon, Target, TrendingUp, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const sdgItems = [
  {
    number: 8,
    title: "Decent Work & Economic Growth",
    icon: TrendingUp,
    description: "Empowering artisans with fair trade",
  },
  {
    number: 9,
    title: "Industry, Innovation & Infrastructure",
    icon: Building2,
    description: "Blockchain for cultural preservation",
  },
  {
    number: 11,
    title: "Sustainable Cities & Communities",
    icon: Target,
    description: "Protecting intangible heritage",
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-gold/10 bg-card/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-terracotta rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* SDG Section */}
        <div className="mb-12">
          <h3 className="font-serif text-xl text-center mb-8 text-muted-foreground">
            Aligned with UN Sustainable Development Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sdgItems.map((sdg) => (
              <div
                key={sdg.number}
                className="glass-card rounded-xl p-6 text-center group hover:border-gold/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-gold mb-4 group-hover:scale-110 transition-transform">
                  <sdg.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-xs font-semibold text-gold mb-1">
                  SDG {sdg.number}
                </div>
                <h4 className="font-serif text-sm font-medium mb-2">
                  {sdg.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {sdg.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-gold" />
            <span className="font-serif text-lg font-bold text-gradient-gold">
              CraftVault
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link to="/restoration" className="hover:text-gold transition-colors">
              Restoration Lab
            </Link>
            <Link to="/auction" className="hover:text-gold transition-colors">
              Auction Hall
            </Link>
            <Link to="/archive" className="hover:text-gold transition-colors">
              Archive
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 CraftVault. Preserving Heritage.
          </p>
        </div>
      </div>
    </footer>
  );
}
