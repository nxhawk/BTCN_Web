function route(app) {
  app.get('/', async function (req, res, next) {
    try {
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  });
  app.use('/auth', require('./auth.r'));
  app.use('/profile', require('./profile.r'));
}

module.exports = route;