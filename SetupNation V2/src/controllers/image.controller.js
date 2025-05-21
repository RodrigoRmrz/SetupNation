import fs from "fs-extra";
import path from "path";
import md5 from "md5";
import mongoose from 'mongoose';

import sidebar from "../helpers/sidebar.js";
import { randomNumber } from "../helpers/libs.js";
import { Image, Comment } from "../models/index.js";

// export const index = async (req, res, next) => {
//   let viewModel = { image: {}, comments: [] };

//   try {
//     const image = await Image.findById(req.params.image_id);

//     if (!image) {
//       return next(new Error("Image does not exists"));
//     }

//     const updatedImage = await Image.findByIdAndUpdate(
//       image._id,
//       { $inc: { views: 1 } },
//       { new: true }
//     ).lean();

//     viewModel.image = updatedImage;

//     const comments = await Comment.find({ image_id: image._id }).sort({ timestamp: 1 });
//     viewModel.comments = comments;

//     viewModel = await sidebar(viewModel);

//     res.render("image", viewModel);
//   } catch (err) {
//     console.error("Error loading image:", err);
//     next(err);
//   }
// };
export const index = async (req, res, next) => {
  let viewModel = { image: {}, comments: [] };

  try {
    const image = await Image.findById(req.params.image_id);
    if (!image) {
      return next(new Error("Image does not exist"));
    }

    const updatedImage = await Image.findByIdAndUpdate(
      image._id,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    viewModel.image = updatedImage;

    const comments = await Comment.find({ image_id: image._id })
      .sort({ timestamp: 1 })
      .populate('image_id', 'filename')
      .lean(); // Usamos lean() para que Mongoose no devuelva instancias de Mongoose

    viewModel.comments = comments; // Asignamos los comentarios al viewModel

    console.log("Comentarios obtenidos:", comments); // Agrega este log para verificar si los comentarios se obtienen correctamente.

    viewModel = await sidebar(viewModel); // Agrega el sidebar si es necesario

    res.render("image", viewModel);
  } catch (err) {
    console.error("Error loading image:", err);
    next(err);
  }
};


export const create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      // Image Location
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`./uploads/${imgUrl}${ext}`);

      // Validate Extension
      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif" ||
        ext === ".webp"
      ) {
        // you wil need the public/temp path or this will throw an error
        await fs.rename(imageTempPath, targetPath);

        // create a new image
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });

        // save the image
        const savedImage = await newImg.save();

        // redirect to the list of images
        res.redirect('/images/' + savedImage._id);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: "Only Images are allowed" });
      }
    }
  };

  saveImage();
};

// export const like = async (req, res) => {
//   const image = await Image.findOne({
//     filename: { $regex: req.params.image_id },
//   });
//   console.log(image);
//   if (image) {
//     image.likes = image.likes + 1;
//     await image.save();
//     res.json({ likes: image.likes });
//   } else {
//     res.status(500).json({ error: "Internal Error" });
//   }
// };

export const like = async (req, res) => {
  try {
    const imageId = req.params.image_id;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ error: 'ID de imagen inválido' });
    }

    // Buscar la imagen por _id (usando un nombre diferente para la variable)
    const image = await Image.findById(imageId);  // Cambié `Image` por `image` aquí
    if (!image) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Incrementar los likes
    image.likes += 1;

    // Guardar los cambios
    await image.save();

    // Responder con los nuevos likes
    res.json({ likes: image.likes });

  } catch (err) {
    console.error('Error al procesar like:', err);
    res.status(500).json({ error: 'Error interno del servidor XD' });
  }
};

// export const comment = async (req, res) => {
//   try {
//     const image = await Image.findById(req.params.image_id);
//     if (!image) return res.redirect("/");

//     console.log("Comentario recibido:", req.body);

//     const newComment = new Comment(req.body);
//     newComment.gravatar = md5(newComment.email);
//     newComment.image_id = image._id;
//     await newComment.save();

//     res.redirect("/images/" + image._id + "#" + newComment._id);
//   } catch (err) {
//     console.error("Error posting comment:", err);
//     res.redirect("/");
//   }
// };

export const comment = async (req, res) => {
  try {
    // Buscar la imagen por ID
    const image = await Image.findById(req.params.image_id);
    if (!image) return res.redirect("/");  // Si no existe la imagen, redirigir a la página principal

    // Imprime el comentario recibido
    console.log("Comentario recibido:", req.body);

    // Crear un nuevo comentario
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email.trim().toLowerCase());
    newComment.image_id = image._id;

    // Guardamos el nuevo comentario
    await newComment.save();

    // Redirigir a la página de la imagen, para mostrar los comentarios
    res.redirect(`/images/${image._id}#comments`);
    
  } catch (err) {
    console.error("Error posting comment:", err);
    res.redirect("/");  // En caso de error, redirigimos a la página principal
  }
};



export const remove = async (req, res) => {
  try {
    const image = await Image.findById(req.params.image_id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = path.resolve("./uploads/" + image.filename);
    if (await fs.pathExists(imagePath)) {
      await fs.unlink(imagePath);
    }

    await Comment.deleteMany({ image_id: image._id });
    await Image.findByIdAndDelete(image._id);

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

