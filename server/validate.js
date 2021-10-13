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
        if (sensorID === undefined) return undefined;
        sensorID = escape(sensorID);
        //TODO
        return sensorID;
    },

    validateSensorNick : function (sensorNick) {
        if (sensorNick === undefined) return undefined;
        sensorNick = escape(sensorNick);
        //TODO
        return sensorNick;
    },

    validateSensorType : function (sensorType) {
        if (sensorType === undefined) return undefined;
        sensorType = escape(sensorType);
        //TODO
        return sensorType;
    },

    validateSensorTypeID : function (sensorTypeID) {
        if (sensorTypeID === undefined) return undefined;
       sensorTypeID = escape(sensorTypeID);
       //TODO
        return sensorTypeID;
    },

    validateDate : function (date) {
        if (date === undefined) return undefined;
        if (!moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            date = new Date(new Date().getTime() + 2 * 3600 * 1000);
            date = date.toISOString().slice(0, 19).replace('T', ' ');
        }
        date = escape(date);
        //TODO
        return date;
    },

    validateValue : function (value) {
        if (value === undefined) return undefined;
        value = escape(value);
        //TODO
        return value;
    },

    validateUnit : function (value) {
        if (value === undefined) return undefined;
        value = escape(value);
        //TODO
        return value;
    },

    validateRepetitions  : function (repetitions) {
        if (repetitions === undefined) return undefined;
        repetitions = escape(repetitions);
        //TODO
        return repetitions;
    },

    validateBrakeTime  : function (brakeTime) {
        if (brakeTime === undefined) return undefined;
        brakeTime = escape(brakeTime);
        //TODO
        return brakeTime;
    },

    validateSleepTime  : function (sleepTime) {
        if (sleepTime === undefined) return undefined;
        sleepTime = escape(sleepTime);
        //TODO
        return sleepTime;
    }
}