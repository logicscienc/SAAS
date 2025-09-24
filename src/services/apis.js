const BASE_URL = process.env.REACT_APP_BASE_URL;

// --- AUTH ENDPOINTS ---
export const endpoints = {
  LOGIN_API: `${BASE_URL}/auth/login`,
  // Add register or other auth endpoints if needed
};

// --- NOTES ENDPOINTS ---
export const notesEndpoints = {
  CREATE_NOTE_API: `${BASE_URL}/note`,       // POST
  GET_ALL_NOTES_API: `${BASE_URL}/note`,     // GET
  GET_NOTE_BY_ID_API: (id) => `${BASE_URL}/note/${id}`, // GET by ID
  UPDATE_NOTE_API: (id) => `${BASE_URL}/note/${id}`,    // PUT
  DELETE_NOTE_API: (id) => `${BASE_URL}/note/${id}`,    // DELETE
};

// --- TENANT ENDPOINTS ---
export const tenantEndpoints = {
  GET_TENANT_DETAILS_API: `${BASE_URL}/tenant/details`,         // Fetch tenant info for logged-in user
   UPGRADE_TENANT_API: (slug) => `${BASE_URL}/tenant/${slug}/upgrade`,            // Upgrade to Pro plan
};

