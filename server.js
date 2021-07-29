const SERVERPORT = 3000;

const fs = require('fs');
const ejs = require('ejs');
const http = require('http');
const net = require('net');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const data = fs.readFileSync('./database.json');
const dbInfo = JSON.parse(data);

const mysqlConn = mysql.createConnection({ //데이터베이스 설정
  host: dbInfo.host,
  port: dbInfo.port,
  user: dbInfo.user,
  password: dbInfo.password,
  database: dbInfo.database,
  dateStrings: true,
  multipleStatements: true
});

const app = express();
const server = http.createServer(app).listen(SERVERPORT, function () { //서버 스타트
  console.log('Start Server...');
});

const messageData = fs.readFileSync('./messageSendInfo.json');
const messageInfo = JSON.parse(messageData);

const accountSid = messageInfo.accountSid;
const authToken = messageInfo.authToken;
const client = require('twilio')(accountSid, authToken);

function sendMessage() {
  client.messages
    .create({
      body: messageInfo.body,
      from: messageInfo.from,
      to: messageInfo.to,
    })
    .then(message => console.log(message.sid));
}

function setClock() {
  const nowTime = new Date();
  const utc = nowTime.getTime() + (nowTime.getTimezoneOffset() * 60 * 1000);
  const KR_Time_Set = 9 * 60 * 60 * 1000;
  const kr_time = new Date(utc + (KR_Time_Set));
  let year = kr_time.getFullYear();
  let month = kr_time.getMonth() + 1;
  let day = kr_time.getDate();
  const hours = kr_time.getHours();
  const minutes = kr_time.getMinutes();
  const seconds = kr_time.getSeconds();

  today = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  dbSearch = "%" + today + "%";
  clock = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

setInterval(() => {
  setClock();
}, 1000);

////////////////////////////////////////////////////////////////////////////////////////////
//소켓 통신

const socketServer = net.createServer(function (socket) {
  //console.log('클라이언트 접속');
  socket.write('Connect to Socket Server');

  socket.on('data', function (hmidata) {
    let socket_data = hmidata.toString();
    let splitdata = socket_data.split(',');
    let id_splitdata = socket_data.split("[");

    global.socket_data = socket_data;
    global.socket_view = socket_data;
    global.id_data = parseInt(id_splitdata[1].substring(0, 1));
    //global.name_data = datasplit[2];
    global.temperature_status = Number(splitdata[22]) / 10;
    global.humidity_status = Number(splitdata[21].substring(1,)) / 10;
    global.water_temperature_status = Number(splitdata[26]) / 100;

    let control_data = parseInt(splitdata[2]).toString(2);
    let control_data_l = reverseBinery(control_data);

    global.compress_data = control_data_l[0];
    global.heating_system_data = control_data_l[1];
    global.ventilator_data = control_data_l[2];
    global.evaporator_data = control_data_l[3];
    global.humidifier_data = control_data_l[4];
    global.fluorescent_lamp_data = control_data_l[5];
    global.led_data = control_data_l[6];
    global.concentric_plug_data = control_data_l[7];

    // 나눠지지 않은 데이터
    //console.log('원본 데이터', socket_data);


    function reverseBinery(n) {
      const reversed = n
        .split("")
        .reverse()
        .join("");

      return reversed;
    }
  });
});

socketServer.on('end', function () {
  console.log('Client Disconnect');
});

socketServer.on('listening', function () {
  console.log('Server is listening');
});

socketServer.on('close', function () {
  console.log('Server closed');
});

socketServer.listen(3001);


////////////////////////////////////////////////////////////////////////////////////////////
// 기능

function checkFunc() {
  let num = 0;

  function countTime() {
    num++;

    if (socket_data == null) {
      console.log('socket_data is null');
    } else if (socket_data != null) {
      console.log('socket_data is not null');
      socket_data = null;
      num = 0;
    }

    if (num == 60) {
      //sendMessage();
    }

    console.log(num);
  }

  let ctime = setInterval(countTime, 1000);
}
checkFunc();

// 예외처리
process.on('uncaughtException', (err) => { 
  console.log('err', err);
});

////////////////////////////////////////////////////////////////////////////////////////////
//상속 및 외부파일 연결

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/views'));


////////////////////////////////////////////////////////////////////////////////////////////
//로그인

app.get('/', function (req, res) {
  res.render('login.html')
});

////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//모니터링

function statusUpdate() { // 데이터베이스 상태 저장
  mysqlConn.query('UPDATE farm_status SET temperature=?, humidity=?, water_temperature=?, compress=?, heating_system=?, ventilator=?, evaporator=?, humidifier=?, fluorescent_lamp=?, led=?, concentric_plug=?, up_date=? WHERE farm_status.farm_no=?',
    [temperature_status, humidity_status, water_temperature_status, compress_data, heating_system_data, ventilator_data, evaporator_data, humidifier_data, fluorescent_lamp_data, led_data, concentric_plug_data, clock, id_data],
    function (err, result) {
      if (err) {
        console.log('update error : ', err.message);
      } else {
        //console.log('update success');
      }
    });
}

setInterval(() => {
  //statusUpdate();
}, 1000);

function logReg() { // 데이터베이스 농장 상태 로그 저장 (measure_result)
  mysqlConn.query('INSERT INTO measure_result(farm_no, measure_date, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, fluorescent_lamp, led, concentric_plug) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [id_data, clock, temperature_status, humidity_status, water_temperature_status, compress_data, heating_system_data, ventilator_data, evaporator_data, humidifier_data, fluorescent_lamp_data, led_data, concentric_plug_data],
    function (err, result) {
      if (err) {
        console.log('insert error: ', err.message);
      } else {
        console.log('reg success');
      }
    });
}

setInterval(() => {
  logReg();
}, 60000);

app.get('/monitoring', function (req, res) {
  fs.readFile('views/monitoring_list.html', 'utf8', function (err, data) {
    if (err) {
      console.log('readFile Err');
    } else {
      mysqlConn.query('SELECT * FROM SmartFarm.farm_info', function (err, results) {
        if (err) {
          console.log('err: ', err.message);
        } else {
          res.send(ejs.render(data, { farmList: results }));
        }
      });
    }
  });
});

app.get('/monitoring/detail/:farm_no', function (req, res) {
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

app.post('/monitoring/detail/:farm_no', function (req, res) {
  let sql1 = "SELECT * FROM SmartFarm.farm_status; ";
  let sql2 = "SELECT measure_no, farm_no, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, measure_date FROM SmartFarm.measure_result WHERE measure_date LIKE ?; ";
  let sql2s = mysql.format(sql2, dbSearch);
  
    mysqlConn.query(sql1 + sql2s, function (err, results) { // 농장상태 테이블 데이터 모니터링 페이지로 전송
        if (err) {
          console.log('err: ', err.message);
        } else {
          res.json({ data : results, logData : socket_view });
        }
      });
  });


////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//농장 일지

app.get('/dailyreport', function (req, res) {
  let dateSet1 = today;
  let dateSet2 = today;
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

app.get('/newreport', function (req, res) {
  fs.readFile('views/newReport.html', 'utf8', function (error, data) {
    if (error) {
      console.log('readFile Error');
    } else {
      res.send(data);
    }
  })
});

app.get('/dailyreport/edit/:seq', function (req, res) {
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

app.get('/dailyreport/delete/:seq', function (req, res) {
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

app.post('/dailyreport', function (req, res) {
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

app.post('/newreport', function (req, res) {
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

app.post('/dailyreport/edit/:seq', function (req, res) {
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


////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//센서 기록 조회


app.get('/sensor', function (req, res) {
  let deviceData = 1;
  let dateSet1 = today;
  let dateSet2 = today;
  let dateWrap = [dateSet1, dateSet2, deviceData];

  fs.readFile('views/sensor_record.html', 'utf8', function (err, data) {
    if (err) {
      console.log('readFile Err');
    } else {
      mysqlConn.query("SELECT measure_no, farm_no, temperature, humidity, water_temperature, compress, heating_system, ventilator, evaporator, humidifier, measure_date FROM SmartFarm.measure_result WHERE farm_no = ? AND measure_date LIKE ?",
        [deviceData, dbSearch], function (err, results) {
          if (err) {
            console.log('err: ', err.message);
          } else {
            res.send(ejs.render(data, { prodList: results, dateWrap: dateWrap }));
          }
        });
    }
  });
});


app.post('/sensor', function (req, res) {
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


////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
//촬영 기록 조회

app.get('/camera', function (req, res) {
  res.render('camera_record.html');
});