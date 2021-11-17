const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userGoogleSchema = new Schema({
    googleId: { type: String, required: true },
    username: { type: String, required: true },
    photo: { type: String },
}, {
    timestamps: true
});

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    photo: { type: String },
    playlistId: [{ type: Schema.Types.ObjectId, ref: "Playlist"}],
    favoriteTrackId: { type: Schema.Types.ObjectId, ref: "FavoriteTrack"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

var userGoogle =  mongoose.model('userGoogle', userGoogleSchema);
var User = mongoose.model('User', userSchema);

module.exports =  {userGoogle, User};
