const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: async (payload, secretKey, tokenLife) => {
    try {
      return await jwt.sign({ payload }, secretKey, {
        expiresIn: tokenLife,
        algorithm: "HS256",
      })
    } catch (error) {
      throw error;
    }
  },
  verifyToken: async (token, secretKey) => {
    try {
      return await jwt.verify(token, secretKey);
    } catch (error) {
      throw error;
    }
  }
}