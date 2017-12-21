'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const multer = require('multer');

module.exports = () => {
  updateProfile: (req, res) => {
    if (!req.body.phone) {
      return res.status(400).json({status: "INVALID_REQUEST"});
    }

    let phone = helpers.stripFirstNumber(helpers.stripSpecialCharsAndSpace(req.body.phone));

  	const usersRef = db.ref().child('/users');
    
    res.json({});
  }
}