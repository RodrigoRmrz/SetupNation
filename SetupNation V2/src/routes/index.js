const express = require("express");
const router = express.Router();

const home = require("../controllers/home");
const image = require("../controllers/image");

module.exports = (app) => {
  router.get("/", home.index); // ruta principal lista todas las imagenes
  // El usuario va a poder navegar en esta ruta
  router.get("/images/:image_id", image.index); //lista una imagen específica
  router.post("/images", image.create); // ruta para crear una imagen
  router.post("/images/:image_id/like", image.like); // ruta para dar like a una imagen
  router.post("images/:image_id/comment", image.comment); //ruta para comentar una imagen
  router.delete("/images/:image_id", image.remove); //ruta para eliminar una imagen
  app.use(router);
};
