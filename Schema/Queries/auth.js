const graphql = require("graphql");
const jwt = require("jsonwebtoken");

const User = require("../../Models/user");

const { chekUserType } = require("../Types/auth");

const { GraphQLString } = graphql;

const QueryFields = {
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
};

module.exports = QueryFields;
