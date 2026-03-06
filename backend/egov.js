const BASE = "https://laws.e-gov.go.jp/api/1";

export async function searchLaws(keyword) {

  if (!keyword) {
    return { laws: [] };
  }

  const url = `${BASE}/lawlists?keyword=${encodeURIComponent(keyword)}`;

  const res = await fetch(url);

  const json = await res.json();

  const list = json.data || [];

  const laws = list.map(l => ({
    lawName: l.lawName,
    lawId: l.lawId
  }));

  return { laws };
}


export async function getLawData(lawId) {

  const url = `${BASE}/lawdata/${lawId}`;

  const res = await fetch(url);

  const json = await res.json();

  return json;
}
