const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);
// webpack.dev.config.js
// webpack.production.config.js

var fs = require('fs');
var datastr = fs.readFileSync('./src/lib/photo.json',{
  encoding: "UTF-8"
});
var data = JSON.parse(datastr);

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1',
  database: 'rivermonitor'
});

connection.connect(function(err){
  if(err){
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id '+ connection.threadId);
});

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

var datalength = 10;

for(let i = 0; i < datalength; i++){
  app.get('/page_'+(i+1),function(req,res){
    res.send(data[i]);
  });
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});