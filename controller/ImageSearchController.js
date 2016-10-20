module.exports = function(app,request,Flickr)
{

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

app.get('/imageapi/:inputurl',function(req,res){
  var param=req.params.inputurl;


  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data

    flickr.photos.search({
      tags:param,
      page: 1,
      per_page: 100
    }, function(err, result) {
      // result is Flickr's response
      console.log(result.photos);


      //convert object into url as below

      //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg


    });


  });














})


  app.get('/',function(req,res){

    res.end("Hello world");
  })
}
