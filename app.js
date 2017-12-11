const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const qs = require('querystring');
// webpack.dev.config.js
// webpack.production.config.js

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'focus',
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
  var addSql = 'insert into cameras (camera_id,name,location,info,mac,video_url,time) values (?,?,?,?,?,now())';
  var addSqlParams = [];
  for (let i = 0; i < 10; i++) {
    addSqlParams.push([(i+1),"仙林" + (i + 1), "仙林", "南邮x-10" + (i + 1), "1.1.1.1", "http://www.baidu.com"])
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

app.get('/cameras', function (req, res) {
  var camerasName = [];
  var Sql = 'select name from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
      return;
    }
    var l = result.length;
    for (let i = 0; i < l; i++) {
      camerasName.push(result[i]);
    }
    res.send(camerasName);
  });
});

for (let i = 0; i < 10; i++) {
  app.get('/camera_' + (i + 1), function (req, res) {
    res.send(videoHtml);
    res.status(404).send('Sorry, we cannot find that!');
  });
  app.get('/camera_' + (i + 1) + '_p', function (req, res) {
    res.send(photoHtml);
    res.status(404).send('Sorry, we cannot find that!');
  });
}

app.get('/video', function (req, res) {
  var Sql = 'select * from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result[req.query.id - 1]);
  });
});

app.get('/setting', function (req, res) {
  var Sql = 'select * from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(result);
  })
})

app.post('/camera_info', function (req, res) {
  res.send(req.body);
  var Sql = 'select * from cameras';
  connection.query(Sql, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    var newInfo = req.body;
    id = parseInt(newInfo.camera_id);
    for (let i in newInfo) {
      if (newInfo[i] != result[id - 1][i]) {
        var Sql = 'update cameras set ' + i + '="' + newInfo[i] + '" where camera_id=' + id;
        connection.query(Sql, function (err, result) {
          if (err) {
            console.log(err.message);
          } else {
            console.log("update ok!");
          }
        });
      }
    }
  });
})

function intialDepthTable(m, n) {
  var sql = 'insert into river_depth (camera_id,name,depth,time) values (?,?,?,now())';
  var addSql = [];
  for (let j = 0; j < m; j++) {
    for (let i = 0; i < n; i++) {
      addSql.push([(i + 1), "仙林" + (i + 1), parseFloat(10 * Math.random()).toFixed(1)]);
    }
  }
  addSql.map(function (item) {
    connection.query(sql, item, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("Initial table river_depth success");
    });
  })
}
// intialDepthTable(11,10);

function initialCameraPhoto(m, n) {
  var Sql = 'insert into camera_photo (camera_id,photo_src,time,note) values (?,?,now(),?)';
  var addSql = [];
  for (let j = 0; j < m * 12; j++) {
    for (let i = 0; i < n; i++) {
      addSql.push([(i + 1), "b-1.png", "测试"]);
    }
  }
  addSql.map(function (item) {
    connection.query(Sql, item, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("initial the camera_photo ok!");
    });
  });
}
// initialCameraPhoto(1,10);

app.get('/depth', function (req, res) {
  var Sql = 'select * from river_depth where camera_id=' + parseInt(req.query.id);
  connection.query(Sql, function (err, result) {
    if (err) {
      console.log(err.message);
      return;
    }
    res.send(result);
  });
})


var pagelength = 10;
for (let i = 0; i < pagelength; i++) {
  app.get('/page_' + (i + 1), function (req, res) {
    var Sql = 'select * from camera_photo where camera_id=' + req.query.id;
    connection.query(Sql, function (err, result) {
      if (err) {
        console.log(err.message);
        return;
      }
      res.send(result);
    });
  });
}



var settingHtml = fs.readFileSync('./dist/setting.html', 'UTF-8', function (err, data) {
  if (err) {
    console.err(err);
  }
});
app.get('/setting.html', function (req, res) {
  res.send(settingHtml);
});

app.post('/depth', function (req, res) {
  var data = req.body;
  var id = parseFloat(data.camera_id),depth = parseInt(data.depth),name = data.name;
  var Sql = 'insert into river_depth (camera_id,name,depth,time) values (?,?,?,now())';  
  var addSql = [id,name,depth];
  connection.query(Sql,addSql,function(err,result){
    if(err){
      console.log(err.message);
      return;
    }
    res.send(data);
    console.log("insert depth " + depth + " to camera_" + id + " ok");
  })
});

app.post('/picture', function (req, res) {
  req.setEncoding('binary'); //设置为binary
  var imgData = '';
  var dirname = './dist/cp_' + req.query.id,
    filename = './dist/cp_' + req.query.id + '/' + req.query.p + '.jpg';
  var Sql = 'insert into camera_photo (camera_id,photo_src,time,note) values (?,?,now(),?)';
  var addSql = [req.query.id,filename,"测试"];
  req.on('data', function (chunk) {
    imgData += chunk;
  });
  req.on('end', function () {
    fs.readdir(dirname, function (err) {
      if (err) {
        fs.mkdir(dirname, function (err) {
          if (err) {
            console.log(err.message);
          }
        });
      }
      fs.writeFile(filename, imgData, 'binary', function (err) {
        if (err) {
          console.log(err.message);
        }
      });
    });
  });
  connection.query(Sql,addSql,function(err,result){
    if(err){
      console.log(err.message);
    }
    console.log("insert photo success!");
  })
  res.send("ok");
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!\n');
});