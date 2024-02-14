//allow to use dotenv throughout all files
require("dotenv").config
const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const PORT = process.env.PORT || 3500;

const app = express();

// use logger
app.use(logger);

// use cors
app.use(cors(corsOptions))

// receive and parse json data
app.use(express.json());

// parse received cookies
app.use(cookieParser());

// serve up static file
app.use("/", express.static(path.join(__dirname, "public")));

// app.use(express.use('public'))
// another way to serve up static file, but not specific path

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
