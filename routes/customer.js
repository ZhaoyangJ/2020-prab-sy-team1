var express = require("express");
const { DBUtil } = require("../db/sqlite");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../lib/util");
const {
  checkExistByField,
  CustomerSchema,
  getById,
  deleteById,
  updateProfile,
} = require("../model/customer");

const {
  getCustomerUnread,
  getCustomerRead,
  getNotificationsByCustomer,
  getNotification,
  updateNotificationStatus,
  deleteById:deleteNotificatoinById
} = require("../model/nodicaition");

/**
 * show customer profile
 */
router.get("/profile.html", async (req, res) => {
  let username = req.session.username;
  let id = req.session.cid;
  if (id) {
    let customer = await getById(id);
    if (customer) {
      res.render("customer/profile", {
        username: username,
        id: id,
        customer: customer
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the customer with the id: ${id}`
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * update customer profile
 */
router.put("/profile/update.json", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let customer = await getById(id);
    if (!customer) {
      res.json({
        code: 404,
        msg: `Not found the customer with id: ${id}`
      });
    }
    let customerSchema = extractValidFields(req.body, CustomerSchema);
    console.log("customer schema is: ", customerSchema);
    if (!customerSchema.name) {
      customerSchema.name = customer.name;
    }
    if (!customerSchema.sex) {
      customerSchema.sex = customer.sex;
    }
    if (!customerSchema.email) {
      customerSchema.email = customer.email;
    }
    if (!customerSchema.address) {
      customerSchema.address = customer.address;
    }
    let result = await updateProfile(id, customerSchema);
    if (result) {
      res.json({
        code: 204,
        msg: "Update customer profile successfully!"
      })
    } else {
      res.json({
        code: 500,
        msg: "Update customer failure!"
      })
    }
  } else {
    res.redirect("/login.html")
  }
});

/**
 * check whether the customer corresponding to a field exist
 */
router.get("/exists.json/:fieldName/:fieldValue", async (req, res) => {
  let fieldName = req.params.fieldName;
  let fieldValue = req.params.fieldValue;
  let customer = await checkExistByField(fieldName, fieldValue);
  if (customer) {
    res.json({
      code: 500,
      msg: `The ${fieldName}(${fieldValue}) has been used!`,
    });
  } else {
    res.json({
      code: 200,
      msg: "ok",
    });
  }
});
/**
 * customer delete
 */
router.get("/delete.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    req.session.id = null;
    req.session.username = null;
    let result = await deleteById(id);
    console.log("delete result is: ", result);
  }
  res.redirect("/login.html");
});

/******************** customer notification ***********/
router.get("/notification/unread/count.json", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let unreadNotificaiotns = await getCustomerUnread(cid);
    res.json({
      code: 200,
      msg: "ok",
      count: unreadNotificaiotns ? unreadNotificaiotns.length : 0
    });
  } else {
    res.json({
      code: 403,
      msg: "Please login before"
    });
  }
});

/**
 * customer notification list
 */
router.get("/notification/lists.html", async (req, res) => {
  let cid = req.session.cid;
  if (cid){
    let readNotifications = await getCustomerRead(cid);
    let unreadNotifications = await getCustomerUnread(cid);
    res.render("customer/notification/list", {
      id: cid,
      username: req.session.username,
      readNotifications: readNotifications,
      unreadNotifications: unreadNotifications,
    });
  } else {
    res.redirect("/login.html");
  }
});


/**
 * get notification detail
 */
router.get("/notification/detail.html/:id", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let id = req.params.id;
    let notification = await getNotification(id);
    if (notification) {
      if (notification.status == 0) {
        await updateNotificationStatus(id, 1);
      }
      res.render("customer/notification/detail", {
        id: cid,
        username: req.session.username,
        notification: notification,
      });
    } else {
      res.json({
        code: 404,
        msg: "Not found the notification!",
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * get notification detail
 */
router.get("/notification/delete.html/:id", async (req, res) => {
  let cid = req.session.cid;
  if (cid) {
    let id = req.params.id;
    let notification = await getNotification(id);
    if (notification) {
      await deleteNotificatoinById(id);
      res.redirect("/customer/notification/lists.html");
    } else {
      res.json({
        code: 404,
        msg: "Not found the notification!",
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;
