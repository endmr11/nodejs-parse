const express = require("express");
var bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES
app.use(routes);

//404
app.get("*", async (req, res) => {
  res.json({ message: "404" });
});

app.listen(3000, () => {
  console.log("Server Port: 3000");
});
