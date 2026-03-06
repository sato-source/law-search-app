import { searchLaws } from "../backend/egov.js";

export default async function handler(req, res) {
  try {
    const q = (req.query.q || "").trim();

    const data = await searchLaws(q);

    res.status(200).json(data);

  } catch (e) {

    console.error(e);

    res.status(500).json({
      error: String(e)
    });
  }
}
