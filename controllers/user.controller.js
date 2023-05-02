const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const redisClient = require("../helpers/redis");

const signup = async (req, res) => {
  try {
    const { name, email, password, ip_address } = req.body;
    const isuserPresent = await User.findOne({ email });

    if (isuserPresent) return res.send("user already present , login please");

    const hash = await bcrypt.hash(password, 8);

    const newUser = new User({ name, email, password: hash, ip_address });
    await newUser.save();

    res.send("Signup successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isuserPresent = await User.findOne({ email });
    if (!isuserPresent) return res.send("User Not present, register Pls");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isuserPresent.password
    );
    if (!isPasswordCorrect) return res.send("Wrong Credential");
    const token = await jwt.sign(
      {
        userId: isuserPresent._id,
        ip_address: isuserPresent.ip_address,
      },
      process.env.JWT_SECRET,
      { expireIn: "1hr" }
    );
    res.send({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(403);

    await redisClient.set(token, token);
    res.send("Logout Successful");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { signup, login, logout };
