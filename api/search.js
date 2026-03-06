module.exports = async function handler(req, res) {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(200).json({ laws: [] });
    }

    const url = `https://laws.e-gov.go.jp/api/1/lawlists?keyword=${encodeURIComponent(q)}`;
    const r = await fetch(url);

    if (!r.ok) {
      throw new Error(`search API error: ${r.status}`);
    }

    const text = await r.text();

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

    res.status(200).json({ laws });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
};
