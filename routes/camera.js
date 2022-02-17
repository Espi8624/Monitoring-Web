const fs = require('fs');
const express = require('express');
const router = express.Router();

module.exports = function (mysqlConn) {
    router.get('/', function (req, res) {
        res.render('camera_record.html');
    });

    return router;
}
