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

  const {
    query: { id },
    method,
  } = req;

  if (method === "GET") {
    try {
      const content = await Content.findById(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      return res.status(200).json(content);
    } catch (error) {
      console.error("Error finding content:", error);
      return res.status(500).json({
        error: "Failed to fetch content",
        details: error.message,
      });
    }
  }

  if (method === "PUT") {
    try {
      const content = await Content.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      return res.status(200).json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      return res.status(500).json({
        error: "Failed to update content",
        details: error.message,
        validationErrors: error.errors,
      });
    }
  }

  if (method === "DELETE") {
    try {
      const content = await Content.findByIdAndDelete(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      return res.status(200).json({ message: "Content deleted" });
    } catch (error) {
      console.error("Error deleting content:", error);
      return res.status(500).json({
        error: "Failed to delete content",
        details: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
