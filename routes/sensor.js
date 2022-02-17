const fs = require('fs');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

module.exports = function (socket_data, mysqlConn) {
    router.get('/', function (req, res) {
        let deviceData = 1;
        let dateSet1 = socket_data.clock_today;
        let dateSet2 = socket_data.clock_today;
        let dateWrap = [dateSet1, dateSet2, deviceData];

        fs.readFile('views/sensor_record.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                mysqlConn.query("SELECT measure_no, farm_no, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, measure_date FROM SmartFarm.measure_result WHERE farm_no = ? AND measure_date LIKE ?",
                    [deviceData, socket_data.clock_dbSearch], function (err, results) {
                        if (err) {
                            console.log('err: ', err.message);
                        } else {
                            res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
                        }
                    });
            }
        });
    });


    router.post('/', function (req, res) {
        let deviceData = req.body['deviceNumber'];
        let date1 = req.body['date1'];
        let date2 = req.body['date2'];
        let dateWrap = [date1, date2, deviceData];

        fs.readFile('views/sensor_record.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                mysqlConn.query("SELECT measure_no, farm_no, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, measure_date FROM SmartFarm.measure_result WHERE farm_no = ? AND measure_date >= ? AND measure_date < DATE_ADD(?, INTERVAL 1 DAY)",
                    [deviceData, date1, date2], function (err, results) {
                        if (err) {
                            console.log('err: ', err.message);
                        } else {
                            res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
                        }
                    });
            }
        });
    });

    return router;
}
