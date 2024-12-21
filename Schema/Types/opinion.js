const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLList, GraphQLID } =
  graphql;

const OpinionType = new GraphQLObjectType({
  name: "Opinion",
  fields: {
    label: { type: GraphQLString },
    value: { type: GraphQLString },
    selectedBy: { type: new GraphQLList(GraphQLID) },
  },
});

const OpinionInputType = new GraphQLInputObjectType({
  name: "OpinionsInput",
  fields: {
    label: { type: GraphQLString },
    value: { type: GraphQLString },
    selectedBy: { type: new GraphQLList(GraphQLID) },
  },
}); 

module.exports = { OpinionType, OpinionInputType };