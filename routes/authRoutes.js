import express from "express";
import {
  getLogin,
  getLogout,
  getRegister,
  postLogin,
  postRegister,
} from "../controllers/authController.js";

export const authRoutes = express.Router();

authRoutes.get("/login", getLogin);
authRoutes.post("/login", postLogin);
authRoutes.get("/register", getRegister);
authRoutes.post("/register", postRegister);
authRoutes.get("/logout", getLogout);
