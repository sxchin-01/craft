import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Gavel,
  CheckCircle2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuctionItem } from "./AuctionCard";
import { cn } from "@/lib/utils";

interface ProvenanceEvent {
  id: string;
  action: string;
  actor: string;
  date: string;
  txHash?: string;
}

interface BidHistoryItem {
  address: string;
  amount: number;
  timestamp: string;
}

const mockProvenance: ProvenanceEvent[] = [
  {
    id: "1",
    action: "Artwork Digitized",
    actor: "National Heritage Foundation",
    date: "2024-01-15",
  },
  {
    id: "2",
    action: "AI Restoration Complete",
    actor: "CraftVault U-Net v2.1",
    date: "2024-02-20",
    txHash: "0x8f72...a91c",
  },
  {
    id: "3",
    action: "Verified by Curator",
    actor: "Dr. Meera Sharma",
    date: "2024-03-01",
  },
  {
    id: "4",
    action: "Listed on Polygon",
    actor: "CraftVault Marketplace",
    date: "2024-03-05",
    txHash: "0x4e21...b8f3",
  },
];

const mockBidHistory: BidHistoryItem[] = [
  { address: "0x7a3f...2e91", amount: 2.4, timestamp: "2 hours ago" },
  { address: "0x9c1b...8f42", amount: 2.2, timestamp: "5 hours ago" },
  { address: "0x3d5e...1a73", amount: 1.9, timestamp: "12 hours ago" },
  { address: "0x6f8c...4b29", amount: 1.5, timestamp: "1 day ago" },
];

interface AuctionModalProps {
  item: AuctionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuctionModal({ item, isOpen, onClose }: AuctionModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!item) return null;

  const handlePlaceBid = async () => {
    if (!bidAmount || parseFloat(bidAmount) <= item.currentBid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than ${item.currentBid} ${item.currency}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Transaction Signed",
      description: "Waiting for block confirmation...",
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Bid Placed Successfully!",
      description: `Your bid of ${bidAmount} ${item.currency} has been confirmed.`,
    });

    setIsProcessing(false);
    setBidAmount("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-gold/20">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-gradient-gold">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Left Column - Image & Bid */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden aspect-square">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 glass-card px-3 py-1.5 rounded-full flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-mono">12h 34m 56s</span>
              </div>
            </div>

            {/* Artist Info */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm text-muted-foreground">Artist</p>
              <p className="font-serif font-semibold">{item.artist}</p>
            </div>

            {/* Place Bid */}
            <div className="glass-card-gold rounded-xl p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                <p className="font-mono text-2xl font-bold text-gradient-gold">
                  {item.currentBid} {item.currency}
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Min: ${item.currentBid + 0.1}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="font-mono bg-muted/50 border-border"
                />
                <Button
                  variant="heritage"
                  onClick={handlePlaceBid}
                  disabled={isProcessing}
                  className="gap-2 min-w-[120px]"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Gavel className="w-4 h-4" />
                      Place Bid
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            {/* Provenance Timeline */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                Provenance History
              </h3>

              <div className="space-y-3">
                {mockProvenance.map((event, index) => (
                  <div
                    key={event.id}
                    className={cn(
                      "relative pl-6 pb-3",
                      index < mockProvenance.length - 1 &&
                        "border-l-2 border-border"
                    )}
                  >
                    <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-gradient-to-br from-terracotta to-gold -translate-x-[7px]" />
                    <p className="text-sm font-medium">{event.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.actor}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {event.date}
                      </span>
                      {event.txHash && (
                        <a
                          href="#"
                          className="text-xs text-gold hover:underline flex items-center gap-1"
                        >
                          {event.txHash}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-serif font-semibold mb-4">Bid History</h3>

              <div className="space-y-2">
                {mockBidHistory.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(bid.address)}
                        className="text-sm font-mono text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
                      >
                        {bid.address}
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold">
                        {bid.amount} {item.currency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bid.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
