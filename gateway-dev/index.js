const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const {env} = require('./config');

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: env.USER_SERVICE_URL,
    secure: false,
    pathRewrite: {
      "^/api/auth": "",
    },
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
