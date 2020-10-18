var express = require("express");
var router = express.Router();
const { extractValidFields, validateAgainstSchema } = require("../lib/util");
const { getByPet, getById:getMedicalHistory } = require("../model/petMedicalHistory");
const { getById } = require("../model/pet");

/**
 * list all the pet medical history
 */
router.get("/:petId/lists.html", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let petId = req.params.petId;
    let medicalHistories = await getByPet(petId);
    let pet = await getById(petId);
    res.render("pet/medical_history/lists", {
      id: cid,
      username: req.session.username,
      medicalHistories: medicalHistories,
      pet: pet,
    });
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;

/**
 * view pet medical history
 */
router.get("/detail.html/:id", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let id = req.params.id;
    let medicalHistory = await getMedicalHistory(id);
    res.render("pet/medical_history/detail", {
      id: cid,
      username: req.session.username,
      medicalHistory: medicalHistory,
    });
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;
