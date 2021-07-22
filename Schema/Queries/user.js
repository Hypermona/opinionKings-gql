const graphql = require("graphql");

const User = require("../../Models/user");

const UserType = require("../Types/user");

const { GraphQLID, GraphQLList } = graphql;

const QueryFields = {
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve(_, args) {
      return User.findById(args.id);
    },
  },

  users: {
    type: new GraphQLList(UserType),
    resolve() {
      return User.find({});
    },
  },
};

module.exports = QueryFields;
