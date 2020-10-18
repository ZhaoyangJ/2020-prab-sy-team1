const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const VeterinarySchema = {
  id: { required: false },
  email: { required: true },
  password: { required: true },
  introduction: { required: false },
  photo: { required: false },
  create_at: { required: false },
};
exports.VeterinarySchema = VeterinarySchema;

/**
 * add veterinary
 * @param {*} veterinary
 */
const add = async (veterinary) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into veterinary(email,password,introduction,photo) values(@email,@password,@introduction,@photo)
  `;
  let result = await dbutil.run(sql, veterinary);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * login validation
 * @param {*} email
 * @param {*} password
 */
const login = async (email, password) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,email,introduction,create_at from veterinary where email = ? and password = ?
  `;
  let result = await dbutil.get(sql, [email, password]);
  await dbutil.destroy();
  return result;
};
exports.login = login;

/**
 * query all the veterinaries
 */
const listAllVeterinaries = async () => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,email,introduction,photo,create_at from veterinary
  `;
  let result = await dbutil.query(sql, []);
  await dbutil.destroy();
  return result;
};
exports.listAllVeterinaries = listAllVeterinaries;

/**
 * query single veterinary intormation according to the id
 * @param {*} id veterinary id
 */
const getVeterinary = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,email,introduction,photo,create_at from veterinary where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getVeterinary = getVeterinary;

/**
 * update the veterinary's information
 * @param {*} id 
 * @param {*} veterinary 
 */
const updateProfile = async (id, veterinary) => {
  const dbutil = new DBUtil(dbfile);
  const sql =
    "update veterinary set introduction=? where id = ?";
  let result = await dbutil.run(sql, [
    veterinary.introduction,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.updateProfile = updateProfile;
