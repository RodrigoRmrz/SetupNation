import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

(async () => {
  try {
    const db = await mongoose.connect(MONGODB_URI);
    console.log("DB is connected:", db.connection.name);
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
  }
})();