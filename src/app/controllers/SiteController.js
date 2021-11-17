const { multipleMongooseToObject } = require('../../util/mongoose');
class SiteController {
    // [GET] /
    index(req, res, next) {
        res.render('home', {
            display_header: true,
            display_footer: true,
            display: true,
        });
        
    }
}

module.exports = new SiteController();
