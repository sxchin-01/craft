import { useState, useEffect } from "react";
import { Clock, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AuctionItem {
  id: string;
  title: string;
  artist: string;
  image: string;
  currentBid: number;
  currency: string;
  endTime: Date;
  bidCount: number;
}

interface AuctionCardProps {
  item: AuctionItem;
  onClick: () => void;
  delay?: number;
}

function formatTimeRemaining(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return `${hours}h ${minutes}m ${seconds}s`;
}

export function AuctionCard({ item, onClick, delay = 0 }: AuctionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(item.endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [item.endTime]);

  return (
    <div
      className={cn(
        "glass-card-gold rounded-2xl overflow-hidden group cursor-pointer",
        "hover:scale-[1.02] hover:border-gold/40 transition-all duration-500",
        "opacity-0 animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Time Badge */}
        <div className="absolute top-3 right-3 glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-mono font-medium text-foreground">
            {timeRemaining}
          </span>
        </div>

        {/* Bids Badge */}
        <div className="absolute bottom-3 left-3 glass-card px-3 py-1.5 rounded-full">
          <span className="text-xs text-muted-foreground">
            {item.bidCount} bids
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-serif text-lg font-semibold mb-1 group-hover:text-gold transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          by {item.artist}
        </p>

        {/* Bid Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
            <p className="font-mono text-lg font-bold text-gradient-gold">
              {item.currentBid} {item.currency}
            </p>
          </div>

          <Button
            variant="heritage"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Gavel className="w-4 h-4" />
            Bid
          </Button>
        </div>
      </div>
    </div>
  );
}
