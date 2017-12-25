'use strict';
const format = require('util').format;
const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');

const Storage = require('@google-cloud/storage');
const Jimp = require("jimp");

const storage = Storage({
  projectId: "divemby-fb",
  keyFilename: "./divemby-fb-firebase-adminsdk-d6iqf-c98baf092c.json"
});

const Multer = require('multer');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

var upload = multer.single('file');

const bucket = storage.bucket("divemby-fb.appspot.com");

module.exports = () => {
  return {
    updateProfile: (req, res) => {
      let opts = req.body;
      const usersRef = db.ref('users/' + req.decoded.userRefKey);

      usersRef.once("value").then(snapshot => {
        if (snapshot.exists()) {
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
      let file = req.file;

      const usersRef = db.ref('users/' + req.decoded.userRefKey);

      if (!file) { return res.status(400).json({status: "INVALID_REQUEST"}); }

      let newFileName = file.originalname + '_' + Date.now();
      let fileUpload = bucket.file(newFileName);

      Jimp.read(file.buffer, (err, image) => {
          image.resize(80,80);
          image.getBuffer(Jimp.MIME_JPEG, (err, img) => {
            const blobStream = fileUpload.createWriteStream({
              metadata: {
                contentType: file.mimetype
              }
            });

            blobStream.on('error', (error) => {
              // reject('Something is wrong! Unable to upload at the moment.');
              res.json({status: 'ERROR'});
            });

            blobStream.on('finish', () => {
              // The public URL can be used to directly access the file via HTTP.
              const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);

              usersRef.once("value").then(snapshot => {
                if (snapshot.exists()) {
                  usersRef.update({avatar: {
                    thumb: url,
                    original: url
                  }}).then(data => {
                    res.json({status: 'OK'});
                  }).catch(err => {
                    res.status(500).json({status:'ERROR'});
                  });
                } else {
                  res.status(404).json({status:'NOT FOUND'});
                }
              });

              res.json({status: 'OK', data: {url: url}});
            });

            blobStream.end(img);
          });
          // var file = "new_name." + image.getExtension();
          // image.write(file)
          // do stuff with the image (if no exception)

      });

    },

    getProfile: (req, res) => {
      const usersRef = db.ref('users/' + req.decoded.userRefKey);
      usersRef.once("value").then(snapshot => {
        if (snapshot.exists()) {
          res.json({status: 'OK', data: { getProfile: snapshot.val() }});
        } else {
          res.status(404).json({status:'NOT FOUND'});
        }
      });

    }
  }
}