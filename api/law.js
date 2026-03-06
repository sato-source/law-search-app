module.exports = async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      throw new Error("id is required");
    }

    const url = `https://laws.e-gov.go.jp/api/1/lawdata/${encodeURIComponent(id)}`;
    const r = await fetch(url);

    if (!r.ok) {
      throw new Error(`law API error: ${r.status}`);
    }

    const text = await r.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(`law JSON parse error: ${text.slice(0, 200)}`);
    }

    res.status(200).json(json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
};
