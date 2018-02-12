const puppeteer = require('puppeteer');

function capitalize(str){
  // function change the first letter to toUpperCase
  str= str.replace("_" , " ");
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase()
     + txt.substr(1).toLowerCase();
   });
}

function scrapWeather(city, res){
  //parse city
  if(city.includes(",")){
    var temp=city;
    temp= temp.split(",")[0];
    city= temp;
  }
  city=capitalize(city);
  let scrape = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  console.log("city == "+ city);
  await page.goto('https://www.google.co.il/search?q=weather+'+city);
  await page.waitFor(1000);
  const result = await page.evaluate((city) => {
      if(document.querySelector('#wob_tm')== null){
        console.log("city not found");
        return {"error": true};
      }
      let temparture = document.querySelector('#wob_tm').innerText;
      let humidity = document.querySelector('#wob_hm').innerText;
      let wind = document.querySelector('#wob_ws').innerText.trim().split(" ")[0];
      let imgUrl = document.querySelector('#wob_tci').src;

      return {
      "error":false,
      "city": city,
      "temp":temparture,
      "humidity": humidity,
      "wind": wind,
      "img": imgUrl
      }

  }, city);

  browser.close();
  return result;
  };

  scrape().then((value) => {
  console.log(value); // Success!
  if(value.city){
    value.city= capitalize(value.city);
  }
  res.send(value);
  });
}


module.exports= scrapWeather;
