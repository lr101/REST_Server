module.exports = {
    serverLogFile : function(){return "./logging/server.log";},
    sqlLogFile : function(){return "./logging/sql.log";},


    idTable : function() {
        return {
            tableName: "id",
            sensorType: "sensorType",          //type: char(16)
            sensorID: "sensorID",  //type: char(16)
            sensorNick: "sensorNick"       //type: char(16)
        }
    },

    tempTable : function() {
        return {
            date: "date",    //type: float(10,2)
            value: "value"   //type: datetime
        };
    },

    dbLogin : function() {
        return {
            host: "100.85.77.19",
            user: "user",
            password: "root",
            database: "sensors"
        };
    }
}