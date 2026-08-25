import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;

  const schedulesPath = path.join(process.cwd(), "data", "schedules.json");
  const schedules = JSON.parse(fs.readFileSync(schedulesPath, "utf8"));

  const schedule = schedules[id];

  if (!schedule) {
    return res.status(404).json({ error: "Schedule not found" });
  }

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  res.status(200).json({
    brand: "oclok.app",
    weeklySchedule: schedule.map(s => ({
      day: days[s.day],
      start: s.start,
      end: s.end
    }))
  });
}
