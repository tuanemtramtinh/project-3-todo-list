const express = require("express");
const databaseConfig = require("./configs/database.config");
const routeClient = require("./routes/clients/index.route");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config;

databaseConfig.connect();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routeClient(app);

app.listen(process.env.PORT, () => {
  console.log(`Server đang lắng nghe trên cổng ${process.env.PORT}`);
});
