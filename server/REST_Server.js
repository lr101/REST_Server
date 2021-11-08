


/**
 * required modules
 */

const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
const REST_API = require('./queryPostgreSQL');
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
 * consts
 */
const INTERVALL =

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

app.get("/sensors/id/:sensor_id/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        REST_API.GET_id_sensor_id(sensor_id).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensor_id/sensor_nick/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        REST_API.GET_id_sensor_id_sensor_nick(sensor_id).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/sensors/id/:sensor_id/sensor_type/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        REST_API.GET_id_sensor_id_sensor_type( sensor_id).then(function (result) {
            res.json(result);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.put("/sensors/id/:sensor_id/", async function (req, res) {
    try {
        let success = false;
        const sensor_id = validate.validatesensor_id(req.params.sensor_id);
        if (req.body.sensor_type_id !== undefined) {
            const sensor_type_id = validate.validatesensor_type(req.body.sensor_type_id);
            await REST_API.PUT_id_sensor_id_sensor_type_id( sensor_id, sensor_type_id).then(function (result) {
                success = result;
            });
        } else {
            success = true;
        }
        if (req.body.sensor_nick !== undefined) {
            const sensor_nick = validate.validatesensor_nick(req.body.sensor_nick);
            await REST_API.PUT_id_sensor_id_sensor_nick( sensor_id, sensor_nick).then(function (result) {
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
        const sensor_id = validate.validatesensor_id(req.body.sensor_id);
        const sensor_nick = validate.validatesensor_nick(req.body.sensor_nick);
        REST_API.POST_id( sensor_id, sensor_nick).then(function (result) {
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

app.delete("/sensors/id/:sensor_id/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        REST_API.DELETE_id_sensor_id( sensor_id).then(function (result) {
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
    const sensor_id = validate.validatesensor_id(req.query.sensor_id);
    let timezone = validate.validate_timezone(req.query.timezone);
    let date1 = validate.validateDate(req.query.date1);
    let date2 = validate.validateDate(req.query.date2);
    let interval = req.query.interval;
    let values = await REST_API.GET_display_graph(sensor_id, interval, date1, date2);
    //let values = await REST_API.GET_sensor_id( sensor_id, date1, date2);
    values = webpageParser.formatForGraph(values, timezone);
    res.json(values);
});

app.post("/sensors/types/", async function (req, res) {
    try{
        const sensor_type = validate.validatesensor_type(req.body.sensor_type);
        const unit = validate.validateUnit(req.body.unit);
        const repetitions = validate.validateRepetitions(req.body.repetitions);
        const sleep_time = validate.validatesleep_time(req.body.sleep_time);
        REST_API.POST_types( sensor_type, unit, repetitions, sleep_time).then(function (result) {
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

app.delete("/sensors/types/:sensor_type_id/", function (req, res) {
    try {
        let sensor_type_id = validate.validatesensor_type_id(req.params.sensor_type_id);
        REST_API.DELETE_sensor_type_id( sensor_type_id).then(function (result) {
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


app.get("/sensors/:sensor_id/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        let limit = validate.validate_limit(req.query.limit);
        if (parseInt(limit) === 1 && date1 === undefined && date2 !== undefined) {
            REST_API.GET_sensor_id_last(sensor_id,date2).then(function (result){
                res.json(result);
            });
        } else {
            REST_API.GET_sensor_id(sensor_id, date1, date2, limit).then(function (result) {
                res.json(result);
            });
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/sensors/:sensor_id/", function (req, res) {
    try {
        const sensor_id = validate.validatesensor_id(req.params.sensor_id);
        const date = validate.validateDate(req.body.date);
        const value = validate.validateValue(req.body.value);
        REST_API.POST_sensor_id( sensor_id, date, value).then(function (result) {
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

app.delete("/sensors/:sensor_id/", function (req, res) {
    try {
        let sensor_id = validate.validatesensor_id(req.params.sensor_id);
        let date1 = validate.validateDate(req.query.date1);
        let date2 = validate.validateDate(req.query.date2);
        REST_API.DELETE_sensor_id( sensor_id, date1, date2).then(function (result) {
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
        const sensor_type = validate.validatesensor_type(req.body.sensor_type);
        const unit = validate.validateUnit(req.body.unit);
        const sensor_type_id = validate.validatesensor_type_id(req.body.sensor_type_id);
        const repetitions = validate.validateRepetitions(req.body.repetitions);
        const sleep_time = validate.validatesleep_time(req.body.sleep_time);
        REST_API.PUT_types( sensor_type, sensor_type_id, unit, repetitions, sleep_time).then(function (result) {
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
    const sensor_id = validate.validatesensor_id(req.query.sensor_id);
    const sensors = await REST_API.GET_id();
    let index = 0;
    for (let i = 0; i < sensors.length; i++ ) {
        if (sensors[i].sensor_id === sensor_id) {
            index = i;
        }
    }
    res.render('display.ejs', {index: index, sensors : sensors});
});

app.get('/config/',  async function (req, res) {
    res.redirect(req.path + "/local-sensors");
});

app.get('/config/local-sensors/',  async function (req, res) {
    const sensor_id = validate.validatesensor_id(req.query.sensor_id);
    const sensors = await REST_API.GET_id();
    res.render('config-local-sensors.ejs', {sensors : sensors, sensor_id : sensor_id});
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
app.set('views', path.join(__dirname, '../views'));

/**
 * static data url
 */

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));


/**
 * set port and save in Express
 */

const port = parseInt(process.env.SERVER_PORT) || 5000;
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


