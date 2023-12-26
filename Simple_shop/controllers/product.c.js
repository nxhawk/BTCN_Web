const catM = require("../models/categories.m");
const productM = require("../models/product.m");
const path = require("path");
const fs = require("fs");

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
      const { ProductID } = req.params;
      const data = await productM.getByID(ProductID);
      const Cat = await catM.getByID(data[0].CatID);
      if (Cat[0] === undefined) {
        data[0].Category = "Uncategorized - Chưa được phân loại";
      } else {
        data[0].Category = Cat[0].CatName;
      }

      const rs = await catM.getAll();
      var clist = rs.map((item) => {
        return { CatID: item.CatID, CatName: item.CatName };
      });

      res.render("DetailProduct", {
        data: data[0],
        cclist: clist.filter(function (item) {
          return item.CatID != data[0].CatID;
        }),
      });
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      var { ProductID } = req.params;
      const dir = path.resolve("./public/imgs/pid/" + ProductID);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const multer = require("multer");
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "./public/imgs/pid/" + ProductID);
        },
        filename: function (req, file, cb) {
          cb(null, "main.jpg");
        },
      });
      const upload = multer({ storage: storage }).single("FileE");
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log(err);
        } else if (err) {
          // An unknown error occurred when uploading.
          console.log(err);
        }
        // Everything went fine.
        var data = req.body;
        productM.update(ProductID, data).then(() => {
          setTimeout(function () {
            res.redirect("/product/" + ProductID);
          }, 3000);
        });
      });
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      var { ProductID } = req.params;
      productM.delete(ProductID).then((rs) => {
        if (rs.length > 0) {
          const dir = path.resolve("./public/imgs/pid/" + rs[0].ProID);
          if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
          }
        }
        setTimeout(function () {
          res.redirect("/");
        }, 2000);
      });
    } catch (error) {
      next(error);
    }
  },
};
