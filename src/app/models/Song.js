const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Song = new Schema({
    songId : {type: Number, required: true},
    title: {type: String, required: true},
    Lyric: [{type: String }],
    img: {type: String },
    path: {type: String, required: true},
    singers: [{type: Number, required: true}],
    categories : {type: Number, required: true},
    duration: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('Song', Song);
