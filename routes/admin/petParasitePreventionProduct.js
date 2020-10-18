var express = require("express");
var router = express.Router();
const { extractValidFields } = require("../../lib/util");
const {
  checkExistByField,
  add,
  list,
  getById,
  update,
  deleteById,
  queryByName,
  PetParsitePrevetionProductSchema,
} = require("../../model/admin/petParsitePrevetionProduct");

/**
 * pet parasite prevention products list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let name = req.query.q;
    let petParasitePreventionProducts = null;
    if (!name) {
        petParasitePreventionProducts = await list();
    } else {
        petParasitePreventionProducts = await queryByName(name);
    }
    res.render("admin/parasite_prevention/index", {
      aid: id,
      ausername: req.session.ausername,
      petParasitePreventionProducts: petParasitePreventionProducts,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * check whether the pet parasite prevention product name exist
 */
router.get("/exists.json/:name", async (req, res) => {
  let name = req.params.name;
  let petParasitePreventionProduct = await checkExistByField("name", name);
  if (petParasitePreventionProduct) {
    res.json({
      code: 500,
      msg: `The pet parasite prvention product name(${name}) has exist!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});

/**
 * pet parasite prevention product add page
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    res.render("admin/parasite_prevention/add", {
      aid: id,
      ausername: req.session.ausername,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet parasite prevention product form submit
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let productSchema = extractValidFields(req.body, PetParsitePrevetionProductSchema);
    let result = await add(productSchema);
    if (result) {
      res.redirect("/admin/pet_parasite_prevention_product/index.html");
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet parasite prevention product edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let pid = req.params.id;
    let product = await getById(pid);
    if (product) {
      res.render("admin/parasite_prevention/edit", {
        aid: id,
        ausername: req.session.ausername,
        product: product,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet parasite prvention product information with the id: ${pid}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet parasite prevention product edit submit page
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let pid = req.body.pid;
    let product = await getById(pid);
    if (product) {
      let result = await update(pid, {
        name: req.body.name,
        description: req.body.description,
      });
      if (result) {
        res.redirect("/admin/pet_parasite_prevention_product/index.html");
      }
    } else {
      res.json({
        code: 400,
        msg: `Not found the pet parasite prevention product with the id: ${pid}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * pet parasite prevention product delete page
 */
router.get("/delete.html/:id", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let id = req.params.id;
    let product = await getById(id);
    if (product) {
      let result = await deleteById(id);
      if (result) {
        res.redirect("/admin/pet_parasite_prevention_product/index.html");
      }
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet parasite prevention product with the id: ${id}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

module.exports = router;
