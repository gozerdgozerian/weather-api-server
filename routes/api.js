/**
 * Route defintion for the main weather api. 
 */
var express = require('express');
var router = express.Router();

var ForecastIO = require('forecast-io');
var forecast = new ForecastIO('YOUR-API-KEY');

var publicConfig = {
  key: '',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true // use https 
  //proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests 
};

var GoogleMapsAPI = require('googlemaps');
var gmAPI = new GoogleMapsAPI(publicConfig);
 
/* 
 * GET api 
 */   
router.get('/:address', function(req, res, next) {
   var addr = req.params.address;
   
   // geocode API 
   var geocodeParams = {
     "address":    addr,
     "components": "components=country:US",
     "bounds":     "55,-1|54,1",
     "language":   "en",
     "region":     "us"
   };
   
   console.log(geocodeParams);
   
   gmAPI.geocode(geocodeParams, function(err, result){
      if (err) {
         res.send(err);
      }
      else {
         var overallResult = {};
         if (result.hasOwnProperty('results')) {
            var locations = result.results;
            var numLocations = locations.length;
            console.log(locations);
            for (var i = 0; i < numLocations; i++) {
               var l = locations[i];
               if (l.hasOwnProperty('formatted_address')) {
                  overallResult.place = l.formatted_address;
               }
               if (l.hasOwnProperty('geometry')) {
                  if (l.geometry.hasOwnProperty('location')) {
                     var loc = l.geometry.location;
                     
                     if (loc.hasOwnProperty('lat') && loc.hasOwnProperty('lng')) {
                        console.log('lat: ' + loc.lat + '  lng: ' + loc.lng);
                        // Get the forecast for this location 
                        forecast.latitude(loc.lat).longitude(loc.lng)
                                .get()
                                .then(function (frcst) {
                                   console.log(frcst);
                                   overallResult.status = 'OK';
                                   overallResult.forecast = JSON.parse(frcst);
                                   sendResult(overallResult);
                                   return;                                  
                                })
                                .catch(function (err) {
                                   console.log(err);
                                   overallResult.status = err;
                                   sendResult(overallResult);
                                });
                     } 
                     else {
                        overallResult.status = 'Couldn\'t find lat or long';
                        sendResult(overallResult);
                     }
                  }
                  else {
                     overallResult.status = 'Could not find location property';
                     sendResult(overallResult);
                  }
               }
               else {
                  overallResult.status = 'Could not find geometry property';
                  sendResult(overallResult);
               }
            }
         }   
      }      
   });
   
   /**
    * Finishes processing the request and sends the result object with any data or status obtained.
    * @param {type} result the result of the request
    */
   function sendResult(result) {
      res.send(result);
   }
});

module.exports = router;

