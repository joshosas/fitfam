const express = require("express");
const User = require("../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");

// GET Route for Home
router.get("/", (req, res) => {
  res.render("index", { title: "HOME" });
});

// GET Route for Blog
router.get("/blog", (req, res) => {
  res.render("blog", { title: "BLOG" });
});

// GET Route for Sign Up
router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

// POST Route for Sign Up
router.post("/signup", (req, res) => {
  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.redirect("/signin");
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
      console.log(err);
    });
});

// GET Route for Sign In
router.get("/signin", (req, res) => {
  res.render("signin", { title: "Sign In" });
});

// Post Route for Sign In
router.post("/signin", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    console.log(userExist);

    if (userExist.password === req.body.password) {
      res.render("dashboard", { title: userExist.fname });
    }
  } catch {
    res.redirect("/signin");
    req.session.message = {
      type: "danger",
      message: "Incorrect Email or Password",
    };
  }
});

// GET Route for Blog
router.get("/blog", (req, res) => {
  res.render("blog", { title: "BLOG" });
});

// GET Route for Dashboard
router.get("/dashboard", (req, res) => {
  res.redirect("/signin");
});

module.exports = router;
