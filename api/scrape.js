import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Store browser instance
let browser = null;

/**
 * Initialize Puppeteer browser
 */
async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ],
    });
  }
  return browser;
}

/**
 * Scrape Unsplash search results using Puppeteer
 * GET /api/search?query={keyword}
 */
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  let page = null;

  try {
    const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(query.trim())}`;

    console.log(`Scraping: ${searchUrl}`);

    const browserInstance = await getBrowser();
    page = await browserInstance.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Navigate to the page
    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait for images to load
    await page.waitForSelector('img[src*="images.unsplash.com"]', {
      timeout: 10000,
    });

    // Scroll down to load more images
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || totalHeight > 3000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Wait a bit for lazy loading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Extract photo data
    const photos = await page.evaluate(() => {
      const results = [];
      const seenUrls = new Set();

      // Find all images
      const images = document.querySelectorAll('img[src*="images.unsplash.com"]');

      images.forEach((img, index) => {
        let src = img.getAttribute('src') || '';

        // Skip small thumbnails
        if (src.includes('&w=20') || src.includes('&w=30') || src.includes('&w=40') || src.includes('&w=50')) {
          return;
        }

        // Skip if already seen
        if (seenUrls.has(src)) {
          return;
        }
        seenUrls.add(src);

        // Get higher quality
        if (src.includes('&w=')) {
          src = src.replace(/&w=\d+/, '&w=800');
        }
        if (src.includes('&q=')) {
          src = src.replace(/&q=\d+/, '&q=85');
        }

        const alt = img.getAttribute('alt') || '';
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;

        let aspectRatio = 'landscape';
        if (height > width * 1.2) aspectRatio = 'portrait';
        else if (width > height * 1.2) aspectRatio = 'landscape';
        else aspectRatio = 'square';

        // Extract photo ID
        const photoIdMatch = src.match(/photo-([a-zA-Z0-9_-]+)/);
        const photoId = photoIdMatch ? photoIdMatch[1] : `scraped-${index}`;

        results.push({
          id: `unsplash-${photoId}`,
          src,
          alt: alt || `Unsplash photo`,
          title: alt || `Photo ${index + 1}`,
          aspectRatio,
        });
      });

      return results;
    });

    // Limit to 30 photos
    const limitedPhotos = photos.slice(0, 30);

    console.log(`Found ${limitedPhotos.length} photos`);

    res.json({
      query: query.trim(),
      count: limitedPhotos.length,
      photos: limitedPhotos,
    });
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({
      error: 'Failed to scrape Unsplash',
      message: error.message,
    });
  } finally {
    if (page) {
      await page.close();
    }
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cleanup on exit
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Scraper API server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET /api/health`);
  console.log(`  - GET /api/search?query={keyword}`);
});
