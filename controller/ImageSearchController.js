module.exports = function(app, Flickr, mongoose) {


  app.get('/imageapi',function(req,res){
    var obj={ error:404, Message: "Please type the keyword" }
    res.end(JSON.stringify(obj));
  })

  app.post('/imageapi',function(req,res){
  var url=req.body.url;
  res.writeHead(301,{Location:"/imageapi/"+url});
      res.end();
  console.log(url);
  })


    //database connection

    mongoose.connect("mongodb://test:test@ds063856.mlab.com:63856/imagesearch");

    var history = mongoose.model('history', {

        keyword: String,
        time: String
    });



    var flickrOptions = {
        api_key: "bb67678716c6a444a61b554f1c4024de",
        secret: "45f4ca677268e04b"
    };




    /*
        request('',function(error,response,body)
          {
            if(error)
            throw error;
            if(body)
            {
              console.log(body);
            }
          });
    */

    app.get('/latest', function(req, res) {

    history.find({},{'_id':0, 'keyword':1, 'time':1},function(err,data){
      var sendObj=[];
      if(err) throw err;
      for(var i=0;i<data.length;i++)
      {
        var timestamp=data[i].time;
        //convert into  to UTC time
        var newdate=new Date(parseInt(timestamp));
        var keyword = data[i].keyword
        var obj={searchWord: keyword, time: newdate}
        sendObj.push(obj);
      }
      res.end(JSON.stringify(sendObj));
    }).sort({'time':-1}).limit(10);


    })


    app.get('/imageapi/:inputurl', function(req, res) {
        var param = req.params.inputurl;
        var offset = req.query.offset;

        //date/time to timestamp
        var current_date =Math.floor(new Date() / 1000)
      //  var now = new Date(current_date.toUTCString());


        //storing data into database

        var save_timestamp = new history({
            keyword: param,
            time: current_date
        });

        save_timestamp.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Object Saved Successfully');
            }
        });





        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            // we can now use "flickr" as our API object,
            // but we can only call public methods and access public data

            flickr.photos.search({
                tags: param,
                page: offset,
                per_page: 100
            }, function(err, result) {
                // result is Flickr's response
                //  console.log(result.photos.photo[0]);

                var searchObj = [];
                var farm_id;
                var server_id;
                var id;
                var secret;
                var title;


                console.log(result.photos.photo[0]);
                if (result.photos.photo.length > 10) {
                    for (var j = 0; j < 10; j++) {
                        farm_id = result.photos.photo[j].farm;
                        server_id = result.photos.photo[j].server;
                        id = result.photos.photo[j].id;
                        secret = result.photos.photo[j].secret;
                        p_title = result.photos.photo[j].title;
                        searchObj.push({
                            title: p_title,
                            url: "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg",
                            thumbnail: "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_t.jpg"
                        });
                    }
                } else {

                    for (var j = 0; j <= result.photos.photo.length; j++) {
                        farm_id = result.photos.photo[j].farm;
                        server_id = result.photos.photo[j].server;
                        id = result.photos.photo[j].id;
                        secret = result.photos.photo[j].secret;
                        p_title = result.photos.photo[j].title;
                        searchObj.push({
                            title: p_title,
                            url: "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg",
                            thumbnail: "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + "_t.jpg"
                        });

                    }

                }

                console.log(offset);
                res.contentType('application/json');
                res.send(JSON.stringify(searchObj));



                //convert object into url as below

                //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg


            });


        });









    })


}
