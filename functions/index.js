'use strict';

const functions = require("firebase-functions")
const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')
const helmet = require('helmet')
const compression = require('compression')
const chalk = require('chalk')

const firebase = require('firebase')
const moment = require('moment')
const errorHandler = require('strong-error-handler');

const authCtrl = require('./ctrl/auth')();
const userCtrl = require('./ctrl/user')();
const orderCtrl = require('./ctrl/order')();

const jtwMiddleware = require('./middleware/jwt');

const Multer = require('multer');

const middlewareMulter = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
}).single('file');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())



app.use(errorHandler({
  debug: true,
  log: true,
}));

app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());

app.use(compression());

app.get("/", (req, res) => {
  res.send(
    "Divemby API"
  )
})

// auth and reg
app.post('/verifyPhone', authCtrl.verifyPhone);
app.post('/checkCode', authCtrl.checkCode);

// user
app.post('/updateProfile', jtwMiddleware.verify, userCtrl.updateProfile);
app.post('/uploadImg', [jtwMiddleware.verify, middlewareMulter], userCtrl.uploadImg);
app.post('/getProfile', jtwMiddleware.verify, userCtrl.getProfile);

// order

app.post('/setOrder', jtwMiddleware.verify, orderCtrl.setOrder);
app.post('/updateOrder', jtwMiddleware.verify, orderCtrl.updateOrder);
app.post('/getSittersByGeo', jtwMiddleware.verify, orderCtrl.getSittersByGeo);
app.post('/getOrders', jtwMiddleware.verify, orderCtrl.getOrders);

const api = functions.https.onRequest(app);

module.exports = {
  api
}
