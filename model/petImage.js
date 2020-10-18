const { DBUtil } = require("../db/sqlite");
const { update } = require("./petAlbum");
const dbfile = "./db/pet.db";

const PetImageSchema = {
  id: { required: false },
  pet_album_id: { required: true },
  name: { required: true },
  description: { required: false },
  url: { required: true },
  create_at: { required: false },
};
exports.PetImageSchema = PetImageSchema;

/**
 * query single pet image intormation according to the id
 * @param {*} id pet image id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select pi.*,pa.pet_id as petId,pa.name as albumName
    from pet_image pi, pet_album pa
    where pi.id = ? and pi.pet_album_id = pa.id
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

const addImages = async (images) => {
  const dbutil = new DBUtil(dbfile);
  const db = dbutil.getDB();
  console.log("images are: ", images);
  const sql = `
    insert into pet_image(pet_album_id,name,description,url) 
    values(@pet_album_id,@name,@description,@url)
  `;
  let insert = db.prepare(sql);
  const insertMany = db.transaction((_images) => {
    for (const image of _images) {
      insert.run(image);
    }
  });
  let result = await insertMany(images);
  await dbutil.destroy();
  return result;
};

exports.addImages = addImages;

const getByAlbumId = async (albumId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = 'select *from pet_image where pet_album_id = ?';
  let result = await dbutil.query(sql, [albumId]);
  return result;
};
exports.getByAlbumId = getByAlbumId;

/**
 * delete pet image according to the id
 * @param {*} id pet image id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet_image where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

/**
 * delete all the images with specified album id
 * @param {*} albumId 
 */
const deleteByAlbumId = async (albumId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet_image where pet_album_id = ?";
  let result = await dbutil.run(sql, [albumId]);
  await dbutil.destroy();
  return result;
};
exports.deleteByAlbumId = deleteByAlbumId;

/**
 * update image information
 * @param {*} id 
 * @param {*} name 
 * @param {*} description 
 */
const updateImage = async (id, image) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update pet_image set name = ?, description = ? where id = ?";
  let result = await dbutil.run(sql, [image.name, image.description, id]);
  await dbutil.destroy();
  return result;
};
exports.updateImage = updateImage;
