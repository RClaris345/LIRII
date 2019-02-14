require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//Bands In Town

var action = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

function userChoice(action, userInput) {
  switch (action) {
    case "spotify-this-song":
      spotifyThisSong(userInput);
      break;
    case "concert-this":
      bands(userInput);
      break;
    case "movie-this":
      movieThis(userInput);
      break;
    default:
      console.log("We don't know whatchu want bro....");
    case "do-what-it-says":
      doThis(userInput);
      break;
  }
}

userChoice(action, userInput);

function bands(artist) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(function(response) {
    //  console.log(response.data[0]);
    console.log(response.data[0].venue.name);
    console.log(response.data[0].venue.city);
    //  console.log(moment(response.data[0].datetime,"MM-DD-YYYY"));
    console.log(moment(response.data[0].datetime).format("MM-DD-YYYY"));
  });
}
// bands(artist);

function movieThis(movieName) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl).then(function(response) {
    console.log("Movie Title: " + response.data.Title);
    console.log("Release Year: " + response.data.Year);
    console.log("Movie Rated: " + response.data.imdbRating);
    console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
    console.log("Country Movie Made: " + response.data.Country);
    console.log("Movie Language: " + response.data.Language);
    console.log("Movie Plot: " + response.data.Plot);
    console.log("Movie Acotrs: " + response.data.Actors);
  });
}

// movieThis(movieName);

//Spotify

function spotifyThisSong(song) {
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    logToFile("log/spotify.json", data);
    var song = data.tracks.items;

    song.forEach(element => {
      console.log("\n");
      // console.log(element.artists[0].name);
      var name = element.artists.map(artist => {
        return artist.name;
      });
      console.log(name);
      console.log(element.name);
      console.log(element.preview_url);
      console.log(element.album.name);
    });
  });
}

function logToFile(filePath, data) {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), function(err) {
    if (err) console.log(err);
  });
}

function doThis() {
  // we'll read the random text file and print it to the console
  fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) { return console.log(error); }
      var args = data.split(", ");
      userCommand(args[0], args[1]);
  });
}
