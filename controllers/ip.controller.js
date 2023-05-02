const { ipModel } = require("../models/ip.model");
const redisClient = require("../helpers/redis");
const { json } = require("express");

const getcitydata = async (req, res) => {
  try {
    const ipAddress = req.params.ip || process.env.ip_address;

    const cityCache = await redisClient.get(ipAddress);

    if (cityCache) return res.status(200).send({ currentLocation: cityCache });

    const cityApi = await fetch(`http://ip-api.com/json/${ipAddress}`).then(
      (res) => res.json()
    );

    await CityModel.findOneAndUpdate(
      { userId: req.body.userId },
      { userId: req.body.userId, $push: { searches: cityApi } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await redisClient.set(ipAddress, cityApi.city);
    await redisClient.expire(ipAddress, 60 * 60 * 6);

    res.status(200).send({ currentLocation: cityApi.city });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Something went wrong" });
  }
};

module.exports = { getcitydata };
