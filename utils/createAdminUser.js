import { User } from "../models/UserSchema.js";
import bcrypt from "bcrypt";

export async function createAdminUser() {
  const admin = await User.findOne({ email: "admin@admin.com" });
  if (!admin) {
    await User.create({
      name: "admin",
      email: "admin@admin.com",
      password: bcrypt.hashSync("admin", 10),
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }
}
