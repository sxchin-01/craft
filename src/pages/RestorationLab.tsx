import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ImageComparisonSlider } from "@/components/ImageComparisonSlider";
import { ProcessingLog } from "@/components/ProcessingLog";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Upload, Sparkles, X } from "lucide-react";
import { uploadImage, restoreImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import damagedImage from "@/assets/manuscript-damaged.jpg";
import restoredImage from "@/assets/manuscript-restored.jpg";

const RestorationLab = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to backend
      const result = await uploadImage(file);
      toast({
        title: "Upload successful",
        description: `Image "${file.name}" uploaded successfully`,
      });
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Could not connect to server. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearUpload = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartRestoration = () => {
    setIsProcessing(true);
    setIsComplete(false);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setIsComplete(false);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-foreground">
                U-Net Neural Architecture
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              AI <span className="text-gradient-heritage">Restoration</span> Lab
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch as our deep learning model reconstructs damaged manuscripts
              and artwork, pixel by pixel. Every restoration is verified and
              minted on-chain.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Image Comparison - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Show uploaded image preview or default comparison */}
              {uploadedImage ? (
                <div className="relative">
                  <div className="glass-card rounded-xl overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Uploaded image"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 gap-1"
                    onClick={handleClearUpload}
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                  <div className="absolute bottom-2 left-2 glass-card px-3 py-1 rounded-full">
                    <span className="text-sm text-muted-foreground">
                      {uploadedFile?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <ImageComparisonSlider
                  beforeImage={damagedImage}
                  afterImage={restoredImage}
                  beforeLabel="Damaged Original"
                  afterLabel="AI Restored"
                />
              )}

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="heritage"
                  size="lg"
                  onClick={handleStartRestoration}
                  disabled={(isProcessing && !isComplete) || !uploadedImage}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isProcessing ? "Processing..." : "Start Restoration"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>

                <Button 
                  variant="glass" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload Your Own"}
                </Button>
              </div>
            </div>

            {/* Processing Log - Takes 1 column */}
            <div className="lg:col-span-1">
              <ProcessingLog
                isRunning={isProcessing}
                onComplete={handleComplete}
              />

              {/* Info Card */}
              <div className="glass-card rounded-xl p-4 mt-4">
                <h3 className="font-serif font-semibold mb-3 text-gold">
                  How It Works
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-light">1.</span>
                    Upload a damaged artifact image
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-light">2.</span>
                    U-Net analyzes damage patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-light">3.</span>
                    AI inpaints missing regions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-light">4.</span>
                    Metadata & hash generated
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-light">5.</span>
                    NFT minted on Polygon
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tech Specs */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Model", value: "U-Net v2.1" },
                { label: "Resolution", value: "4K Max" },
                { label: "Accuracy", value: "98.7%" },
                { label: "Chain", value: "Polygon" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {spec.label}
                  </p>
                  <p className="font-mono font-bold text-gold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestorationLab;
