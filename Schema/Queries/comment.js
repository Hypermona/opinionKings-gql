const graphql = require("graphql");

const { Comment } = require("../../Models/post");

const CommentType = require("../Types/comment");

const { GraphQLString, GraphQLID, GraphQLList } = graphql;

const QueryFields = {
  comment: {
    type: CommentType,
    args: {
      id: { type: GraphQLString },
    },
    resolve(_, args) {
      return Comment.findById(args.id);
    },
  },

  comments: {
    type: new GraphQLList(CommentType),
    args: { postId: { type: GraphQLID } },
    resolve(_, args) {
      return Comment.find({ postId: args.postId });
    },
  },
};
module.exports = QueryFields;
