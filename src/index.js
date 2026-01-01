const express = require("express");
const { ServerConfig } = require("./config");
const { rateLimit } = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

app.use(
  "/bookingsService",
  createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true,
    pathRewrite: { "^/bookingsService": "/" },
  })
);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is up and running on port: ${ServerConfig.PORT}`);
});
