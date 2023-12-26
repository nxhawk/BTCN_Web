let messages = [];
module.exports = {
  renderPage: async (req, res, next) => {
    try {
      return res.render("chat");
    } catch (error) {
      next(error);
    }
  },
  postMessage: async (req, res, next) => {
    try {
      let message = req.body.message;
      messages.push(message);
      res.json(true);
    } catch (error) {
      next(error);
    }
  },
  getMessage: async (req, res, next) => {
    try {
      return res.json({ messages });
    } catch (error) {
      next(error);
    }
  },
};
