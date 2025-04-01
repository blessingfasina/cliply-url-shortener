// pages/api/shorten.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    try {
      const { originalUrl } = req.body;
  
      // Validate URL
      if (!originalUrl) {
        return res.status(400).json({ message: 'URL is required' });
      }
  
      // Basic URL validation
      try {
        new URL(originalUrl);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
  
      // Forward the request to our Cloudflare Worker API
      const apiUrl = 'https://cliply.blessingfasina.workers.dev/api/shorten';
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });
  
      // Handle non-success responses from the worker
      if (!response.ok) {
        // Try to parse the error message
        try {
          const errorData = await response.json();
          return res.status(response.status).json({ 
            message: errorData.error || 'Failed to shorten URL' 
          });
        } catch (jsonError) {
          // If we can't parse the error, return a generic message
          return res.status(response.status).json({ 
            message: 'Failed to shorten URL' 
          });
        }
      }
  
      // Handle success response
      const data = await response.json();
      return res.status(201).json(data);
    } catch (error) {
      console.error('Error shortening URL:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }