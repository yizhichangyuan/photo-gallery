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
  speed: number;
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
  const [contentHeight, setContentHeight] = useState(0);

  const isPaused = hoveredPhotoId !== null && photos.some(p => p.id === hoveredPhotoId);

  // Use single set of photos initially to reduce load
  const displayPhotos = photos.length > 0 ? [...photos, ...photos] : [];

  // Calculate content height once photos are rendered
  useEffect(() => {
    if (!containerRef.current || photos.length === 0) return;
    
    const calculateHeight = () => {
      const items = containerRef.current?.querySelectorAll('.photo-item');
      if (!items) return;
      
      let height = 0;
      items.forEach((item, index) => {
        if (index < photos.length) {
          height += (item as HTMLElement).offsetHeight;
        }
      });
      setContentHeight(height);
    };

    // Wait for images to load
    const timer = setTimeout(calculateHeight, 500);
    return () => clearTimeout(timer);
  }, [photos.length]);

  const animate = useCallback(
    (timestamp: number) => {
      if (isPaused || contentHeight === 0) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const movement = (speed * deltaTime) / 1000;
      positionRef.current += movement;

      if (positionRef.current >= contentHeight) {
        positionRef.current = positionRef.current % contentHeight;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(0, -${positionRef.current}px, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPaused, speed, contentHeight]
  );

  useEffect(() => {
    if (!isPaused && isReady && contentHeight > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused, isReady, animate, contentHeight]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        lastTimeRef.current = null;
      } else if (!isPaused && isReady && contentHeight > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, isReady, animate, contentHeight]);

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

  if (photos.length === 0) {
    return <div className="h-full" />;
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div
        ref={containerRef}
        className="flex flex-col gap-3"
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
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
