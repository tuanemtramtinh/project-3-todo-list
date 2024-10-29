const Task = require("../models/task.model");

module.exports.index = async (req, res) => {
  try {
    const tasks = await Task.find({
      deleted: false,
    });

    res.json(tasks);
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });

    res.json(task);
  } catch (error) {
    console.log(error);
  }
};
