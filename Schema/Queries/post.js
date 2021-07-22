const graphql = require("graphql");

const { Post } = require("../../Models/post");

const PostType = require("../Types/post");

const { GraphQLID, GraphQLList } = graphql;

const QueryFields = {
  post: {
    type: PostType,
    args: {
      id: { type: GraphQLID },
    },
    resolve(_, args) {
      return Post.findById(args.id);
    },
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve(_, __) {
      return Post.find({});
    },
  },
};
module.exports = QueryFields;
