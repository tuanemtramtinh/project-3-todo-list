const md5 = require("md5");
const User = require("../models/user.model");
const generateHelper = require("../helpers/generate.helper");

module.exports.register = async (req, res) => {
  try {

    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = md5(req.body.password);
    const token = generateHelper.generateRandomString(20);

    const existUser = await User.findOne({
      email: email,
    });


    if (existUser) {
      res.json({
        statusCode: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
      return;
    }

    const newUser = new User({
      fullName,
      email,
      password,
      token: token,
    });

    await newUser.save();

    res.json({
      statusCode: "success",
      message: "Đăng ký thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
  }
};
