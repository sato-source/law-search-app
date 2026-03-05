import express from "express";
import cors from "cors";
import { searchLaws, getLawData } from "./egov.js";

const app = express();

// 公開用：どこからでもアクセスOK
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const data = await searchLaws(q);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/api/law/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await getLawData(id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Renderは PORT を指定してくるので必ずこうする
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log("backend running:", port);
});