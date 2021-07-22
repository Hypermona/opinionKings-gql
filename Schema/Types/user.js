const graphql = require("graphql");

const { Post } = require("../../Models/post");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLList } =
  graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    image: { type: GraphQLString },
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    followers: { type: GraphQLInt },
    follwing: { type: GraphQLInt },
    verified: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    token: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, _) {
        return Post.find({ authorId: parent.id });
      },
    },
  }),
});

module.exports = UserType;

const PostType = require("./post");
