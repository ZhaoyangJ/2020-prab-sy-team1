var express = require("express");
var router = express.Router();

// veterinary router module
router.use("/", require("./veterinary"));
// symptom router module
router.use("/symptom", require("./symptom"));
// diagnosing router module
router.use("/diagnosing", require("./diagnosing"));
// reminder 
router.use("/reminder", require("./reminder"));

module.exports = router;
