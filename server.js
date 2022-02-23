const SERVERPORT = 3000;

const fs = require('fs');
const ejs = require('ejs');
const http = require('http');
const net = require('net');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();

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
mysqlConn.connect();

// const messageData = fs.readFileSync('./messageSendInfo.json');
// const messageInfo = JSON.parse(messageData);

// const accountSid = messageInfo.accountSid;
// const authToken = messageInfo.authToken;
// const client = require('twilio')(accountSid, authToken);

// function sendMessage() {
//   client.messages
//     .create({
//       body: messageInfo.body,
//       from: messageInfo.from,
//       to: messageInfo.to,
//     })
//     .then(message => console.log(message.sid));
// }

let send_socket_data = {
  clock_today: '',
  clock_dbSearch: '',
  clock_clock: '',
  original_data: '',
  id_data: '',
  temperature: 0,
  humidity: 0,
  water_temperature: 0,

  compress_data: 0,
  heating_system_data: 0,
  ventilator_data: 0,
  evaporator_data: 0,
  humidifier_data: 0,
  fluorescent_lamp_data: 0,
  led_data: 0,
  concentric_plug_data: 0
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

  send_socket_data.clock_today = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  send_socket_data.clock_dbSearch = "%" + today + "%";
  send_socket_data.clock_clock = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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

    send_socket_data.original_data = socket_data;
    // global.socket_view = socket_data;
    send_socket_data.id_data = parseInt(id_splitdata[1].substring(0, 1));
    //global.name_data = datasplit[2];
    send_socket_data.temperature = Number(splitdata[22]) / 10;
    send_socket_data.humidity = Number(splitdata[21].substring(1,)) / 10;
    send_socket_data.water_temperature = Number(splitdata[26]) / 100;

    let control_data = parseInt(splitdata[2]).toString(2);
    let control_data_l = reverseBinery(control_data);

    send_socket_data.compress_data = control_data_l[0];
    send_socket_data.heating_system_data = control_data_l[1];
    send_socket_data.ventilator_data = control_data_l[2];
    send_socket_data.evaporator_data = control_data_l[3];
    send_socket_data.humidifier_data = control_data_l[4];
    send_socket_data.fluorescent_lamp_data = control_data_l[5];
    send_socket_data.led_data = control_data_l[6];
    send_socket_data.concentric_plug_data = control_data_l[7];

    // 나눠지지 않은 데이터
    console.log('원본 데이터', send_socket_data.original_data);


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
  console.log('Socket server is listening');
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

////////////////////////////////////////////////////////////////////////////////////////////
// 상속 및 외부파일 연결

app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/views'));

////////////////////////////////////////////////////////////////////////////////////////////
// Routes

const loginRouter = require('./routes/login')(mysqlConn);
const monitoringRouter = require('./routes/monitoring')(send_socket_data, mysqlConn);
const dailyreportRouter = require('./routes/dailyreport')(send_socket_data, mysqlConn);
const sensorRouter = require('./routes/sensor')(send_socket_data, mysqlConn);
const cameraRouter = require('./routes/camera')(mysqlConn);

app.use('/', loginRouter);
app.use('/monitoring', monitoringRouter);
app.use('/dailyreport', dailyreportRouter);
app.use('/sensor', sensorRouter);
app.use('/camera', cameraRouter);

////////////////////////////////////////////////////////////////////////////////////////////
// Server

app.use(function (req, res, next) {
  res.status(404).send('Sorry can not find page!');
});

app.use(function (err, req, res, next) {
  res.status(500).send('Something broke!');
});

const server = http.createServer(app).listen(SERVERPORT, function () {
  console.log(`Server start -> http://127.0.0.1:${SERVERPORT}/`);
});

process.on('uncaughtException', (err) => { 
  // console.log('err', err);
});