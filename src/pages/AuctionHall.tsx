import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuctionCard, AuctionItem } from "@/components/AuctionCard";
import { AuctionModal } from "@/components/AuctionModal";
import { Button } from "@/components/ui/button";
import { Filter, Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

import madhubaniImage from "@/assets/madhubani-painting.jpg";
import palmLeafImage from "@/assets/palm-leaf-manuscript.jpg";
import natarajaImage from "@/assets/bronze-nataraja.jpg";
import pattachitraImage from "@/assets/pattachitra-painting.jpg";
import mughalImage from "@/assets/mughal-miniature.jpg";
import kalamkariImage from "@/assets/kalamkari-textile.jpg";

const auctionItems: AuctionItem[] = [
  {
    id: "1",
    title: "Madhubani Fish & Birds",
    artist: "Sita Devi, Bihar",
    image: madhubaniImage,
    currentBid: 2.4,
    currency: "MATIC",
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    bidCount: 23,
  },
  {
    id: "2",
    title: "Ancient Palm Leaf Manuscript",
    artist: "Kerala State Archives",
    image: palmLeafImage,
    currentBid: 5.8,
    currency: "MATIC",
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    bidCount: 45,
  },
  {
    id: "3",
    title: "Bronze Nataraja",
    artist: "Chola Dynasty, 11th Century",
    image: natarajaImage,
    currentBid: 18.5,
    currency: "MATIC",
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    bidCount: 89,
  },
  {
    id: "4",
    title: "Pattachitra Krishna",
    artist: "Raghu Meher, Odisha",
    image: pattachitraImage,
    currentBid: 3.2,
    currency: "MATIC",
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    bidCount: 31,
  },
  {
    id: "5",
    title: "Mughal Court Scene",
    artist: "Akbar's Workshop, 16th Century",
    image: mughalImage,
    currentBid: 12.7,
    currency: "MATIC",
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    bidCount: 67,
  },
  {
    id: "6",
    title: "Kalamkari Tree of Life",
    artist: "Pedana Artisans, Andhra",
    image: kalamkariImage,
    currentBid: 1.9,
    currency: "MATIC",
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    bidCount: 18,
  },
];

const AuctionHall = () => {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = auctionItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Auction <span className="text-gradient-gold">Hall</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bid on verified, AI-restored artifacts. Every piece includes a
              complete provenance record minted on-chain.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="glass-card rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-sm">
                  <span className="font-semibold text-foreground">24h Volume:</span>{" "}
                  <span className="text-gold font-mono">456.8 MATIC</span>
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {auctionItems.length} Active Auctions
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search artifacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Auction Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <AuctionCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
                delay={index * 100}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No artifacts found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Auction Modal */}
      <AuctionModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <Footer />
    </div>
  );
};

export default AuctionHall;
