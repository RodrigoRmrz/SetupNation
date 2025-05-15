import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SetupNation";
export const PORT = process.env.PORT || 3000;