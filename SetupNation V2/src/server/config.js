const path = require("path");
const exphbs = require("express-handlebars");

const morgan = require("morgan");
const multer = require("multer");
const express = require("express");
const errorhandler = require("errorhandler");

const routes = require("../routes/index");

module.exports = (app) => {
  // Configuraciones
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(__dirname, "../views"));
  app.engine(
    ".hbs",
    exphbs.engine({
      defaultLayout: "main",
      //carpeta partials y carpeta layouts están dentro de views
      layoutsDir: path.join(app.get("views"), "layouts"),
      partialsDir: path.join(app.get("views"), "partials"),
      extname: ".hbs",
      //funciones
      helpers: require("./helpers"),
    })
  );
  app.set("view engine", ".hbs");
  // Middlewares
  app.use(morgan("dev"));
  //Cuando me envíen una imagen la voy a colocar en esta carpeta y solo 1
  app.use(
    multer({ dest: path.join(__dirname, "../public/upload/temp") }).single(
      "image"
    )
  );
  // Recibe datos de formularios
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  // Rutas
  routes(app);
  // Archivos estaticos
  app.use("/public", express.static(path.join(__dirname, "../public")));
  // errorhandlers
  if ("development" === app.get("env")) {
    app.use(errorhandler());
  }

  return app;
};
