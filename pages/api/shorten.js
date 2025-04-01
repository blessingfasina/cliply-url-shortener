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
    // In production, this would be your actual deployed worker URL
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.cliply.blessingfasina.workers.dev/api/shorten'
      : 'http://localhost:8787/api/shorten';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        message: error.error || 'Failed to shorten URL' 
      });
    }

    const data = await response.json();
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}