const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Playlist = new Schema({
    playlistName: { type: String, require: true },
    description: { type: String },
    photo: { type: String },
    songId: [{type: Number}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('Playlist', Playlist);
