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
  MedicationTypeSchema,
} = require("../../model/admin/medicationType");

/**
 * medication type list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let name = req.query.q;
    let medicationTypes = null;
    if (!name) {
      medicationTypes = await list();
    } else {
      medicationTypes = await queryByName(name);
    }
    res.render("admin/medication_type/index", {
      aid: id,
      ausername: req.session.ausername,
      medicationTypes: medicationTypes,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * check whether the medication type name exist
 */
router.get("/exists.json/:name", async (req, res) => {
  let name = req.params.name;
  let medicationType = await checkExistByField("name", name);
  if (medicationType) {
    res.json({
      code: 500,
      msg: `The medication type name(${name}) has exist!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});

/**
 * pet medicaiton type add page
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    res.render("admin/medication_type/add", {
      aid: id,
      ausername: req.session.ausername,
    });
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * medication type form submit
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let medicationTypeSchema = extractValidFields(
      req.body,
      MedicationTypeSchema
    );
    let result = await add(medicationTypeSchema);
    if (result) {
      res.redirect("/admin/medication_type/index.html");
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * medication type edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let mid = req.params.id;
    let medicationType = await getById(mid);
    console.log(medicationType);
    if (medicationType) {
      res.render("admin/medication_type/edit", {
        aid: id,
        ausername: req.session.ausername,
        medicationType: medicationType,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the medication type information with the id: ${mid}`,
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
    let mid = req.body.mid;
    let medicationType = await getById(mid);
    if (medicationType) {
      let result = await update(mid, {
        name: req.body.name,
        description: req.body.description,
      });
      if (result) {
        res.redirect("/admin/medication_type/index.html");
      }
    } else {
      res.json({
        code: 400,
        msg: `Not found the medication type with the id: ${mid}`,
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
    let mid = req.params.id;
    let medicationType = await getById(mid);
    if (medicationType) {
      let result = await deleteById(mid);
      if (result) {
        res.redirect("/admin/medication_type/index.html");
      }
    } else {
      res.json({
        code: 404,
        msg: `Not found the medication type with the id: ${mid}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

module.exports = router;
