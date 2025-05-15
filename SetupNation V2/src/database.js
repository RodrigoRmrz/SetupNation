const mongoose = require("mongoose");

const { database } = require("./keys");

mongoose
  .connect(database.URI)
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.log(err));
