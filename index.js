import mongoose from "mongoose";
import express from "express";
import { dirname, sep } from "path";
import { fileURLToPath } from "url";
import process from "process";
import { createAdminUser } from "./utils/createAdminUser.js";
import session from "express-session";
import MongoStore from "connect-mongo";

// Import des routeurs
import { authRoutes } from "./routes/authRoutes.js";

main()
  .then(() => console.log("Connected to MongoDB database : mongoblog"))
  .then(() => createAdminUser())
  .catch((err) => console.log(err));

async function main() {
  const url = process.env.DB_URL || "mongodb://localhost:27017/";
  const dbName = process.env.DB_NAME || "mongoblog";
  await mongoose.connect(`${url}${dbName}`);
}

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url)) + sep;

// Configuration
const cfg = {
  port: process.env.APP_PORT || process.argv[2] || 7777,
  dir: {
    root: __dirname,
    public: __dirname + "public" + sep,
    views: __dirname + "views" + sep,
  },
};

// Static files
app.use(express.static(cfg.dir.public));

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configuration EJS
app.set("view engine", "ejs");
app.set("views", cfg.dir.views);

// Setup sessions
const store = MongoStore.create({
  mongoUrl: "mongodb://localhost:27017/mongoblog",
});

store.on("error", function (error) {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "mongoblog : homepage",
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "mongoblog : about" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "mongoblog : contact" });
});

app.get("/post", (req, res) => {
  res.render("post", { title: "mongoblog : post" });
});

app.use("/auth", authRoutes);

// Gestion des erreurs
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path}`);
  res.status(404).send("Page not found");
});

// Démarrage du serveur
app.listen(cfg.port, () => {
  console.log(`Serveur démarré sur http://localhost:${cfg.port}`);
});
