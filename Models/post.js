const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentScheme = new Schema(
  {
    data: String,
    likes: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    title: String,
    image: String,
    shortDescription: String,
    description: String,
    authorId: mongoose.Types.ObjectId,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    tags: [String],
    comments: [commentScheme],
  },
  { timestamps: true }
);

module.exports = {
  Post: mongoose.model("Post", postSchema),
  Comment: mongoose.model("Comment", commentScheme),
};
