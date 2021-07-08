const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentScheme = new Schema(
  {
    data: String,
    likes: Number,
    postId: mongoose.Types.ObjectId,
    authorId: mongoose.Types.ObjectId,
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
    categoryId: mongoose.Types.ObjectId,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = {
  Post: mongoose.model("Post", postSchema),
  Comment: mongoose.model("Comment", commentScheme),
};
