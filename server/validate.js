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
        //TODO
        return sensorID;
    },

    validateSensorNick : function (sensorNick) {
        sensorNick = escape(sensorNick);
        //TODO
        return sensorNick;
    },

    validateSensorType : function (sensorType) {
        sensorType = escape(sensorType);
        //TODO
        return sensorType;
    },

    validateSensorTypeID : function (sensorTypeID) {
       sensorTypeID = escape(sensorTypeID);
       //TODO
        return sensorTypeID;
    },

    validateDate : function (date) {
        if (date !== undefined) {
            if (!moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
                date = new Date(new Date().getTime() + 2 * 3600 * 1000);
                date = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            date = escape(date);
        }
        //TODO
        return date;
    },

    validateValue : function (value) {
        value = escape(value);
        //TODO
        return value;
    },

    validateUnit : function (value) {
        value = escape(value);
        //TODO
        return value;
    }
}