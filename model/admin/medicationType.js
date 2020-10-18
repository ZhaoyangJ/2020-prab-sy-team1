const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const MedicationTypeSchema = {
  id: { required: false },
  name: { required: true },
  description: { required: false },
  create_at: { required: false },
};
exports.MedicationTypeSchema = MedicationTypeSchema;

/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `select *from medication_type where ${fieldName} = ?`;
  let result = await dbutil.get(sql, [fieldValue]);
  await dbutil.destroy();
  return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add medication type 
 * @param {*} medicationType
 */
const add = async (medicationType) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into medication_type(name,description) values(@name,@description)
  `;
  let result = await dbutil.run(sql, medicationType);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query medication type intormation
 */
const list = async () => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select * from medication_type order by create_at desc
  `;
  let result = await dbutil.query(sql, []);
  await dbutil.destroy();
  return result;
};
exports.list = list;

/**
 * query medication type according to name
 * @param {*} name  medication type
 */
const queryByName = async (name) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
        select * from medication_type where name like '%${name}%' order by create_at desc
    `;
  let result = await dbutil.query(sql, []);
  await dbutil.destroy();
  return result;
};
exports.queryByName = queryByName;

/**
 * query single medication type according to the id
 * @param {*} id medication type id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select  *from medication_type where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * delete medication type according to the id
 * @param {*} id medication type id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from medication_type where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

/**
 * update medication type information
 * @param {*} id
 * @param {*} medicationType
 */
const update = async (id, medicationType) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update medication_type set name=?,description=? where id = ?";
  let result = await dbutil.run(sql, [
    medicationType.name,
    medicationType.description,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.update = update;
