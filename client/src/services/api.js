const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch from ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Ships
  getShips: () => fetchJson('/ships'),
  getShip: (id) => fetchJson(`/ships/${id}`),
  createShip: (data) => fetchJson('/ships', { method: 'POST', body: JSON.stringify(data) }),

  // Operations
  getActiveOperation: () => fetchJson('/operations/active'),
  getOperations: () => fetchJson('/operations'),

  // Parts
  getParts: () => fetchJson('/parts'),
  createPart: (data) => fetchJson('/parts', { method: 'POST', body: JSON.stringify(data) }),

  // Materials
  getMaterials: () => fetchJson('/materials'),

  // Maintenance
  getMaintenance: () => fetchJson('/maintenance'),

  // Feasibility
  getFeasibility: () => fetchJson('/feasibility'),

  // Photos
  getPhotos: () => fetchJson('/photos'),
  uploadPhoto: async (formData) => {
    const res = await fetch(`${API_BASE}/photos/upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Blog
  getBlogPosts: () => fetchJson('/blog'),
  getBlogPost: (slug) => fetchJson(`/blog/${slug}`),

  // Contact
  submitContact: (data) => fetchJson('/contact', { method: 'POST', body: JSON.stringify(data) }),
};
