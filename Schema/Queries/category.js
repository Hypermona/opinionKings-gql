const graphql = require("graphql");

const Category = require("../../Models/category");

const CategoryType = require("../Types/category");

const { GraphQLString, GraphQLList } = graphql;

const QueryFields = {
  category: {
    type: CategoryType,
    args: {
      id: { type: GraphQLString },
    },
    resolve(_, args) {
      return Category.findById(args.id);
    },
  },

  categories: {
    type: new GraphQLList(CategoryType),
    resolve() {
      return Category.find({});
    },
  },
};
module.exports = QueryFields;
