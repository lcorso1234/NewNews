import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["blog", "podcast", "video"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.type === "blog";
    },
  },
  audioUrl: {
    type: String,
    required: function () {
      return this.type === "podcast";
    },
  },
  videoUrl: {
    type: String,
    required: function () {
      return this.type === "video";
    },
  },
  imageUrl: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    default: "Admin",
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ContentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Content ||
  mongoose.model("Content", ContentSchema);
