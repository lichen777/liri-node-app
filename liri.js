require("dotenv").config();

var keys = require('./keys.js');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var request = require('request');

var command = process.argv[2];

var movieThis = function(movieName) {
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  //console.log(queryUrl);
  request(queryUrl, function(error, response, body) {
    if (error) {
      return console.log('error:', error);
    }
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      if (!movieName) {
        console.log("If you haven't watched 'Mr. Nobody,' then you should:");
        console.log("http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
        return movieThis('Mr. Nobody');
      } else if (JSON.parse(body).Response === 'False') {
        console.log("Movie not found!");
        return movieThis();
      } else {
        console.log("Title of the movie: " + JSON.parse(body).Title);
        console.log("Year the movie came out: " + JSON.parse(body).Year);
        console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
        var ratingArray = JSON.parse(body).Ratings;
        var rottenRating = ratingArray.find( x => {
          return x.Source === 'Rotten Tomatoes';
        })
        if (rottenRating) {
          console.log("Rotten Tomatoes Rating of the movie: " + rottenRating.Value);
        }
        console.log("Country where the movie was produced: " + JSON.parse(body).Country);
        console.log("Language of the movie: " + JSON.parse(body).Language);
        console.log("Plot of the movie: " + JSON.parse(body).Plot);
        console.log("Actors in the movie: " + JSON.parse(body).Actors);
      }
    }
  });
  return
}

if (command === 'movie-this') {
  var movieName = process.argv.slice(3).join("+");
  movieThis(movieName);
};
