import express from "express";
import {
  getAddPost,
  getEditPost,
  getPost,
  getPosts,
  postCreatePosts,
  postUpdatePost,
} from "../controllers/postController.js";

export const postRoutes = express.Router();

postRoutes.get("/", getPosts);
postRoutes.get("/add", getAddPost);
postRoutes.post("/create", postCreatePosts);
postRoutes.get("/:slug", getPost);
postRoutes.get("/:slug/edit", getEditPost);
postRoutes.post("/:slug/update", postUpdatePost);
