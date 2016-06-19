/**
 * Route defintion for the weather api. Fetches the weather for a specific location. Used for
 * testing purposes only. 
 */
var express = require('express');
var router = express.Router();

var ForecastIO = require('forecast-io');
var forecast = new ForecastIO('YOUR-API-KEY');
 
/** 
 * GET /forecast 
 */
router.get('/', function(req, res, next) {
   
   forecast
    .latitude('37.8267')
    .longitude('-122.423')
    .get()           
    .then(function(forecast) {
        console.log(forecast);
        res.send(forecast);
    })
    .catch(function(err)  {
        console.log(err);
        res.send(err);
    });
});

module.exports = router;

