'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const multer = require('multer');

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
    }
  }
}