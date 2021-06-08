const graphql = require("graphql");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
require("dotenv").config();

let timestamp = Math.round(new Date().getTime() / 1000);

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
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        image: { type: GraphQLString },
        name: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        verified: { type: GraphQLBoolean },
      },
      async resolve(_, args) {
        try {
          const email = await User.findOne({ email: args.email });
          if (email) {
            throw new Error("User exists already.");
          }
          const userName = await User.findOne({ userName: args.userName });
          if (userName) {
            throw new Error("username exists already.");
          }
          const password = await bcrypt.hash(args.password, 12);
          const user = new User({
            image: args.image,
            name: args.name,
            userName: args.userName,
            email: args.email,
            password: password,
            verified: args.verified,
          });
          return user.save();
        } catch (err) {
          throw err;
        }
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
      resolve(_, args) {
        const post = new Post({
          title: args.title,
          image: args.image,
          shortDescription: args.shortDescription,
          description: args.description,
          tags: args.tags,
          authorId: args.authorId,
        });
        return post.save();
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
