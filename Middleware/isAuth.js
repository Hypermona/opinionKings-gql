const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decodedToken);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.id = decodedToken.id;
    return next();
  } catch (err) {
    console.log("decoded", " decodedToken");
    req.isAuth = false;
    return next();
  }
};
