const app = require("express");
const router = app.Router();

const boardController = require('../controllers/board.c')
router.post('/create', boardController.handleCreateBoard)
router.get("/history", boardController.renderHistoryPage)
router.get("/history/:name", boardController.renderHistoryDetailPage)
router.get('/:id', boardController.renderBoardPage)
router.post('/:id', boardController.getInforPlayingBoard)
router.post('/:name/:player', boardController.handleInvitePlayer)

module.exports = router;