var express = require("express");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../../lib/util");
const {
  loginValidate,
  LoginUserSchema,
  getById,
  AdministratorSchema,
  updateProfile,
} = require("../../model/admin/administrator");

/**
 * redirect administrator login page
 */
router.get("/login.html", (req, res) => {
  res.render("admin/login");
});
/**
 * administrator login form submit
 */
router.post("/login.html", async (req, res) => {
  if (validateAgainstSchema(req.body, LoginUserSchema)) {
    const { username, password } = req.body;
    let admin = await loginValidate(username, password);
    if (admin) {
      req.session.aid = admin.id;
      req.session.ausername = admin.username;
      res.redirect("/admin");
    } else {
      res.render("login", {
        error: "Your username or password is invalid!",
      });
    }
  } else {
    res.json({
      code: 401,
      msg: "Miss required login fields!",
    });
  }
});

/**
 * administrator logout
 */
router.get("/logout.html", (req, res) => {
  req.session.aid = null;
  req.session.ausername = null;
  res.redirect("/admin/login.html");
});

/**
 * administrator index page
 */
router.get("/", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let admin = await getById(id);
    if (admin) {
      res.render("admin/index", {
        title: "Welcome to administrator",
        ausername: req.session.ausername,
        aid: req.session.aid,
        admin: admin,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the administrator with the id: ${id}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * administrator profile
 */
router.get("/edit.html", async (req, res) => {
  let username = req.session.ausername;
  let id = req.session.aid;
  console.log("admin id is: ", id);
  if (id) {
    let admin = await getById(id);
    if (admin) {
      res.render("admin/edit", {
        ausername: username,
        aid: id,
        admin: admin,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the administrator with the id: ${id}`,
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

/**
 * update administrator profile
 */
router.put("/profile/update.json", async (req, res) => {
  let id = req.session.aid;
  if (id) {
    let admin = await getById(id);
    if (!admin) {
      res.json({
        code: 404,
        msg: `Not found the administrator with id: ${id}`,
      });
    }
    let adminSchema = extractValidFields(req.body, AdministratorSchema);
    if (!adminSchema.name) {
      adminSchema.name = admin.name;
    }
    if (!adminSchema.sex) {
      adminSchema.sex = admin.sex;
    }
    if (!adminSchema.email) {
      adminSchema.email = admin.email;
    }
    if (!adminSchema.address) {
      adminSchema.address = admin.address;
    }
    let result = await updateProfile(id, adminSchema);
    if (result) {
      res.json({
        code: 204,
        msg: "Update administrator profile successfully!",
      });
    } else {
      res.json({
        code: 500,
        msg: "Update administrator failure!",
      });
    }
  } else {
    res.redirect("/admin/login.html");
  }
});

module.exports = router;
