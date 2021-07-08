const graphql = require("graphql");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let timestamp = Math.round(new Date().getTime() / 1000);
const Category = require("../Models/category");
const User = require("../Models/user");
const { Post, Comment } = require("../Models/post");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = graphql;

////////////////// Types /////////////////////////
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    followers: { type: GraphQLInt },
    follwing: { type: GraphQLInt },
    verified: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    token: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, _) {
        return Post.find({ authorId: parent.id });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    shortDescription: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, _) {
        return User.findById(parent.authorId);
      },
    },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    shares: { type: GraphQLInt },
    saves: { type: GraphQLInt },
    tags: { type: new GraphQLList(GraphQLString) },
    category: {
      type: CategoryType,
      resolve(parent, _) {
        return Category.findById(parent.categoryId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, _) {
        return Comment.find({ postId: parent.id });
      },
    },
    createdAt: { type: GraphQLString },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLString },
    data: { type: GraphQLString },
    like: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

const LoginType = new GraphQLObjectType({
  name: "Login",
  fields: () => ({
    id: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const chekUserType = new GraphQLObjectType({
  name: "chekUser",
  fields: () => ({
    user: { type: GraphQLBoolean },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, _) {
        return Post.find({ categoryId: parent.id });
      },
    },
  }),
});

////////////////// Queries /////////////////////////
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(_, args) {
        return Post.findById(args.id);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return User.findById(args.id);
      },
    },
    comment: {
      type: CommentType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(_, args) {
        return Comment.findById(args.id);
      },
    },
    category: {
      type: CategoryType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(_, args) {
        return Category.findById(args.id);
      },
    },
    signature: {
      type: GraphQLString,
      resolve(_, __) {
        let signature = cloudinary.utils.api_sign_request(
          {
            timestamp: timestamp,
            eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
            public_id: "sample_image",
          },
          process.env.API_SECRET
        );
        return signature;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(_, __) {
        return Post.find({});
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      },
    },
    commetns: {
      type: new GraphQLList(CommentType),
      args: { postId: { type: GraphQLID } },
      resolve(_, args) {
        return Comment.find({ postId: args.postId });
      },
    },
    checkUser: {
      type: chekUserType,
      args: { userName: { type: GraphQLString } },
      async resolve(_, args) {
        const user = await User.findOne({ userName: args.userName });
        if (user) {
          return { user: true };
        } else {
          return { user: false };
        }
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve() {
        return Category.find({});
      },
    },
  },
});

////////////////// Muations /////////////////////////
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        new: { type: GraphQLBoolean },
        image: { type: GraphQLString },
        name: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
      },
      async resolve(_, args) {
        try {
          if (args.new) {
            const userName = await User.findOne({ userName: args.userName });
            if (userName) {
              throw new Error("userName exists already.");
            }
            const email = await User.findOne({ email: args.email });
            if (email) {
              throw new Error("email exists already.");
            }
          }
          let imageResponse = {};
          if (args.image) {
            imageResponse = await cloudinary.uploader.upload(args.image, {
              upload_preset: "ml_default",
            });
          } else {
            imageResponse.secure_url = null;
          }
          const password = await bcrypt.hash(args.password, 12);
          const user = new User({
            image: imageResponse.secure_url,
            name: args.name,
            userName: args.userName,
            email: args.email,
            password: password,
            verified: args.verified,
          });
          const data = await user.save();
          if (args.new) {
            const token = await jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
            return { id: user.id, token: token, tokenExpiration: 1 };
          } else {
            return data;
          }
        } catch (err) {
          throw err;
        }
      },
    },
    login: {
      type: LoginType,
      args: {
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args) {
        let user = await User.findOne({ userName: args.email });
        if (!user) {
          user = await User.findOne({ email: args.email });
        }
        if (!user) {
          throw new Error("username or password is not matching");
        }

        const isEqual = await bcrypt.compare(args.password, user.password);
        if (!isEqual) {
          throw new Error("username or password is not matching");
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { id: user.id, token: token, tokenExpiration: 1 };
      },
    },
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
    addComment: {
      type: CommentType,
      args: {
        postId: { type: GraphQLID },
        userId: { type: GraphQLID },
        data: { type: GraphQLString },
      },
      resolve(_, args) {
        const comment = new Comment({
          postId: args.postId,
          userId: args.userId,
          data: args.data,
        });
        return comment.save();
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_, args) {
        const category = new Category({
          name: args.name,
        });
        return category.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
