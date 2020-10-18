var express = require("express");
var router = express.Router();

const { validateAgainstSchema, extractValidFields } = require("../../lib/util");

const {
  VeterinarySchema,
  login,
  add,
  getVeterinary,
  updateProfile,
} = require("../../model/veterinary/veterinary");

const {
  PetMedicalHistorySchema,
  addRecord,
} = require("../../model/petMedicalHistory");

const {
  list: getAllPPPP,
} = require("../../model/admin/petParsitePrevetionProduct");
const {
  list: getAllMedicationType,
} = require("../../model/admin/medicationType");
const { getByVeterinary, getById } = require("../../model/appointment");
const { getByAppointment } = require("../../model/petMedicalHistory");
const {
  getByAppointment: getMedicationByAppointment,
  PetMedicationSchema,
  addMedication
} = require("../../model/petMedication");
const path = require("path");
const imagePath = path.join(__dirname, "..", "public");

const { getMulterUload } = require("../../lib/util");
const { EDESTADDRREQ } = require("constants");

/**
 * veterinary login page
 */
router.get("/login.html", async (req, res) => {
  res.render("veterinary/login");
});

/**
 * veterinary login form submit
 */
router.post("/login.html", async (req, res) => {
  const { email, password } = req.body;
  let veterinary = await login(email, password);
  if (veterinary) {
    req.session.vid = veterinary.id;
    req.session.vemail = veterinary.email;
    res.redirect("/veterinary/index.html");
  } else {
    res.render("veterinary/login", {
      error: "Your username or password is invalid!",
    });
  }
});

/**
 * veterinary logout
 */
router.get("/logout.html", (req, res) => {
  req.session.vid = null;
  req.session.vemail = null;
  res.redirect("/veterinary/login.html");
});

/**
 * redirect register page
 */
router.get("/register.html", (req, res) => {
  res.render("veterinary/register");
});

/**
 * submit veterinary register form data
 */
const photoFile = getMulterUload("public/avatars").single("photo");
router.post("/register.html", photoFile, async (req, res) => {
  let avatarFile = req.file;
  if (validateAgainstSchema(req.body, VeterinarySchema) && avatarFile) {
    let veterinary = extractValidFields(req.body, VeterinarySchema);
    veterinary.photo = `/avatar/${avatarFile.filename}`;
    let rs = await add(veterinary);
    if (rs) {
      res.json({
        code: 200,
        msg: "ok",
      });
    }
  } else {
    res.json({
      code: 401,
      msg: "Miss required field",
    });
  }
});

/**
 * veterinary home page
 */
router.get("/index.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let veterinary = await getVeterinary(vid);
    if (veterinary) {
      res.render("veterinary/index", {
        vid: vid,
        vemail: req.session.vemail,
        veterinary: veterinary,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the veterinary information with the id: ${vid}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * veterinary profile edit page
 */
router.get("/profile/edit.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let veterinary = await getVeterinary(vid);
    if (veterinary) {
      res.render("veterinary/editProfile", {
        vid: vid,
        vemail: req.session.vemail,
        veterinary: veterinary,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the veterinary with the id: ${vid}`,
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * submit veterinary update form data
 */
router.post("/profile/edit.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    const { veterinaryId, introduction } = req.body;
    await updateProfile(veterinaryId, {
      introduction: introduction,
    });
    res.redirect("/veterinary/index.html");
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * veterinary appointment list
 */
router.get("/appointments/index.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let appointments = await getByVeterinary(vid);
    let veterinary = await getVeterinary(vid);
    res.render("veterinary/appointment/index", {
      vid: vid,
      vemail: req.session.vemail,
      appointments: appointments,
      veterinary: veterinary,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * make record for patient pet
 */
router.get("/appointment/record.html/:id", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let appointmentId = req.params.id;
    let appointment = await getById(appointmentId);
    let petMedicalHistories = await getByAppointment(appointmentId);
    let petParsitePrevetionProducts = await getAllPPPP();
    // console.log("pet medical: ", petMedicalHistories);
    res.render("veterinary/appointment/record", {
      vid: vid,
      vemail: req.session.vemail,
      appointment: appointment,
      petMedicalHistories: petMedicalHistories,
      petParsitePrevetionProducts: petParsitePrevetionProducts,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * save pet medical history
 */
router.post("/appointment/record.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    if (validateAgainstSchema(req.body, PetMedicalHistorySchema)) {
      let petMedicalHistory = extractValidFields(
        req.body,
        PetMedicalHistorySchema
      );
      let result = await addRecord(petMedicalHistory);
      if (result) {
        res.redirect(
          "/veterinary/appointment/record.html/" +
            petMedicalHistory.appointment_id
        );
      } else {
        res.json({
          code: 500,
          msg: "Record pet medical failure, please try again later!",
        });
      }
    } else {
      res.json({
        code: 401,
        msg: "Miss required field of the pet medical history!",
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * give medication for patient pet
 */
router.get("/appointment/medication.html/:id", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let appointmentId = req.params.id;
    let appointment = await getById(appointmentId);
    let medications = await getMedicationByAppointment(appointmentId);
    let medicationTypes = await getAllMedicationType();
    // console.log("pet medical: ", petMedicalHistories);
    res.render("veterinary/appointment/medication", {
      vid: vid,
      vemail: req.session.vemail,
      appointment: appointment,
      medications: medications,
      medicationTypes: medicationTypes,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});


/**
 * save pet medication
 */
router.post("/appointment/medication.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    if (validateAgainstSchema(req.body, PetMedicationSchema)) {
      let peMedication = extractValidFields(req.body, PetMedicationSchema);
      let result = await addMedication(peMedication);
      if (result) {
        res.redirect(
          "/veterinary/appointment/medication.html/" +
            peMedication.appointment_id
        );
      } else {
        res.json({
          code: 500,
          msg: "Record pet medication failure, please try again later!",
        });
      }
    } else {
      res.json({
        code: 401,
        msg: "Miss required field of the pet medication!",
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

module.exports = router;
