import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  ExternalLink,
  Calendar,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

import madhubaniImage from "@/assets/madhubani-painting.jpg";
import palmLeafImage from "@/assets/palm-leaf-manuscript.jpg";
import natarajaImage from "@/assets/bronze-nataraja.jpg";
import pattachitraImage from "@/assets/pattachitra-painting.jpg";
import mughalImage from "@/assets/mughal-miniature.jpg";
import kalamkariImage from "@/assets/kalamkari-textile.jpg";

interface ArchiveItem {
  id: string;
  title: string;
  category: string;
  origin: string;
  period: string;
  image: string;
  status: "restored" | "archived" | "pending";
}

const archiveItems: ArchiveItem[] = [
  {
    id: "1",
    title: "Madhubani Fish & Birds Painting",
    category: "Painting",
    origin: "Bihar, India",
    period: "Contemporary",
    image: madhubaniImage,
    status: "restored",
  },
  {
    id: "2",
    title: "Sanskrit Palm Leaf Manuscript",
    category: "Manuscript",
    origin: "Kerala, India",
    period: "12th Century",
    image: palmLeafImage,
    status: "restored",
  },
  {
    id: "3",
    title: "Chola Bronze Nataraja",
    category: "Sculpture",
    origin: "Tamil Nadu, India",
    period: "11th Century",
    image: natarajaImage,
    status: "archived",
  },
  {
    id: "4",
    title: "Pattachitra Divine Scene",
    category: "Painting",
    origin: "Odisha, India",
    period: "Contemporary",
    image: pattachitraImage,
    status: "restored",
  },
  {
    id: "5",
    title: "Mughal Miniature Painting",
    category: "Painting",
    origin: "Delhi, India",
    period: "16th Century",
    image: mughalImage,
    status: "archived",
  },
  {
    id: "6",
    title: "Kalamkari Temple Textile",
    category: "Textile",
    origin: "Andhra Pradesh, India",
    period: "Traditional",
    image: kalamkariImage,
    status: "pending",
  },
];

const categories = ["All", "Painting", "Manuscript", "Sculpture", "Textile"];

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = archiveItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: ArchiveItem["status"]) => {
    switch (status) {
      case "restored":
        return "bg-terracotta/20 text-terracotta-light";
      case "archived":
        return "bg-gold/20 text-gold";
      case "pending":
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Heritage <span className="text-gradient-heritage">Archive</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A decentralized repository of preserved cultural artifacts,
              accessible to researchers and enthusiasts worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Artifacts", value: "2,456" },
              { label: "Restored", value: "1,892" },
              { label: "Countries", value: "24" },
              { label: "Contributors", value: "180+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="font-serif text-2xl font-bold text-gradient-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="glass-card rounded-xl p-4 mb-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, origin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "heritage" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Archive Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="glass-card-gold rounded-2xl overflow-hidden group opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          getStatusColor(item.status)
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif font-semibold mb-2 line-clamp-1 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.origin}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.period}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-serif font-semibold mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      <span>{item.origin}</span>
                      <span>{item.period}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusColor(item.status)
                    )}
                  >
                    {item.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No artifacts found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Archive;
