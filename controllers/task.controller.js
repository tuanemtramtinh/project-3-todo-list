const Task = require("../models/task.model");

module.exports.index = async (req, res) => {
  try {
    const status = req.query.status;
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    const sort = {};

    const find = {
      deleted: false,
    };

    if (status) {
      find.status = status;
    }

    if (sortKey && sortValue) {
      sort[sortKey] = sortValue;
    }

    let page = 1;
    let limit = 4;

    if (req.query.page) {
      page = parseInt(req.query.page);
    }

    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const skip = (page - 1) * limit;

    const keyword = req.query.keyword;

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      find.title = regex;
    }

    const tasks = await Task.find(find).sort(sort).skip(skip).limit(limit);

    res.json({
      statusCode: "success",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.query.status;

    const find = {
      _id: id,
      deleted: false,
    };

    if (status) {
      find.status = status;
    }

    const task = await Task.findOne(find);

    res.json({
      statusCode: "success",
      data: task,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const status = req.body.status;
    const ids = req.body.ids;

    if (ids.length > 0) {
      await Task.updateMany(
        {
          _id: { $in: ids },
          deleted: false,
        },
        {
          status: status,
        }
      );
      res.json({
        statusCode: "success",
        message: "Update status success",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    let timeStart = req.body.timeStart;
    const timeFinish = req.body.timeFinish;
    const listUser = req.body.listUser;
    const createdBy = req.user.id;

    if (!timeStart) {
      timeStart = new Date();
    }

    const data = {
      title,
      content,
      timeStart,
      timeFinish,
      createdBy,
      listUser,
    };

    const newTask = new Task(data);

    await newTask.save();

    res.json({
      statusCode: "success",
      message: "Create task successfully",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body);

    res.json({
      statusCode: "success",
      message: "Edit task success",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteMultiPatch = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (ids.length > 0) {
      await Task.updateMany(
        {
          _id: { $in: ids },
        },
        {
          deleted: true,
        }
      );

      res.json({
        statusCode: "success",
        message: "Delete successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
