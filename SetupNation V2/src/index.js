const express = require("express");

const config = require("./server/config");

// Base de datos
require("./database");

const app = config(express());

// Empezando el servidor
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});
