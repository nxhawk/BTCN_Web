const userM = require("../models/user.m");
const categoryM = require("../models/categories.m");
const productM = require("../models/product.m");

module.exports = {
  render: async (req, res, next) => {
    try {
      const categoryList = await categoryM.getAll();
      const productList = await productM.getAll();
      res.render("home", { categoryList, productList, btn_display: "none" });
    } catch (error) {
      next(error);
    }
  },
};
