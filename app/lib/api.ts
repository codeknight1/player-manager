// API utility functions with better error handling
async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function apiGet(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}`);
    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
}

export async function apiPost(endpoint: string, data: any) {
  try {
    const res = await fetch(`${API_BASE}/api/${endpoint}`,
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
    const res = await fetch(`${API_BASE}/api/${endpoint}`,
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
    const res = await fetch(`${API_BASE}/api/${endpoint}`,
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

