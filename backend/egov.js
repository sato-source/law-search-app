const BASE = "https://laws.e-gov.go.jp/api/1";

async function searchLaws(keyword) {
  if (!keyword) {
    return { laws: [] };
  }

  const url = `${BASE}/lawlists?keyword=${encodeURIComponent(keyword)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`search API error: ${res.status}`);
  }

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`search JSON parse error: ${text.slice(0, 200)}`);
  }

  const list = json.data || json.laws || [];

  const laws = list.map((l) => ({
    lawName: l.lawName || l.law_title || l.name || "",
    lawId: l.lawId || l.law_id || ""
  }));

  return { laws };
}

async function getLawData(lawId) {
  if (!lawId) {
    throw new Error("lawId is required");
  }

  const url = `${BASE}/lawdata/${encodeURIComponent(lawId)}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`law API error: ${res.status}`);
  }

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`law JSON parse error: ${text.slice(0, 200)}`);
  }

  return json;
}

module.exports = {
  searchLaws,
  getLawData
};
