'use strict';

const jwt = require('jsonwebtoken');
const SALT = 'HpJPmZeCZZf9Syy9fJgT';

module.exports = {
  verify: function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, SALT, function(err, decoded) {
        if (err) {
          return res.status(401).json({type: 'authentication_error', message: 'Token wrong or expire'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).json({status: 'invalid_request_error', message: 'Отсутствует token доступа'});
    }
  }
};
