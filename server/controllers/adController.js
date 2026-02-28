import Ad from "../models/Ad.js";

export const clickAd = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.clicks += 1;
    await ad.save();

    res.json({
      message: "Ad clicked",
      totalClicks: ad.clicks,
      totalRevenue: ad.clicks * (ad.revenuePerClick || 0)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};