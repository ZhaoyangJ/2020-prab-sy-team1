var express = require("express");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../../lib/util");
const {
  PetCategorySchema,
  checkExistByField,
  add,
  list,
  getById,
  updatePetCategory,
  deleteById,
  queryByPname,
} = require("../../model/admin/petCategory");

/**
 * pet categort search
 */
router.post("/search.html", async (req, res) => {
    let pName = req.body.pCategoryName;
    let petCategories = null;
    if (pName) {
        petCategories = await queryByPname(pName);
    } else {
        petCategories = list();
    }
    // console.log("pet categories are: ", petCategories);
    res.render("admin/category/index", {
      aid: req.session.aid,
      ausername: req.session.ausername,
      petCategories: petCategories,
    });
});

/**
 * pet category list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let petCategories = await list();
    res.render("admin/category/index", {
      aid: id,
      ausername: req.session.ausername,
      petCategories: petCategories,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * check whether the category name exist
 */
router.get("/exists.json/:categoryName", async (req, res) => {
  let categoryName = req.params.categoryName;
  let petCategory = await checkExistByField("name", categoryName);
  if (petCategory) {
    res.json({
      code: 500,
      msg: `The category name(${categoryName}) has exist!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});

/**
 * pet category add page
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    res.render("admin/category/add", {
      aid: id,
      ausername: req.session.ausername,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet category form submit
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let petCategorySchema = extractValidFields(req.body, PetCategorySchema);
    let result = await add(petCategorySchema);
    if (result) {
      res.redirect("/admin/category/index.html");
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet category edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let pid = req.params.id;
    let petCategory = await getById(pid);
    if (petCategory) {
      res.render("admin/category/edit", {
        aid: id,
        ausername: req.session.ausername,
        petCategory: petCategory,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet category information with the id: ${pid}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet category edit submit page
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let pid = req.body.pid;
    let petCategory = await getById(pid);
    if (petCategory) {
      let result = await updatePetCategory(pid, {
        name: req.body.name,
        description: req.body.description,
      });
      if (result) {
        res.redirect("/admin/category/index.html");
      }
    } else {
      res.json({
        code: 400,
        msg: `Not found the pet category information with the id: ${pid}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet category delete page
 */
router.get("/delete.html/:id", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let petCategoryId = req.params.id;
    let petCategory = await getById(petCategoryId);
    if (petCategory) {
      let result = await deleteById(petCategoryId);
      if (result) {
        res.redirect("/admin/category/index.html");
      }
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet category with the id: ${petCategoryId}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

module.exports = router;
