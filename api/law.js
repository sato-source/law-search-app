const { getLawData } = require("../backend/egov.js");

module.exports = async function handler(req, res) {
  try {
    const { id } = req.query;
    const data = await getLawData(id);
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: String(e)
    });
  }
};
