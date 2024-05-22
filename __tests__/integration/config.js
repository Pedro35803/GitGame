const dotenv = require("dotenv");
dotenv.config();

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const port = process.env.PORT || 3000;
const baseURL = `http://localhost:${port}`;

module.exports = {
  baseURL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
