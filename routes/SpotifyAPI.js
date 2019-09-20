var Spotify = require("node-spotify-api");

class SpotifyAPI {
    constructor(configKeys) {
        this.api = new Spotify(configKeys);
    }

    getSong(songName, callback) {
        this.api.search(
            {
                type: "track",
                query: songName,
                limit: 10
            },
            function(err, data) {
                if (err) {
                    callback("Error occured " + err, undefined);
                }
                var songs = [];
                var results = data.tracks.items;
                for (var i = 0; i < results.length; i++) {
                    var singers = [];
                    for (var j = 0; j < results[i].artists.length; j++) {
                        singers.push(" " + results[i].artists[j].name);
                    }
                    var songAdd = {
                        artist: singers,
                        song: results[i].name,
                        previewURL: results[i].preview_url,
                        album: results[i].album.name,
                        albumURL: results[i].album.images[0].url
                    }
                    songs.push(songAdd);
                };
                /////////////////
                //feel free to add logic to modify songs object before returning through callback
                /////////////////
                callback(undefined, songs);
        });
    }

    getTrack(trackName, callback) {
        // TODO ADD TRACK LOGIC
    }

    getArtistInfo(artistName, callback) {
        // TODO ADD ARTIST LOGIC
    }
}

module.exports = SpotifyAPI;