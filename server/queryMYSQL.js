const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const util = require('util');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const sqlLogFile =  path.join(__dirname, "../logging/sql.log");

let stream = fs.createWriteStream(sqlLogFile, {flags : 'a'});

function logDB(e) {
    stream.write("[SQL QUERY -> " + new Date().toISOString() + "] " + e + "\n");
}

module.exports  = {
    GET_id : async function () {
        const sql = "SELECT * FROM id INNER JOIN types ON id.sensor_type_id=types.sensor_type_id;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensor_id : async function (sensor_id) {
        const sql = "SELECT * FROM id INNER JOIN types ON id.sensor_type_id=types.sensor_type_id WHERE sensor_id='" + sensor_id + "';";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensor_id_sensor_nick : async function (sensor_id) {
        const sql = "SELECT sensor_nick FROM id WHERE sensor_id='" + sensor_id + "';";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensor_id_sensor_type :async function (sensor_id) {
        const sql = "SELECT types.sensor_type FROM id INNER JOIN types ON id.sensor_type_id=types.sensor_type_id WHERE sensor_id='" + sensor_id + "' ;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensor_id_sensor_type_id :async function (sensor_id) {
        const sql = "SELECT sensor_type_id FROM id WHERE sensor_id='" + sensor_id + "' ;";
        logDB(sql);
        return await con.query(sql);
    },

    POST_id : async function (sensor_id, sensor_nick) {
        let sql = "INSERT INTO id (sensor_id, sensor_type_id, sensor_nick) VALUES ('"+sensor_id+"',0,'"+sensor_nick+"');";
        logDB(sql);
        try {
            await con.query(sql).then(async function (){
                sql = "CREATE TABLE "+ sensor_id +" (row_id BIGINT NOT NULL AUTO_INCREMENT, date datetime, value float(10,2), CONSTRAINT PRIMARY KEY (row_id));"
                logDB(sql);
                await con.query(sql);
            });
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }

    },

    PUT_id_sensor_id_sensor_nick : async function (sensor_id, sensor_nick) {
        let sql = "UPDATE id SET sensor_nick='"+ sensor_nick +"' WHERE sensor_id='" + sensor_id +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    PUT_id_sensor_id_sensor_type_id : async function (sensor_id, sensor_type_id) {
        if ((await this.GET_types_sensor_type_id(sensor_type_id)).length === 0) {
            logDB("sensor_type_id doesn't exist");
            return "sensor_type_id doesn't exist";
        }
        let sql = "UPDATE id SET sensor_type_id="+ sensor_type_id +" WHERE sensor_id='" + sensor_id +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_id_sensor_id : async function (sensor_id) {
        let sql = "DELETE FROM id WHERE sensor_id='" + sensor_id +"';";
        logDB(sql);
        try {
            await con.query(sql).then(async function (){
                sql = "DROP TABLE " + sensor_id + ";"
                logDB(sql);
                await con.query(sql, [sensor_id]);

            });
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    GET_sensor_id_last : async function(sensor_id, date2) {
        //TODO Optimization for MYSQL
        return await this.GET_sensor_id(sensor_id, date2, 1);
    },

    GET_sensor_id : async function (sensor_id, date1, date2, limit) {
        let sql = "SELECT * FROM " + sensor_id;
        if (date1 !== undefined && date2 !== undefined) {
            sql += " WHERE date <= '" + date1 + "' AND date >='" + date2 + "'";
        } else if (date1 !== undefined) {
            sql += " WHERE date <= '" + date1 + "'";
        } else if (date2 !== undefined) {
            sql += " WHERE date >= '" + date2 + "'"
        }
        if (limit !== undefined) {
            sql += " ORDER BY row_id DESC FETCH FIRST " + limit + " ROWS ONLY";
        }
        sql += ";";
        logDB(sql);
        return await con.query(sql);
    },

    POST_sensor_id : async function (sensor_id, date, value) {
        try {
            let sql = "INSERT INTO "+ sensor_id +" (date, value) VALUES ('"+date+"','"+value+"');";
            logDB(sql);
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_sensor_id : async function (sensor_id, date1, date2) {
        try {
            let sql = "DELETE FROM " + sensor_id;
            if (date1 !== undefined && date2 !== undefined) {
                sql += " WHERE date <= '" + date1 + "' AND date >='" + date2 + "'";
            } else if (date1 !== undefined) {
                sql += " WHERE date <= '" + date1 + "'";
            } else if (date2 !== undefined) {
                sql += " WHERE date >= '" + date2 + "'"
            }
            sql += ";";
            logDB(sql);
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    GET_types : async function () {
        const sql = "SELECT * FROM types;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_types_sensor_type_id : async function (sensor_type_id) {
        const sql = "SELECT * FROM types WHERE sensor_type_id=" + sensor_type_id + ";";
        logDB(sql);
        return await con.query(sql);
    },

    POST_types : async function(sensor_type, unit, repetitions, sleep_time) {
        const sql = "INSERT INTO types (sensor_type, unit" +
            (repetitions ? ",repetitions" : "" )+
            (sleep_time ? ",sleep_time" : "" )+
            ") VALUES ('" +
            sensor_type +"', '" + unit +"'" +
            (repetitions ? "," + repetitions : "")+
            (sleep_time ? "," + sleep_time : "" )+
            ");";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    PUT_types : async function(sensor_type, sensor_type_id, unit, repetitions, sleep_time) {
        const sql = "UPDATE types SET sensor_type='"+ sensor_type +"', unit='" + unit +"'" +
            (repetitions ? ", repetitions=" + repetitions : "")+
            (sleep_time ? ", sleep_time=" + sleep_time : "") +
            " WHERE sensor_type_id='" + sensor_type_id +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_sensor_type_id : async function (sensor_type_id) {
        try {
            if (sensor_type_id.toString() !== "0") {
                let sql = "DELETE FROM types WHERE sensor_type_id='" + sensor_type_id + "';";
                logDB(sql);
                await con.query(sql).then(function () {
                    sql = "UPDATE id SET sensor_type_id=0 WHERE sensor_type_id=" +sensor_type_id + ";";
                    con.query(sql);
                });
                return true;
            } else {
                logDB("CAN'T DELETE DEFAULT VALUE");
                return "CAN'T DELETE DEFAULT VALUE";
            }
        } catch (e) {
            logDB(e);
            return e;
        }
    },

}

/**
 * MYSQL Database login data from .env
 */

const dbLogin = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

function makeDb() {
    const connection = mysql.createConnection(dbLogin);
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
    };
}

/**
 * try to establish db connection
 */

let con;

try {
    con = makeDb();
} catch (e) {
    logDB(e);
}