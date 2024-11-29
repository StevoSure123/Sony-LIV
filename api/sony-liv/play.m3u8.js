export default async function handler(req, res) {
  try {
    const { segment } = req.query;

    if (!segment) {
      res.status(400).json({ error: "Missing 'segment' query parameter." });
      return;
    }

    const originalSegmentUrl = `https://fifabd.xyz/KIDxRANAPKs/${segment}`;

    const response = await fetch(originalSegmentUrl, {
      headers: {
        Referer: "RANAPK",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch TS segment from original URL: ${response.statusText}`,
      });
      return;
    }

    // Pipe the .ts segment to the client
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "video/mp2t");
    response.body.pipe(res);
  } catch (error) {
    console.error("Error in TS segment handler:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
