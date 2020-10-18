var express = require("express");
var router = express.Router();

const { extractValidFields } = require("../../lib/util");
const {
  checkExistByField,
  add,
  list,
  getSymptom,
  updateSymptom,
  deleteById,
  SymptomSchema,
} = require("../../model/veterinary/symptom");

/**
 * symptom type list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let symptoms = await list(id);
    res.render("veterinary/symptom/index", {
      vid: id,
      vemail: req.session.vemail,
      symptoms: symptoms,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * check whether the symptom name exist
 */
router.get("/exists.json/:name", async (req, res) => {
  let name = req.params.name;
  let symptom = await checkExistByField("name", name);
  if (symptom) {
    res.json({
      code: 500,
      msg: `The symptom name(${name}) has exist!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});

/**
 * symptom add page
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    res.render("veterinary/symptom/add", {
      vid: id,
      vemail: req.session.vemail,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * symptom form submit
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let symptomSchema = extractValidFields(req.body, SymptomSchema);
    let recorderId = parseInt(symptomSchema.recorder_id);
    console.log(id, symptomSchema.recorder_id);
    if (recorderId && id === recorderId) {
      let result = await add(symptomSchema);
      if (result) {
        res.redirect("/veterinary/symptom/index.html");
      } else {
        res.json({
          code: 500,
          msg: "Add symptom failure!",
        });
      }
    } else {
      res.redirect("/veterinary/login.html");
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * symptom edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let sid = req.params.id;
    let symptom = await getSymptom(sid);
    if (symptom) {
      res.render("veterinary/symptom/edit", {
        vid: id,
        vemail: req.session.vemail,
        symptom: symptom,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the symptom with the id: ${sid}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * symptom submit page
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let sid = req.body.sid;
    let symptom = await getSymptom(sid);
    if (symptom) {
      const { name, duration, frequency } = req.body;
      let result = await updateSymptom(sid, {
        name: name,
        duration: duration,
        frequency: frequency,
      });
      if (result) {
        res.redirect("/veterinary/symptom/index.html");
      }
    } else {
      res.json({
        code: 400,
        msg: `Not found the symptom with the id: ${sid}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * delete symptom
 */
router.get("/delete.html/:id", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let sid = req.params.id;
    let symptom = await getSymptom(sid);
    if (symptom) {
      let result = await deleteById(sid);
      if (result) {
        res.redirect("/veterinary/symptom/index.html");
      }
    } else {
      res.json({
        code: 404,
        msg: `Not found the symptom with the id: ${sid}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

module.exports = router;
