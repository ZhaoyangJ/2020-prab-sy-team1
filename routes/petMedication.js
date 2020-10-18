var express = require("express");
var router = express.Router();
const {
  getByPet,
  getById: getPetMedication,
} = require("../model/petMedication");
const { getById } = require("../model/pet");

/**
 * list all the pet medications
 */
router.get("/:petId/lists.html", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let petId = req.params.petId;
    let medications = await getByPet(petId);
    let pet = await getById(petId);
    res.render("pet/medication/lists", {
      id: cid,
      username: req.session.username,
      medications: medications,
      pet: pet,
    });
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;

/**
 * view pet medication detail
 */
router.get("/detail.html/:id", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let id = req.params.id;
    let medication = await getPetMedication(id);
    res.render("pet/medication/detail", {
      id: cid,
      username: req.session.username,
      medication: medication,
    });
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;
