const userM = require('../models/user.m');

module.exports = {
  renderProfilePage: async (req, res, next) => {
    try {
      const username = req.username;
      if (!username) {
        res.redirect('/auth/logout');
      }
      const user = await userM.getByUsername(username)
      const avatars = await userM.getAllAvatarPublic(user.avatar);

      user.password = null;

      res.render('profile', { isLogin: true, user, avatars })
    } catch (error) {
      next(error);
    }
  },
  handleProfile: async (req, res, next) => {
    try {
      if (req.body.fullname.trim().length == 0) {
        return res.json({ success: false, message: "Tên người dùng không được rỗng" });
      }
      if (req.body.nickname.trim().length == 0) {
        return res.json({ success: false, message: "Nickname không được rỗng" });
      }
      if (req.body.avatar.length == 0) {
        return res.json({ success: false, message: "Avatar không được rỗng" });
      }
      await userM.updateProfile(req.body);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}