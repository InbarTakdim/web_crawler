var scrapr = require('scrapr');
var result;

function capitalize(str){
  // function change the first letter to toUpperCase
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase()
     + txt.substr(1).toLowerCase();
   });
}

function scrapWeather(city, res){
  scrapr.getHtmlViaBrowser('http://mavir.co.il/israel/'+city, true)
  .then(function($){
      $('html').filter(function(){
        var htmlTag = $(this);
        if(htmlTag.find("h2").length>0){
          if( htmlTag.find("h2").text().indexOf("404")>-1){
            //mavir.co.il return status=404,
            res.send({"error":true});
            return;
          }
        }
        //find windspeed
        var weatherDiv = htmlTag.find('ul')[1];
        var li2=$(weatherDiv).find("li")[2];
        var liSpan2= $(li2).find('span');
        var text= $(liSpan2).text().trim();
        var wind= text.substr(0, text.indexOf(" "));
        //find humidity
        var li3=$(weatherDiv).find("li")[3];
        var liSpan3= $(li3).find('span');
        var humidity= $(liSpan3).text();
        //find temparture
        var li0=$(weatherDiv).find("li")[0];
        var liSpan0= $(li0).find('span');
        var temparture= $(liSpan0).find('span').text();
        // pick relative path to img url
        var prefix="http://mavir.co.il";
        var imgObj= $(htmlTag).find('.photo');
        var x= $(imgObj).attr('src');
        var imgUrl= prefix+x; // full path to img src = (prefix)+(relative path)
        city= city.replace("_" , " ");
        var city2=capitalize(city);
        result={
          "error":false,
          "city": city2,
          "temp":temparture,
          "humidity": humidity,
          "wind": wind,
          "img": imgUrl
        };
        res.send(result);
      });
  },
  function(err){
      console.log("error : "+err);
      return err;
  })
}

module.exports= scrapWeather;
