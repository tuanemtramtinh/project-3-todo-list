const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      res.json({
        statusCode: "error",
        message: "Vui lòng gửi kèm theo token",
      });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const existUser = await User.findOne({
      token: token,
      deleted: false,
    });

    if (!existUser) {
      res.json({
        statusCode: "error",
        message: "Token không hợp lệ!",
      });
      return;
    }

    req.user = existUser;

    next();
  } catch (error) {
    console.log(error);
  }
};
