export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check for API key in both possible environment variables
  const rawApiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
  const apiKey = rawApiKey ? rawApiKey.trim() : null;
  
  console.log('API Key available:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 'N/A');
  console.log('API Key starts with:', apiKey ? apiKey.substring(0, 15) + '...' : 'N/A');
  console.log('Raw API Key length:', rawApiKey ? rawApiKey.length : 'N/A');
  console.log('Environment variables:', Object.keys(process.env).filter(key => key.includes('ANTHROPIC')));
  
  if (!apiKey) {
    console.error('No API key found in environment variables');
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