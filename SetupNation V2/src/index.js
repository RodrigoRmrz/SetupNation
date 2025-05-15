import app from "./app.js";
import { PORT } from "./config.js";

// database
import "./config/mongoose.js";

// Starting the server
app.set("port", PORT);
app.listen(PORT);
console.log("Server on port", PORT);