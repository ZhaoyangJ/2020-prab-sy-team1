const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const ReminderSchema = {
  id: { required: false },
  pet_id: { required: true },
  reminder_id: { required: true },
  title: { required: true },
  message: { required: true },
  status: { required: false },
  reminder_datetime: { required: true },
  create_at: { required: false },
};
exports.ReminderSchema = ReminderSchema;

/**
 * add reminder
 * @param {*} reminder
 */
const add = async (reminder) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into reminder(pet_id,reminder_id,title,message,reminder_datetime) 
    values(@pet_id,@reminder_id,@title,@message,@reminder_datetime)
  `;
  let result = await dbutil.run(sql, reminder);
  await dbutil.destroy();
  return result;
};
exports.add = add;

const getReminders = async (reminderId) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      r.*,
      p.name as petName,
      c.username as customer
    from 
      reminder r, 
      pet p, 
      customer c
    where 
      r.reminder_id = ? 
      and p.id = r.pet_id
      and p.owner_id = c.id
  `;
  let result = await dbutil.query(sql, [reminderId]);
  await dbutil.destroy();
  return result;
};
exports.getReminders = getReminders;

const deleteById = async (id) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `delete from reminder where id = ?`;
    let result = await dbutil.run(sql, [id]);
    await dbutil.destroy();
    return result;
};
exports.deleteById = deleteById;
