const fs = require('fs');
const express = require('express');
const router = express.Router();

module.exports = function (mysqlConn) {
    router.get('/', function (req, res) {
        fs.readFile('views/login.html', 'utf8', function (err, data) {
            if (err) {
                console.log('readFile Err');
            } else {
                res.send(data);
            }
        });
    });

    return router;
}