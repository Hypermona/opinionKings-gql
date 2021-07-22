const graphql = require("graphql");

const Category = require("../../Models/category");

const CategoryType = require("../Types/category");

const { GraphQLString } = graphql;

const MutationFields = {
  addCategory: {
    type: CategoryType,
    args: {
      name: { type: GraphQLString },
    },
    resolve(_, args) {
      const category = new Category({
        name: args.name,
      });
      return category.save();
    },
  },
};
module.exports = MutationFields;
