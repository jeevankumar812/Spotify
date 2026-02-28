import Song from "../models/Song.js";

export const searchSongs = async (req, res) => {
  const { query } = req.query;

  const results = await Song.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });

  res.json(results);
};