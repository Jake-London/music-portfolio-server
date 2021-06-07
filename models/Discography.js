const mongoose = require('mongoose');

const DiscographySchema = new mongoose.Schema({
    discName: { type: String, required: true},
    discCoverPath: { type: String, required: true},
    discSpotify: { type: String, required: true}
});

const Discography = mongoose.model('Discography', DiscographySchema);

module.exports = Discography;