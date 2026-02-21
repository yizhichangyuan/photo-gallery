import { useRef, useEffect, useState, useCallback } from 'react';
import { PhotoItem } from './PhotoItem';

interface Photo {
  id: string;
  src: string;
  alt: string;
  title: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

interface WaterfallColumnProps {
  photos: Photo[];
  columnIndex: number;
  speed: number; // pixels per second
  hoveredPhotoId: string | null;
  onPhotoHover: (photoId: string | null, columnIndex: number, title: string | null, position: { x: number; y: number } | null) => void;
  onPhotoMove: (position: { x: number; y: number }) => void;
}

export function WaterfallColumn({
  photos,
  columnIndex,
  speed,
  hoveredPhotoId,
  onPhotoHover,
  onPhotoMove,
}: WaterfallColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Check if this column has a hovered photo
  const isPaused = hoveredPhotoId !== null && photos.some(p => p.id === hoveredPhotoId);

  // Double the photos for seamless loop
  const displayPhotos = [...photos, ...photos];

  // Calculate total height of one set of photos
  const getContentHeight = useCallback(() => {
    if (!containerRef.current) return 0;
    const firstSet = containerRef.current.querySelectorAll('.photo-item');
    let height = 0;
    firstSet.forEach((item, index) => {
      if (index < photos.length) {
        height += (item as HTMLElement).offsetHeight;
      }
    });
    return height;
  }, [photos.length]);

  // Animation loop using requestAnimationFrame for smooth 60fps
  const animate = useCallback(
    (timestamp: number) => {
      if (isPaused) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Calculate movement based on speed (pixels per second)
      const movement = (speed * deltaTime) / 1000;
      positionRef.current += movement;

      const contentHeight = getContentHeight();

      // Reset position for seamless loop
      if (contentHeight > 0 && positionRef.current >= contentHeight) {
        positionRef.current = positionRef.current % contentHeight;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPaused, speed, getContentHeight]
  );

  // Start/stop animation
  useEffect(() => {
    if (!isPaused && isReady) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused, isReady, animate]);

  // Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        lastTimeRef.current = null;
      } else if (!isPaused && isReady) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, isReady, animate]);

  // Set ready state after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = useCallback(
    (photoId: string, title: string, e: React.MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      onPhotoHover(photoId, columnIndex, title, position);
    },
    [columnIndex, onPhotoHover]
  );

  const handleMouseLeave = useCallback(() => {
    onPhotoHover(null, columnIndex, null, null);
  }, [columnIndex, onPhotoHover]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      onPhotoMove(position);
    },
    [onPhotoMove]
  );

  return (
    <div className="relative h-full overflow-hidden">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="flex flex-col gap-3"
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {displayPhotos.map((photo, index) => (
          <div key={`${photo.id}-${index}`} className="photo-item">
            <PhotoItem
              src={photo.src}
              alt={photo.alt}
              aspectRatio={photo.aspectRatio}
              isPaused={isPaused}
              isHovered={photo.id === hoveredPhotoId}
              onMouseEnter={(e) => handleMouseEnter(photo.id, photo.title, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}