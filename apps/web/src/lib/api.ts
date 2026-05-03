const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const authStore = {
  getToken() {
    return window.localStorage.getItem("tradeflow.token") ?? "";
  },
  setToken(token: string) {
    window.localStorage.setItem("tradeflow.token", token);
  },
  clear() {
    window.localStorage.removeItem("tradeflow.token");
  },
};

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");

  const token = authStore.getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();
  const body: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const asObj = (body ?? {}) as Record<string, unknown>;
    const message =
      asObj.error ? JSON.stringify(asObj.error) : typeof asObj.message === "string" ? asObj.message : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

