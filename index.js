const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const logger = require("./middleware/logger");
const { ipRouter } = require("./routes/ip.route");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/api/user", userRouter);

app.use("/api/ip", ipRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
    logger.log("info", "connected database");
  } catch (err) {
    console.log(err.message);
    logger.log("error", "connection failed");
  }
  console.log("server running on port", process.env.PORT);
});
