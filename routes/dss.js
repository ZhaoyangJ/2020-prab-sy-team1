var express = require("express");
var router = express.Router();

const { queryByParent } = require("../model/dss");

router.get("/inquiry.html", async (req, res) => {
  res.render("dss");
});

router.get("/inquiry.json/:parentId", async (req, res) => {
    let parentId = req.params.parentId;
    let dssMenu = await queryByParent(parentId);
    dssMenu.push({
      id: -1,
      parent_id: -1,
      content: 'Go back'
    });
    console.log(dssMenu);
    res.json({
      code: 200,
      dssMenu: dssMenu,
    });
});

module.exports = router;
