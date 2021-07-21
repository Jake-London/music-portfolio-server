const mongoose = require('mongoose');

const DiscographySchema = new mongoose.Schema({
    discName: { type: String, required: true},
    discArtists: { type: String, required: true },
    discSpotifyId: { type: String, required: true },
    discSpotifyEmbed: { type: String, required: true },
    discCoverUrl: { type: String, required: true}
});

const Discography = mongoose.model('Discography', DiscographySchema);

module.exports = Discography;