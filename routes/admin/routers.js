var express = require("express");
var router = express.Router();

// router.use("/", require("./index"));
router.use("/", require("./administrator"));
router.use("/category", require("./petCategory"));
router.use("/pet_parasite_prevention_product", require("./petParasitePreventionProduct"));
router.use("/medication_type", require("./medicationType"));

module.exports = router;
