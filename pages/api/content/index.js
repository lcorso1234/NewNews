import dbConnect from "../../../lib/mongodb";
import Content from "../../../lib/models/Content";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      error: "Database connection failed",
      details:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }

  if (req.method === "GET") {
    try {
      const { type, published } = req.query;
      const filter = {};

      if (type) {
        filter.type = type;
      }

      if (published === "true") {
        filter.published = true;
      }

      const contents = await Content.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(contents);
    } catch (error) {
      console.error("Error fetching content:", error);
      return res.status(500).json({ error: "Failed to fetch content" });
    }
  }

  if (req.method === "POST") {
    try {
      const content = new Content(req.body);
      await content.save();
      return res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      return res.status(500).json({
        error: "Failed to create content",
        details: error.message,
        validationErrors: error.errors,
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
