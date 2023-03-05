const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String, 
  email: String,
  profileImage: String,
  customerID : String,
  createdAt: String
});

const User = model("User", userSchema);

module.exports = User;
