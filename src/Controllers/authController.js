import { privateKey } from "../Middlewares/auth.js";
import { User } from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

const authController = {
  signup: async (req, res, next) => {
    try {
      const { email } = req.body;

      // Kiểm tra tính hợp lệ của dữ liệu đầu vào
      if (!email || !validator.isEmail(email)) {
        return res
          .status(400)
          .json({ error: "Please provide a valid email address" });
      }

      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      // Tạo người dùng mới
      const user = await User.create(req.body);

      // Trả về phản hồi thành công
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      // Xử lý lỗi và chuyển tiếp nếu cần
      next(error);
    }
  },

  sendTokenResponse: async (user, codeStatus, res) => {
    try {
      // Ký token bằng key private
      const token = jwt.sign({ _id: user._id }, privateKey);

      // Đảm bảo rằng token đã được ký thành công trước khi tiếp tục
      if (!token) {
        throw new Error("Failed to generate token");
      }

      // Thiết lập cookie và gửi phản hồi cho client
      return res
        .status(codeStatus)
        .cookie("token", token, { maxAge: 600 * 600 * 1000, httpOnly: true })
        .json({ success: true, token, user });
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  signin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Validation
      if (!email) {
        return res.status(400).json({ error: "Please provide an email" });
      }
      if (!password) {
        return res.status(400).json({ error: "Please provide a password" });
      }

      // Check user email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      // Check password
      const isMatched = await user.comparePassword(password);
      if (!isMatched) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Gửi token nếu thông tin xác thực hợp lệ
      await authController.sendTokenResponse(user, 200, res);
    } catch (error) {
      next(error);
    }
  },

  // log out
  logout(req, res, next) {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "logged out",
    });
  },

  // user profile
  userProfile: async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  },
};

export default authController;
