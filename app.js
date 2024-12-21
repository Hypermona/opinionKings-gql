const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const isAuth = require("./Middleware/isAuth");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const schema = require("./Schema/schema");

const app = express();
app.use(
  cors({
    origin: ["http://192.168.20.4:3000","http://localhost:3000" ],
    credentials: true,
  })
);
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000", "http://192.168.20.4:3000"]);
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Acess-Control-Allow-Headers", "Content-Type", "Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: "5mb" }));
const mongoDbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@localhost:27017/${process.env.DB_NAME}?authSource=${"admin"}&w=1`;
// const mongoDbUrl  = 'mongodb://localhost:27017/fakeking'
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongodb kings...");
});

app.use(cookieParser());

app.use(isAuth);

app.use("/", (req, res) =>
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { req, res },
  })(req, res)
);

app.listen(4000, () => {
  console.log("Litening at http://localhost:4000/");
});
