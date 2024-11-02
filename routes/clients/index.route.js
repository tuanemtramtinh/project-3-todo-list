const tasksRoute = require("./task.route");
const userRoute = require("./user.route");

module.exports = (app) => {

  app.use("/users", userRoute);
  app.use("/tasks", tasksRoute);
};
