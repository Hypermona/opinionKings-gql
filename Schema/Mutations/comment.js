const graphql = require("graphql");

const { Comment } = require("../../Models/post");

const CommentType = require("../Types/comment");

const { GraphQLString, GraphQLID } = graphql;

const MutationFields = {
  addComment: {
    type: CommentType,
    args: {
      postId: { type: GraphQLID },
      userId: { type: GraphQLID },
      data: { type: GraphQLString },
    },
    resolve(_, args) {
      const comment = new Comment({
        postId: args.postId,
        userId: args.userId,
        data: args.data,
      });
      return comment.save();
    },
  },
};
module.exports = MutationFields;
