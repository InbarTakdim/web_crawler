
var http= require('http');
var weatherModule= require('./weather');
var express=require('express');
var app=express();

app.all('*', (req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/weatherByCity/:city' , (req, res)=> {
  var city=req.params.city;
  weatherModule(city, res);
});

http.createServer(app).listen(process.env.PORT ||8080);
