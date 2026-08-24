function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const config = getConfig();
  if (!config) {
    return res.status(503).json({ error: "Supabase is not configured" });
  }

  try {
    const response = await fetch(
      `${config.url}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.msg || data.message || data.error_description || "Login failed"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      userId: data.user?.id,
      username: data.user?.user_metadata?.username || email,
      timezone: data.user?.user_metadata?.timezone || "UTC",
      accessToken: data.access_token,
      expiresIn: data.expires_in
    });
  } catch {
    return res.status(502).json({ error: "Unable to reach Supabase" });
  }
}
