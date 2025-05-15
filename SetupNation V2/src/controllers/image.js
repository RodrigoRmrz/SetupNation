const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
const { Image } = require("../models");
const ctrl = {};

ctrl.index = (req, res) => {
  res.send("Image Page");
};
ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      console.log(imgUrl);
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          description: req.body.description,
          filename: imgUrl + ext,
        });
        const imageSaved = await newImg.save();
        //res.redirect("/images/:image_id");
        res.send("correcto");
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: "Formato de imagen no compatible" });
      }
    }
  };
  saveImage();
};
ctrl.like = (req, res) => {};
ctrl.comment = (req, res) => {};
ctrl.remove = (req, res) => {};

module.exports = ctrl;
