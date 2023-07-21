const express = require("express");
const User = require("../../models/users");
const Post = require("../models/Post");
// const User = require("../models/user_info");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GLOBAL = [];


const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check USER Login
*/
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId= decoded.userId;
    next();
  } catch(error) {

    if (error.name === "TokenExpiredError") {
      res.redirect("/signin");
      req.session.message = {
        type: "danger",
        message: "Your session has expired, please login again."
      };

    } else {
    res.status(401).json( { message: 'Unauthorized'} );
    }
  }
};


// GET Route for Home
router.get("/", (req, res) => {
  res.render("index", { title: "HOME" });
});


// GET Route for Blog
// router.get("/blog", (req, res) => {
//   res.render("blog", { title: "BLOG" });
// });
router.get("/blog", async (req, res) => {
  try {
     const locals = {
         title: "FitFam Blog ",
         description: "Fitfam home page for ALX students."
     }
 
     let perPage = 6;
     let page = req.query.page || 1;
 
     const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
     .skip(perPage * page - perPage)
     .limit(perPage)
     .exec();
     
     const count = await Post.count();
     const nextPage = parseInt(page) + 1;
     const hasNextPage = nextPage <= Math.ceil(count / perPage);
 
    
     res.render('blog', { 
         locals,
         data,
         current: page,
         nextPage: hasNextPage ? nextPage : null,
         currentRoute: '/blog'
       });
  
 
         // const data = await Post.find();
         // res.render("blog", { locals, data }); // render the data from locals obj
 
     } catch (error) {
         console.log(error);
 
     }
     
            
  });

   /**
 * GET /
 * Post :id
*/
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "FitFam Blog posts.",
    }

    res.render("post", { 
      locals,
      data,
      // currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

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

// Post Route for Sign In -- check Login
router.post("/signin", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    GLOBAL.push(userExist);

    if (userExist.password === req.body.password) {

      const token = jwt.sign({ userId: userExist._id}, jwtSecret );
       res.cookie('token', token, { httpOnly: true });
      res.render("dashboard", { title: userExist.fname, userInfo: userExist });
      console.log(token);
    }
  } catch {
    res.redirect("/signin");
    req.session.message = {
      type: "danger",
      message: "Incorrect Email or Password",
    };
  }
});



// // Post - User - Check Login
// router.post('/signin', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     const user = await User.findOne( { email } );

//     if(!user) {
//       return res.status(401).json( { message: 'Invalid credentials' } );
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if(!isPasswordValid) {
//       return res.status(401).json( { message: 'Invalid credentials' } );
//     }

//     const token = jwt.sign({ userId: user._id}, jwtSecret );
//     res.cookie('token', token, { httpOnly: true });

//     res.render('dashboard', {
//        title: userInfo.fname,
//        userInfo
//    });

//   } catch (error) {
//     console.log(error);
//   }
// });




// // GET Route for Dashboard
// router.get("/dashboard", authMiddleware, async (req, res) => {
//   res.render("/dashboard");
// });


// GET Dashboard
router.get('/dashboard/:id', authMiddleware, async (req, res) => {
  try {

    
    const locals = {
      title: 'Dashboard',
      description: 'User Dashboard.'
    }

    const userInfo = await User.findOne({ _id: req.params.id });

    //const userInfo = await User.find();
    res.render("dashboard", { 
      locals,
     userInfo
    
    });

  } catch (error) {
    console.log(error);
  }

});

 
// GET ROUTE FOR EDIT
router.get("/edit_todos/:id", authMiddleware, async (req, res) => {
  try {

    
    const locals = {
      title: "Update my Todo list",
      description: "Edit user To-do"
    };
    
    const userInfo = await User.findOne({ _id: req.params.id });
    console.log(userInfo);
    res.render("edit_todos", {
       locals,
      userInfo
      })



  } catch (error) {
    console.log(error);
  }

   
});



//edit_todos / PUT
router.put("/edit_todos/:id", authMiddleware, async (req, res) => {

     try {

      await User.findByIdAndUpdate(req.params.id, {
        // fname: req.body.fname,
        // lname: req.body.lname,
        // email: req.body.email,
        // password: req.body.password,
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
        am2_4: req.body.am2_4


      });

      res.redirect(`/edit_todos/${req.params.id}`);     


  

  } catch (error) {
    console.log(error);
  }
   
});




module.exports = router;
