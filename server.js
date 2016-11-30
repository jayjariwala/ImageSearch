var express=require('express');
var Flickr=require('flickrapi');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var app = express();
var controller=require('./controller/ImageSearchController');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
  extended:true
}))

app.get('/', function(req, res) {
      res.sendFile(__dirname + '/index.html');
    })
controller(app,Flickr,mongoose);



var port= Number(process.env.PORT || 8081);
app.listen(port);
