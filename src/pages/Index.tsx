import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Cpu,
  Shield,
  Scale,
  Archive,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI Restoration",
    description:
      "Our U-Net neural architecture reconstructs damaged manuscripts and artwork, filling missing pixels with historically accurate detail.",
  },
  {
    icon: Shield,
    title: "Blockchain Authenticity",
    description:
      "Every restoration is cryptographically signed and minted as an NFT on Polygon, creating an immutable provenance record.",
  },
  {
    icon: Scale,
    title: "Fair Trade",
    description:
      "Smart contracts ensure artisans receive fair royalties on every secondary sale, empowering traditional craftspeople globally.",
  },
  {
    icon: Archive,
    title: "Global Archive",
    description:
      "Access a decentralized repository of preserved heritage, searchable and accessible to researchers worldwide.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-terracotta/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-terracotta/5 rounded-full" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 opacity-0 animate-fade-in"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-foreground">
                Powered by AI & Blockchain
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              Preserving Culture,{" "}
              <span className="text-gradient-heritage">Immutable</span> on
              Blockchain
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              CraftVault uses advanced AI to restore ancient Indian artifacts
              and permanently records their authenticity on the blockchain,
              creating a timeless digital archive.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "600ms" }}
            >
              <Link to="/restoration">
                <Button variant="heritage" size="xl" className="gap-2">
                  Explore Restoration Lab
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auction">
                <Button variant="glass" size="xl" className="gap-2">
                  Browse Auction Hall
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto opacity-0 animate-fade-in"
              style={{ animationDelay: "800ms" }}
            >
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-gradient-gold">
                  2,450+
                </p>
                <p className="text-sm text-muted-foreground">
                  Artifacts Restored
                </p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-gradient-gold">
                  180
                </p>
                <p className="text-sm text-muted-foreground">Partner Museums</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-gradient-gold">
                  ₹12Cr
                </p>
                <p className="text-sm text-muted-foreground">
                  Artisan Royalties
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1000ms" }}>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-gold animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              The Future of{" "}
              <span className="text-gradient-gold">Heritage Preservation</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining cutting-edge technology with deep cultural respect to
              create a new paradigm in artifact conservation.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta/10 via-transparent to-gold/10" />
        
        <div className="container mx-auto px-4 relative">
          <div className="glass-card-gold rounded-3xl p-8 md:p-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to Preserve History?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join museums, collectors, and artisans in building the world's
              most secure heritage archive.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/restoration">
                <Button variant="heritage" size="lg">
                  Start Restoring
                </Button>
              </Link>
              <Link to="/archive">
                <Button variant="outline" size="lg">
                  Browse Archive
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
