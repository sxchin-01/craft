import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize glass-card-gold select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Full) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute bottom-4 right-4 glass-card px-3 py-1.5 rounded-full">
          <span className="text-xs font-medium text-gold">{afterLabel}</span>
        </div>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover sepia brightness-75"
          draggable={false}
        />
        <div className="absolute bottom-4 left-4 glass-card px-3 py-1.5 rounded-full">
          <span className="text-xs font-medium text-terracotta-light">{beforeLabel}</span>
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold to-terracotta shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-10 h-10 rounded-full bg-card border-2 border-gold",
            "flex items-center justify-center shadow-xl",
            "transition-transform duration-200",
            isDragging && "scale-110"
          )}
        >
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gold rounded-full" />
            <div className="w-0.5 h-4 bg-gold rounded-full" />
          </div>
        </div>
      </div>

      {/* Scan Line Animation */}
      <div
        className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50 animate-scan pointer-events-none"
        style={{ left: `${sliderPosition - 50}%` }}
      />
    </div>
  );
}
