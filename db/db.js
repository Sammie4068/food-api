const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: "okoro",
  host: "localhost",
  database: "Foods",
  password: process.env.password,
  port: 5432,
});
client.connect().then(() => console.log("connected to database.."));
module.exports = client;
