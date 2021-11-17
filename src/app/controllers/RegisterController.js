const {userGoogle, User} = require('../models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');
const FavoriteTrack = require('../models/FavoriteTrack');
var bcrypt = require('bcryptjs');
class RegisterController {
    // [GET] /
    index(req, res, next) {
        res.render('register', {
            display_header: true,
            display_footer: true,
            display: true,
        });
    }
    
    
    async create(req, res, next) {
        const {username, email, password} = req.body;
        let user = await User.findOne({ email });
        if(user) {
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = new User({
            username,
            email,
            password: hashedPassword,
        });

        const favoriteTrack = new FavoriteTrack({
            songId: []
        });

        user.favoriteTrackId = favoriteTrack._id;

        await user.save();
        await favoriteTrack.save();
        res.redirect('/login');

    }
}

module.exports = new RegisterController();
