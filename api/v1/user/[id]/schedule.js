function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getConfig();
  if (!config) return res.status(503).json({ error: "Supabase is not configured" });

  try {
    const id = encodeURIComponent(req.query.id);
    const response = await fetch(
      `${config.url}/rest/v1/schedules?user_id=eq.${id}&select=day,start_time,end_time&order=day`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`
        }
      }
    );
    const rows = await response.json();
    if (!response.ok) throw new Error(rows.message || "Supabase query failed");
    if (!rows.length) return res.status(404).json({ error: "Schedule not found" });

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return res.status(200).json({
      brand: "oclok.app",
      weeklySchedule: rows.map(item => ({
        day: days[item.day],
        start: item.start_time,
        end: item.end_time
      }))
    });
  } catch {
    return res.status(502).json({ error: "Unable to query Supabase" });
  }
}
