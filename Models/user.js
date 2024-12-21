const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    image: String,
    userName: String,
    email: String,
    password: String,
    followers: { type: [mongoose.Types.ObjectId] ,default:[]},
    following: { type: [mongoose.Types.ObjectId] ,default:[]},
    verified: { type: Boolean, default: false },
    saved: { type: [mongoose.Types.ObjectId] ,default:[]},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
