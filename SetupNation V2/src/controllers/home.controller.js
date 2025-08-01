import sidebar from "../helpers/sidebar.js";
import { Image } from "../models/index.js";


export const index = async (req, res, next) => {
  try {
    const images = await Image.find()
      .sort({ timestamp: -1 })
      .lean({ virtuals: true });

    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    res.render("index", viewModel);
  } catch (error) {
    next(error);
  }
};

