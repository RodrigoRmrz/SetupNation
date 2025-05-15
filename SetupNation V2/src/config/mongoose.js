import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

(async () => {
  const db = await mongoose.connect(MONGODB_URI);
  console.log("db is connected: ", db.connection.name);
})();
