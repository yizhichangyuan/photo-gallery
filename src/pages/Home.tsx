import { useState, useCallback, useEffect, useMemo } from 'react';
import { WaterfallColumn } from '../components/WaterfallColumn';
import { PhotoTitleModal } from '../components/PhotoTitleModal';
import { columnPhotos as originalColumnPhotos, columnSpeeds, Photo } from '../data/photos';
import { searchPhotos } from '../services/unsplash';
import { Search, Loader2 } from 'lucide-react';

export function Home() {
  // Track hovered photo state
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle photo hover - pause column and show title
  const handlePhotoHover = useCallback((
    photoId: string | null,
    columnIndex: number,
    title: string | null,
    position: { x: number; y: number } | null
  ) => {
    setHoveredPhotoId(photoId);
    setHoveredColumnIndex(photoId ? columnIndex : null);
    setModalTitle(title || '');
    setModalPosition(position);
  }, []);

  // Handle mouse move - update tooltip position
  const handlePhotoMove = useCallback((position: { x: number; y: number }) => {
    setModalPosition(position);
  }, []);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsSearching(true);

      try {
        const results = await searchPhotos(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search photos. Please try again.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Distribute photos into columns
  const displayedPhotos = useMemo(() => {
    if (isSearching && searchResults.length > 0) {
      // Distribute search results into columns
      const columnCount = 6;
      const columns: Photo[][] = Array.from({ length: columnCount }, () => []);
      
      searchResults.forEach((photo, index) => {
        const columnIndex = index % columnCount;
        columns[columnIndex].push(photo);
      });

      return columns;
    }

    // Return original photos if not searching
    return originalColumnPhotos;
  }, [isSearching, searchResults]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  }, []);

  // Determine number of columns based on screen width
  const [columnCount, setColumnCount] = useState(6);

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(2);
      else if (width < 768) setColumnCount(3);
      else if (width < 1024) setColumnCount(4);
      else if (width < 1280) setColumnCount(5);
      else setColumnCount(6);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* Header - Minimal transparent with search */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white/90 text-lg font-light tracking-widest uppercase">
            Gallery
          </h1>
          
          {/* Search Input */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative group">
              {isLoading ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 animate-spin z-10" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-hover:text-white/80 group-focus-within:text-white transition-colors z-10 pointer-events-none" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search photos..."
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-full py-2 pl-10 pr-10 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              />
              {searchQuery && !isLoading && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  <span className="text-xs">×</span>
                </button>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="absolute top-full left-0 right-0 mt-2 text-xs text-red-400 text-center">
                {error}
              </div>
            )}
          </div>

          <div className="text-white/50 text-xs tracking-wider">
            {isSearching 
              ? `Found ${searchResults.length} photos` 
              : 'Hover to explore'}
          </div>
        </div>
      </header>

      {/* Main waterfall grid */}
      <main className="h-screen pt-20 pb-4 px-2">
        <div 
          className="h-full grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          }}
        >
          {displayedPhotos.slice(0, columnCount).map((photos, index) => (
            <div key={index} className="h-full">
              <WaterfallColumn
                photos={photos}
                columnIndex={index}
                speed={columnSpeeds[index]}
                hoveredPhotoId={hoveredColumnIndex === index ? hoveredPhotoId : null}
                onPhotoHover={handlePhotoHover}
                onPhotoMove={handlePhotoMove}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Photo Title Tooltip - follows mouse */}
      <PhotoTitleModal
        title={modalTitle}
        isVisible={hoveredPhotoId !== null}
        position={modalPosition}
      />
    </div>
  );
}