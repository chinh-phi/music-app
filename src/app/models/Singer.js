const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Singer = new Schema({
    name: { type: String },
    singerId: { type: Number, require: true },
    // songId: {type: Schema.Types.ObjectId, ref: "Song"},
    songs: [{type: Number, require: true}],
    slug: {type: String},
    img: { type: String, require: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('Singer', Singer);
