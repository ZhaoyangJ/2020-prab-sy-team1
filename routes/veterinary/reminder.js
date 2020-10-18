var express = require("express");
var router = express.Router();
var schedule = require("node-schedule");

const { extractValidFields, validateAgainstSchema } = require("../../lib/util");
const {
  getReminders,
  add: addReminder,
  deleteById: deleteReminder,
  ReminderSchema,
} = require("../../model/reminder");
const { getById: getPetById } = require("../../model/pet");
const { add: addNotification } = require("../../model/nodicaition");

/**
 * add reminder page
 */
router.get("/index.html/:petId", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let petId = req.params.petId;
    let pet = await getPetById(petId);
    let reminders = await getReminders(vid);
    res.render("veterinary/reminder/index", {
      vid: vid,
      vemail: req.session.vemail,
      pet: pet,
      reminders: reminders,
    });
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * add reminder page
 */
router.get("/add.html/:petId", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let petId = req.params.petId;
    let pet = await getPetById(petId);
    if (pet) {
      res.render("veterinary/reminder/add", {
        vid: vid,
        vemail: req.session.vemail,
        pet: pet,
      });
    } else {
      res.json({
        code: 404,
        msg: "Not found the pet.",
      });
    }
  } else {
    res.redirect("/veterinaty/login.html");
  }
});

/**
 * add reminder
 */
router.post("/add.html", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    if (validateAgainstSchema(req.body, ReminderSchema)) {
      let reminder = extractValidFields(req.body, ReminderSchema);
      let result = await addReminder(reminder);
      let date = Date.parse(reminder.reminder_datetime);
      schedule.scheduleJob(date, async function () {
        // console.log(reminder);
        let notification = {};
        notification.pet_id = reminder.pet_id;
        notification.reminder_id = reminder.reminder_id;
        notification.title = reminder.title;
        notification.message = reminder.message;
        notification.reminder_datetime = reminder.reminder_datetime;
        let result = await addNotification(notification);
        console.log("add one notification: ", result);
      });
      res.redirect("/veterinary/reminder/index.html/" + reminder.pet_id);
    } else {
      res.json({
        code: 401,
        msg: "Miss required field of the reminder.",
      });
    }
  } else {
    res.redirect("/veterinary/login.html");
  }
});

/**
 * add reminder page
 */
router.get("/delete.html/:id/:petId", async (req, res) => {
  let vid = req.session.vid;
  if (vid) {
    let id = req.params.id;
    let petId = req.params.petId;
    await deleteReminder(id);
    res.redirect("/veterinary/reminder/index.html/" + petId);
  } else {
    res.redirect("/veterinaty/login.html");
  }
});

module.exports = router;
