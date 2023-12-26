const catM = require("../models/categories.m");
const productM = require("../models/product.m");
const path = require("path");
const fs = require("fs");

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
  addProduct: async (req, res, next) => {
    try {
      var proID = 0;
      productM.getNewProID().then((rs) => {
        proID = rs;
        const dir = path.resolve("./public/imgs/pid/" + rs);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const multer = require("multer");
        const storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, "./public/imgs/pid/" + proID);
          },
          filename: function (req, file, cb) {
            cb(null, "main.jpg");
          },
        });
        const upload = multer({ storage: storage }).single("File");
        upload(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            console.log(err);
          } else if (err) {
            // An unknown error occurred when uploading.
            console.log(err);
          }

          // Everything went fine.
          var CatID = req.params.CatID;
          var data = req.body;
          productM.add(CatID, data).then(() => {
            setTimeout(function () {
              res.redirect("/category/" + CatID);
            }, 3000);
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },
};
