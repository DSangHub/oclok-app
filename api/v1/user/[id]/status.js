import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const schedulesPath = path.join(process.cwd(), "data", "schedules.json");

  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  const schedules = JSON.parse(fs.readFileSync(schedulesPath, "utf8"));

  const user = users[id];
  const schedule = schedules[id];

  if (!user || !schedule) {
    return res.status(404).json({ error: "User or schedule not found" });
  }

  const now = new Date();
  const timezone = user.timezone;

  const todaySchedule = schedule.find(s => s.day === now.getDay());
  let status = "offline";

  if (todaySchedule) {
    const start = new Date(now);
    const end = new Date(now);

    const [sh, sm] = todaySchedule.start.split(":");
    const [eh, em] = todaySchedule.end.split(":");

    start.setHours(sh, sm, 0, 0);
    end.setHours(eh, em, 0, 0);

    if (now >= start && now <= end) status = "online";
  }

  function getNextOnline(now) {
    for (let i = 0; i < 7; i++) {
      const checkDay = (now.getDay() + i) % 7;
      const daySchedule = schedule.find(s => s.day === checkDay);
      if (!daySchedule) continue;

      const date = new Date(now);
      date.setDate(now.getDate() + i);

      const [h, m] = daySchedule.start.split(":");
      date.setHours(h, m, 0, 0);

      if (date > now) return date;
    }
    return null;
  }

  const nextOnline = getNextOnline(now);
  const minutesUntilOnline = nextOnline
    ? Math.round((nextOnline - now) / 60000)
    : null;

  res.status(200).json({
    brand: "oclok.app",
    user: user.username,
    timezone,
    currentTime: now.toISOString(),
    status,
    nextOnline: nextOnline ? nextOnline.toISOString() : null,
    minutesUntilOnline
  });
}
