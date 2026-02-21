import { Photo } from '../data/photos';

/**
 * Search photos using Picsum Photos API
 * Picsum generates random photos based on seed, ensuring consistent results for same query
 * @param query - Search keyword
 * @returns Array of Photo objects
 */
export async function searchPhotos(query: string): Promise<Photo[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    // Use Picsum Photos to generate photos based on query seed
    // This provides real, high-quality photos without needing API keys
    const photos: Photo[] = [];
    const seed = query.toLowerCase().replace(/\s+/g, '-');
    const count = 30;

    for (let i = 0; i < count; i++) {
      // Alternate between different aspect ratios for variety
      const aspectRatio = i % 3 === 0 ? 'portrait' : i % 3 === 1 ? 'landscape' : 'square';
      
      // Set dimensions based on aspect ratio
      let width: number;
      let height: number;
      
      switch (aspectRatio) {
        case 'portrait':
          width = 400;
          height = 600;
          break;
        case 'landscape':
          width = 600;
          height = 400;
          break;
        case 'square':
        default:
          width = 500;
          height = 500;
          break;
      }

      photos.push({
        id: `picsum-${seed}-${i}`,
        src: `https://picsum.photos/seed/${seed}-${i}/${width}/${height}`,
        alt: `${query} photo ${i + 1}`,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} ${i + 1}`,
        aspectRatio,
      });
    }

    return photos;
  } catch (error) {
    console.error('Failed to search photos:', error);
    throw error;
  }
}

/**
 * Check if photo service is available
 * Picsum is generally very reliable
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://picsum.photos/seed/test/100/100', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}