export default async function handler(req, res) {
  // CORS headers - restrict to your domain(s)
  const allowedOrigins = [
    'https://architectour-planner.vercel.app',
    'https://yourdomain.com', // Replace with your actual domain
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:5173'] : [])
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'");

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Simple rate limiting based on IP (optional additional protection)
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const rateLimit = process.env.RATE_LIMIT_PER_IP || 10; // 1つのIPから1日10回まで
  
  // Note: In production, you'd want to use a proper rate limiting service like Redis
  // This is a simple in-memory approach for demonstration

  // Check for API key in both possible environment variables
  const rawApiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
  const apiKey = rawApiKey ? rawApiKey.trim() : null;
  
  if (!apiKey) {
    console.error('API key not configured');
    res.status(500).json({ error: 'Anthropic API key not configured' });
    return;
  }

  try {
    console.log('Making request to Claude API with body:', JSON.stringify(req.body, null, 2));
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body)
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      res.status(response.status).json({ error: errorData });
      return;
    }

    const data = await response.json();
    console.log('Claude API success');
    res.status(200).json(data);
  } catch (error) {
    console.error('Claude API proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}