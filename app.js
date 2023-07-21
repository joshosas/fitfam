// imports
require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");


const path = require("path");

const { log, error } = require("console");

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("database connected"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my_secret_key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set Templating Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");


//app.use("", require("./routes/routes"));
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));


app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});
