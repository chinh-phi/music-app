const { multipleMongooseToObject } = require('../../util/mongoose');
class SignoutController {
    // [GET] /
    index(req, res, next) {
        res.render('signout', {
            display_header: false,
            display_footer: true,
            display: false,
        });
    }
}

module.exports = new SignoutController();
