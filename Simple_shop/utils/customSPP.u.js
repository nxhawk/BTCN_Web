const { Strategy } = require("passport-strategy");
const passport = require("passport");

module.exports = class MyStrategy extends Strategy {
  constructor(verify, options) {
    super();
    this.name = "myS";
    this.verify = verify;
    this.userNameField =
      options && options.username ? options.username : "username";
    this.passwordField =
      options && options.password ? options.password : "password";
    passport.strategies[this.name] = this;
  }
  authenticate(req, options) {
    const username = req.body[this.userNameField];
    const password = req.body[this.passwordField];
    this.verify(username, password, (err, user) => {
      if (err) {
        return this.fail(err);
      }
      if (!user) {
        return this.fail("invalid auth");
      }
      this.success(user);
    });
  }
};
