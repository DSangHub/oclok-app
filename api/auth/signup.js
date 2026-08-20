import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, email, password, timezone } = req.body;

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  const id = "user_" + Date.now();

  users[id] = { username, email, password, timezone };

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(200).json({ message: "Signup successful", userId: id });
}
