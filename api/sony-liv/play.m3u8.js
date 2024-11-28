export default async function handler(req, res) {
  try {
    const { id } = req.query;

    // Check if 'id' parameter is present
    if (!id) {
      res.status(400).json({ error: "Missing 'id' query parameter." });
      return;
    }

    const originalUrl = `https://fifabd.xyz/KIDxRANAPKs/play.m3u8?id=${id}`;

    // Fetch the M3U8 playlist from the original URL
    const response = await fetch(originalUrl, {
      headers: {
        Referer: "RANAPK", // Ensure the Referer header is correct
      },
    });

    // If the fetch fails
    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch M3U8 from original URL: ${response.statusText}`,
      });
      return;
    }

    // Parse the M3U8 data as text
    const m3u8Data = await response.text();

    // Set the response header to indicate it's an M3U8 playlist
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");

    // Send the M3U8 data as the response
    res.status(200).send(m3u8Data);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error in M3U8 handler:", error);

    // Respond with a 500 internal server error and error details
    res.status(500).json({ error: "Internal server error." });
  }
}
