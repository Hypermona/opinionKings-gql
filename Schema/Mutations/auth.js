const graphql = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../../Models/user");

const { LoginType, RefreshToken } = require("../Types/auth");

const { GraphQLString } = graphql;

const MutationFields = {
  login: {
    type: LoginType,
    args: {
      userName: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
    },
    async resolve(_, args, context) {
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
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30s" });
      const refershToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "1h",
      });
      User.findByIdAndUpdate(user.id, { token: refershToken });
      context.res.cookie("jwt", refershToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return { id: user.id, token: token, tokenExpiration: 1 };
    },
  },
  refreshToken: {
    type: RefreshToken,
    args: {},
    async resolve(_, args, context) {
      try {
        const token = context.req.cookies.jwt;
        if (token) {
          return jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
              console.log(err);
              context.res.sendStatus(400);
            }
            const user = await User.findById(decoded.id);
            if (user) {
              console.log(user);

              const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "30s",
              });
              return { id: user._id, token: newToken, tokenExpiration: 1 };
            } else {
              context.res.sendStatus(400);
            }
          });
        } else {
          context.res.sendStatus(406);
        }
      } catch (error) {
        console.log(error);
        context.res.sendStatus(500);
      }
    },
  },
};

module.exports = MutationFields;
