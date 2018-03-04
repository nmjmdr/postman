const config = require('../config')
const server = require('./api/server');
const routes = require('./api/routes');

const app = server.create({ handleUncaughtExceptions: true });
routes.create(app);
app.listen(config.api.port, () => console.log('%s listening at %s', config.api.name, app.url));
