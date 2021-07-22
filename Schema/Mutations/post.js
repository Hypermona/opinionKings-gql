const graphql = require("graphql");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const { Post } = require("../../Models/post");

const PostType = require("../Types/post");

const { GraphQLString, GraphQLID, GraphQLList } = graphql;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const MutationFields = {
  addPost: {
    type: PostType,
    args: {
      title: { type: GraphQLString },
      image: { type: GraphQLString },
      shortDescription: { type: GraphQLString },
      description: { type: GraphQLString },
      tags: { type: new GraphQLList(GraphQLString) },
      authorId: { type: GraphQLID },
    },
    async resolve(_, args, req) {
      if (!req.isAuth) {
        throw new Error("not authenticated");
      }

      try {
        let imageResponse = {};
        if (args.image) {
          // const subFolder = args.category ? args.category : "all";
          imageResponse = await cloudinary.uploader.upload(args.image, {
            // folder: `${subFolder}/`,
            upload_preset: "ml_default",
          });
        } else {
          imageResponse.secure_url = "";
        }
        const post = new Post({
          title: args.title,
          image: imageResponse.secure_url,
          shortDescription: args.shortDescription,
          description: args.description,
          tags: args.tags,
          authorId: req.id,
        });
        return post.save();
      } catch (err) {
        throw err;
      }
    },
  },
};
module.exports = MutationFields;
