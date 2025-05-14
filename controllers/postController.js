import { Post } from "../models/PostSchema.js";

export async function getPosts(req, res) {
  const posts = await Post.find({}).sort({ date: -1 });
  res.render("blog/posts/index", { title: "mongoblog : Posts List", posts });
}

export function getAddPost(req, res) {
  res.render("blog/posts/add", { title: "mongoblog : Add New Post" });
}

export async function postCreatePosts(req, res) {
  const user = req.session.user ? req.session.user.name : null;
  if (!user) {
    return res.redirect("/auth/login");
  }

  const { title, subtitle, content } = req.body;

  try {
    const post = await Post.create({
      title,
      slug: title.trim().toLowerCase().replace(/\s/g, "-"),
      subtitle,
      content,
      author: user,
      date: Date.now(),
    });
    res.redirect("/blog/posts/" + post.slug);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la création du post");
  }
}

export async function getPost(req, res) {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    return res.redirect("/blog/posts");
  }
  res.render("blog/posts/post", { title: "mongoblog : post", post });
}

export async function getEditPost(req, res) {
  const post = await Post.findOne({ slug: req.params.slug });
  res.render("blog/posts/edit", { title: "mongoblog : edit post", post });
}

export async function postUpdatePost(req, res) {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) {
    return res.redirect("/blog/posts");
  }

  const { title, subtitle, content } = req.body;
  const newSlug = title.trim().toLowerCase().replace(/\s/g, "-");

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: post._id },
      {
        title,
        subtitle,
        content,
        slug: newSlug,
        date: Date.now(),
      },
      { new: true },
    );
    res.redirect("/blog/posts/" + updatedPost.slug);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la mise à jour du post");
  }
}
