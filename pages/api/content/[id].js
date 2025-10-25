import dbConnect from "../../../lib/mongodb";
import Content from "../../../lib/models/Content";

export default async function handler(req, res) {
  // Authentication removed — admin access open
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const content = await Content.findById(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({
        error: "Failed to fetch content",
        details: error.message,
      });
    }
  } else if (req.method === "PUT") {
    try {
      const content = await Content.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.status(200).json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({
        error: "Failed to update content",
        details: error.message,
        validationErrors: error.errors,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const content = await Content.findByIdAndDelete(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.status(200).json({ message: "Content deleted" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({
        error: "Failed to delete content",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
