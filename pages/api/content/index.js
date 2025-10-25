import dbConnect from "../../../lib/mongodb";
import Content from "../../../lib/models/Content";

export default async function handler(req, res) {
  // Authentication removed — admin access is open
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { type, published } = req.query;
      let query = {};

      if (type) {
        query.type = type;
      }

      if (published === "true") {
        query.published = true;
      }

      const contents = await Content.find(query).sort({ createdAt: -1 });
      res.status(200).json(contents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  } else if (req.method === "POST") {
    try {
      const content = new Content(req.body);
      await content.save();
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({
        error: "Failed to create content",
        details: error.message,
        validationErrors: error.errors,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
