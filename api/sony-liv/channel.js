export default async function handler(req, res) {
  try {
    // Get 'id' from query
    const { id } = req.query;

    if (!id) {
      res.status(400).json({ error: "Missing 'id' query parameter." });
      return;
    }

    // Build the original M3U8 URL
    const originalUrl = `https://fifabd.xyz/KIDxRANAPKs/play.m3u8?id=${id}`;

    // Fetch the M3U8 data
    const response = await fetch(originalUrl, {
      headers: {
        Referer: "RANAPK", // Required Referer header
      },
    });

    // Check for response errors
    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch M3U8: ${response.statusText}` });
      return;
    }

    // Get M3U8 content
    const m3u8Data = await response.text();

    // Set headers and return M3U8 data
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.status(200).send(m3u8Data);
  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
