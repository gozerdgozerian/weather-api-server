/**
 * 
 * Route definition for geolocating. Fetches the geolocation information for a given address from 
 * the Google Maps API. For testing. 
 */
var express = require('express');
var router = express.Router();

var publicConfig = {
  key: '',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true // use https 
  //proxy:              'http://127.0.0.1:9999' // optional, set a proxy for HTTP requests 
};

var GoogleMapsAPI = require('googlemaps');
var gmAPI = new GoogleMapsAPI(publicConfig);

/** 
 * GET /geolocate/{address} 
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
         res.send(result);
      }      
   });
});

module.exports = router;
