const mysql = require('mysql');
const moment = require('moment');
moment().format();

function escape (statement) {
    statement = mysql.escape(statement);
    if (isNaN(statement)) {
        statement = statement.substring(1, statement.length - 1);
    }
    return statement;
}

module.exports  = {
    validateSensorID : function (sensorID) {
        sensorID = escape(sensorID);
        console.log(sensorID);
        //TODO
        return sensorID;
    },

    validateSensorNick : function (sensorNick) {
        sensorNick = escape(sensorNick);
        console.log(sensorNick);
        //TODO
        return sensorNick;
    },

    validateSensorType : function (sensorType) {
        sensorType = escape(sensorType);
        console.log(sensorType);
        //TODO
        return sensorType;
    },

    validateDate : function (date) {
        if (date !== undefined){
            if (!moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
                date = new Date(new Date().getTime() + 2 * 3600 * 1000);
                date = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            date = escape(date);
        }
        console.log(date);
        //TODO
        return date;
    },

    validateValue : function (value) {
        value = escape(value);
        console.log(value);
        //TODO
        return value;
    }
}