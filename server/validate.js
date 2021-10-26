const mysql = require('mysql');
const moment = require('moment');
const escapes = require('escape-html');
moment().format();

const MAX_CHAR = 16;

function escape (statement) {
    statement = mysql.escape(statement);
    if (isNaN(statement)) {
        statement = statement.substring(1, statement.length - 1);
    }
    return escapes(statement);
}

module.exports  = {
    validateSensorID : function (sensorID) {
        if (sensorID === undefined) return undefined;
        sensorID = escape(sensorID);
        if (sensorID.length === 0) return undefined;
        if (sensorID.length > MAX_CHAR) return undefined;
        return sensorID;
    },

    validateSensorNick : function (sensorNick) {
        if (sensorNick === undefined) return undefined;
        sensorNick = escape(sensorNick);
        if (sensorNick.length === 0) return undefined;
        if (sensorNick.length > MAX_CHAR) return undefined;
        return sensorNick;
    },

    validateSensorType : function (sensorType) {
        if (sensorType === undefined) return undefined;
        sensorType = escape(sensorType);
        if (sensorType.length === 0) return undefined;
        if (sensorType.length > MAX_CHAR) return undefined;
        return sensorType;
    },

    validateSensorTypeID : function (sensorTypeID) {
        if (sensorTypeID === undefined) return undefined;
        sensorTypeID = escape(sensorTypeID);
        if (isNaN(sensorTypeID)) return undefined;
        if (sensorTypeID < 0) return undefined;
        return sensorTypeID;
    },

    validateDate : function (date) {
        if (date === undefined) return undefined;
        if (!moment(date, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
            date = new Date(new Date().getTime() + 2 * 3600 * 1000);
            date = date.toISOString().slice(0, 19).replace('T', ' ');
        }
        date = escape(date);
        return date;
    },

    validateValue : function (value) {
        if (value === undefined) return undefined;
        value = escape(value);
        if (isNaN(value)) return undefined;
        return value;
    },

    validateUnit : function (unit) {
        if (unit === undefined) return undefined;
        unit = escape(unit);
        if (!isNaN(unit)) return undefined;
        if (unit.length === 0 || unit.length > 5) return undefined;
        return unit;
    },

    validateRepetitions  : function (repetitions) {
        if (repetitions === undefined) return undefined;
        repetitions = escape(repetitions);
        if (isNaN(repetitions)) return undefined;
        if (repetitions <= 0) return undefined;
        return repetitions;
    },

    validateSleepTime  : function (sleepTime) {
        if (sleepTime === undefined) return undefined;
        sleepTime = escape(sleepTime);
        if (isNaN(sleepTime)) return undefined;
        if (sleepTime < 0) return undefined;
        return sleepTime;
    }
}