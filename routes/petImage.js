var express = require("express");
var router = express.Router();
const { validateAgainstSchema, extractValidFields } = require("../lib/util");
const { getById } = require("../model/petAlbum");
const {
  getDB,
  addImages,
  deleteById,
  getById: getImage,
  getByAlbumId,
  updateImage,
} = require("../model/petImage");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "..", "public");

/**
 * redirect album image upload page
 */
router.get("/upload.html/:albumId", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let albumId = req.params.albumId;
    let album = await getById(albumId);
    if (album) {
      res.render("pet/album/image/upload", {
        id: id,
        username: req.session.username,
        album: album,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the album with the id: ${albumId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * image upload
 */
/**
 * create folder used to store uploaded image if
 * the file folder does not exist
 * @param {*} folder
 */
function createFolder(folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
}
/**
 * get the filename except for the extension
 * @param {*} file
 */
function getFilename(file) {
  if (file && file !== "") {
    let index = file.indexOf(".");
    if (index > 0) {
      return file.substring(0, index);
    }
  }
  return null;
}
/**
 * get the file extension name
 * @param {*} file
 */
function getExt(file) {
  if (file && file !== "") {
    let index = file.indexOf(".");
    if (index > 0) {
      return file.substring(index);
    }
  }
  return null;
}
const uploadFileFolder = "public/upload";
createFolder(uploadFileFolder);
/**
 * set the file name of the uploaded images
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFileFolder);
  },
  filename: function (req, file, cb) {
    // set the saved image fiel name as filename + timestamp，such as logo-1478521468943
    let _filename =
      getFilename(file.originalname) +
      "-" +
      Date.now() +
      getExt(file.originalname);
    cb(null, _filename);
  },
});
let upload = multer({ storage: storage });
/**
 * upload image
 */
router.post("/upload.html", upload.array("images"), async (req, res) => {
  let files = req.files;
  let images = [];
  if (files && files.length > 0) {
    let albumId = req.body.albumId;
    for (let i = 0; i < files.length; ++i) {
      images.push({
        pet_album_id: albumId,
        name: files[i].filename,
        description: "",
        url: `/upload/${files[i].filename}`,
      });
    }
  }
  if (images.length > 0) {
    await addImages(images);
  }
  // console.log(req.body.albumId);
  // console.log(req.files);
  // console.log("result is: ", result);
  res.json({
    code: 200,
    msg: "Ok",
  });
});

/**
 * redirect image edit page
 */
router.get("/edit.html/:id", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let id = req.params.id;
    let image = await getImage(id);
    if (image) {
      let album = await getById(image.pet_album_id);
      res.render("pet/album/image/edit", {
        id: id,
        username: req.session.username,
        album: album,
        image: image,
      });
    } else {
      res.json({
        code: 404,
        msg: `Not found the image with the id: ${id}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * update image information
 */
router.post("/edit.html", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    const { imageId, name, description } = req.body;
    let image = await getImage(imageId);
    if (image) {
      await updateImage(imageId, {
        name: name,
        description: description,
      });
      res.redirect(`/pet/album/edit.html/${image.pet_album_id}`);
    } else {
      res.json({
        code: 404,
        msg: `Not found the image with the id: ${imageId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

const deleteImage = async (image) => {
  // firstly, delete local image file
  fs.unlinkSync(`${imagePath}${image.url}`);
  await deleteById(image.id);
  console.log("delete image successfully");
};

/**
 * delete image in the album according to its id
 */
router.get("/delete.html/:id", async (req, res) => {
  let id = req.session.cid;
  if (id) {
    let imageId = req.params.id;
    let image = await getImage(imageId);
    if (image) {
      await deleteImage(image);
      console.log("redirect album edit page..");
      res.redirect(`/pet/album/edit.html/${image.pet_album_id}`);
    } else {
      res.json({
        code: 404,
        msg: `Not found the image with the id: ${imageId}`,
      });
    }
  } else {
    res.redirect("/login.html");
  }
});

/**
 * image detail page
 */
router.get("/detail.html/:id", async (req, res) => {
  let id = req.params.id;
  let image = await getImage(id);
  if (image) {
    let album = await getById(image.pet_album_id);
    res.render("pet/album/image/detail", {
      id: req.session.cid,
      username: req.session.username,
      image: image,
      album: album,
    });
  } else {
    res.json({
      code: 404,
      msg: `Not found the image with the id: ${id}`,
    });
  }
});

module.exports = router;
