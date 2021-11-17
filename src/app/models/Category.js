const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    categoryId: {type: Number},
    name: { type: String },
    songs: [{type: Number}],
    singers: [{type: Number}],
    img: {type: String },
    slug: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('category', Category);
