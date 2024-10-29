const express = require("express");
const databaseConfig = require("./configs/database.config");
const routeClient = require("./routes/clients/index.route");
require("dotenv").config;

databaseConfig.connect();

const app = express();

routeClient(app);

app.listen(process.env.PORT, () => {
  console.log(`Server đang lắng nghe trên cổng ${process.env.PORT}`);
});
