const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  am4_6: {
    type: String,
    required: true,
    default: new Array("Eat", "Code", "Sleep"),
  },
  am6_9: {
    type: String,
    required: true,
    default: new Array("Eat", "Code", "Sleep"),
  },
  am9_12pm: {
    type: String,
    required: true,
    default: new Array("Eat", "Code", "Sleep"),
  },
});

module.exports = mongoose.model("User", userSchema);
