var express = require("express");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../lib/util");
const {
  PetSchema,
  add,
  getById,
  listByOwner,
  listByName,
  listByCategory,
  deleteById,
  update,
} = require("../model/pet");
const { list } = require("../model/admin/petCategory");
const { listAll } = require("../model/petAlbum");

/**
 * pet list page
 */
router.get("/index.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let pets = await listByOwner(id);
    // console.log("all my pets are: ", pets);
    res.render("pet/index", {
      id: id,
      username: req.session.username,
      pets: pets,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 * query all pet according to the pet category
 */
router.get("/search_by_category.html/:categoryId", async (req, res) => {
  let categoryId = req.params.categoryId;
  let pets = await listByCategory(categoryId);
  let petCategories = await list();
  res.render("index", {
    id: req.session.cid,
    username: req.session.username,
    pets: pets,
    petCategories: petCategories,
  });
});

/**
 * query all pet according its name
 */
router.get("/search.html/:name", async (req, res) => {
  let name = req.params.name;
  let pets = await listByName(name);
  let petCategories = await list();
  res.render("index", {
    id: req.session.cid,
    username: req.session.username,
    pets: pets,
    petCategories: petCategories,
  });
});

/**
 * redirect the page adding pet
 */
router.get("/add.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petCategories = await list();
    res.render("pet/add", {
      cid: id,
      username: req.session.username,
      petCategories: petCategories,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 * submit the pet form
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    if (validateAgainstSchema(req.body, PetSchema)) {
      let petSchema = extractValidFields(req.body, PetSchema);
      let result = await add(petSchema);
      if (result) {
        res.redirect("/pet/index.html");
      } else {
        res.json({
          code: 500,
          msg: "Add pet failure!",
        });
      }
    } else {
      res.json({
        code: 401,
        msg: "Miss the required pet fields!",
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * pet detail
 */
router.get("/detail.html/:id", async (req, res) => {
  let petId = req.params.id;
  let pet = await getById(petId);
  if (pet) {
    let albums = await listAll(petId);
    res.render("pet/detail", {
      id: req.session.cid,
      username: req.session.username,
      pet: pet,
      albums: albums,
    });
  } else {
    res.json({
      code: 404,
      msg: `Not found the pet with id: ${petId}`,
    });
  }
});

/**
 * pet information edit
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.id;
    let pet = await getById(petId);
    let petCategories = await list();
    res.render("pet/edit", {
      id: id,
      username: req.session.username,
      pet: pet,
      petCategories: petCategories,
    });
  } else {
    res.redirect("/login.html");
  }
});

/**
 * submit updated pet information
 */
router.put("/edit.json/:id", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.id;
    let petSchema = extractValidFields(req.body, PetSchema);
    let result = await update(petId, petSchema);
    if (result) {
      res.json({
        code: 204,
        msg: "Update successfully!",
      });
    } else {
      res.json({
        code: 500,
        msg: "Update failure!",
      });
    }
  } else {
    res.json({
      code: 403,
      msg: "Please login first!",
    });
  }
});

/**
 * delete pet according to its id
 */
router.get("/delete.html/:petId", async (req, res) => {
  let id = req.session.cid;
  let petId = req.params.petId;
  if (id) {
    let pet = await getById(petId);
    if (pet) {
      await deleteById(petId);
      res.redirect("/pet/index.html");
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet with the id: ${petId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

module.exports = router;
