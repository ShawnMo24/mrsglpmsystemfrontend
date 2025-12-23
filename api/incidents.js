let incidents = [
  {
    id: "INC-001",
    type: "welfare_check",
    priority: "medium",
    status: "active",
    location: { lat: 34.0522, lng: -118.2437, address: "123 Main St" },
    description: "Wellness check requested",
    assignedResponder: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(incidents);
  }

  if (req.method === 'POST') {
    const newIncident = {
      id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    incidents.push(newIncident);
    return res.status(201).json(newIncident);
  }

  if (req.method === 'PATCH') {
    const { id } = req.query;
    const index = incidents.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    incidents[index] = { 
      ...incidents[index], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    return res.status(200).json(incidents[index]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
