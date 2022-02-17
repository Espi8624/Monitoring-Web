const fs = require('fs');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

module.exports = function (socket_data, mysqlConn) {
    router.get('/', function (req, res) {
        let dateSet1 = socket_data.clock_today;
        let dateSet2 = socket_data.clock_today;
        let dateWrap = [dateSet1, dateSet2];

        fs.readFile('views/dailyreport.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                mysqlConn.query('SELECT * FROM SmartFarm.daily_report', function (err, results) {
                    if (err) {
                        console.log('err: ', err.message);
                    } else {
                        res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
                    }
                });
            }
        });
    });

    //Get-------------------

    router.get('/newreport', function (req, res) {
        fs.readFile('views/newReport.html', 'utf8', function (error, data) {
            if (error) {
                console.log('readFile Error');
            } else {
                res.send(data);
            }
        })
    });

    router.get('/edit/:seq', function (req, res) {
        fs.readFile('views/editReport.html', 'utf8', function (err, data) {
            mysqlConn.query('SELECT * FROM SmartFarm.daily_report WHERE seq = ?', [req.params.seq],
                function (err, result) {
                    if (err) {
                        console.log('readFile Err');
                    } else {
                        res.send(ejs.render(data, {
                            daily_report: result[0]
                        }));
                    }
                });
        });
    });

    router.get('/delete/:seq', function (req, res) {
        mysqlConn.query('DELETE FROM SmartFarm.daily_report WHERE seq = ?', [req.params.seq],
            function (err, result) {
                if (err) {
                    console.log('delete Error', err.message);
                } else {
                    console.log('delete seq = %d', req.params.seq);
                    res.redirect('/dailyreport');
                }
            });
    });


    //Post-------------------

    router.post('/', function (req, res) {
        let date1 = req.body['date1'];
        let date2 = req.body['date2'];
        let selectKeyword = req.body['selectKeyword'];
        let searchKeyword = req.body['searchKeyword'];
        let searchKeyword_db = "%" + searchKeyword + "%";
        let dateWrap = [date1, date2];

        fs.readFile('views/dailyreport.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else if (selectKeyword == '식물') {
                mysqlConn.query("SELECT* FROM SmartFarm.daily_report WHERE plant LIKE ? AND report_date >= ? AND report_date < DATE_ADD(?, INTERVAL 1 DAY)",
                    [searchKeyword_db, date1, date2], function (err, results) {
                        if (err) {
                            console.log('err: ', err.message);
                        } else {
                            res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
                        }
                    });
            } else if (selectKeyword == '내용') {
                mysqlConn.query("SELECT* FROM SmartFarm.daily_report WHERE report LIKE ? AND report_date >= ? AND report_date < DATE_ADD(?, INTERVAL 1 DAY)",
                    [searchKeyword_db, date1, date2], function (err, results) {
                        if (err) {
                            console.log('err: ', err.message);
                        } else {
                            res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
                        }
                    });
            }
        });
    });

    router.post('/newreport', function (req, res) {
        let body = req.body;

        mysqlConn.query('INSERT INTO daily_report(plant, report, report_date) VALUES(?,?,?)',
            [body.plant, body.report, body.date],
            function (err, result) {
                if (err) {
                    console.log('insert error: ', err.message);
                } else {
                    res.redirect('/dailyreport');
                }
            });
    });

    router.post('/edit/:seq', function (req, res) {
        let seq = req.body['seq'];
        let plant = req.body['plant'];
        let report = req.body['report'];
        let date = req.body['date'];

        mysqlConn.query('UPDATE daily_report SET plant=?, report=?, report_date=? WHERE daily_report.seq=?',
            [plant, report, date, seq],
            function (err, result) {
                if (err) {
                    console.log('update error : ', err.message);
                } else {
                    res.redirect('/dailyreport');
                }
            });
    });

    return router;
}
