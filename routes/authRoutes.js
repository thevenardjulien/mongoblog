import express from "express";
import { User } from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
  res.render("auth/login", { title: "mongoblog : login" });
});

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login", {
        title: "mongoblog : login",
        error: "Email ou mot de passe incorrect",
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          title: "mongoblog : login",
          error: "Email ou mot de passe incorrect",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

authRoutes.get("/register", (req, res) => {
  res.render("auth/register", { title: "mongoblog : register" });
});

authRoutes.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.render("auth/register", {
        title: "mongoblog : register",
        error: "Cet email est déjà utilisé",
      });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
      });
      res.render("auth/register", {
        title: "mongoblog : register",
        error: "Compte créé avec succès",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

authRoutes.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Erreur lors de la destruction de la session:", err);
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
});
