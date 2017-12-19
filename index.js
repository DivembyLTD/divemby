'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')
const helmet = require('helmet')
const compression = require('compression')
const chalk = require('chalk')
const app = express();

app.set('port', process.env.WEB_PORT || process.env.PORT || 3000);
app.set('host', process.env.WEB_HOST || process.env.HOST || 'localhost');

app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(compression());

app.get('/', (req, res) => {
  res.json({status: 'ok'});
});


app.listen(app.get('port'), app.get('host'), () => {
  debug('%s API server listening on ' + app.get('host') + ' port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
})
