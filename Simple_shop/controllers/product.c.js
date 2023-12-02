const catM = require("../models/categories.m");
const productM = require("../models/product.m");

module.exports = {
  addProduct: async (req, res, next) => {
    try {
      catM.add(req.body.CatName).then(() => {
        setTimeout(function () {
          res.redirect("/");
        }, 1000);
      });
    } catch (error) {
      next(error);
    }
  },
  render: async (req, res, next) => {
    try {
      const { ProID } = req.params;
      const data = await productM.getByID(proID);
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const { CatID } = req.params;
      const { CatName } = req.body;
      catM.update(CatID, CatName).then(() => {
        console.log("hell");
        setTimeout(function () {
          res.redirect("/category/" + CatID);
        }, 1000);
      });
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const { CatID } = req.params;
      catM.delete(CatID).then(() => {
        setTimeout(function () {
          res.redirect("/");
        }, 1000);
      });
    } catch (error) {
      next(error);
    }
  },
};
