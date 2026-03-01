import Ad from "../models/Ad.js";

export const clickAd = async (req, res) => {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Increment clicks
    ad.clicks += 1;

    // Ensure costPerClick exists
    const costPerClick = ad.costPerClick || 5; // default ₹5 per click

    // Calculate revenue
    ad.revenue = (ad.revenue || 0) + costPerClick;

    await ad.save();

    res.json({
      message: "Ad clicked",
      totalClicks: ad.clicks,
      totalRevenue: ad.revenue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};