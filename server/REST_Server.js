


/**
 * required modules
 */

const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
require('ejs')
const path = require('path');

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
 * REST-API
 *
 */
app.get("/sensors/id/", function (req, res) {
    try {
        REST_API.GET_id().then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }

});

app.get("/sensors/id/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID(sensorID).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensorID/sensorNick/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID_sensorNick(sensorID).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensorID/sensorType/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        REST_API.GET_id_sensorID_sensorType( sensorID).then(function (result) {
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
            await REST_API.PUT_id_sensorID_sensorTypeID( sensorID, sensorTypeID).then(function (result) {
                success = result;
            });
        } else {
            success = true;
        }
        if (req.body.sensorNick !== undefined) {
            const sensorNick = validate.validateSensorNick(req.body.sensorNick);
            await REST_API.PUT_id_sensorID_sensorNick( sensorID, sensorNick).then(function (result) {
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
        const sensorNick = validate.validateSensorNick(req.body.sensorNick);
        REST_API.POST_id( sensorID, sensorNick).then(function (result) {
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
        REST_API.DELETE_id_sensorID( sensorID).then(function (result) {
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
app.get("/sensors/types/", function (req, res) {
    try {
        REST_API.GET_types().then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(500).send(e);
    }

});

app.get('/display/graph/', async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    let date1 = validate.validateDate(req.query.date1);
    let date2 = validate.validateDate(req.query.date2);
    let values = await REST_API.GET_sensorID( sensorID, date1, date2);
    values = webpageParser.formatForGraph(values);
    res.json(values);
});

app.post("/sensors/types/", async function (req, res) {
    try{
        const sensorType = validate.validateSensorType(req.body.sensorType);
        const unit = validate.validateUnit(req.body.unit);
        const repetitions = validate.validateRepetitions(req.body.repetitions);
        const brakeTime = validate.validateBrakeTime(req.body.brakeTime);
        const sleepTime = validate.validateSleepTime(req.body.sleepTime);
        REST_API.POST_types( sensorType, unit, repetitions, brakeTime, sleepTime).then(function (result) {
            if (result === true) {
                res.status(200).send("ROW ADDED TO TABLE");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.delete("/sensors/types/:sensorTypeID/", function (req, res) {
    try {
        let sensorTypeID = validate.validateSensorTypeID(req.params.sensorTypeID);
        REST_API.DELETE_sensorTypeID( sensorTypeID).then(function (result) {
            if (result === true) {
                res.status(201).send("SENSOR SUCCESSFULLY DELETED");
            } else {
                res.status(500).send("SERVER/DATABASE ERROR " + result);
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
});


app.get("/sensors/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        REST_API.GET_sensorID( sensorID, date1, date2).then(function (result) {
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
        REST_API.POST_sensorID( sensorID, date, value).then(function (result) {
            if (result === true) {
                res.status(200).send("ROW ADDED TO TABLE");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.delete("/sensors/:sensorID/", function (req, res) {
    try {
        let sensorID = validate.validateSensorID(req.params.sensorID);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        REST_API.DELETE_sensorID( sensorID, date1, date2).then(function (result) {
            if (result === true) {
                res.status(200).send("VALUES SUCCESSFULLY DELETED");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
});



app.put("/sensors/types/", async function (req, res) {
    try{
        const sensorType = validate.validateSensorType(req.body.sensorType);
        const unit = validate.validateUnit(req.body.unit);
        const sensorTypeID = validate.validateSensorTypeID(req.body.sensorTypeID);
        const repetitions = validate.validateRepetitions(req.body.repetitions);
        const brakeTime = validate.validateBrakeTime(req.body.brakeTime);
        const sleepTime = validate.validateSleepTime(req.body.sleepTime);
        REST_API.PUT_types( sensorType, sensorTypeID, unit, repetitions, brakeTime, sleepTime).then(function (result) {
            if (result === true) {
                res.status(200).send("ROW ADDED TO TABLE");
            } else {
                res.status(500).send("ERROR: " + result);
            }
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * Web-page routes:
 *
 */

app.get('/',  async function (req, res) {
    const sensors = await REST_API.GET_id();
    res.render('index.ejs', {sensors : sensors});
});

app.get('/display/',  async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    const sensors = await REST_API.GET_id();
    let index = 0;
    for (let i = 0; i < sensors.length; i++ ) {
        if (sensors[i].sensorID === sensorID) {
            index = i;
        }
    }
    res.render('display.ejs', {index: index, sensors : sensors});
});

app.get('/config/',  async function (req, res) {
    res.redirect(req.path + "/local-sensors");
});

app.get('/config/local-sensors/',  async function (req, res) {
    const sensorID = validate.validateSensorID(req.query.sensorID);
    const sensors = await REST_API.GET_id();
    res.render('config-local-sensors.ejs', {sensors : sensors, sensorID : sensorID});
});

app.get('/config/sensor-types/',  async function (req, res) {
    const sensors = await REST_API.GET_id();
    const types = await REST_API.GET_types();
    res.render('config-sensor-types.ejs', {sensors : sensors, types : types});
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


