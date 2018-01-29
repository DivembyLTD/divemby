'use strict';

const functions = require("firebase-functions")
const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')
const helmet = require('helmet')
const compression = require('compression')
const chalk = require('chalk')
const logger = require('morgan');

const firebase = require('firebase')
const moment = require('moment')
const errorHandler = require('strong-error-handler');

const Busboy = require('busboy');

const authCtrl = require('./ctrl/auth')();
const userCtrl = require('./ctrl/user')();
const orderCtrl = require('./ctrl/order')();
const notifyCtrl = require('./ctrl/notify')();
const shopCtrl = require('./ctrl/shop')();

const jtwMiddleware = require('./middleware/jwt');

const getRawBody = require('raw-body');
const contentType = require('content-type')
const cors = require('cors');

const bodyParserError = require('bodyparser-json-error');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());

app.use(compression());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((req, res, next) => {
    if(req.rawBody === undefined && req.method === 'POST' && req.headers['content-type'] !== undefined && req.headers['content-type'].startsWith('multipart/form-data')){
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '10mb',
            encoding: contentType.parse(req).parameters.charset
        }, function(err, string){
            if (err) return next(err);
            req.rawBody = string;
            next();
        });
    }
    else{
        next();
    }
});

app.use((req, res, next) => {
  if (req.method === 'POST' && req.headers['content-type'].startsWith('multipart/form-data')) {
      const busboy = new Busboy({ headers: req.headers })
      let fileBuffer = new Buffer('')
      req.files = {
          file: []
      }

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          file.on('data', (data) => {
              fileBuffer = Buffer.concat([fileBuffer, data])
          })

          file.on('end', () => {
              const file_object = {
                  fieldname,
                  'originalname': filename,
                  encoding,
                  mimetype,
                  buffer: fileBuffer
              }

              req.files.file.push(file_object)
              next()
          })
      })

      busboy.end(req.rawBody)
  } else {
      next()
  }
});

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
app.post('/uploadImg', jtwMiddleware.verify, userCtrl.uploadImg);
app.post('/uploadMoreImg', jtwMiddleware.verify, userCtrl.uploadMoreImg);
app.post('/getProfile', jtwMiddleware.verify, userCtrl.getProfile);
app.post('/checkAddress', jtwMiddleware.verify, userCtrl.checkAddress);
app.post('/getPriceZone', jtwMiddleware.verify, userCtrl.getPriceZone);

// public
app.post('/getUserProfile', userCtrl.getUserProfile);


// notify
app.post('/sendNotify', jtwMiddleware.verify, notifyCtrl.sendNotify);


// order
app.post('/setOrder', jtwMiddleware.verify, orderCtrl.setOrder);
app.post('/updateOrder', jtwMiddleware.verify, orderCtrl.updateOrder);

app.post('/getOrders', jtwMiddleware.verify, orderCtrl.getOrders);


// shop
app.options('/importCatImg', cors())
app.post('/importCatImg', jtwMiddleware.verify, shopCtrl.importCatImg);

const api = functions.https.onRequest(app);

module.exports = {
  api
}
