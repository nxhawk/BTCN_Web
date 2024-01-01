const { verifyToken } = require('../utils/token.u');

exports.isAuth = async (req, res, next) => {
  try {
    let verified = !!req.cookies.jwt;

    if (!verified) {
      return res.redirect('/auth/login')
    }
    const accessToken = req.cookies.access
    verified = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    req.username = verified.payload.username;
    return next();

  } catch (error) {
    return res.redirect('/auth/login')
  }
};