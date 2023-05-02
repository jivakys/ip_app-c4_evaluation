const redisClient = require("../helpers/redis");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const jwtToken = req.headers?.authorization?.split(" ")[1];
    if (!jwtToken) return res.status(400).send("please Login again");

    const isValidToken = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    if (!isValidToken) return res.send("acess denied");

    const istokenBlacklisted = await redisClient.get(jwtToken);

    if (istokenBlacklisted) return res.send("Unauthorized");
    req.body.userId = isValidToken.userId;
    req.body.ip_address = isValidToken.ip_address;

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { auth };
