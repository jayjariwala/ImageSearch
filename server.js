var express=require('express');
var request=require('request');
var Flickr=require('flickrapi');
var app = express();
var controller=require('./controller/ImageSearchController');


controller(app,request,Flickr);



var port= Number(process.env.PORT || 8080);
app.listen(port);
