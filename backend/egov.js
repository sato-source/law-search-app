const BASE = "https://laws.e-gov.go.jp/api/2";

async function fetchJson(url) {
  const r = await fetch(url.toString());
  if (!r.ok) {
    throw new Error(`HTTP ${r.status}`);
  }
  return r.json();
}

export async function searchLaws(q) {

  const keysToTry = [
    "law_title",
    "law_name",
    "keyword",
    "q"
  ];

  let best = null;

  for (const key of keysToTry) {

    const url = new URL(`${BASE}/laws`);
    url.searchParams.set(key, q);
    url.searchParams.set("count", "50");
    url.searchParams.set("offset", "0");

    try {

      const data = await fetchJson(url);
      const laws = data?.laws ?? [];
      const count = Array.isArray(laws) ? laws.length : 0;

      if (!best || count > best.count) {
        best = {
          key,
          count,
          data
        };
      }

      if (count >= 5) {
        break;
      }

    } catch (e) {
      // 次のキーへ
    }
  }

  if (!best) {
    return { laws: [] };
  }

  return {
    ...best.data,
    _used_search_key: best.key,
    _got: best.count
  };
}

export async function getLawData(id) {

  const url = new URL(`${BASE}/law_data/${encodeURIComponent(id)}`);

  const r = await fetch(url);

  if (!r.ok) {
    throw new Error(`HTTP ${r.status}`);
  }

  return r.json();
}