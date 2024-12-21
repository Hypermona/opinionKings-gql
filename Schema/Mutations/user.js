const graphql = require("graphql");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../../Models/user");

const UserType = require("../Types/user");
const { LoginType } = require("../Types/auth");

const { GraphQLString, GraphQLID, GraphQLBoolean } = graphql;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const MutationFields = {
  addUser: {
    type: LoginType,
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
      // try {
      if (args.new) {
        const userName = await User.findOne({ userName: args.userName });
        if (userName) {
          // context.res.status(409);
          throw new Error("userName exists already.");
        }
        const email = await User.findOne({ email: args.email });
        if (email) {
          // context.res.status(409);
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
          expiresIn: "6hr",
        });
        const refreshToken = await jwt.sign({ id: data.id }, process.env.JWT_REFRESH_SECRET, {
          expiresIn: "24h",
        });
        // User.findByIdAndUpdate(user.id, { token: refreshToken });
        context.res.cookie("jwt", refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        return { user, token: token, tokenExpiration: 1 };
      } else {
        return data;
      }
      // } catch (err) {
      //   console.error(err);
      //   throw new Error("Internal server error");
      // }
    },
  },
  savePost: {
    type: UserType,
    args: {
      postId: { type: GraphQLID },
    },
    async resolve(_, args, context) {
      try {
        const user = await User.findById(context.req.id);
        if (user?.saved?.includes(args.postId)) {
          const savedPosts = user.saved.filter((p) => p != args.postId);
          return await User.findByIdAndUpdate(user.id, { saved: savedPosts },{new:true});
        } else {
          const existingPosts = user.saved || [];
          return await User.findByIdAndUpdate(
            user.id,
            { saved: [...existingPosts, args.postId] },
            { new: true }
          );
        }
      } catch (err) {
        return err;
      }
    },
  },
  updateFollowers: {
    type: UserType,
    args: {
      followerId: { type: GraphQLID },
    },
    async resolve(_, args, context) {
      try {
        const user = await User.findById(context.req.id);
        const follower = await User.findById(args.followerId);
        if (
          user?.following?.includes(args.followerId) &&
          follower?.followers?.includes(context.req.id)
        ) {
          const newFollowing = user.following.filter((p) => p != args.followerId);
          const newFollowers = follower.followers.filter((p) => p != context.req.id);
          console.log("filterrrr", newFollowers, newFollowing, args.followerId, context.req.id);
          await User.findByIdAndUpdate(
            follower.id,
            { $set: { followers: newFollowers } },
            { new: true }
          );
          return await User.findByIdAndUpdate(
            user.id,
            { $set: { following: newFollowing } },
            { new: true }
          );
        } else {
          const existingFollowings = user.following || [];
          const existingFollowers = follower.followers || [];

          await User.findByIdAndUpdate(args.followerId, {$set:{
            followers: [...existingFollowers, context.req.id],
          }},{new:true});
          const result =  await User.findByIdAndUpdate(context.req.id, {$set:{
            following: [...existingFollowings, args.followerId],
          }},{new:true});
          console.log("ddddddddd", result, args.followerId, context.req.id);
          return result
        }
      } catch (err) {
        return err;
      }
    },
  },
};
module.exports = MutationFields;
