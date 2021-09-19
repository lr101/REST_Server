


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
require('ejs')
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});

let app;


/**
 * logging files
 */
const serverLogFile = path.join(__dirname, "../logging/server.log");
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

console.log(__dirname);

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

app.put("/sensors/id/:sensorID/", async function (req, res) {
    try {
        let success = false;
        const sensorID = validate.validateSensorID(req.params.sensorID);
        if (req.body.sensorTypeID !== undefined) {
            const sensorTypeID = validate.validateSensorType(req.body.sensorTypeID);
            await REST_API.PUT_id_sensorID_sensorTypeID(con, sensorID, sensorTypeID).then(function (result) {
                success = result;
            });
        } else {
            success = true;
        }
        if (req.body.sensorNick !== undefined) {
            const sensorNick = validate.validateSensorNick(req.body.sensorNick);
            await REST_API.PUT_id_sensorID_sensorNick(con, sensorID, sensorNick).then(function (result) {
                if (result === true && success) {
                    success = result;
                }
            });
        }
        if (success === true) {
            res.status(200).send("SENSOR SUCCESSFULLY UPDATED");
        } else {
            res.status(500).send("SERVER/DATABASE ERROR: " + success);
        }
    } catch (e) {
        res.status(500).send(e);
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

        console.log(date);
        console.log(value);

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

app.get("/sensors/types/", function (req, res) {
    try {
        REST_API.GET_types(con).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }

});

app.get('/display/graph', async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    let date1 = validate.validateDate(req.query.date1);
    let date2 = validate.validateDate(req.query.date2);
    let values = await REST_API.GET_sensorID(con, sensorID, date1, date2);
    values = webpageParser.formatForGraph(values);
    res.json(values);
});

/**
 * Web-page routes:
 *
 */

app.get('/',  async function (req, res) {
    const sensors = await REST_API.GET_id(con);
    res.render('index.ejs', {sensors : sensors});
});

app.get('/display/',  async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    let values = (await REST_API.GET_id_sensorID_sensorNick(con, sensorID))[0];
    values["sensorID"] = sensorID;
    res.render('display.ejs', {sensor : values});
});

app.get('/config/',  async function (req, res) {
    res.redirect(req.path + "/local-sensors");
});

app.get('/config/local-sensors/',  async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    const sensors = await REST_API.GET_id(con);
    res.render('config-local-sensors.ejs', {sensors : sensors, sensorID : sensorID});
});


/**
 * set ejs as View Engine
 */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "../views"));

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
