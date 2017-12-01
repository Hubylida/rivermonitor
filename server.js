const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
// webpack.dev.config.js
// webpack.production.config.js

var fs = require('fs');
var pageStr = fs.readFileSync('./src/lib/photo.json', {
  encoding: "UTF-8"
});
var page = JSON.parse(pageStr);
var video = fs.readFileSync('./dist/video.html', 'UTF-8', function (err, data) {
  if (err) {
    console.err(err);
  }
  console.log(data);
})

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1',
  database: 'rivermonitor'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


function getData() {
  var all;
  var getSql = 'select * from cameras';
  connection.query(getSql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    all = console.log(result[1]);
  });
  connection.end();
}
// getData();


function addData() {
  var addSql = 'insert into cameras (name,location,info,mac,video_url,time) values (?,?,?,?,?,?)';
  var addSqlParams = [];
  for (let i = 0; i < 10; i++) {
    addSqlParams.push(["仙林" + (i + 1), "仙林", "南邮x-10" + (i + 1), "1.1.1.1", "http://www.a.com", "2017-11-30 15:20"])
  }
  addSqlParams.map(function (item) {
    connection.query(addSql, item, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log('--------------------------INSERT----------------------------');
      console.log('INSERT ID:', result);
      console.log('-----------------------------------------------------------------\n\n');
    })
  });
  connection.end();
}

// addData();

function deleteData() {
  var deleSql = 'delete from cameras where camera_id=1';
  var showSql = 'select * from cameras';
  connection.query(deleSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }

    console.log('--------------------------DELETE----------------------------');
    console.log('DELETE affectedRows', result.affectedRows);
    console.log('-----------------------------------------------------------------\n\n');
  });
  connection.query(showSql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
  });
  connection.end();
}

// deleteData();
var camerasName = [];

function getAllCamerasName() {
  var Sql = 'select name from cameras';
  var cameraItem;
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    var l = result.length;
    for (let i = 0; i < l; i++) {
      camerasName.push(result[i]);
      app.get('/camera_' + (i + 1), function (req, res) {
        res.send(video);
        res.status(404).send('Sorry, we cannot find that!');
      });
    }
  });

  // connection.end();
}
getAllCamerasName();

function getAllCameras() {
  var Sql = 'select * from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    for (let i = 0; i < result.length; i++) {
      let index = 1;
      app.get('/video', function (req, res) {
        if (req.query.id == index) {
          res.send(result[i]);
          index++;
        }
      });
    }
  });
  connection.end();
}

getAllCameras();

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

var pagelength = 10;

for (let i = 0; i < pagelength; i++) {
  app.get('/page_' + (i + 1), function (req, res) {
    res.send(page[i]);
  });
}


app.get('/cameras', function (req, res) {
  res.send(camerasName);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});