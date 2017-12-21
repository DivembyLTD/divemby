'use strict';

const functions = require("firebase-functions")
const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')
const helmet = require('helmet')
const compression = require('compression')
const chalk = require('chalk')
const app = express()
const firebase = require('firebase')
const moment = require('moment')
const errorHandler = require('strong-error-handler');

const authCtrl = require('./ctrl/auth')();
const userCtrl = require('./ctrl/user')();

const jtwMiddleware = require('./middleware/jwt');


app.use(errorHandler({
  debug: true,
  log: true,
}));
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(compression());

app.get("/", (req, res) => {
  res.send(
    "Divemby API"
  )
})


app.post('/verifyPhone', authCtrl.verifyPhone);
app.post('/checkCode', authCtrl.checkCode);
app.post('/updateProfile', jtwMiddleware.verify, userCtrl.updateProfile);


// app.post('/reg', (req, res) => {
//   var opts = req.body;

//   // var newUserObj = {
//   //   createdDate: moment().format(),
//   //   modifiedDate: '',
//   //   name: 'Andrey',
//   //   surname: 'Delov',
//   //   phone: '79119028069',
//   //   email: '',
//   //   balance: '',
//   //   marketing: '',
//   //   avatar: '',
//   //   device: {
//   //     type: '',
//   //     token: '',
//   //     ip: ''
//   //   },
//   //   geo: {
//   //     lat: '',
//   //     lng: '',
//   //     address: ''
//   //   },
//   //   sitter: {
//   //     active: false,
//   //     verified: false,
//   //     text: '',
//   //     acccat: false,
//   //     accdogsm: false,
//   //     accdogmd: false,
//   //     accdogbg: false,
//   //     accdoglg: false,
//   //     pricecat: 0,
//   //     pricedogsm: 0,
//   //     pricedogmd: 0,
//   //     pricedogbg: 0,
//   //     pricedoglg: 0,
//   //     payments: {
//   //       card: '',
//   //       yandexWallet: ''
//   //     },
//   //     balance: 0 
//   //   },
//   //   pets: [
//   //     {
//   //       type: 'cat',
//   //       sex: 'male',
//   //       castr: true,
//   //       age: 17,
//   //       vetpass: 0,
//   //       dogsize: ''
//   //     }
//   //   ]
//   // };

//   var newUserKey = firebase.database().ref('users').push().key;
//   var updates = {};
//   updates['users/' + newUserKey] = newUserObj;

//   firebase.database().ref().update(updates).then(data => {
//     res.json({status: 'ok'});
//   }).catch(err => {
//     res.status(500).json({status: 'error', err: err});
//   });
// })

const api = functions.https.onRequest(app);

module.exports = {
  api
}
