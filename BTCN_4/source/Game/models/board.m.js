const readFileJSON = require("../utils/readFileJSON.u");
const writeFileJSON = require("../utils/writeFileJSON.u");

module.exports = {
  isPlaying: async (username) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      for (board of data.boards) {
        if ((board.player1 === username || board.player2 === username) && board.state < 1) return board.name;
      }
      return -1;
    } catch (error) {
      throw error;
    }
  },
  createNewBoard: async (time, size, admin) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      let name = 1;
      if (data.boards.length > 0)
        name = data.boards[data.boards.length - 1].name + 1;
      const newdata = {
        time: parseInt(time),
        size: parseInt(size),
        player1: admin,
        viewers: [],
        player2: "",
        state: -1,
        steps: [],
        start: "player1",
        now: 1,
        name
      }
      data.boards.push(newdata);
      await writeFileJSON("Game/data/board.json", data);
      return name;
    } catch (error) {
      throw error;
    }
  },
  getAllBoardPlaying: async () => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      data.boards = data.boards.filter(board => board.state <= 0);
      return data.boards;
    } catch (error) {
      throw error;
    }
  },
  getBoardByName: async (name) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      for (const board of data.boards) {
        if (board.name === parseInt(name)) {
          // get current color of player
          const users = await readFileJSON("Auth/data/user.json")
          for (const user of users.users) {
            if (user.username === board.player1) {
              board.color1 = user.color;
            } else if (user.username === board.player2) {
              board.color2 = user.color;
            }
          }
          //writeFileJSON("Game/data/board.json", data);
          return board;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  updatePlayer2: async (player2) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      for (const board of data.boards) {
        if (board.name === parseInt(player2.name) && board.state == -1 && board.player2.length === 0) {
          board.state = 0;
          board.player2 = player2.username;
          await writeFileJSON("Game/data/board.json", data);
          return board;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  updateBoard: async (br) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      for (const board of data.boards) {
        if (board.name === parseInt(br.name) && board.state == 0) {
          board.steps.push({
            "row": parseInt(br.row),
            "col": parseInt(br.col),
            "val": board.now
          })
          if (board.now == 1) board.now = 2;
          else board.now = 1;
          const users = await readFileJSON("Auth/data/user.json")
          for (const user of users.users) {
            if (user.username === board.player1) {
              board.color1 = user.color;
            } else if (user.username === board.player2) {
              board.color2 = user.color;
            }
          }
          await writeFileJSON("Game/data/board.json", data);
          return board;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  doneBoardGame: async (br) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      for (const board of data.boards) {
        if (board.name === parseInt(br.name)) {
          board.state = parseInt(br.state);
          await writeFileJSON("Game/data/board.json", data);
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  },
  invitePlayer: async (name, player2) => {
    try {
      const data = await readFileJSON("Game/data/board.json")
      // check if this player is playing
      for (const board of data.boards) {
        if (board.state == 0 && (board.player2 == player2 || board.player1 == player2)) return null;
      }
      // get infor player1
      for (const board of data.boards) {
        if (board.state <= 0 && board.name == parseInt(name)) return board.player1;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  getHistory: async (username) => {
    try {
      const data = await readFileJSON("Game/data/board.json")

      let response = [];
      for (const board of data.boards) {
        if (board.state > 0 && (board.player2 == username || board.player1 == username)) {
          response.push(board);
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
}