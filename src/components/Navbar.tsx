import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Restoration Lab", path: "/restoration" },
  { name: "Auction Hall", path: "/auction" },
  { name: "Archive", path: "/archive" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const location = useLocation();

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-gold transition-transform duration-300 group-hover:rotate-90" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gold">CV</span>
              </div>
            </div>
            <span className="font-serif text-xl md:text-2xl font-bold text-gradient-gold">
              CraftVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-300 hover:text-gold",
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-terracotta to-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <Button
              variant="wallet"
              onClick={handleConnectWallet}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? "0x7a3...f92" : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-gold/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="wallet"
              onClick={handleConnectWallet}
              className="w-full gap-2 mt-4"
            >
              <Wallet className="w-4 h-4" />
              {walletConnected ? "0x7a3...f92" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
