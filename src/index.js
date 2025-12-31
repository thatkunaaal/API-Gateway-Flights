const express = require("express");
const { ServerConfig } = require("./config");

const app = express();
const apiRoutes = require("./routes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Server is up and running on port: ${ServerConfig.PORT}`);
});
