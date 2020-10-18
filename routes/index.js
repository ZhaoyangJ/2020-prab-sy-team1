var express = require("express");
var router = express.Router();
const { listAll } = require("../model/pet");
const { list } = require("../model/admin/petCategory");

/* GET home page. */
router.get("/", async (req, res) => {
  let id = req.session.cid;
  let pets = await listAll();
  let petCategories = await list();
  res.render("index", {
    username: req.session.username,
    id: id,
    pets: pets,
    petCategories: petCategories,
  });
});

module.exports = router;
