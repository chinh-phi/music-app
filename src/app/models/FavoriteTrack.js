const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteTrack = new Schema({
    songId: [{type: Number, require: true}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('FavoriteTrack', FavoriteTrack);
