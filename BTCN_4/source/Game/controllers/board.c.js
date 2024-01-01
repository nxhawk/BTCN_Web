const boardM = require('../models/board.m')

module.exports = {
  handleCreateBoard: async (req, res, next) => {
    try {
      if (!req.cookies?.username) return res.redirect('/auth/logout');
      const { time, size } = req.body
      const username = req.cookies.username
      const isPlaying = await boardM.isPlaying(username);
      if (isPlaying != -1) {
        return res.json(isPlaying);
      }
      const newboard = await boardM.createNewBoard(time, size, username);
      return res.json(newboard);
    } catch (error) {
      next(error);
    }
  },
  renderBoardPage: async (req, res, next) => {
    try {
      const isLogin = !!req.cookies.access;
      if (!isLogin) {
        return res.redirect('/auth/logout');
      }

      const name = req.params.id;
      const board = await boardM.getBoardByName(name);
      const username = req.cookies.username
      if (!board) return res.redirect('/');
      return res.render('board', { isLogin, username, name });
    } catch (error) {
      next(error);
    }
  },
  getInforPlayingBoard: async (req, res, next) => {
    try {
      const name = req.params.id;
      const username = req.cookies.username
      const board = await boardM.getBoardByName(name);
      if (!board) return res.redirect('/');
      return res.json({ board, username });
    } catch (error) {
      next(error)
    }
  },
  handleInvitePlayer: async (req, res, next) => {
    try {
      const { name, player } = req.params;
      const response = await boardM.invitePlayer(name, player);
      res.json(response);
    } catch (error) {
      next(error)
    }
  },
  renderHistoryPage: async function (req, res, next) {
    try {
      const isLogin = !!req.cookies.access;
      if (!isLogin) {
        return res.redirect('/auth/logout');
      }
      const isPlaying = await boardM.isPlaying(req.cookies.username);
      const boards = await boardM.getHistory(req.cookies.username);
      res.render('history', { isLogin: true, isPlaying, username: req.cookies.username, boards });
    } catch (error) {
      next(error)
    }
  },
  renderHistoryDetailPage: async function (req, res, next) {
    try {
      const isLogin = !!req.cookies.access;
      const name = req.params.name
      if (!isLogin) {
        return res.redirect('/auth/logout');
      }
      const isPlaying = await boardM.isPlaying(req.cookies.username);
      const board = await boardM.getBoardByName(name);
      if (!board) {
        return res.redirect('/');
      }
      res.render('detailBoard', { isLogin: true, isPlaying, username: req.cookies.username, board });
    } catch (error) {
      throw error;
    }
  }
}