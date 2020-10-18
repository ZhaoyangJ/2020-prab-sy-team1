const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");

/**
 * used to encrypt the text content
 * @param {*} content
 */
exports.encrypt = function (content) {
  let md5 = crypto.createHash("md5");
  md5.update(content);
  return md5.digest("hex");
}

/*
 * Performs data validation on an object by verifying that it contains
 * all required fields specified in a given schema.
 *
 * Returns true if the object is valid agianst the schema and false otherwise.
 */
exports.validateAgainstSchema = function (obj, schema) {
  return (
    obj &&
    Object.keys(schema).every((field) => !schema[field].required || obj[field])
  );
};

/*
 * Extracts all fields from an object that are valid according to a specified
 * schema.  Extracted fields can be either required or optional.
 *
 * Returns a new object containing all valid fields extracted from the
 * original object.
 */
exports.extractValidFields = function (obj, schema) {
  let validObj = {};
  Object.keys(schema).forEach((field) => {
    if (obj[field]) {
      validObj[field] = obj[field];
    }
  });
  return validObj;
};

/**
 * file upload
 * @param {*} folder 
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
exports.createFolder = createFolder;
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

exports.getMulterUload = (uploadFileFolder) => {
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
  return upload;
};
