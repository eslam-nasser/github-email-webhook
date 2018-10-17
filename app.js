const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config();


const indexRouter = require("./routes/index");
app.use("/", indexRouter);


app.listen(port, () => {
  console.log("Server started on port " + port);
});
