/* =============================
   GLOBAL API HELPER FOR FRONTEND
   ============================= */

const API_BASE = "http://localhost:5000/api"; // your backend URL

// Token Manager
const auth = {
  getToken: () => localStorage.getItem("token"),
  setToken: (t) => localStorage.setItem("token", t),
  clear: () => localStorage.removeItem("token"),
};

// Main fetch wrapper
async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";

  // Attach token if exists
  const token = auth.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.message || "API Error",
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
