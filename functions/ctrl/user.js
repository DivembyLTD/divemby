'use strict';
const format = require('util').format;
const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const utilities = require('./utilities');
const imageJimp = require('./../lib/jimp');

const axios = require('axios');

const Storage = require('@google-cloud/storage');
const Jimp = require('jimp');
const _ = require('lodash');
const Promise = require('bluebird');

const GeoFire = require('geofire');

const storage = Storage({
  projectId: "divemby-fb",
  keyFilename: "./divemby-fb-firebase-adminsdk-d6iqf-c98baf092c.json"
});


const Multer = require('multer');

const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
}).single('file');

const bucket = storage.bucket("divemby-fb.appspot.com");



module.exports = () => {
  return {
    updateProfile: (req, res) => {
      let opts = req.body;

      const geoFire = new GeoFire(db.ref("users_geo"));
      const usersRef = db.ref('users/' + req.decoded.userRefKey);
      usersRef.once("value").then(snapshot => {

        if (snapshot.exists()) {
          
          // drop geo point from geofire
          if (_.has(opts,'sitter') && opts.sitter.active === false) {
            console.log('remove key from geofire');
            geoFire.remove(req.decoded.userRefKey).then(() => {
              console.log("Provided key has been removed from GeoFire");
            }, err => {
              console.log("Error: " + err);
            });
          }

          if (_.has(opts,'geo') && opts.geo) {
            geoFire.set(req.decoded.userRefKey, [parseFloat(opts.geo.lat), parseFloat(opts.geo.lng)]).then(() => {
              console.log("Provided key has been added to GeoFire");
            }, err => {
              console.log("Error: " + err);
            });
          }


          usersRef.update(opts).then(data => {
            res.json({status: 'OK'});
          }).catch(err => {
            res.status(500).json({status:'ERROR'});
          });
        } else {
          res.status(404).json({status:'NOT FOUND'});
        }
      });
    },

    uploadImg: (req, res) => {
      let originalFileName, thumbFileName, thumbFileNameUpload, originalFileNameUpload;
      const usersRef = db.ref('users/' + req.decoded.userRefKey);

      if (!req.files.file[0]) { return res.status(400).json({status: "INVALID_REQUEST"}); }
      let opts = req.body;
      let file = req.files.file[0];
      const fileBuffer = file.buffer;
      let imageJimpPromises = [ 
        imageJimp.avaProcess(fileBuffer, 26, 26, 100, true),
        imageJimp.avaProcess(fileBuffer, 130, 130, 100, true)
      ]

      Promise.all(imageJimpPromises).then(result => {

          thumbFileName = 'thumb_' + Date.now() + '_' + file.originalname;
          originalFileName = 'original_' + Date.now() + '_' + file.originalname;


          thumbFileNameUpload = bucket.file('avatars/' + thumbFileName);
          originalFileNameUpload = bucket.file('avatars/' + originalFileName);

          
          let thumbStream = thumbFileNameUpload.createWriteStream({
              metadata: {
                contentType: 'image/jpeg'
              }
            })
            .on('error', (err) => {})
            .on('finish', () => {
              thumbFileNameUpload.makePublic().then(() => {
                const url = format(`https://storage.googleapis.com/${bucket.name}/${thumbFileNameUpload.name}`);

                usersRef.once("value").then(snapshot => {
                  if (snapshot.exists()) {
                    usersRef.child('avatar').update({
                      thumb: url
                    }).then(data => { 
                      console.log('upload 1');
                    });
                  }
                });
              });
            }).end(result[0]);


          let originalStream = originalFileNameUpload.createWriteStream({
              metadata: {
                contentType: 'image/jpeg'
              }
            })
            .on('error', function(err) {})
            .on('finish', () => {
              originalFileNameUpload.makePublic().then(() => {
                const url = format(`https://storage.googleapis.com/${bucket.name}/${originalFileNameUpload.name}`);

                usersRef.once("value").then(snapshot => {
                  if (snapshot.exists()) {
                    usersRef.child('avatar').update({
                      original: url
                    }).then(data => { 
                      console.log('upload 2');
                      res.json({status: "OK"}); 
                    });
                  }
                });
              });
            }).end(result[1]);

          

      });
    },

    uploadMoreImg: (req, res) => {
      let newFileName,  fileUpload;
      const usersRef = db.ref('users/' + req.decoded.userRefKey);

      if (!req.files.file[0]) { return res.status(400).json({status: "INVALID_REQUEST"}); }
      let file = req.files.file[0];

      const fileBuffer = file.buffer;

      imageJimp.avaProcess(fileBuffer, 800, 800, 100, false).then(img => {
        newFileName = Date.now() + '_' + file.originalname;
        fileUpload = bucket.file('additional/' + newFileName);

        let blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/jpeg'
          }
        })
          .on('error', function(err) {})
          .on('finish', () => {
            fileUpload.makePublic().then(() => {
              const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
              usersRef.once("value").then(snapshot => {
                if (snapshot.exists()) {
                  usersRef.child('images').push({
                    src: url
                  }).then(data => {
                    res.json({status: 'OK', data: {url: url}});
                  }).catch(err => {
                    res.status(500).json({status:'ERROR'});
                  });
                } else {
                  res.status(404).json({status:'NOT FOUND'});
                }
              });
            });
          }).end(img);
      });
    },

    getProfile: (req, res) => {
      const usersRef = db.ref('users/' + req.decoded.userRefKey);
      usersRef.once("value").then(snapshot => {
        if (snapshot.exists()) {
          res.json({status: 'OK', data: { getProfile: snapshot.val(), ref: req.decoded.userRefKey }});
        } else {
          res.status(404).json({status:'NOT FOUND'});
        }
      });
    },

    getUserProfile: (req, res) => {
      let opts = req.body;
      if (opts.ref) {
        const usersRef = db.ref('users/' + opts.ref);
        usersRef.once("value").then(snapshot => {
          if (snapshot.exists()) {
            let f = snapshot.toJSON();
            let userProfile = {}
            userProfile.createdDate =  f.createdDate;
            userProfile.modifiedDate = f.modifiedDate;
            userProfile.name = f.name;
            userProfile.surname = f.surname;
            userProfile.marketing = f.marketing;
            userProfile.avatar = f.avatar;
            userProfile.device = f.device;
            userProfile.geo = f.geo;
            userProfile.sitter = f.sitter;
            userProfile.pets = f.pets;
            res.json({status: 'OK', data: { getProfile: userProfile, ref: opts.ref }});
          } else {
            res.status(404).json({status:'NOT FOUND'});
          }
        });
      } else {
        return res.status(400).json({status: "INVALID_REQUEST"});
      }
    },


    checkAddress: (req, res) => {
      let opts = req.body;
      let key = 'AIzaSyDrci2dyaK4j6rYxrUJ9RHtB0mxiGGJgCM';
      let geoReqObj = {
        address: opts.city + ' ' + opts.street + ' ' + opts.home,
        key: key
      }

      axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params: geoReqObj })
      .then(result => {
        if (result.data && result.data.status === 'OK') {
          res.json({ status: "OK", geo: result.data.results[0].geometry.location });
        } else {
          res.status(404).json({status:'NOT FOUND'});
        }
      }).catch(err => {
        res.status(500).json({status:'ERROR', err: err});
      });

    },

    getPriceZone: (req, res) => {
      let opts = req.body;
      if (!_.has(opts,'geo')) {
        return res.status(400).json({status: "INVALID_REQUEST"});
      }

      let currentRegion = utilities.getSmallerDistance(opts.geo);
      let currentZone = utilities.getPriceLevelByRegion(currentRegion);

      res.json({status: "OK", data: { zone: currentZone, region: currentRegion.name }});
    }
  }
}