const graphql = require("graphql");
const UserType = require("./user");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLBoolean } = graphql;

const LoginType = new GraphQLObjectType({
  name: "Login",
  fields: () => ({
    user: { type: UserType },
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

const RefreshToken = new GraphQLObjectType({
  name: "refreshToken",
  fields: () => ({
    user: { type: UserType },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const logoutType = new GraphQLObjectType({
  name: "logout",
  fields: () => ({
    success: { type: GraphQLString },
  }),
});

module.exports = { LoginType, chekUserType, RefreshToken, logoutType };
