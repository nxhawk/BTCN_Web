const catM = require("../models/categories.m");
const productM = require("../models/product.m");

module.exports = {
  addCategory: async (req, res, next) => {
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
      const categoryList = await catM.getAll();
      const { CatID } = req.params;
      const productList = await productM.getByCatID(CatID);
      let CatName = "";
      categoryList.map((category) => {
        if (CatName === "" && category.CatID == CatID)
          CatName = category.CatName;
      });

      res.render("home", {
        categoryList,
        productList,
        CatName,
        CatID,
        btn_display: "inline",
      });
    } catch (error) {
      next(error);
    }
  },
  updateCategory: async (req, res, next) => {
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
  deleteCategory: async (req, res, next) => {
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
