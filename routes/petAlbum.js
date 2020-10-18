var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const { validateAgainstSchema, extractValidFields } = require("../lib/util");
const {
  PetAlbumSchema,
  add,
  getById,
  listAll,
  listByName,
  deleteById,
  updateCover,
  update,
} = require("../model/petAlbum");
const { list } = require("../model/admin/petCategory");
const { getById: getPetById } = require("../model/pet");
const {
  getByAlbumId,
  getById: getImageById,
  deleteByAlbumId,
} = require("../model/petImage");
const imagePath = path.join(__dirname, "..", "public");

/**
 * pet album list page
 */
router.get("/:petId/index.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.petId;
    let petAlbums = await listAll(petId);
    let pet = await getPetById(petId);
    res.render("pet/album/index", {
      id: id,
      username: req.session.username,
      petAlbums: petAlbums,
      pet: pet,
    });
  } else {
    res.redirect("/login.html");
  }
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
 * redirect the page adding pet album
 */
router.get("/:petId/add.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.petId;
    let pet = await getPetById(petId);
    if (pet) {
      res.render("pet/album/add", {
        cid: id,
        username: req.session.username,
        pet: pet,
      });
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

/**
 * submit the pet album form
 */
router.post("/add.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    if (validateAgainstSchema(req.body, PetAlbumSchema)) {
      let petAlbumSchema = extractValidFields(req.body, PetAlbumSchema);
      let result = await add(petAlbumSchema);
      if (result) {
        res.redirect(`/pet/album/${petAlbumSchema.pet_id}/index.html`);
      } else {
        res.json({
          code: 500,
          msg: "Add pet album failure!",
        });
      }
    } else {
      res.json({
        code: 401,
        msg: "Miss the required pet album fields!",
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * pet album edit page
 */
router.get("/edit.html/:albumId", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let albumId = req.params.albumId;
    let album = await getById(albumId);
    if (album) {
      let images = await getByAlbumId(albumId);
      res.render("pet/album/edit", {
        id: id,
        username: req.session.username,
        album: album,
        images: images,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet album with the id: ${albumId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * update pet album information
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    const { albumId, petId, name, description } = req.body;
    await update(albumId, {
      name: name,
      description: description,
    });
    res.redirect(`/pet/album/${petId}/index.html`);
  } else {
    res.redirect("/login.html");
  }
});

const deleteImage = async (albumId, images) => {
  if (images && images.length > 0) {
    // firstly, delete local image file
    for (const image of images) fs.unlinkSync(`${imagePath}${image.url}`);
    await deleteByAlbumId(albumId);
  }
};

/**
 * delete pet album according to its id
 * firstly, delete all the images in the album
 * at last, delete the current album
 */
router.get("/:petId/delete.html/:albumId", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let petId = req.params.petId;
    let albumId = req.params.albumId;
    let album = await getById(albumId);
    if (album) {
      if (album.pet_id == petId) {
        // Firstly, delete all the images in the album
        let images = await getByAlbumId(albumId);
        await deleteImage(albumId, images);
        // Then, delete album with the specified id
        await deleteById(albumId);
      }
      res.redirect(`/pet/album/${petId}/index.html`);
    } else {
      res.json({
        code: 404,
        msg: `Not found the pet album with the id: ${albumId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * update the album's cover
 */
router.get("/cover/setting.html/:albumId/:imageId", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let albumId = req.params.albumId;
    let imageId = req.params.imageId;
    let image = await getImageById(imageId);
    if (image && image.url) {
      await updateCover(albumId, image.url);
    }
    res.redirect(`/pet/album/${image.petId}/index.html`);
  } else {
    res.redirect("/login.html");
  }
});

/**
 * image list of the album
 */
router.get("/image/list.html/:id", async (req, res) => {
  let albumId = req.params.id;
  let album = await getById(albumId);
  if (album) {
    let images = await getByAlbumId(albumId);
    res.render("pet/album/list", {
      id: req.session.cid,
      username: req.session.username,
      images: images,
      album: album
    });
  } else {
    res.json({
      code: 404,
      msg: `Not found the album with the id: ${albumId}`
    });
  }
});

module.exports = router;
