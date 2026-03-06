module.exports = async function handler(req, res) {
  try {
    const q = (req.query.q || "").trim();

    // まずは全法令一覧を取得
    const url = "https://laws.e-gov.go.jp/api/1/lawlists/1";
    const r = await fetch(url);

    if (!r.ok) {
      throw new Error(`search API error: ${r.status}`);
    }

    const xml = await r.text();

    // とりあえず文字列検索で候補を抜き出す簡易版
    // <LawNameListInfo> ... <LawId>...</LawId><LawName>...</LawName> ...
    const items = [...xml.matchAll(/<LawNameListInfo>[\s\S]*?<LawId>(.*?)<\/LawId>[\s\S]*?<LawName>(.*?)<\/LawName>[\s\S]*?<\/LawNameListInfo>/g)];

    const laws = items
      .map(m => ({
        lawId: m[1],
        lawName: m[2]
      }))
      .filter(x => !q || x.lawName.includes(q))
      .slice(0, 20);

    res.status(200).json({ laws });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
};
