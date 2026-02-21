import { useState, useCallback } from 'react';
import { Download } from 'lucide-react';

interface PhotoItemProps {
  src: string;
  alt: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  isPaused: boolean;
  isHovered: boolean;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export function PhotoItem({
  src,
  alt,
  aspectRatio,
  isPaused,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}: PhotoItemProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Generate high-res download URL
  const getHighResUrl = useCallback((originalSrc: string): string => {
    // For Picsum photos, use larger dimensions
    if (originalSrc.includes('picsum.photos')) {
      // Extract seed from URL
      const seedMatch = originalSrc.match(/seed\/([^/]+)/);
      if (seedMatch) {
        const seed = seedMatch[1];
        // Return high-res version (1200px on longest side)
        if (originalSrc.includes('/400/600') || originalSrc.includes('/600/400')) {
          // Portrait or landscape - use 1200 on longest side
          return `https://picsum.photos/seed/${seed}/1200/1800`;
        }
        // Square
        return `https://picsum.photos/seed/${seed}/1200/1200`;
      }
    }
    
    // For Unsplash photos, modify URL parameters for higher quality
    if (originalSrc.includes('images.unsplash.com')) {
      return originalSrc
        .replace(/&w=\d+/, '&w=1920')
        .replace(/&q=\d+/, '&q=90')
        .replace(/&fit=[^&]*/, '');
    }
    
    return originalSrc;
  }, []);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const highResUrl = getHighResUrl(src);
    
    try {
      // Fetch the high-res image
      const response = await fetch(highResUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a temporary link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from alt text or use default
      const filename = alt.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'photo';
      link.download = `${filename}_hd.jpg`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      // Fallback: open high-res image in new tab
      window.open(highResUrl, '_blank');
    }
  }, [src, alt, getHighResUrl]);

  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  return (
    <div
      className={`
        relative overflow-hidden cursor-pointer
        ${aspectClasses[aspectRatio]}
        transition-all duration-300 ease-out
        ${isHovered ? 'scale-105 z-40' : 'hover:scale-[1.02]'}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        willChange: 'transform',
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`
          w-full h-full object-cover
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        loading="lazy"
        decoding="async"
      />

      {/* Overlay on hover/pause */}
      <div
        className={`
          absolute inset-0 bg-black/0
          transition-all duration-300
          ${isHovered ? 'bg-black/20' : 'hover:bg-black/10'}
        `}
      />

      {/* Hover indicator ring */}
      {isHovered && (
        <div className="absolute inset-0 ring-1 ring-white/30 ring-inset" />
      )}

      {/* Download button - bottom left, only on hover */}
      {isHovered && (
        <button
          onClick={handleDownload}
          className="
            absolute bottom-3 left-3
            flex items-center gap-1.5
            px-3 py-1.5
            bg-black/40 backdrop-blur-sm
            text-white/80 text-xs
            rounded-full
            border border-white/10
            transition-all duration-200
            hover:bg-black/60 hover:text-white
            active:scale-95
          "
          title="Download HD photo"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="font-light tracking-wide">Download HD</span>
        </button>
      )}
    </div>
  );
}
