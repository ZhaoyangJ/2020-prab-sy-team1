const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const CustomerSchema = {
  id: { required: false },
  username: { required: true },
  password: { required: true },
  name: { required: true },
  sex: {required: false},
  email: { required: false },
  address: { required: false },
};
exports.CustomerSchema = CustomerSchema;

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
    select id,username,name,email,sex,address from customer where username = ? and password = ?
  `;
  let result = await dbutil.get(sql, [username, password]);
  await dbutil.destroy();
  return result;
};
exports.loginValidate = loginValidate;

/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `select *from customer where ${fieldName} = ?`;
    let result = await dbutil.get(sql, [fieldValue]);
    await dbutil.destroy();
    return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add customer
 * @param {*} customer 
 */
const add = async (customer) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into customer(username,password,name,sex,email,address) values(@username,@password,@name,@sex,@email,@address)
  `;
  let result = await dbutil.run(sql, customer);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query single customer intormation according to the id
 * @param {*} id customer id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,username,name,email,sex,address from customer where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * delete customer intormation according to the id
 * @param {*} id customer id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from customer where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

const updateProfile = async (id, customer) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update customer set name=?,sex=?,email=?,address=? where id = ?";
  let result = await dbutil.run(sql, [
    customer.name,
    customer.sex,
    customer.email,
    customer.address,
    id
  ]);
  await dbutil.destroy();
  return result;
};
exports.updateProfile = updateProfile;

