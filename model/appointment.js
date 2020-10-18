const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const AppointmentSchema = {
  id: { required: false },
  pet_id: { required: true },
  veterinary_id: { required: true },
  description: { required: false },
  appointment_date: { required: true },
  appointment_time_period: { required: true },
  create_at: { required: false },
};
exports.AppointmentSchema = AppointmentSchema;

/**
 * add appointment record
 * @param {*} appointment
 */
const add = async (appointment) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into t_appointment(pet_id,veterinary_id,description,appointment_date,appointment_time_period) values(@pet_id,@veterinary_id,@description,@appointment_date,@appointment_time_period)
  `;
  let result = await dbutil.run(sql, appointment);
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
    select 
      p.name as petName, p.sex as petSex,
      ta.*
    from 
      pet p, t_appointment ta
    where
      p.id = ta.pet_id and ta.id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 *
 * @param {*} veterinaryId
 * @param {*} period
 */
const queryAppointmentPeriod = async (veterinaryId, appointment_date) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select *from t_appointment where veterinary_id = ? and appointment_date = ?
    `;
  let result = await dbutil.query(sql, [veterinaryId, appointment_date]);
  await dbutil.destroy();
  return result;
};
exports.queryAppointmentPeriod = queryAppointmentPeriod;

/**
 *
 * @param {*} veterinaryId
 * @param {*} period
 */
const checkExist = async (
  petId,
  veterinaryId,
  appointment_date,
  appointment_time_period
) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select 
    *from 
      t_appointment 
    where 
      pet_id = ? and veterinary_id = ? and appointment_date = ? and appointment_time_period =? 
  `;
  let result = await dbutil.get(sql, [
    petId,
    veterinaryId,
    appointment_date,
    appointment_time_period,
  ]);
  await dbutil.destroy();
  return result;
};
exports.checkExist = checkExist;

/**
 * query all the appointments according specified
 * veterinary id
 * @param {*} veterinaryId 
 */
const getByVeterinary = async (veterinaryId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      p.name as petName, p.sex as petSex,
      c.username as customerName,
      ta.*
    from 
      pet p, t_appointment ta, customer c
    where 
      p.owner_id = c.id and p.id = ta.pet_id and ta.veterinary_id = ?
  `;
  let result = await dbutil.query(sql, [veterinaryId]);
  await dbutil.destroy();
  return result;
};
exports.getByVeterinary = getByVeterinary;
