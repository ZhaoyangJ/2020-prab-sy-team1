const { DBUtil } = require("../../db/sqlite");
const dbfile = "./db/pet.db";

const PetParsitePrevetionProductSchema = {
  id: { required: false },
  name: { required: true },
  description: { required: false },
  create_at: { required: false }
};
exports.PetParsitePrevetionProductSchema = PetParsitePrevetionProductSchema;

/**
 * check whether the field exists
 * @param {*} fieldName the field to be checked
 * @param {*} fieldValue the field value of the field to be checked
 */
const checkExistByField = async (fieldName, fieldValue) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `select *from pet_parasite_prevention_product where ${fieldName} = ?`;
  let result = await dbutil.get(sql, [fieldValue]);
  await dbutil.destroy();
  return result;
};
exports.checkExistByField = checkExistByField;

/**
 * add pet parasite prevention product
 * @param {*} petParasitePreventionProduct
 */
const add = async (petParasitePreventionProduct) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into pet_parasite_prevention_product(name,description) values(@name,@description)
  `;
  let result = await dbutil.run(sql, petParasitePreventionProduct);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query pet parasite prevention product intormation
 */
const list = async () => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select * from pet_parasite_prevention_product order by create_at desc
  `;
  let result = await dbutil.query(sql,[]);
  await dbutil.destroy();
  return result;
};
exports.list = list;

/**
 * query pet parasite prevention product according to name
 * @param {*} name pet parasite prevention product name
 */
const queryByName = async (name) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `
        select * from pet_parasite_prevention_product where name like '%${name}%' order by create_at desc
    `;
    let result = await dbutil.query(sql, []);
    await dbutil.destroy();
    return result;
};
exports.queryByName = queryByName;

/**
 * query single pet parasite prevention product according to the id
 * @param {*} id pet parasite prevention product id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select  *from pet_parasite_prevention_product where id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * delete pet parasite prevention product according to the id
 * @param {*} id pet parasite prevention product id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet_parasite_prevention_product where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

/**
 * update pet parasite prevention product information
 * @param {*} id 
 * @param {*} petParasitePreventionProduct 
 */
const update = async (id, petParasitePreventionProduct) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "update pet_parasite_prevention_product set name=?,description=? where id = ?";
  let result = await dbutil.run(sql, [
    petParasitePreventionProduct.name,
    petParasitePreventionProduct.description,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.update = update;
