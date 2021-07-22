const graphql = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../../Models/user");

const { LoginType } = require("../Types/auth");

const { GraphQLString } = graphql;

const MutationFields = {
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
};

module.exports = MutationFields;
