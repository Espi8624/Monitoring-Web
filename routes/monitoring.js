const fs = require('fs');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

module.exports = function (socket_data, mysqlConn) {
    router.get('/', function (req, res) {
        fs.readFile('views/monitoring_list.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                res.send(data);
            }
        });
    });

    router.get('/get/list', function(req, res) {
        mysqlConn.query('SELECT * FROM SmartFarm.farm_info', function (err, results) {
            if (err) {
                console.log('err: ', err.message);
            } else {
                res.json({ data: results });
            }
        });
    });

    router.get('/detail/:farm_no', function (req, res) {
        fs.readFile('views/monitoring.html', 'utf8', function (err, data) {
            mysqlConn.query('SELECT * FROM SmartFarm.farm_status WHERE farm_no = ?', [req.params.farm_no],
                function (err, result) {
                    if (err) {
                        console.log('readFile Err', err.message);
                    } else {
                        res.send(ejs.render(data, { farm_status: result[0] }));
                    }
                });
        });
    });

    router.post('/detail/:farm_no', function (req, res) {
        let sql1 = "SELECT * FROM SmartFarm.farm_status; ";
        let sql2 = "SELECT measure_no, farm_no, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, measure_date FROM SmartFarm.measure_result WHERE measure_date LIKE ?; ";
        let sql2s = mysql.format(sql2, socket_data.clock_dbSearch);

        mysqlConn.query(sql1 + sql2s, function (err, results) { // 농장상태 테이블 데이터 모니터링 페이지로 전송
            if (err) {
                console.log('err: ', err.message);
            } else {
                res.json({ data: results, logData: socket_data.original_data });
            }
        });
    });

    function statusUpdate() { // 데이터베이스 상태 저장
        let temperature = socket_data.temperature;
        let humidity = socket_data.humidity;
        let water_temperature = socket_data.water_temperature;
        let compress_data = socket_data.compress_data;
        let heating_system_data = socket_data.heating_system_data;
        let ventilator_data = socket_data.ventilator_data;
        let evaporator_data = socket_data.evaporator_data;
        let humidifier_data = socket_data.humidifier_data;
        let fluorescent_lamp_data = socket_data.fluorescent_lamp_data;
        let led_data = socket_data.led_data;
        let concentric_plug_data = socket_data.concentric_plug_data;
        let clock = socket_data.clock_clock;
        let id_data = socket_data.id_data;

        let sql = 'UPDATE farm_status SET temperature=?, humidity=?, water_temperature=?, compress=?, heating_system=?, ventilator=?, evaporator=?, humidifier=?, fluorescent_lamp=?, led=?, concentric_plug=?, up_date=? WHERE farm_status.farm_no=?';
        let data_set = [temperature, humidity, water_temperature, compress_data, heating_system_data, ventilator_data, evaporator_data, humidifier_data, fluorescent_lamp_data, led_data, concentric_plug_data, clock, id_data];
        mysqlConn.query(sql, data_set,
            function (err, result) {
                if (err) {
                    console.log('update error : ', err.message);
                } else {
                    //console.log('update success');
                }
            });
    }

    // setInterval(() => {
    //     statusUpdate();
    // }, 1000);

    function logReg() { // 데이터베이스 농장 상태 로그 저장 (measure_result)
        let temperature = socket_data.temperature;
        let humidity = socket_data.humidity;
        let water_temperature = socket_data.water_temperature;
        let compress_data = socket_data.compress_data;
        let heating_system_data = socket_data.heating_system_data;
        let ventilator_data = socket_data.ventilator_data;
        let evaporator_data = socket_data.evaporator_data;
        let humidifier_data = socket_data.humidifier_data;
        let fluorescent_lamp_data = socket_data.fluorescent_lamp_data;
        let led_data = socket_data.led_data;
        let concentric_plug_data = socket_data.concentric_plug_data;
        let clock = socket_data.clock_clock;
        let id_data = socket_data.id_data;

        let sql = 'INSERT INTO measure_result(farm_no, measure_date, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, fluorescent_lamp, led, concentric_plug) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let data_set = [id_data, clock, temperature, humidity, water_temperature, compress_data, heating_system_data, ventilator_data, evaporator_data, humidifier_data, fluorescent_lamp_data, led_data, concentric_plug_data];
        mysqlConn.query(sql, data_set,
            function (err, result) {
                if (err) {
                    console.log('insert error: ', err.message);
                } else {
                    console.log('reg success');
                }
            });
    }

    // setInterval(() => {
    //     logReg();
    // }, 60000);

    return router;
}
