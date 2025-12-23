let responders = [
  {
    id: "RSP-001",
    name: "Unit Alpha",
    status: "available",
    location: { lat: 34.0525, lng: -118.2440 },
    specializations: ["wellness", "crisis_support"],
    currentAssignment: null
  },
  {
    id: "RSP-002", 
    name: "Unit Bravo",
    status: "available",
    location: { lat: 34.0510, lng: -118.2420 },
    specializations: ["medical_support", "wellness"],
    currentAssignment: null
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(responders);
  }

  if (req.method === 'PATCH') {
    const { id } = req.query;
    const index = responders.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Responder not found' });
    }
    responders[index] = { ...responders[index], ...req.body };
    return res.status(200).json(responders[index]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
