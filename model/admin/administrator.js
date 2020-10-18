const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const AdministratorSchema = {
  id: { required: false },
  username: { required: true },
  password: { required: true },
  name: { required: true },
  sex: { required: false },
  email: { required: false },
  address: { required: false },
};
exports.AdministratorSchema = AdministratorSchema;

const LoginUserSchema = {
  username: { required: true },
  password: { required: true },
};
exports.LoginUserSchema = LoginUserSchema;

/**
 * login validation
 * @param {*} username
 * @param {*} password
 */
const loginValidate = async (username, password) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,username,name,email,sex,address from administrator where username = ? and password = ?
  `;
  let result = await dbutil.get(sql, [username, password]);
  await dbutil.destroy();
  return result;
};
exports.loginValidate = loginValidate;

/**
 * query single administrator intormation according to the id
 * @param {*} id administrator id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,username,name,email,sex,address from administrator where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

const updateProfile = async (id, admin) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update administrator set name=?,sex=?,email=?,address=? where id = ?";
  let result = await dbutil.run(sql, [
    admin.name,
    admin.sex,
    admin.email,
    admin.address,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.updateProfile = updateProfile;
