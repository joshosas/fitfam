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
  // OTHERS
  // - MORNING
  am4_6: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  am6_9: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  am9_12pm: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  // - AFTERNOON
  pm12_3: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  pm3_6: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  pm6_9: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  // - NIGHT
  pm9_12am: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  am12_2: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
  am2_4: {
    type: String,
    required: true,
    default: "Eat, Code, Sleep",
  },
});

module.exports = mongoose.model("NewUser", userSchema);
