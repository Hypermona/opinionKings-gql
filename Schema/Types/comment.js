const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString } = graphql;

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLString },
    data: { type: GraphQLString },
    like: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});
module.exports = CommentType;
