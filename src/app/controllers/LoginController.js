const {userGoogle, User} = require('../models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');
var bcrypt = require('bcryptjs');
class LoginController {
    // [GET] /login
    index(req, res, next) {
        res.render('login', {
            display_header: true,
            display_footer: true,
            display: true,
        });
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            return res.render('/login', {
                message: 'Your email is invalid. Please try again'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            
            return res.redirect('/login');
        }

        req.session.isAuth = true;
        req.session.user = user;
        res.redirect('/music');
        
    }
    
}

module.exports = new LoginController();
