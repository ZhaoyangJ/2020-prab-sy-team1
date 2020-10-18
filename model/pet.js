const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const PetSchema = {
  id: { required: false },
  owner_id: { required: true },
  pet_category_id: { required: true },
  name: { required: true },
  sex: { required: true },
  weight: { required: true },
  date_of_birth: { required: true },
  husbandry_info: { required: true },
  create_at: { required: false },
};
exports.PetSchema = PetSchema;

/**
 * add pet
 * @param {*} pet
 */
const add = async (pet) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into pet(owner_id,pet_category_id,name,sex,weight,date_of_birth,husbandry_info) values(@owner_id,@pet_category_id,@name,@sex,@weight,@date_of_birth,@husbandry_info)
  `;
  let result = await dbutil.run(sql, pet);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * query single pet intormation according to the id
 * @param {*} id pet id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select pc.name as category, p.*, c.username as owner
    from pet p, customer c, pet_category pc 
    where p.id = ? and p.owner_id = c.id and pc.id = p.pet_category_id
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * query all pets
 */
const listAll = async () => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
      pc.name as category, 
      p.*, 
      c.username as owner 
    from 
      pet p, customer c, pet_category pc 
    where 
      p.owner_id = c.id and pc.id = p.pet_category_id
    order by create_at desc
  `;
  let result = await dbutil.query(sql, []);
  await dbutil.destroy();
  return result;
};
exports.listAll = listAll;

/**
 * query all pets according to the owner id
 * @param {*} owner_id owner id
 */
const listByOwner = async (owner_id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select p.*,pc.name as category 
    from pet p, customer c, pet_category pc 
    where p.owner_id = ? and p.owner_id = c.id and pc.id = p.pet_category_id
    order by create_at desc
  `;
  let result = await dbutil.query(sql, [owner_id]);
  await dbutil.destroy();
  return result;
};
exports.listByOwner = listByOwner;

/**
 * query pet according to its name
 * @param {*} name pet name
 */
const listByName = async (pname) => {
   const dbutil = new DBUtil(dbfile);
   const sql = `
    select p.*,pc.name as category,c.name as owner
    from pet p, customer c, pet_category pc 
    where p.name like '%${pname}%' and p.owner_id = c.id and pc.id = p.pet_category_id
    order by create_at desc
  `;
   let result = await dbutil.query(sql, []);
   await dbutil.destroy();
   return result;
};
exports.listByName = listByName;

/**
 * query pet according to category id
 * @param {*} categoryId pet category id
 */
const listByCategory = async (categoryId) => {
   const dbutil = new DBUtil(dbfile);
   const sql = `
    select p.*,pc.name as category, c.name as owner
    from pet p, customer c, pet_category pc 
    where p.pet_category_id = ?  and p.owner_id = c.id and pc.id = p.pet_category_id
    order by create_at desc
  `;
   let result = await dbutil.query(sql, [categoryId]);
   await dbutil.destroy();
   return result;
};
exports.listByCategory = listByCategory;

/**
 * delete pet intormation according to the id
 * @param {*} id pet id
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = "delete from pet where id = ?";
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;

const update = async (id, pet) => {
  const dbutil = new DBUtil(dbfile);
  const sql =` 
        update pet set pet_category_id=?, name=?,sex=?,weight=?,date_of_birth=?,husbandry_info=? where id = ?
    `;
  let result = await dbutil.run(sql, [
    pet.pet_category_id,
    pet.name,
    pet.sex,
    pet.weight,
    pet.date_of_birth,
    pet.husbandry_info,
    id,
  ]);
  await dbutil.destroy();
  return result;
};
exports.update = update;
