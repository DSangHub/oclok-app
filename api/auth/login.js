import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  const entry = Object.entries(users).find(
    ([id, user]) => user.email === email && user.password === password
  );

  if (!entry) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const [userId, user] = entry;

  res.status(200).json({
    message: "Login successful",
    userId,
    username: user.username,
    timezone: user.timezone
  });
}
