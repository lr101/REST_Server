
const fs = require('fs');
const path = require('path');
const sqlLogFile =  path.join(__dirname, "../logging/sql.log");

let stream = fs.createWriteStream(sqlLogFile, {flags : 'a'});

function logDB(e) {
    stream.write("[SQL QUERY -> " + new Date().toISOString() + "] " + e + "\n");
}

module.exports  = {
    GET_id : async function (con) {
        const sql = "SELECT * FROM id INNER JOIN types ON id.sensorTypeID=types.sensorTypeID;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensorID : async function (con, sensorID) {
        const sql = "SELECT * FROM id INNER JOIN types ON id.sensorTypeID=types.sensorTypeID WHERE sensorID='" + sensorID + "';";
        logDB(sql);
        return await con.query(sql);
        },

    GET_id_sensorID_sensorNick : async function (con, sensorID) {
        const sql = "SELECT sensorNick FROM id WHERE sensorID='" + sensorID + "';";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensorID_sensorType :async function (con, sensorID) {
        const sql = "SELECT types.sensorType FROM id INNER JOIN types ON id.sensorTypeID=types.sensorTypeID WHERE sensorID='" + sensorID + "' ;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensorID_sensorTypeID :async function (con, sensorID) {
        const sql = "SELECT sensorTypeID FROM id WHERE sensorID='" + sensorID + "' ;";
        logDB(sql);
        return await con.query(sql);
    },

    POST_id : async function (con, sensorID, sensorTypeID, sensorNick) {
        if ((await this.GET_types_sensorTypeID(con, sensorTypeID)).length === 0) {
            sensorTypeID = 0;
        }
        let sql = "INSERT INTO id (sensorID, sensorTypeID, sensorNick) VALUES ('"+sensorID+"','"+sensorTypeID+"','"+sensorNick+"');";
        logDB(sql);
        try {
            await con.query(sql).then(async function (){
                sql = "CREATE TABLE "+ sensorID +" (rowID BIGINT NOT NULL AUTO_INCREMENT, date datetime, value float(10,2), CONSTRAINT PRIMARY KEY (rowID));"
                logDB(sql);
                await con.query(sql, [sensorID]);
            });
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }

    },

    PUT_id_sensorID_sensorNick : async function (con, sensorID, sensorNick) {
        let sql = "UPDATE id SET sensorNick='"+ sensorNick +"' WHERE sensorID='" + sensorID +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    PUT_id_sensorID_sensorTypeID : async function (con, sensorID, sensorTypeID) {
        if ((await this.GET_types_sensorTypeID(con, sensorTypeID)).length === 0) {
            logDB("SensorTypeID doesn't exist");
            return "SensorTypeID doesn't exist";
        }
        let sql = "UPDATE id SET sensorTypeID="+ sensorTypeID +" WHERE sensorID='" + sensorID +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_id_sensorID : async function (con, sensorID) {
        let sql = "DELETE FROM id WHERE sensorID='" + sensorID +"';";
        logDB(sql);
        try {
            await con.query(sql).then(async function (){
                sql = "DROP TABLE " + sensorID + ";"
                logDB(sql);
                await con.query(sql, [sensorID]);

            });
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    GET_sensorID : async function (con, sensorID, date1, date2) {
        let sql = "SELECT * FROM " + sensorID;
        if (date1 !== undefined && date2 !== undefined) {
            sql += " WHERE date <= '" + date1 + "' AND date >='" + date2 + "'";
        } else if (date1 !== undefined) {
            sql += " WHERE date <= '" + date1 + "'";
        } else if (date2 !== undefined) {
            sql += " WHERE date >= '" + date2 + "'"
        }
        sql += ";";
        logDB(sql);
        return await con.query(sql);
    },

    POST_sensorID : async function (con, sensorID, date, value) {
        try {
            let sql = "INSERT INTO "+ sensorID +" (date, value) VALUES ('"+date+"','"+value+"');";
            logDB(sql);
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_sensorID : async function (con, sensorID, date1, date2) {
        try {
            let sql = "DELETE FROM " + sensorID;
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

    GET_types : async function (con) {
        const sql = "SELECT * FROM types;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_types_sensorTypeID : async function (con, sensorTypeID) {
        const sql = "SELECT * FROM types WHERE sensorTypeID=" + sensorTypeID + ";";
        logDB(sql);
        return await con.query(sql);
    },

    POST_types : async function(con, sensorType) {
       const sql = "INSERT INTO types (sensorType) VALUES ('" + sensorType +"');";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    PUT_types : async function(con, sensorType, sensorTypeID) {
        const sql = "UPDATE types SET sensorType='"+ sensorType +"' WHERE sensorTypeID='" + sensorTypeID +"'";
        logDB(sql);
        try {
            await con.query(sql);
            return true;
        } catch (e) {
            logDB(e);
            return e;
        }
    },

    DELETE_sensorTypeID : async function (con,sensorTypeID) {
        try {
            if (sensorTypeID.toString() !== "0") {
                let sql = "DELETE FROM types WHERE sensorTypeID='" + sensorTypeID + "';";
                logDB(sql);
                await con.query(sql).then(function () {
                    sql = "UPDATE id SET sensorTypeID=0 WHERE sensorTypeID=" +sensorTypeID + ";";
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