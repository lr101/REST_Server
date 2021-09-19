
const fs = require('fs');
const path = require('path');
const sqlLogFile =  path.join(__dirname, "../logging/sql.log");

let stream = fs.createWriteStream(sqlLogFile, {flags : 'a'});

function logDB(e) {
    stream.write("[SQL QUERY -> " + new Date().toISOString() + "] " + e + "\n");
}

module.exports  = {
    GET_id : async function (con) {
        const sql = "SELECT * FROM id;";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensorID : async function (con, sensorID) {
        const sql = "SELECT * FROM id WHERE sensorID='" + sensorID + "';";
        logDB(sql);
        return await con.query(sql);
        },

    GET_id_sensorID_sensorNick : async function (con, sensorID) {
        const sql = "SELECT sensorNick FROM id WHERE sensorID='" + sensorID + "';";
        logDB(sql);
        return await con.query(sql);
    },

    GET_id_sensorID_sensorType :async function (con, sensorID) {
        const sql = "SELECT sensorType FROM id WHERE sensorID='" + sensorID + "';";
        logDB(sql);
        return await con.query(sql);
    },

    POST_id : async function (con, sensorID, sensorType, sensorNick) {
        let sql = "INSERT INTO id (sensorID, sensorType, sensorNick) VALUES ('"+sensorID+"','"+sensorType+"','"+sensorNick+"');";
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

    PUT_id_sensorID_sensorType : async function (con, sensorID, sensorType) {
        let sql = "UPDATE id SET sensorType='"+ sensorType +"' WHERE sensorID='" + sensorID +"'";
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
    }

}