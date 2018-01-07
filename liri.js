require("dotenv").config();

var keys = require('./keys.js');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var request = require('request');

var movieThis = function (movieName) {
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

var spotifyThis = function (songName) {
  if (!songName) {
    return spotifyThis("The Sign, Ace of Base");
  }
  spotify.search({ type: 'track', query: songName, limit: 5}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    //console.log(data.tracks.items);
    if(data.tracks.total === 0) {
      console.log("Song not Found!");
      console.log("If you haven't Listened to 'The Sign' by Ace of Base, then you should:");
      return spotifyThis("The Sign, Ace of Base");
    } else {
      var response = data.tracks.items[0];
      if (response.artists.length === 1) {
        console.log("Artist: " + response.artists[0].name);
      } else {
        var artistList = "Artists: ";
        for (key in response.artists) {
          if (key == 0) {
           artistList += response.artists[key].name;
          } else {
           artistList += ", " + response.artists[key].name;
          }
        }
        console.log(artistList);
      }
      console.log("The song's name: " + response.name);
      console.log("A preview link of the song from Spotify: " + response.preview_url);
      console.log("The album that the song is from: " + response.album.name);
    }
  })
  return
}

var myTweets = function () {
  client.get('search/tweets', {q: 'nodejs'}, function(error, tweets, response) {
    if (error) {
      return console.log('Error occurred: ' + error);
    }
    var tweetsList = tweets.statuses;
    for (tweet of tweetsList) {
      console.log("#Tweet created at: " + tweet.created_at);
      console.log("Tweet: " + tweet.text);
    }
  });
}

var doRandom = function () {
  fs.readFile('random.txt', "utf-8", function(error, data) {
    var array = data.trim().split(",");
    //console.log(array);
    main(array[0], array[1]);
  })
}

var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

var main = function (command, input) {
  console.log('<><><><><><><><><><><><><>');
  switch (command) {
    case 'movie-this':
      movieThis(input);
      break;
    case 'spotify-this-song':
      spotifyThis(input);
      break;
    case 'my-tweets':
      myTweets();
      break;
    case 'do-what-it-says':
      doRandom();
      break;
  }
}

main(command, input);
