const loginRouter = require('./login'); 
const siteRouter = require('./site');
const musicRouter = require('./music');
const signoutRouter = require('./signout');
const registerRouter = require('./register');
const apiRouter = require('./api');
function route(app) {
    app.use('/', siteRouter);
    app.use('/login', loginRouter);
    app.use('/auth', loginRouter);
    app.use('/signout', signoutRouter);
    app.use('/music', musicRouter);
    app.use('/register', registerRouter);
    app.use('/api', apiRouter);
}

module.exports = route;