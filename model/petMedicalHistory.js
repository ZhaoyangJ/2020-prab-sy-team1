const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const PetMedicalHistorySchema = {
  id: { required: false },
  appointment_id: { required: true },
  pet_id: { required: true },
  recorder_id: { required: true },
  parasite_prevention_product_id: { required: true },
  check_up: { required: false },
  medication_date: { required: false },
  create_at: { required: false },
};
exports.PetMedicalHistorySchema = PetMedicalHistorySchema;

/**
 * add pet medicatl history
 * @param {*} petMedicalHistory
 */
const addRecord = async (petMedicalHistory) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into 
    pet_medical_history(appointment_id,pet_id,recorder_id,parasite_prevention_product_id,check_up,medication_date) 
    values(@appointment_id,@pet_id,@recorder_id,@parasite_prevention_product_id,@check_up,@medication_date)
  `;
  let result = await dbutil.run(sql, petMedicalHistory);
  await dbutil.destroy();
  return result;
};
exports.addRecord = addRecord;

/**
 * 
 * @param {*} id pet medical history id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      pmh.*,
      pppp.name as parasite_prevention_product,
      ta.description as symptom_description,
      ta.appointment_date as appointment_date,
      ta.appointment_time_period,
      p.name as petName,
      v.email as veterinary,
      c.username as customer
    from 
      pet_medical_history pmh,
      t_appointment ta,
      pet p,
      veterinary v,
      customer c,
      pet_parasite_prevention_product pppp
    where
      pmh.appointment_id = ta.id 
      and pmh.pet_id = p.id
      and p.owner_id = c.id
      and pmh.recorder_id = v.id
      and pppp.id = pmh.parasite_prevention_product_id
      and pmh.id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getById = getById;

/**
 * 
 * @param {*} appointmentId 
 */
const getByAppointment = async (appointmentId) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `
    select
      pmh.*,
      pppp.name as parasite_prevention_product
    from 
      pet_medical_history pmh, pet_parasite_prevention_product pppp
    where 
      pmh.appointment_id = ? and pppp.id = pmh.parasite_prevention_product_id
    order by create_at desc
  `;
    let result = await dbutil.query(sql, [appointmentId]);
    await dbutil.destroy();
    return result;
};
exports.getByAppointment = getByAppointment;

/**
 * 
 * @param {*} petId 
 */
const getByPet = async (petId) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `
    select
      pmh.*,
      pppp.name as parasite_prevention_product
    from 
      pet_medical_history pmh, pet_parasite_prevention_product pppp
    where 
      pmh.pet_id = ? and pppp.id = pmh.parasite_prevention_product_id
    order by create_at desc
  `;
    let result = await dbutil.query(sql, [petId]);
    await dbutil.destroy();
    return result;
};
exports.getByPet = getByPet;

