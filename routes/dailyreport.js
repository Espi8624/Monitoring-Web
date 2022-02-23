const fs = require('fs');
const express = require('express');
const router = express.Router();

module.exports = function (socket_data, mysqlConn) {
    router.get('/', function (req, res) {
        fs.readFile('views/dailyreport.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                res.send(data);
            }
        });
    });

    router.get('/get/posting', function (req, res) {
        fs.readFile('views/dailyreport.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                mysqlConn.query('SELECT * FROM SmartFarm.daily_report', function (err, results) {
                    if (err) {
                        console.log('err: ', err.message);
                    } else {
                        res.json({ data: results });
                    }
                });
            }
        });
    });

    router.post('/newreport', function (req, res) {
        let body = req.body.postData[0];

        mysqlConn.query('INSERT INTO daily_report(plant, report, report_date) VALUES(?,?,?)',
            [body.title, body.contents, body.regist_time],
            function (err, result) {
                if (err) {
                    console.log('insert error: ', err.message);
                } else {

                }
            });
    });

    router.post('/edit', function (req, res) {
        let body = req.body.editData[0];

        mysqlConn.query('UPDATE daily_report SET plant=?, report=?, report_date=? WHERE daily_report.seq=?',
            [body.title, body.contents, body.regist_time, body.seq],
            function (err, result) {
                if (err) {
                    console.log('update error : ', err.message);
                } else {
                    
                }
            });
    });

    router.get('/delete/:seq', function (req, res) {
        mysqlConn.query('DELETE FROM SmartFarm.daily_report WHERE seq = ?', [req.params.seq],
            function (err, result) {
                if (err) {
                    console.log('delete Error', err.message);
                } else {
                    res.redirect('/dailyreport');
                }
            });
    });

    return router;
}
