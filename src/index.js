const express = require("express");
const { ServerConfig } = require("./config");
const { rateLimit } = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const { UserMiddleware } = require("./middleware");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});

app.use(cookieParser());
app.use(limiter);

app.use(
  "/bookingService",
  UserMiddleware.checkAuth,
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/bookingService": "/" },
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("user", JSON.stringify(req.user.dataValues));
      },
    },
  })
);

app.use(
  "/flightService",
  UserMiddleware.checkAuth,
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/flightService": "/" },
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader("user", JSON.stringify(req.user.dataValues));
      },
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is up and running on port: ${ServerConfig.PORT}`);
});
