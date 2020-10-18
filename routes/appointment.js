var express = require("express");
var router = express.Router();
const { extractValidFields, validateAgainstSchema } = require("../lib/util");
const {
  queryAppointmentPeriod,
  add: addAppointment,
  checkExist,
  AppointmentSchema,
} = require("../model/appointment");
const {
  listAllVeterinaries,
  getVeterinary,
} = require("../model/veterinary/veterinary");
const { getById: getPetById } = require("../model/pet");

/**
 * redirect to appointment book page
 */
router.get("/:petId/veterinaries/list.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.petId;
    let pet = await getPetById(petId);
    let veterinaries = await listAllVeterinaries();
    res.render("pet/appointment/veterinaries/list", {
      id: id,
      username: req.session.username,
      veterinaries: veterinaries,
      pet: pet,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 * enter appointment information page
 */
router.get("/:petId/veterinary/:vid/book.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.petId;
    let vid = req.params.vid;
    let veterinary = await getVeterinary(vid);
    let pet = await getPetById(petId);
    res.render("pet/appointment/veterinaries/book", {
      id: id,
      username: req.session.username,
      veterinary: veterinary,
      pet: pet,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 *
 */
router.get("/search.json/:veterinaryId/:appointmentDate", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let veterinaryId = req.params.veterinaryId;
    let appointmentDate = req.params.appointmentDate;
    let appointments = await queryAppointmentPeriod(
      veterinaryId,
      appointmentDate
    );
    let timePeriods = [];
    if (appointments && appointments.length > 0) {
      for (const appointment of appointments) {
        timePeriods.push(appointment.appointment_time_period);
      }
    }
    res.json({
      code: 200,
      timePeriods: timePeriods,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 * enter appointment information page
 */
router.post("/book.json", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    if (validateAgainstSchema(req.body, AppointmentSchema)) {
      let appointment = extractValidFields(req.body, AppointmentSchema);
      let existAppoint = await checkExist(
        appointment.pet_id,
        appointment.veterinary_id,
        appointment.appointment_date,
        appointment.appointment_time_period
      );
      if (existAppoint) {
        res.json({
          code: 500,
          msg:
            "At the date time, you have made an appointment for this veterinary!",
        });
      } else {
        let result = await addAppointment(appointment);
        if (result) {
          res.json({
            code: 200,
            msg: "You have book this doctor successfully!",
          });
        } else {
          res.json({
            code: 500,
            msg: "Make appointment failure!",
          });
        }
      }
    } else {
      res.json({
        code: 401,
        msg: "Miss required field of the Appointment Schema.",
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;
