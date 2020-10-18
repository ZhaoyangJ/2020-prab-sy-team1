const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const PetAlbumSchema = {
  id: { required: false },
  pet_id: { required: true },
  name: { required: true },
  cover_url: { required: false },
  description: { required: false },
  create_at: { required: false },
};
exports.PetAlbumSchema = PetAlbumSchema;

/**
 * add pet album
 * @param {*} petAlbum
 */
const add = async (petAlbum) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into pet_album(pet_id,name,description) values(@pet_id,@name,@description)
  `;
  let result = await dbutil.run(sql, petAlbum);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query single pet album intormation according to the id
 * @param {*} id pet album id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select p.id as petId,p.name as petName,pa.*
    from pet p, pet_album pa 
    where pa.id = ? and p.id = pa.pet_id
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * query all pet album according to the owner id
 * @param {*} petId pet id
 */
const listAll = async (petId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select * 
    from pet_album
    where pet_id = ?
    order by create_at desc
  `;
  let result = await dbutil.query(sql, [petId]);
  await dbutil.destroy();
  return result;
};
exports.listAll = listAll;

/**
 * query pet ablum according to its name
 * @param {*} petId pet id
 * @param {*} pname pet name
 */
const listByName = async (petId, pname) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select *
    from pet_album
    where name like '%${pname}%' and p.pet_id = ?
    order by create_at desc
  `;
  let result = await dbutil.query(sql, [petId]);
  await dbutil.destroy();
  return result;
};
exports.listByName = listByName;

/**
 * delete pet album intormation according to the id
 * @param {*} id pet album id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet_album where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

/**
 * update pet album information
 * @param {*} id pet album id
 * @param {*} petAlbum pet album information
 */
const update = async (id, petAlbum) => {
  const dbutil = new DBUtil(dbfile);
  const sql = ` 
        update pet_album set name=?, description=? where id = ?
    `;
  let result = await dbutil.run(sql, [petAlbum.name, petAlbum.description, id]);
  await dbutil.destroy();
  return result;
};
exports.update = update;

/**
 * update the album's cover
 * @param {*} id
 * @param {*} coverUrl
 */
const updateCover = async (id, coverUrl) => {
  const dbutil = new DBUtil(dbfile);
  const sql = ` 
    update pet_album set cover_url = ? where id = ?
  `;
  let result = await dbutil.run(sql, [coverUrl, id]);
  await dbutil.destroy();
  return result;
};
exports.updateCover = updateCover;
