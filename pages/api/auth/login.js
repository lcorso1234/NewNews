import { validateCredentials } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, password } = req.body || {};

  try {
    const isValid = validateCredentials(username, password);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Authentication not configured properly",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
}
