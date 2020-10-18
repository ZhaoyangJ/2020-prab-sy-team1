const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const SymptomSchema = {
  id: { required: false },
  recorder_id: { required: true },
  name: { required: true },
  duration: { required: true },
  frequency: { required: true },
  release_date: { required: false },
  create_at: { required: false },
};
exports.SymptomSchema = SymptomSchema;

/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `select *from symptom where ${fieldName} = ?`;
  let result = await dbutil.get(sql, [fieldValue]);
  await dbutil.destroy();
  return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add symptom
 * @param {*} symptom
 */
const add = async (symptom) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into symptom(recorder_id,name,duration,frequency) 
    values(@recorder_id,@name,@duration,@frequency)
  `;
  let result = await dbutil.run(sql, symptom);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query symptoms
 */
const list = async (recorderId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select *from symptom where recorder_id = ? order by create_at desc
  `;
  let result = await dbutil.query(sql, [recorderId]);
  await dbutil.destroy();
  return result;
};
exports.list = list;

/**
 * list all the symptoms with not corresponding to 
 * any diagnosings
 * @param {*} recorderId recorder id
 */
const listAllNotInDiagnosing = async (recorderId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
      *
    from 
      symptom
    where
      recorder_id = ? and id not in (select symptom_id from diagnosing)
  `;
  let result = await dbutil.query(sql, [recorderId]);
  await dbutil.destroy();
  return result;
};
exports.listAllNotInDiagnosing = listAllNotInDiagnosing;

/**
 * query single symptom intormation according to the id
 * @param {*} id symptom id
 */
const getSymptom = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select *from symptom where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getSymptom = getSymptom;

/**
 * update the symptom's information
 * @param {*} id
 * @param {*} symptom
 */
const updateSymptom = async (id, symptom) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update symptom set name=?, duration=?,frequency=? where id = ?";
  let result = await dbutil.run(sql, [
    symptom.name,
    symptom.duratoin,
    symptom.frequency,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.updateSymptom = updateSymptom;

/**
 * delete symptom according to the id
 * @param {*} id symptom id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from symptom where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;
