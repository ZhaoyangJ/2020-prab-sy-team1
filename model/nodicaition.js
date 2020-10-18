const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const NotificationSchema = {
  id: { required: false },
  pet_id: { required: true },
  reminder_id: { required: true },
  title: { required: true },
  message: { required: true },
  status: { required: false },
  reminder_datetime: { required: true },
  create_at: { required: false },
};
exports.NotificationSchema = NotificationSchema;

/**
 * add notification
 * @param {*} notification
 */
const add = async (notification) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    insert into notification(pet_id,reminder_id,title,message,reminder_datetime) 
    values(@pet_id,@reminder_id,@title,@message,@reminder_datetime)
  `;
  let result = await dbutil.run(sql, notification);
  await dbutil.destroy();
  return result;
};
exports.add = add;

/**
 * get unique notification according to its id
 * @param {*} id 
 */
const getNotification = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      n.*,
      p.name as petName,
      c.username as customer,
      v.email as reminder
    from 
      notification n, 
      pet p, 
      customer c,
      veterinary v
    where 
      n.pet_id = p.id
      and p.owner_id = c.id
      and v.id = n.reminder_id
      and n.id = ?
  `;
  let result = await dbutil.get(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.getNotification = getNotification;

/**
 * get all the notifications
 * @param {*} cid 
 */
const getNotificationsByCustomer = async (cid) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      n.*,
      p.name as petName,
      c.username as customer
    from 
      notification n, 
      pet p, 
      customer c
    where 
      n.pet_id = p.id
      and p.owner_id = c.id
      and c.id = ?
  `;
  let result = await dbutil.query(sql, [cid]);
  await dbutil.destroy();
  return result;
};
exports.getNotificationsByCustomer = getNotificationsByCustomer;

/**
 * get all the unread notifications
 * @param {*} cid 
 */
const getCustomerUnread = async (cid) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      n.*,
      p.name as petName,
      c.username as customer
    from 
      notification n, 
      pet p, 
      customer c
    where 
      n.pet_id = p.id
      and n.status = ?
      and p.owner_id = c.id
      and c.id = ?
    order by n.create_at desc
  `;
  let result = await dbutil.query(sql, [0, cid]);
  await dbutil.destroy();
  return result;
};
exports.getCustomerUnread = getCustomerUnread;

/**
 * get all the read notifications
 * @param {*} cid 
 */
const getCustomerRead = async (cid) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `
    select
      n.*,
      p.name as petName,
      c.username as customer
    from 
      notification n, 
      pet p, 
      customer c
    where 
      n.pet_id = p.id
      and n.status = ?
      and p.owner_id = c.id
      and c.id = ?
    order by n.create_at desc
  `;
  let result = await dbutil.query(sql, [1, cid]);
  await dbutil.destroy();
  return result;
};
exports.getCustomerRead = getCustomerRead;

/**
 * update the status of the notification
 * @param {*} id 
 * @param {*} status 
 */
const updateNotificationStatus = async (id, status) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `update notification set status = ? where id = ?`;
  let result = await dbutil.run(sql, [status, id]);
  await dbutil.destroy();
  return result;
};
exports.updateNotificationStatus = updateNotificationStatus;

/**
 * delete notification according to its id
 * @param {*} id 
 */
const deleteById = async (id) => {
  const dbutil = new DBUtil(dbfile);
  const sql = `delete from notification where id = ?`;
  let result = await dbutil.run(sql, [id]);
  await dbutil.destroy();
  return result;
};
exports.deleteById = deleteById;
