export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      res.status(400).json({ error: "Missing 'url' query parameter." });
      return;
    }

    // Fetch the TS segment from the original URL
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        Referer: "https://ranapk.spidy.online",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch TS segment: ${response.statusText}`,
      });
      return;
    }

    // Set appropriate headers for TS files
    res.setHeader("Content-Type", "video/mp2t");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Pipe the TS segment data to the response
    response.body.pipe(res);
  } catch (error) {
    console.error("Error in TS segment handler:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
