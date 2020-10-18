const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const PetMedicationSchema = {
  id: { required: false },
  appointment_id: { required: true },
  pet_id: { required: true },
  recorder_id: { required: true },
  medication_type_id: { required: true },
  medication_duration: { required: false },
  medication_date: { required: false },
  create_at: { required: false },
};
exports.PetMedicationSchema = PetMedicationSchema;

/**
 * add pet medication
 * @param {*} petMedication
 */
const addMedication = async (petMedication) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into 
    pet_medication(appointment_id,pet_id,recorder_id,medication_type_id,medication_duration,medication_date) 
    values(@appointment_id,@pet_id,@recorder_id,@medication_type_id,@medication_duration,@medication_date)
  `;
  let result = await dbutil.run(sql, petMedication);
  await dbutil.destroy();
  return result;
};
exports.addMedication = addMedication;

/**
 * @param {*} id pet medication id
 */
const getById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      pm.*,
      mt.name as medication_type,
      ta.description as symptom_description,
      ta.appointment_date as appointment_date,
      ta.appointment_time_period,
      p.name as petName,
      v.email as veterinary,
      c.username as customer
    from 
      pet_medication pm,
      t_appointment ta,
      pet p,
      veterinary v,
      customer c,
      medication_type mt
    where
      pm.appointment_id = ta.id 
      and pm.pet_id = p.id
      and p.owner_id = c.id
      and pm.recorder_id = v.id
      and mt.id = pm.medication_type_id
      and pm.id = ?
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
      pm.*,
      mt.name as medication_type
    from 
      pet_medication pm, medication_type mt
    where 
      pm.appointment_id = ? and mt.id = pm.medication_type_id
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
      pm.*,
      mt.name as medication_type
    from 
      pet_medication pm, medication_type mt
    where 
      pm.pet_id = ? and mt.id = pm.medication_type_id
    order by create_at desc
  `;
    let result = await dbutil.query(sql, [petId]);
    await dbutil.destroy();
    return result;
};
exports.getByPet = getByPet;

