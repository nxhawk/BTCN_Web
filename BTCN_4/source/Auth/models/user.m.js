const readFileJSON = require("../utils/readFileJSON.u");
const writeFileJSON = require("../utils/writeFileJSON.u");

module.exports = {
  getAllUser: async () => {
    try {
      const data = await readFileJSON('Auth/data/user.json');
      return data.users
    } catch (error) {
      throw error;
    }
  },
  getByUsername: async (username) => {
    try {
      const data = await readFileJSON('Auth/data/user.json');
      for (user of data.users) {
        if (user.username === username) return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  add: async (newUser) => {
    try {
      const data = await readFileJSON('Auth/data/user.json');
      newUser.avatar = `https://avatar.iran.liara.run/public/${data.users.length + 1}`;
      newUser.token = "";
      newUser.nickname = newUser.username;
      newUser.shareAvatar = "off";
      newUser.color = "#000000"
      data.users.push(newUser);
      writeFileJSON('Auth/data/user.json', data);
      return newUser;
    } catch (error) {
      throw error;
    }
  },
  updateToken: async (username, token) => {
    try {
      const data = await readFileJSON('Auth/data/user.json');
      for (const user of data.users) {
        if (user.username === username) {
          user.token = token;
          break;
        }
      }
      await writeFileJSON('Auth/data/user.json', data);
      return true;
    } catch (error) {
      return false;
    }
  },
  updatePublicData: async (username, avatar) => {
    try {
      const data = await readFileJSON('Auth/data/user.json');
      for (const user of data.users) {
        if (user.username === username) {
          user.shareAvatar = avatar || "off";
          break;
        }
      }
      await writeFileJSON('Auth/data/user.json', data);
    } catch (error) {
      throw error;
    }
  },
  getAllAvatarPublic: async (avatar) => {
    try {
      let data = await readFileJSON('Game/data/avatar.json');
      data = data.avatars;
      const data_auth = await readFileJSON('Auth/data/user.json');
      for (const user of data_auth.users) {
        if (user.shareAvatar === 'on' && !data.includes(user.avatar) && avatar != user.avatar) {
          data.push(user.avatar);
        }
      }
      return data
    } catch (error) {
      throw error;
    }
  },
  updateProfile: async (newInfo) => {
    try {
      let data = await readFileJSON('Auth/data/user.json');
      for (const user of data.users) {
        if (user.username === newInfo.username) {
          user.nickname = newInfo.nickname;
          user.fullname = newInfo.fullname;
          user.avatar = newInfo.avatar;
          user.color = newInfo.color;

          await writeFileJSON('Auth/data/user.json', data);
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}