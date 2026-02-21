export interface Photo {
  id: string;
  src: string;
  alt: string;
  title: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

// Sample photography data using placeholder images
// In production, replace with actual photography URLs
export const columnPhotos: Photo[][] = [
  // Column 1 - Mix of portraits and landscapes
  [
    { id: 'c1-1', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'Mountain landscape at sunset', title: 'Golden Hour Peaks', aspectRatio: 'landscape' },
    { id: 'c1-2', src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80', alt: 'Portrait of a woman', title: 'Ethereal Gaze', aspectRatio: 'portrait' },
    { id: 'c1-3', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', alt: 'Nature wilderness', title: 'Wilderness Calling', aspectRatio: 'landscape' },
    { id: 'c1-4', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80', alt: 'Fashion portrait', title: 'Urban Elegance', aspectRatio: 'portrait' },
    { id: 'c1-5', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', alt: 'Foggy forest', title: 'Misty Morning', aspectRatio: 'landscape' },
  ],
  // Column 2 - Urban and architecture
  [
    { id: 'c2-1', src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80', alt: 'City skyline', title: 'City Lights', aspectRatio: 'landscape' },
    { id: 'c2-2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', alt: 'Man portrait', title: 'Silent Strength', aspectRatio: 'portrait' },
    { id: 'c2-3', src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80', alt: 'Urban architecture', title: 'Concrete Dreams', aspectRatio: 'landscape' },
    { id: 'c2-4', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', alt: 'Model portrait', title: 'Fresh Perspective', aspectRatio: 'portrait' },
    { id: 'c2-5', src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', alt: 'Street photography', title: 'Street Stories', aspectRatio: 'landscape' },
  ],
  // Column 3 - Nature and wildlife
  [
    { id: 'c3-1', src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80', alt: 'Waterfall in forest', title: 'Cascading Dreams', aspectRatio: 'portrait' },
    { id: 'c3-2', src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', alt: 'Aerial landscape', title: 'Above the Clouds', aspectRatio: 'landscape' },
    { id: 'c3-3', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80', alt: 'Elderly portrait', title: 'Wisdom Lines', aspectRatio: 'portrait' },
    { id: 'c3-4', src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80', alt: 'Green hills', title: 'Rolling Hills', aspectRatio: 'landscape' },
    { id: 'c3-5', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80', alt: 'Young woman portrait', title: 'Natural Beauty', aspectRatio: 'portrait' },
  ],
  // Column 4 - Art and abstract
  [
    { id: 'c4-1', src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=600&q=80', alt: 'Ocean waves', title: 'Ocean Whispers', aspectRatio: 'landscape' },
    { id: 'c4-2', src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80', alt: 'Beauty portrait', title: 'Soft Focus', aspectRatio: 'portrait' },
    { id: 'c4-3', src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', alt: 'Morning light', title: 'First Light', aspectRatio: 'landscape' },
    { id: 'c4-4', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80', alt: 'Man with beard', title: 'Character Study', aspectRatio: 'portrait' },
    { id: 'c4-5', src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80', alt: 'Dark forest', title: 'Deep Woods', aspectRatio: 'landscape' },
  ],
  // Column 5 - Travel and culture
  [
    { id: 'c5-1', src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80', alt: 'Woman in city', title: 'Urban Explorer', aspectRatio: 'portrait' },
    { id: 'c5-2', src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', alt: 'Lake and mountains', title: 'Mirror Lake', aspectRatio: 'landscape' },
    { id: 'c5-3', src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80', alt: 'Portrait with hat', title: 'Summer Style', aspectRatio: 'portrait' },
    { id: 'c5-4', src: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=600&q=80', alt: 'Sunset landscape', title: 'Sunset Dreams', aspectRatio: 'landscape' },
    { id: 'c5-5', src: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&q=80', alt: 'Child portrait', title: 'Pure Joy', aspectRatio: 'portrait' },
  ],
  // Column 6 - Minimal and monochrome
  [
    { id: 'c6-1', src: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&q=80', alt: 'Minimal architecture', title: 'Clean Lines', aspectRatio: 'landscape' },
    { id: 'c6-2', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', alt: 'Profile portrait', title: 'Side Profile', aspectRatio: 'portrait' },
    { id: 'c6-3', src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80', alt: 'Beach minimal', title: 'Endless Horizon', aspectRatio: 'landscape' },
    { id: 'c6-4', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', alt: 'Smiling woman', title: 'Genuine Smile', aspectRatio: 'portrait' },
    { id: 'c6-5', src: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&q=80', alt: 'Night sky', title: 'Starry Night', aspectRatio: 'landscape' },
  ],
];

// Different scroll speeds for each column (pixels per second)
export const columnSpeeds = [35, 45, 40, 50, 38, 42];