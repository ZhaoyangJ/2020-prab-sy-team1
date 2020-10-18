const { DBUtil } = require("../db/sqlite");
const dbfile = "./db/pet.db";

const DSSSchema = {
  id: { required: false },
  parent_id: { required: true },
  content: { required: false },
};
exports.DSSSchema = DSSSchema;

/**
 * 
 * @param {*} parentId 
 */
const queryByParent = async (parentId) => {
    const dbutil = new DBUtil(dbfile);
    const sql = `select id,parent_id,content from dss_menu where parent_id = ?`;
    let result = await dbutil.query(sql, [parentId]);
    await dbutil.destroy();
    return result;
};
exports.queryByParent = queryByParent;