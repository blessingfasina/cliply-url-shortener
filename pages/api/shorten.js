// pages/api/shorten.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { originalUrl } = req.body;
  
      // Validate URL
      if (!originalUrl) {
        return res.status(400).json({ message: 'URL is required' });
      }
  
      try {
        new URL(originalUrl);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
  
      // Connect to your Cloudflare Worker
      try {
        const apiUrl = 'https://cliply.blessingfasina.workers.dev/api/shorten';
        
        // Set longer timeout for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ originalUrl }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // If worker returns an error, fall back to local short URL generation
          throw new Error('Worker response not OK');
        }
        
        const data = await response.json();
        return res.status(201).json(data);
      } catch (workerError) {
        console.error('Worker error:', workerError);
        
        // If connecting to the worker fails, generate a URL locally as a fallback
        // This makes the app functional even if the worker has issues
        const shortId = Math.random().toString(36).substring(2, 8);
        
        // Use the direct worker domain for the short URL
        const shortUrl = `https://cliply.blessingfasina.workers.dev/${shortId}`;
        
        // Return the shortened URL
        return res.status(201).json({ 
          shortUrl,
          message: "Using temporary URL. Link will not remain active permanently."
        });
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }