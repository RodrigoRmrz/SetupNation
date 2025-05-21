import { Comment, Image } from "../models/index.js";
import md5 from 'md5';

export default {
  async newest() {
    try {
      const comments = await Comment.find()
        .limit(5)
        .sort({ timestamp: -1 })
        .populate('image_id', 'filename') // Aquí usamos populate para obtener solo el campo 'filename' de la imagen asociada.
        .lean(); // Asegúrate de usar .lean() para convertir los documentos de Mongoose en objetos planos

      // Asegurarse de que gravatar se calcule correctamente
      comments.forEach(comment => {
        comment.gravatar = md5(comment.email.trim().toLowerCase()); // Calculamos el gravatar
      });

      return comments; // Regresamos los comentarios
    } catch (err) {
      console.error("Error obteniendo los comentarios:", err);
      return []; // En caso de error, regresamos un arreglo vacío
    }
  },
};