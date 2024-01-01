const readFileJSON = require("../utils/readFileJSON.u");
const writeFileJSON = require("../utils/writeFileJSON.u");

module.exports = {
  checkIsLogin: async (username) => {
    try {
      const data = await readFileJSON("Game/data/userOnline.json");
      for (user of data.users) {
        if (user.username === username) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  },
  addNewLogin: async (username) => {
    try {
      const data = await readFileJSON("Game/data/userOnline.json");
      for (user of data.users) {
        if (user.username === username.username) {
          return data.users;
        }
      }
      data.users.push(username);
      await writeFileJSON('Game/data/userOnline.json', data);
      return data.users;
    } catch (error) {
      throw error;
    }
  },
  Logout: async (username) => {
    try {
      const data = await readFileJSON("Game/data/userOnline.json");
      data.users = data.users.filter(user => user.username != username)

      await writeFileJSON('Game/data/userOnline.json', data);
      return data.users;
    } catch (error) {
      throw error;
    }
  }
}