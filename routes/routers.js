var express = require("express");
var router = express.Router();

router.use("/", require("./index"));
router.use("/", require("./account"));
router.use("/customer", require("./customer"));
// pet router
router.use("/pet", require("./pet"));
// pet album
router.use("/pet/album", require("./petAlbum"));
// pet image
router.use("/pet/image", require("./petImage"));
// pet make appointments
router.use("/pet/appointment", require("./appointment"));
// pet medical history
router.use("/pet/medical_history", require("./petMedicalHistory"));
// pet medication
router.use("/pet/medication", require("./petMedication"));
// dss
router.use("/dss", require("./dss"));

// administrator router
router.use("/admin", require("./admin/routers"));
// veterinary router
router.use("/veterinary", require("./veterinary/routers"));

module.exports = router;