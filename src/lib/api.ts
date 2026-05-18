const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

export async function fetchPortfolio(): Promise<any | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn("fetchPortfolio failed:", e);
    return null;
  }
}

export async function savePortfolio(data: any): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (e) {
    console.warn("savePortfolio failed:", e);
    return false;
  }
}

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      // Si la réponse n'est pas OK, vérifier si c'est du JSON
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return { success: false, error: data.error || "Erreur inconnue" };
      }
      return { success: false, error: `Erreur serveur: ${res.status}` };
    }
    
    const data = await res.json();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erreur de connexion au serveur" };
  }
}

export default { fetchPortfolio, savePortfolio, sendContactEmail };
