const BASE_URL = 'http://localhost:3000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiJson<T>(
  path: string,
  options: { method: string; body?: unknown },
): Promise<T> {
  return apiFetch<T>(path, {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options.body ?? {}),
  });
}
