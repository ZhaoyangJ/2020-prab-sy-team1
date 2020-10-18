var express = require("express");
var router = express.Router();

const { extractValidFields } = require("../../lib/util");
const {
  checkExistByField,
  add,
  list,
  getDiagnosing,
  updateDiagnosing,
  deleteById,
  getDiagnosingBySymptom,
  DiagnosingSchema,
} = require("../../model/veterinary/diagnosing");

const {
  listAllNotInDiagnosing
} = require("../../model/veterinary/symptom");

/**
 * diagnosing type list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let diagnosings = await list(id);
    res.render("veterinary/diagnosing/index", {
      vid: id,
      vemail: req.session.vemail,
      diagnosings: diagnosings,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * check whether the diagnosing name exist
 */
router.get("/exists.json/:name", async (req, res) => {
  let name = req.params.name;
  let diagnosing = await checkExistByField("name", name);
  if (diagnosing) {
    res.json({
      code: 500,
      msg: `The diagnosing name(${name}) has exist!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});

// /**
//  * check whether the symptom has correscoding to 
//  * another diagnosing
//  */
// router.get("/symptom/exists.json/:symptomId", async (req, res) => {
//     let id = req.session.vid;
//     if (id) {
//         let symptomId = req.params.symptomId;
//         let diagnosing = await getDiagnosingBySymptom(symptomId);
//         if (diagnosing) {
//             res.json({
//                 code: 403,
//                 msg: `The`
//             });
//         } else {

//         }
//     } else {
//         res.redirect("/veterinary/login.html");
//     }
// });

/**
 * diagnosing add page
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let symptoms = await listAllNotInDiagnosing(id);
    await res.render("veterinary/diagnosing/add", {
      vid: id,
      vemail: req.session.vemail,
      symptoms: symptoms,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * diagnosing form submit
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let diagnosingSchema = extractValidFields(req.body, DiagnosingSchema);
    let recorderId = parseInt(diagnosingSchema.recorder_id);
    if (recorderId && id === recorderId) {
      let result = await add(diagnosingSchema);
      if (result) {
        res.redirect("/veterinary/diagnosing/index.html");
      } else {
        res.json({
          code: 500,
          msg: "Add diagnosing failure!",
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
 * diagnosing edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let did = req.params.id;
    let diagnosing = await getDiagnosing(did);
    if (diagnosing) {
      let symptoms = await listAllNotInDiagnosing(id);
      res.render("veterinary/diagnosing/edit", {
        vid: id,
        vemail: req.session.vemail,
        diagnosing: diagnosing,
        symptoms: symptoms,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the diagnosing with the id: ${did}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * diagnosing submit page
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let did = req.body.did;
    let diagnosing = await getDiagnosing(did);
    if (diagnosing) {
      const { symptom_id, name, result, solution, suggestion } = req.body;
      let rs = await updateDiagnosing(did, {
        symptom_id: symptom_id,
        name: name,
        result: result,
        solution: solution,
        suggestion: suggestion,
      });
      if (rs) {
        res.redirect("/veterinary/diagnosing/index.html");
      }
    } else {
      res.json({
        code: 400,
        msg: `Not found the diagnosing with the id: ${did}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * delete diagnosing
 */
router.get("/delete.html/:id", async (req, res) => {
  let id = req.session.vid;
  if (id) {
    let did = req.params.id;
    let diagnosing = await getDiagnosing(did);
    if (diagnosing) {
      let result = await deleteById(did);
      if (result) {
        res.redirect("/veterinary/diagnosing/index.html");
      }
    } else {
      res.json({
        code: 404,
        msg: `Not found the diagnosing with the id: ${did}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

module.exports = router;
