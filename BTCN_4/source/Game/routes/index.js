const http = require("http");
const userM = require("../models/user.m");
const boardM = require("../models/board.m");

function route(app) {

  app.get('/', async function (req, res, next) {
    try {
      const isLogin = !!req.cookies?.access;
      if (!isLogin) {
        return res.redirect('https://localhost:3003/auth/login');
      }
      const boards = await boardM.getAllBoardPlaying();
      const isPlaying = await boardM.isPlaying(req.cookies.username);
      return res.render('home', { isLogin, username: req.cookies.username, boards, isPlaying })
    } catch (error) {
      next(error);
    }
  })
  app.use('/auth', require('./auth.r'))
  app.use('/board', require('./board.r'))

  const server = http.createServer(app);

  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    socket.on("newlogin", async function (username) {
      const data = await userM.addNewLogin(username);

      io.emit("newlogin", data);
    });

    socket.on("logout", async function (username) {
      const data = await userM.Logout(username.username);
      io.emit("logout", data);
    });

    socket.on("newboard", async function (name) {
      const data = await boardM.getAllBoardPlaying();
      io.emit("newboard", data);
    });

    socket.on("message", async function (message) {
      io.emit("message", message.message);
    });

    socket.on("join", async function (data) {
      io.emit("join", data);
    })

    socket.on("reject", function (data) {
      io.emit("reject", data);
    })

    socket.on("rejectInvite", function (data) {
      io.emit("rejectInvite", data);
    })

    socket.on("play", async function (data) {
      const response = await boardM.updatePlayer2(data);
      if (response) io.emit("play", response);
    })

    socket.on('tick', async function (data) {
      const response = await boardM.updateBoard(data);
      if (response) io.emit("tick", response);
    })

    socket.on('donegame', async function (data) {
      const response = await boardM.doneBoardGame(data);
      if (response) io.emit("donegame", data);
    })

    socket.on('message-game', function (data) {
      io.emit("message-game", data);
    })

    socket.on('invite', async data => {
      io.emit("invite", data);
    })
  });

  const PORT = process.env.GAME_PORT;

  server.listen(PORT, () => console.log(`Server Game listening on port ${PORT}`));
}

module.exports = route;