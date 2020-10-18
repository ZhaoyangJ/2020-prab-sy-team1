const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const DiagnosingSchema = {
  id: { required: false },
  recorder_id: { required: true },
  symptom_id: { required: true },
  name: { required: true },
  result: { required: true },
  solution: { required: true },
  suggestion: { required: true },
  create_at: { required: false },
};
exports.DiagnosingSchema = DiagnosingSchema;

/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `select *from diagnosing where ${fieldName} = ?`;
  let result = await dbutil.get(sql, [fieldValue]);
  await dbutil.destroy();
  return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add diagnosing
 * @param {*} diagnosing
 */
const add = async (diagnosing) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into diagnosing(recorder_id,symptom_id,name,result,solution,suggestion) 
    values(@recorder_id,@symptom_id,@name,@result,@solution,@suggestion)
  `;
  let result = await dbutil.run(sql, diagnosing);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query diagnosing
 */
const list = async (recorderId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
      d.*,
      s.id as symptomId,
      s.name as symptomName
    from 
      diagnosing d, 
      symptom s 
    where 
      d.recorder_id = ? and d.symptom_id = s.id
    order by d.create_at desc
  `;
  let result = await dbutil.query(sql, [recorderId]);
  await dbutil.destroy();
  return result;
};
exports.list = list;

/**
 * query single diagnosing intormation according to the id
 * @param {*} id diagnosing id
 */
const getDiagnosing = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
      d.*,
      s.id as symptomId,
      s.name as symptomName
    from 
      diagnosing d, 
      symptom s 
    where 
      d.id = ? and d.symptom_id = s.id
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getDiagnosing = getDiagnosing;

/**
 * query single diagnosing intormation according to the symptom id
 * @param {*} symptomId symptom id
 */
const getDiagnosingBySymptom = async (symptomId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
      d.*,
      s.id as symptomId,
      s.name as symptomName
    from 
      diagnosing d, 
      symptom s 
    where 
      d.symptom_id = ? and d.symptom_id = s.id
  `;
  let result = await dbutil.get(sql, [symptomId]);
  await dbutil.destroy();
  return result;
};
exports.getDiagnosingBySymptom = getDiagnosingBySymptom;

/**
 * update the diagnosing's information
 * @param {*} id
 * @param {*} symptom
 */
const updateDiagnosing = async (id, diagnosing) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
        update diagnosing 
        set symptom_id=?, name=?, result=?, solution=?, suggestion=?
        where id = ?
    `;
  let result = await dbutil.run(sql, [
    diagnosing.symptom_id,
    diagnosing.name,
    diagnosing.result,
    diagnosing.solution,
    diagnosing.suggestion,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.updateDiagnosing = updateDiagnosing;

/**
 * delete diagnosing according to the id
 * @param {*} id diagnosing id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from diagnosing where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;
