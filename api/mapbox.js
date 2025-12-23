export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const mapboxToken = process.env.OPENAI_API_KEY_MAPBOX;
  
  if (!mapboxToken) {
    return res.status(500).json({ 
      error: 'MapBox not configured',
      message: 'Please add OPENAI_API_KEY_MAPBOX environment variable'
    });
  }

  return res.status(200).json({ 
    token: mapboxToken,
    style: 'mapbox://styles/mapbox/dark-v11'
  });
}
