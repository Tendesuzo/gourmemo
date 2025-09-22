export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export type SearchParams = {
  mode: "private" | "public";
  bbox?: string;
  status?: "visited" | "planned" | "all";
  min_rating?: number;
};

export async function search(params: SearchParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) query.set(k, String(v));
  });
  const res = await fetch(`${API_BASE}/api/v1/search?${query.toString()}`);
  return res.json();
}

export async function createPlace(input: {
  name: string;
  category?: string;
  address?: string;
  lon: number;
  lat: number;
}) {
  const res = await fetch(`${API_BASE}/api/v1/places`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ place: input }),
  });
  if (!res.ok) throw new Error("Failed to create place");
  return res.json();
}

export async function createVisit(input: {
  place_id: number;
  visited_at?: string;
  rating?: number;
  price?: number;
  memo?: string;
}) {
  const res = await fetch(`${API_BASE}/api/v1/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visit: input }),
  });
  if (!res.ok) throw new Error("Failed to create visit");
  return res.json();
}
