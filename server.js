const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
// webpack.dev.config.js
// webpack.production.config.js

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

var fs = require('fs');
var pageStr = fs.readFileSync('./src/lib/photo.json', {
  encoding: "UTF-8"
});
var page = JSON.parse(pageStr);

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


function addData() {
  var addSql = 'insert into cameras (name,location,info,mac,video_url,time) values (?,?,?,?,?,?)';
  var addSqlParams = [];
  for (let i = 0; i < 10; i++) {
    addSqlParams.push(["仙林" + (i + 1), "仙林", "南邮x-10" + (i + 1), "1.1.1.1", "./1.mp4", "2017-11-30 15:20"])
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
  // connection.end();
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
  var videoHtml = fs.readFileSync('./dist/video.html', 'UTF-8', function (err, data) {
    if (err) {
      console.err(err);
    }
  });
  var photoHtml = fs.readFileSync('./dist/photo.html', 'UTF-8', function (err, data) {
    if (err) {
      console.err(err);
    }
  });
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
        res.send(videoHtml);
        res.status(404).send('Sorry, we cannot find that!');
      });
      app.get('/camera_' + (i + 1) + '_p', function (req, res) {
        res.send(photoHtml);
        res.status(404).send('Sorry, we cannot find that!');
      })
    }
  });
}
getAllCamerasName();

function getAllCameras() {
  var Sql = 'select * from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    app.get('/video', function (req, res) {
      res.send(result[req.query.id - 1]);
    });
    app.get('/setting', function (req, res) {
      res.send(result);
    });
    app.get('/camera_info', function (req, res) {
      var newInfo = req.query,
        id;
        newInfo.camera_id = parseInt(newInfo.camera_id);
        id = newInfo.camera_id;
      for (let i in newInfo) {
        if (newInfo[i] != result[id - 1][i]) {
          var Sql = 'update cameras set ' + i + '=' + newInfo[i] + ' where camera_id=' + id;
          connection.query(Sql, function (err, result) {
            if (err) {
              console.log(err.message);
            } else {
              console.log("update ok!");
            }
          })

        }
      }
      console.log(newInfo);
      console.log(result[id-1]);
      res.send("保存成功！");
    });
  });
}
getAllCameras();

function intialDepthTable(n) {
  var sql = 'insert into river_depth (name,depth,time) values (?,?,?)';
  var addSql = [];
  for (let i = 0; i < n; i++) {
    addSql.push(["仙林" + (i + 1), parseFloat(10 * Math.random()).toFixed(1), '2017-12-2 14:43:02']);
  }
  addSql.map(function (item) {
    connection.query(sql, item, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("Initial table river_depth success");
    });
    // connection.end();
  })
}
// intialDepthTable(10);

function getRiverDepth() {
  var Sql = 'select * from river_depth';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    app.get('/depth', function (req, res) {
      res.send(result[req.query.id - 1]);
    })
  })
}
getRiverDepth();


var pagelength = 10;
for (let i = 0; i < pagelength; i++) {
  app.get('/page_' + (i + 1), function (req, res) {
    res.send(page[i]);
  });
}

app.get('/cameras', function (req, res) {
  res.send(camerasName);
});

var settingHtml = fs.readFileSync('./dist/setting.html', 'UTF-8', function (err, data) {
  if (err) {
    console.err(err);
  }
});
app.get('/setting.html', function (req, res) {
  res.send(settingHtml);
});

app.post('/photo', function (req, res) {
  console.log('req: ', req);
  // console.log(req.query.wd);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});