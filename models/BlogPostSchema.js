import mongoose from "mongoose";

const Schema = mongoose.Schema;
const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
    trim: true,
  },
});

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);
