export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).json({ error: "Missing 'id' query parameter." });
      return;
    }

    const originalUrl = `https://ranapk.spidy.online/MACX/JAZZ4K/play.m3u8?id=${id}`;

    // Fetch the M3U8 playlist from the original URL
    const response = await fetch(originalUrl, {
      headers: {
        Referer: "https://ranapk.spidy.online",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch M3U8 from original URL: ${response.statusText}`,
      });
      return;
    }

    let m3u8Data = await response.text();

    // Replace .ts URLs in the M3U8 to point to your domain
    const proxiedDomain = "https://unknown-playlists-sony-liv.vercel.app";
    m3u8Data = m3u8Data.replace(
      /(https?:\/\/[^/\s]+\/.+?\.ts)/g, // Match any .ts URLs
      `${proxiedDomain}/api/sony-liv/segment.ts?url=$1` // Rewrite to proxy
    );

    // Optimize CORS and caching headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

    // Send the rewritten M3U8 as the response
    res.status(200).send(m3u8Data);
  } catch (error) {
    console.error("Error in M3U8 handler:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
