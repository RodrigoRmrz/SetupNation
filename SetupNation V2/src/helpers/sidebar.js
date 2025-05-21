import Stats from "./stats.js";
import Images from "./images.js";
import Comments from "./comments.js";

export default async (viewModel) => {
  const results = await Promise.all([
    Stats(),
    Images.popular(),
    Comments.newest(),
  ]);

  viewModel.sidebar = {
    stats: results[0],
    popular: results[1],
    comments: results[2],
  };

  return viewModel;
};