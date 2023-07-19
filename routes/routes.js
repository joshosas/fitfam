const express = require("express");
const User = require("../models/users");
// const User = require("../models/user_info");
const router = express.Router();
// const bcrypt = require("bcrypt");
const GLOBAL = [];

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
    // // OTHERS
    // // MORNING
    am4_6: req.body.am4_6 || "Eat, Code, Sleep",
    am6_9: req.body.am6_9 || "Eat, Code, Sleep",
    am9_12pm: req.body.am9_12pm || "Eat, Code, Sleep",
    // // AFTERNOON
    pm12_3: req.body.pm12_3 || "Eat, Code, Sleep",
    pm3_6: req.body.pm3_6 || "Eat, Code, Sleep",
    pm6_9: req.body.pm6_9 || "Eat, Code, Sleep",
    // // NIGHT
    pm9_12am: req.body.pm9_12am || "Eat, Code, Sleep",
    am12_2: req.body.am12_2 || "Eat, Code, Sleep",
    am2_4: req.body.am2_4 || "Eat, Code, Sleep",
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
      res.redirect("/signup");
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
    GLOBAL.push(userExist);

    if (userExist.password === req.body.password) {
      res.render("dashboard", { title: userExist.fname, userInfo: userExist });
    }
  } catch {
    res.redirect("/signin");
    req.session.message = {
      type: "danger",
      message: "Incorrect Email or Password",
    };
  }
});

// GET Route for Dashboard
router.get("/dashboard", (req, res) => {
  res.render("/dashboard");
});

// GET ROUTE FOR EDIT
router.get("/edit_todos", (req, res) => {
  userData = GLOBAL[0];
  console.log(userData);
  res.render("edit_todos", { title: "EDIT TODOS", userInfo: userData });
});

// Edit an user Todo
router.post("/edit_todos", (req, res) => {
  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    //     // // OTHERS
    //     // // MORNING
    am4_6: req.body.am4_6,
    am6_9: req.body.am6_9,
    am9_12pm: req.body.am9_12pm,
    //     // // AFTERNOON
    pm12_3: req.body.pm12_3,
    pm3_6: req.body.pm3_6,
    pm6_9: req.body.pm6_9,
    //     // // NIGHT
    pm9_12am: req.body.pm9_12am,
    am12_2: req.body.am12_2,
    am2_4: req.body.am2_4,
  });
  user
    .save()
    .then(() => {
      req.session.message = {
        type: "success",
        message: "User added successfully",
      };
      res.render("dashboard", { title: GLOBAL[0].fname, userInfo: GLOBAL[0] });
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
      console.log(err);
      res.redirect("/signup");
    });
});

// router.post("/edit", async (req, res) => {
//   try {
//     const userExist = await User.findOne({ email: req.body.email });
//     console.log(userExist._id);
//     res.render("edit_todos", { title: userExist.fname, userInfo: userExist });
//   } catch {
//     res.send("<h2>Wrong email! Please go back and try again.</h2>");
//   }
// });

// // Update an User Todo
// router.post("/update", async (req, res) => {
//   const userExist = await User.findOne({ email: req.body.email });
//   const id = userExist._id;
//   User.findOneAndUpdate(id, {
//     // MORNING
//     am4_6: req.body.am4_6,
//     am6_9: req.body.am6_9,
//     am9_12pm: req.body.am9_12pm,
//     // AFTERNOON
//     pm12_3: req.body.pm12_3 || "Eat, Code, Sleep",
//     pm3_6: req.body.pm3_6 || "Eat, Code, Sleep",
//     pm6_9: req.body.pm6_9 || "Eat, Code, Sleep",
//     // NIGHT
//     pm9_12am: req.body.pm9_12am || "Eat, Code, Sleep",
//     am12_2: req.body.am12_2 || "Eat, Code, Sleep",
//     am2_4: req.body.am2_4 || "Eat, Code, Sleep",
//   });
//   userExist
//     .save()
//     .then(() => {
//       req.session.message = {
//         type: "success",
//         message: "User updated successfully",
//       };
//       res.redirect("/dashboard");
//     })
//     .catch((err) => {
//       res.json({ message: err.message, type: "danger" });
//       console.log(err);
//       res.redirect("/signup");
//     });
//   res.render("dashboard", { title: userExist.fname, userInfo: userExist });
// });

module.exports = router;
