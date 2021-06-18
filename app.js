const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const isAuth = require("./Middleware/isAuth");
const cors = require("cors");

const schema = require("./Schema/schema");

const app = express();
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/kings", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongodb kings....");
});

app.use(isAuth);

app.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Litening at http://localhost:4000/");
});
