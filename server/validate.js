const mysql = require('mysql');
const moment = require('moment');
const escapes = require('escape-html');
moment().format();

const MAX_CHAR = 17;

function escape (statement) {
    statement = mysql.escape(statement);
    if (isNaN(statement)) {
        statement = statement.substring(1, statement.length - 1);
    }
    return escapes(statement);
}

module.exports  = {
    validatesensor_id : function (sensor_id) {
        if (sensor_id === undefined) return undefined;
        sensor_id = escape(sensor_id);
        if (sensor_id.length === 0) return undefined;
        if (sensor_id.length > MAX_CHAR) return undefined;
        return sensor_id;
    },

    validatesensor_nick : function (sensor_nick) {
        if (sensor_nick === undefined) return undefined;
        sensor_nick = escape(sensor_nick);
        if (sensor_nick.length === 0) return undefined;
        if (sensor_nick.length > MAX_CHAR) return undefined;
        return sensor_nick;
    },

    validatesensor_type : function (sensor_type) {
        if (sensor_type === undefined) return undefined;
        sensor_type = escape(sensor_type);
        if (sensor_type.length === 0) return undefined;
        if (sensor_type.length > MAX_CHAR) return undefined;
        return sensor_type;
    },

    validatesensor_type_id : function (sensor_type_id) {
        if (sensor_type_id === undefined) return undefined;
        sensor_type_id = escape(sensor_type_id);
        if (isNaN(sensor_type_id)) return undefined;
        if (sensor_type_id < 0) return undefined;
        return sensor_type_id;
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

    validatesleep_time  : function (sleep_time) {
        if (sleep_time === undefined) return undefined;
        sleep_time = escape(sleep_time);
        if (isNaN(sleep_time)) return undefined;
        if (sleep_time < 0) return undefined;
        return sleep_time;
    },

    validate_limit  : function (limit) {
        if (limit === undefined) return undefined;
        limit = escape(limit);
        if (isNaN(limit)) return undefined;
        if (limit <= 0) return undefined;
        return limit;
    },

    validate_timezone: function (timezone) {
        if (timezone === undefined) return undefined;
        timezone = escape(timezone);
        if (isNaN(timezone)) return undefined;
        if (timezone < -720 && timezone > 840) return undefined;
        return parseInt(timezone);
    }


}