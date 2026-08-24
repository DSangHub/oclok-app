function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function select(config, table, query) {
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Supabase query failed");
  return data;
}

function localParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
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
    const [profiles, schedules] = await Promise.all([
      select(config, "profiles", `id=eq.${id}&select=id,username,timezone`),
      select(config, "schedules", `user_id=eq.${id}&select=day,start_time,end_time&order=day`)
    ]);

    const user = profiles[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const local = localParts(now, user.timezone || "UTC");
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const today = schedules.find(item => item.day === dayMap[local.weekday]);
    const minutes = Number(local.hour) * 60 + Number(local.minute);
    const toMinutes = value => {
      const [hour, minute] = value.split(":").map(Number);
      return hour * 60 + minute;
    };
    const status = today &&
      minutes >= toMinutes(today.start_time) &&
      minutes < toMinutes(today.end_time) ? "online" : "offline";

    return res.status(200).json({
      brand: "oclok.app",
      user: user.username,
      timezone: user.timezone,
      currentTime: now.toISOString(),
      status,
      nextOnline: null,
      minutesUntilOnline: null
    });
  } catch {
    return res.status(502).json({ error: "Unable to query Supabase" });
  }
}
