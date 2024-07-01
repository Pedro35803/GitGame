const dotenv = require("dotenv");
dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}`;

module.exports = {
  id: "edade002-5e6a-4555-963b-8f70a8c680dd",
  baseURL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
