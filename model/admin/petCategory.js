const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const PetCategorySchema = {
  id: { required: false },
  name: { required: true },
  description: { required: true },
  create_at: { required: false },
};
exports.PetCategorySchema = PetCategorySchema;


/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `select *from pet_category where ${fieldName} = ?`;
  let result = await dbutil.get(sql, [fieldValue]);
  await dbutil.destroy();
  return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add pet category
 * @param {*} petCategory
 */
const add = async (petCategory) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into pet_category(name,description) values(@name,@description)
  `;
  let result = await dbutil.run(sql, petCategory);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query pet category intormation
 */
const list = async () => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,name,description,create_at from pet_category order by create_at desc
  `;
  let result = await dbutil.query(sql,[]);
  await dbutil.destroy();
  return result;
};
exports.list = list;

const queryByPname = async (pName) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `
        select id,name,description,create_at from pet_category where name like '%${pName}%' order by create_at desc
    `;
    let result = await dbutil.query(sql, []);
    await dbutil.destroy();
    return result;
};
exports.queryByPname = queryByPname;

/**
 * query single pet category intormation according to the id
 * @param {*} id category id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select id,name,description,create_at from pet_category where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * delete pet category intormation according to the id
 * @param {*} id customer id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet_category where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

const updatePetCategory = async (id, petCategory) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update pet_category set name=?,description=? where id = ?";
  let result = await dbutil.run(sql, [
    petCategory.name,
    petCategory.description,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.updatePetCategory = updatePetCategory;
