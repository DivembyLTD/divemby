'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const jwt = require('jsonwebtoken');
const SALT = 'HpJPmZeCZZf9Syy9fJgT';
const utilities = require('./utilities');
const helpers = require('./../lib/helpers');

module.exports = () => {
  return {
    verifyPhone: (req, res) => {
    	if (!req.body.phone) {
    		return res.status(400).json({status: "INVALID_REQUEST"});
    	}

      let phone = helpers.stripFirstNumber(helpers.stripSpecialCharsAndSpace(req.body.phone));

      utilities.sendSms(phone, 'Тестирую текст смс с кодом').then(data => {
        res.json({status: "OK", data: data});
      }, err => {
        res.json({status: "ERROR", data: err });
      });
    }
  }
}