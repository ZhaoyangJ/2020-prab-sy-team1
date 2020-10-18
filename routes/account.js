var express = require("express");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../lib/util");
const {
  loginValidate,
  LoginUserSchema,
  CustomerSchema,
  add,
} = require("../model/customer");

/**
 * redirect login page
 */
router.get("/login.html", (req, res) => {
  res.render("login");
});
/**
 * login form submit
 */
router.post("/login.html", async (req, res) => {
  if (validateAgainstSchema(req.body, LoginUserSchema)) {
    const { username, password } = req.body;
    let user = await loginValidate(username, password);
    // console.log("user is: ", user);
    if (user) {
      // console.log(result);
      req.session.cid = user.id;
      req.session.username = user.username;
      res.redirect("/");
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
 * account logout
 */
router.get("/logout.html", (req, res) => {
  req.session.cid = null;
  req.session.username = null;
  res.redirect("/");
});
/**
 * redirect register page
 */
router.get("/register.html", (req, res) => {
  res.render("register");
});
/**
 * submit customer register form data
 */
router.post("/register.html", async (req, res) => {
  if (validateAgainstSchema(req.body, CustomerSchema)) {
    let customerSchame = extractValidFields(req.body, CustomerSchema);
    let rs = await add(customerSchame);
    if (rs) {
      res.redirect("/login.html")
    }
  } else {
    res.json({
      code: 401,
      msg: "Miss required field",
    });
  }
});

module.exports = router;
