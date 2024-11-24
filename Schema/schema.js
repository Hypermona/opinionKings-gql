const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

////////////////// Query Field Imports  /////////////////////////

const { post, posts } = require("./Queries/post");
const { user, users } = require("./Queries/user");
const { category, categories } = require("./Queries/category");
const { comment, comments } = require("./Queries/comment");
const { checkUser } = require("./Queries/auth");

/////////////////// Mutation Field Imports //////////////////////////////

const { login, refreshToken } = require("./Mutations/auth");
const { addCategory } = require("./Mutations/category");
const { addPost } = require("./Mutations/post");
const { addComment } = require("./Mutations/comment");
const { addUser } = require("./Mutations/user");

////////////////// Queries /////////////////////////
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    post,
    posts,
    user,
    users,
    category,
    categories,
    comment,
    comments,
    checkUser,
  },
});

////////////////// Muations /////////////////////////
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser,
    addPost,
    addCategory,
    addComment,
    login,
    refreshToken,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
