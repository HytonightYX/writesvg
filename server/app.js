const Koa = require('koa');
const cors = require('@koa/cors');
const InitManager = require('./core/init');
const bodyParser = require('koa-bodyparser');
const catchError = require('./middlewares/exception');
const { db } = require('./core/db');

const app = new Koa();

require('./app/models/user');
require('./assocs');

// db.sync({force: true});
db.sync();

app.use(cors());
app.use(bodyParser());
app.use(catchError);

InitManager.initCore(app);

if (global.config.env === 'dev') {
}

const port = 3030;

app.listen(port, () => {
  console.log(`server start on ${port}`);
});
