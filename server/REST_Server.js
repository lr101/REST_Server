/**
 * required modules
 */

const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const ejs = require('ejs')
const path = require('path');
let app;

/**
 * config data
 */

const config = require('./config');
const serverLogFile = config.serverLogFile();
const dbLogin = config.dbLogin();

/**
 * import js-files
 *
 */

const validate = require('./validate');
const REST_API = require('./queryControler');
const webpageParser = require('./webpageParser');

/**
 * express middleware
 */

let stream = fs.createWriteStream(serverLogFile, {flags: 'a'});

app = express();
app.use(logger('common', {
    stream: stream
}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/**
 * write db error to log file
 */

function logDB(e) {
    stream.write("[DATABASE OPERATION -> " + new Date().toISOString() + "] " + e + "\n");
}

/**
 * REST-API
 *
 */
app.get("/sensors/id/", function (req, res) {
    try {
        REST_API.GET_id(con).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }

});

app.get("/sensors/id/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID(con, sensorID).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensorID/sensorNick/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID_sensorNick(con, sensorID).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensorID/sensorType/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID_sensorType(con, sensorID).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/sensors/id/", function (req, res) {
    try {
        const sensorID = validate.validateSensorID(req.body.sensorID);
        const sensorType = validate.validateSensorType(req.body.sensorType);
        const sensorNick = validate.validateSensorNick(req.body.sensorNick);
        REST_API.POST_id(con, sensorID, sensorType, sensorNick).then(function (result) {
            if (result === true) {
                res.status(201).send("SENSOR SUCCESSFULLY ADDED");
            } else {
                res.status(500).send("SERVER/DATABASE ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/sensors/id/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.DELETE_id_sensorID(con, sensorID).then(function (result) {
            if (result === true) {
                res.status(201).send("SENSOR SUCCESSFULLY DELETED");
            } else {
                res.status(500).send("SERVER/DATABASE ERROR " + result);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        REST_API.GET_sensorID(con, sensorID, date1, date2).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/sensors/:sensorID/", function (req, res) {
    try {
        const sensorID = validate.validateSensorID(req.params.sensorID);
        const date = validate.validateDate(req.body.date);
        const value = validate.validateValue(req.body.value);

        REST_API.POST_sensorID(con, sensorID, date, value).then(function (result) {
            if (result === true) {
                res.status(200).send("ROW ADDED TO TABLE");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete("/sensors/:sensorID", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        REST_API.DELETE_sensorID(con, sensorID, date1, date2).then(function (result) {
            if (result === true) {
                res.status(200).send("VALUES SUCCESSFULLY DELETED");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * Web-page routes:
 *
 */

app.get('/',  async function (req, res) {
    console.log(await REST_API.GET_id(con));
    res.render('index.ejs', {sensors : await REST_API.GET_id(con)});
});


/**
 * set ejs as View Engine
 */

app.set('view engine', 'ejs');

/**
 * static data url
 */

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


/**
 * set port and save in Express
 */

const port = 3000;
app.set('port', port);

/**
 * create Server
 */

const server = http.createServer(app);

/**
 * listen on port
 */

server.listen(port);

/**
 * Mysql connection
 */

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
