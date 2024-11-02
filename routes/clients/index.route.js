const tasksRoute = require("./task.route");
const userRoute = require("./user.route");
const userMiddleware = require("../../middlewares/user.middlewares");

module.exports = (app) => {
  app.use("/users", userRoute);
  app.use("/tasks", userMiddleware.requireAuth, tasksRoute);
};
