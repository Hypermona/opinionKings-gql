const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLBoolean } = graphql;

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

module.exports = { LoginType, chekUserType };
