var express=require('express');
var Flickr=require('flickrapi');
var mongoose=require('mongoose');
var app = express();
var controller=require('./controller/ImageSearchController');


controller(app,Flickr,mongoose);



var port= Number(process.env.PORT || 8082);
app.listen(port);
