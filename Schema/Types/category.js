const graphql = require("graphql");

const { Post } = require("../../Models/post");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, _) {
        return Post.find({ categoryId: parent.id });
      },
    },
  }),
});
module.exports = CategoryType;

const PostType = require("./post");
