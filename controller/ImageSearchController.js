module.exports = function(app,Flickr,mongoose)
{


  //database connection

  mongoose.connect("mongodb://test:test@ds063856.mlab.com:63856/imagesearch");

  var history = mongoose.model('history', {

    keyword: String,
    time:String
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

app.get('/latest',function(req,res){

  res.end("show latest post here.");

})

app.get('/imageapi/:inputurl',function(req,res){
  var param=req.params.inputurl;
var offset=req.query.offset;

//convet all time and date into UTC format
var current_date= new Date();
var now= new Date(current_date.toUTCString());


//storing data into database

var save_timestamp = new history({ keyword: param ,time:now });

 save_timestamp.save(function (err) {
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
      tags:param,
      page: offset,
      per_page: 100
    }, function(err, result) {
      // result is Flickr's response
    //  console.log(result.photos.photo[0]);

   var searchObj=[];
   var farm_id;
   var server_id;
   var id;
   var secret;
   var title;


   console.log(result.photos.photo[0]);
    if (result.photos.photo.length > 10)
    {
        for(var j=0;j<10;j++)
        {
           farm_id= result.photos.photo[j].farm;
           server_id=result.photos.photo[j].server;
           id=result.photos.photo[j].id;
           secret= result.photos.photo[j].secret;
           p_title=result.photos.photo[j].title;
          searchObj.push({
            title:p_title,
            url: "https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+".jpg",
            thumbnail:"https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_t.jpg"
          });
        }
    }
    else {

      for(var j=0; j<=result.photos.photo.length; j++)
      {
        farm_id= result.photos.photo[j].farm;
        server_id=result.photos.photo[j].server;
        id=result.photos.photo[j].id;
        secret= result.photos.photo[j].secret;
        p_title=result.photos.photo[j].title;
       searchObj.push({
         title:p_title,
         url: "https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+".jpg",
         thumbnail:"https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_t.jpg"
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


  app.get('/',function(req,res){

    res.end("Hello world");
  })
}
