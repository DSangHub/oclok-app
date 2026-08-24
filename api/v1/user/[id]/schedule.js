const DEMO_SCHEDULE = [
  { day: "Monday", start: "09:00", end: "17:00" },
  { day: "Tuesday", start: "09:00", end: "17:00" },
  { day: "Wednesday", start: "09:00", end: "17:00" },
  { day: "Thursday", start: "09:00", end: "17:00" },
  { day: "Friday", start: "09:00", end: "17:00" }
];

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.query.id !== "user_1") {
    return res.status(404).json({ error: "Schedule not found" });
  }

  return res.status(200).json({
    brand: "oclok.app",
    weeklySchedule: DEMO_SCHEDULE,
    demo: true
  });
}
