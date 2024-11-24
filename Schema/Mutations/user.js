const graphql = require("graphql");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../../Models/user");

const UserType = require("../Types/user");

const { GraphQLString, GraphQLBoolean } = graphql;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const MutationFields = {
  addUser: {
    type: UserType,
    args: {
      new: { type: GraphQLBoolean },
      image: { type: GraphQLString },
      name: { type: GraphQLString },
      userName: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      verified: { type: GraphQLBoolean },
    },
    async resolve(_, args, context) {
      try {
        if (args.new) {
          const userName = await User.findOne({ userName: args.userName });
          if (userName) {
            context.res.status(409);
            throw new Error("userName exists already.");
          }
          const email = await User.findOne({ email: args.email });
          if (email) {
            context.res.status(409);
            throw new Error("email exists already.");
          }
        }
        let imageResponse = {};
        if (args.image) {
          imageResponse = await cloudinary.uploader.upload(args.image, {
            upload_preset: "ml_default",
          });
        } else {
          imageResponse.secure_url = null;
        }
        const password = await bcrypt.hash(args.password, 12);
        const user = new User({
          image: imageResponse.secure_url,
          name: args.name,
          userName: args.userName,
          email: args.email,
          password: password,
          verified: args.verified,
        });
        const data = await user.save();
        if (args.new) {
          const token = await jwt.sign({ id: data.id }, process.env.JWT_SECRET, {
            expiresIn: "30s",
          });
          const refreshToken = await jwt.sign({ id: data.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "1h",
          });
          User.findByIdAndUpdate(user.id, { token: refreshToken });
          context.res.cookie("jwt", refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
          return { id: user.id, token: token, tokenExpiration: 1 };
        } else {
          return data;
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
module.exports = MutationFields;
