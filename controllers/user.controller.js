const md5 = require("md5");
const User = require("../models/user.model");
const generateHelper = require("../helpers/generate.helper");
const sendMailHelper = require("../helpers/sendMail.helper");
const ForgotPassword = require("../models/forgot-password.model");

module.exports.registerPost = async (req, res) => {
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

module.exports.loginPost = async (req, res) => {
  try {
    const emaiil = req.body.email;
    const password = req.body.password;
    const encryptPassword = md5(password);

    const existUser = await User.findOne({
      email: emaiil,
    });

    if (!existUser) {
      res.json({
        statusCode: "error",
        message: "Tài khoản không tồn tại",
      });
      return;
    }

    if (encryptPassword !== existUser.password) {
      res.json({
        statusCode: "error",
        message: "Mật khẩu không đúng",
      });
    }

    res.json({
      statusCode: "success",
      message: "Đăng nhập thành công",
      token: existUser.token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const existUser = User.findOne({
      email: email,
    });

    if (!existUser) {
      res.json({
        statusCode: "error",
        message: "Không tồn tại tài khoản này",
      });
      return;
    }

    const existUserInForgotPassword = await ForgotPassword.findOne({
      email: email,
    });

    if (!existUserInForgotPassword) {
      const otp = generateHelper.generateRandomNumber(6);

      const data = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 5 * 60 * 1000,
      };

      await ForgotPassword.create(data);

      const subject = "Xác thực mã OTP";
      const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
      sendMailHelper.sendMail(email, subject, text);
    }

    res.json({
      code: "success",
      message: "Gửi mã OTP thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.otp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    const existRecord = await ForgotPassword.findOne({
      email: email,
      otp: otp,
    });

    if (!existRecord) {
      res.json({
        statusCode: "error",
        message: "Mã OTP không hợp lệ",
      });
      return;
    }

    const existUser = await User.findOne({
      email: email,
    });

    res.json({
      statusCode: "success",
      message: "Mã OTP hợp lệ",
      token: existUser.token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      res.json({
        statusCode: "error",
        message: "Vui lòng gửi kèm theo token",
      });
      return;
    }

    const token = req.headers.authorization.split(" ")[1] || undefined;
    const newPassword = req.body.password;
    const encryptedNewPassword = md5(newPassword);
    if (!token) {
      res.json({
        statusCode: "error",
        message: "Người dùng chưa được xác thực",
      });
      return;
    }

    const existUser = await User.findOne({
      token: token,
    });

    if (!existUser) {
      res.json({
        statusCode: "error",
        message: "Không tồn tại người dùng",
      });
      return;
    }

    await User.updateOne(
      {
        token: token,
        deleted: false,
      },
      {
        password: encryptedNewPassword,
      }
    );

    res.json({
      statusCode: "success",
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.profile = (req, res) => {
  try {
    res.json({
      statusCode: "success",
      message: "Thành công",
      data: {
        id: req.user.id,
        fullName: req.user.fullName,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
