const graphql = require("graphql");

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
      resolove(parent, _) {
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
    date: { type: GraphQLString },
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
        verified: { type: GraphQLBoolean },
      },
      resolve(_, args) {
        const user = new User({
          image: args.image,
          name: args.name,
          userName: args.userName,
          email: args.email,
          verified: args.verified,
        });
        return user.save();
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});