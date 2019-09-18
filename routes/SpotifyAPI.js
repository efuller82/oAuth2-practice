var Spotify = require("node-spotify-api");

class SpotifyAPI {
    constructor(configKeys) {
        this.api = new Spotify(configKeys);
    }

    getSong(songName, callback) {
        this.api.search(
            {
                type: "track",
                query: songName
            },
            function(err, data) {
                if (err) {
                    callback("Error occured " + err, undefined);
                }

                var songs = data.tracks.items;
                /////////////////
                // feel free to add logic to modify songs object before returning through callback
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