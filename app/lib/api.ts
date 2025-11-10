// API utility functions with better error handling
async function handleResponse(res: Response) {
  const raw = await res.text();
  const data = raw.length > 0 ? (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  })() : null;
  if (!res.ok) {
    const message = typeof data === "string" ? data : data?.error || data?.message || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || process.env.NEXTAUTH_URL || "").replace(/\/$/, "");

function buildUrl(endpoint: string) {
  const normalized = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  if (API_BASE.length === 0) {
    return `/api/${normalized}`;
  }
  return `${API_BASE}/api/${normalized}`;
}

export async function apiGet(endpoint: string) {
  try {
    const res = await fetch(buildUrl(endpoint));
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

export async function apiPost(endpoint: string, data: any) {
  try {
    const res = await fetch(buildUrl(endpoint),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

export async function apiPatch(endpoint: string, data: any) {
  try {
    const res = await fetch(buildUrl(endpoint),
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

export async function apiPut(endpoint: string, data: any) {
  try {
    const res = await fetch(buildUrl(endpoint),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

export async function apiDelete(endpoint: string) {
  try {
    const res = await fetch(buildUrl(endpoint),
    {
      method: "DELETE",
    });
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

