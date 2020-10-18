const fs = require("fs");
const Database = require('better-sqlite3');
class DBUtil {
    constructor(dbfile) {
        this.dbfile = dbfile;
        this.db = new Database(this.dbfile, { verbose: console.log });
        let exist = fs.existsSync(this.dbfile);
        if (!exist) {
            console.log("Creating db file!");
            fs.openSync(dbfile, "w");
        }
    }

    get = (sql, params) => {
        const stmt = this.db.prepare(sql);
        return stmt.get(params);
    }

    query = (sql, params) => {
        const stmt = this.db.prepare(sql);
        return stmt.all(params);
    }

    run = (sql, params) => {
        const stmt = this.db.prepare(sql);
        return stmt.run(params);
    }

    getDB = () => {
        return this.db;
    }

    destroy = () => {
        if (this.db) {
            this.db.close();
        }
    }
}

exports.DBUtil = DBUtil;