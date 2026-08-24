const DEMO_USER = {
  id: "user_1",
  username: "Demo User",
  timezone: "America/Los_Angeles"
};

function getLocalMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (id !== DEMO_USER.id) {
    return res.status(404).json({ error: "User not found" });
  }

  const now = new Date();
  const minutes = getLocalMinutes(now, DEMO_USER.timezone);
  const status = minutes >= 9 * 60 && minutes < 17 * 60 ? "online" : "offline";

  return res.status(200).json({
    brand: "oclok.app",
    user: DEMO_USER.username,
    timezone: DEMO_USER.timezone,
    currentTime: now.toISOString(),
    status,
    nextOnline: null,
    minutesUntilOnline: null,
    demo: true
  });
}
