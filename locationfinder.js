 // This module should have a function that takes in a filename and a callback function as a parameter. 

module.exports = function (sitterlocation, userlocation, callback) {
	const request = require('request');
// get distances

    search = `https://www.distance24.org/route.json?stops=${sitterlocation}|${userlocation}`
    request(search, function (err, response, body) {
        var distances;
        if (err){
            console.log('error:', error);
            }  
            var result = JSON.parse(body)
            console.log("HELLOOOOOO")
            console.log(result)
            distances = result.distance  
            callback(distances) 
            return distances
        })
}