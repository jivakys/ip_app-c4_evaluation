const express = require("express");
const { getcitydata } = require("../controllers/ip.controller");
const { valid } = require("../middleware/validator");
const ipRouter = express.Router();

ipRouter.get("/getCitybyIp/:ip", valid, getcitydata);

module.exports = { ipRouter };
