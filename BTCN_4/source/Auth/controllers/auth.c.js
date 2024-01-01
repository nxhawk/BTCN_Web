const bcrypt = require("bcrypt");
const userM = require("../models/user.m");
const { generateToken, verifyToken } = require('../utils/token.u');

module.exports = {
  renderLoginPage: async (req, res, next) => {
    try {
      res.render("login", { isLogin: false })
    } catch (error) {
      next(error);
    }
  },
  renderRegisterPage: async (req, res, next) => {
    try {
      res.render("register", { isLogin: false });
    } catch (error) {
      next(error);
    }
  },
  handleRegister: async (req, res, next) => {
    try {
      const { username, password, fullname } = req.body;
      const user = await userM.getByUsername(username);

      if (user) return res.status(409).json({ success: false, message: 'Tên tài khoản đã tồn tại.' });

      const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

      const newUser = {
        username: username,
        password: hashPassword,
        fullname
      };

      const createUser = await userM.add(newUser);
      if (!createUser) {
        return res.status(400).json({
          success: false,
          message: "Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.",
        });
      }

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
  handleLogin: async (req, res, next) => {
    try {

      const { username, password, tokenLife, avatar } = req.body;
      const user = await userM.getByUsername(username);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại' })
      }
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Mật khẩu không chính xác." });
      }

      // all good
      const accessToken = await generateToken(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE,)

      if (!accessToken) {
        return res
          .status(401)
          .json({ message: "Đăng nhập không thành công, vui lòng thử lại.", success: false });
      }

      const refreshToken = await generateToken(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        tokenLife || process.env.REFRESH_TOKEN_LIFE,
      );

      await userM.updateToken(user.username, refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        Path: "/",
      });

      res.cookie("access", accessToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        Path: "/",
      });

      res.cookie("username", user.username, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        Path: "/",
      })

      await userM.updatePublicData(username, avatar);

      return res.json({
        success: true,
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  },
  handleLogout: async (req, res, next) => {
    try {
      const isLogin = !!req.cookies.jwt;
      if (isLogin) {
        res.clearCookie("jwt");
        res.clearCookie("access");
        res.clearCookie("username");
      }

      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
  getAllAvatar: async (req, res, next) => {
    try {
      const data = await userM.getAllAvatarPublic();
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
  checkAccessToken: async (req, res, next) => {
    try {
      //const accessToken = req.cookies.access;
      console.log(req.cookies);
      // if (!accessToken) {
      //   res.redirect("/auth/logout");
      // }
      // const verified = await verifyToken(
      //   accessToken,
      //   process.env.ACCESS_TOKEN_SECRET,
      // );

      // return res.json(verified)
      return res.json('ok')
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      if (req.cookie?.jwt) {
        const refreshToken = req.cookies.jwt;
        if (!refreshToken) {
          return res.status(400).json({ success: false, message: 'Không tìm thấy refresh token.' });
        }

        //have
        const verifyRefreshToken = await verifyToken(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );

        if (!verifyRefreshToken) {
          return res.status(400).json({ success: false, message: "Refresh token không hợp lệ." });
        }

        const username = verifyRefreshToken.payload.username;
        const user = await userM.getByUsername(username);
        if (!user) {
          return res.status(401).json({ message: "User không tồn tại.", success: false });
        }

        const accessToken = await generateToken(
          {
            username,
          },
          process.env.ACCESS_TOKEN_SECRET,
          process.env.ACCESS_TOKEN_LIFE,
        );
        if (!accessToken) {
          return res.status(400).json({
            success: false,
            message: "Tạo access token không thành công, vui lòng thử lại.",
          });
        }
        return res.json({
          accessToken,
          refreshToken
        });
      }

      return res.status(406).json({ success: false, message: "Unauthorized" });
    } catch (error) {
      next(error);
    }
  }
}