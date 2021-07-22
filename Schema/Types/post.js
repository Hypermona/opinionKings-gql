const graphql = require("graphql");

const Category = require("../../Models/category");
const User = require("../../Models/user");
const { Comment } = require("../../Models/post");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql;

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    shortDescription: { type: GraphQLString },
    description: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, _) {
        return User.findById(parent.authorId);
      },
    },
    likes: { type: GraphQLInt },
    dislikes: { type: GraphQLInt },
    shares: { type: GraphQLInt },
    saves: { type: GraphQLInt },
    tags: { type: new GraphQLList(GraphQLString) },
    category: {
      type: CategoryType,
      resolve(parent, _) {
        return Category.findById(parent.categoryId);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, _) {
        return Comment.find({ postId: parent.id });
      },
    },
    createdAt: { type: GraphQLString },
  }),
});
module.exports = PostType;

const CategoryType = require("./category");
const CommentType = require("./comment");
const UserType = require("./user");
