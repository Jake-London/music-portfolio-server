const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
    songName: { type: String, required: true },
    songBpm: { type: String, required: true },
    songDuration: { type: String, required: true },
    songType: { type: String, required: true },
    songPath: { type: String, required: true },
    coverPath: { type: String, required: true },
    isAvailable: { type: Boolean, required: true }
});

const Track = mongoose.model('Track', TrackSchema);

module.exports = Track;