const { multipleMongooseToObject } = require('../../util/mongoose');
const Song = require('../models/Song');
const { userGoogle, User } = require('../models/User');
const FavoriteTrack = require('../models/FavoriteTrack');
const Singer = require('../models/Singer');
const Playlist = require('../models/Playlist');
const Category = require('../models/Category');
class MusicController {
    // [GET] /
    index(req, res, next) {
        res.render('music', {
            display_header: false,
            display_footer: false,
            display: false,
            user_id: req.session.user._id,
        });
    }
}

module.exports = new MusicController();
