import path from "path";
import morgan from "morgan";
import express from "express";
import errorHandler from "errorhandler";
import multer from "multer";
import { create } from "express-handlebars";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import "./config/passport.js";

import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";

import * as helpers from "./helpers.js";

const app = express();

// Settings
app.set("views", path.join(__dirname, "./views"));
const hbs = create({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  helpers,
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Uploads Settings
app.use(multer({ dest: "./uploads" }).single("image"));

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "somesecretkey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
  // the curren user session
  app.locals.user = req.user || null;
  // succes messages by flash
  app.locals.success = req.flash("success");
  // passport authentication erros
  app.locals.error = req.flash("error");
  next();
});

// Routes
app.use(indexRoutes);
app.use(authRoutes);

// The Public directory for static files
app.use("/public", express.static(path.join(__dirname, "./public")));

// The Uploads directory
app.use("/uploads", express.static("./uploads"));

// Error Handling
if ("development" === app.get("env")) {
  app.use(errorHandler());
}

export default app;
