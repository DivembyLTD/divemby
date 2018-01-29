'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const helpers = require('./../lib/helpers');
const _ = require('lodash');
const utilities = require('./utilities');

module.exports = () => {
  return {
    sendNotify: (req, res) => {
      res.json({});
    }
  }
}