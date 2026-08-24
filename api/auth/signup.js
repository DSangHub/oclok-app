export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, email, password, timezone } = req.body || {};
  if (!username || !email || !password || !timezone) {
    return res.status(400).json({
      error: "Username, email, password, and timezone are required"
    });
  }

  return res.status(503).json({
    error: "Account creation is temporarily unavailable while secure database storage is being configured"
  });
}
