const graphql = require("graphql");

const { GraphQLObjectType, GraphQLSchema } = graphql;

////////////////// Query Field Imports  /////////////////////////

const postQueries = require("./Queries/post");
const userQueries = require("./Queries/user");
const categoryQueries = require("./Queries/category");
const commentQueries = require("./Queries/comment");
const authQueries = require("./Queries/auth");

/////////////////// Mutation Field Imports //////////////////////////////

const authMutations = require("./Mutations/auth");
const categoryMutations = require("./Mutations/category");
const postMutations = require("./Mutations/post");
const commentMutations = require("./Mutations/comment");
const userMutations = require("./Mutations/user");

////////////////// Queries /////////////////////////
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...authQueries,
    ...commentQueries,
    ...categoryQueries,
    ...postQueries,
    ...userQueries
  },
});

////////////////// Muations /////////////////////////
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...authMutations,
    ...commentMutations,
    ...categoryMutations,
    ...postMutations,
    ...userMutations
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
