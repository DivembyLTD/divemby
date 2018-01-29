'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const jwt = require('jsonwebtoken');
const SALT = 'HpJPmZeCZZf9Syy9fJgT';
const utilities = require('./utilities');
const helpers = require('./../lib/helpers');
const crpt = require('./../lib/crypto');

const _ = require('lodash');

module.exports = () => {
  return {
    verifyPhone: (req, res) => {
    	if (!req.body.phone) {
    		return res.status(400).json({status: "INVALID_REQUEST"});
    	}

      const codeTempRef = db.ref().child('/temp_codes');
      const phone = helpers.stripFirstNumber(helpers.stripSpecialCharsAndSpace(req.body.phone));
      const code = _.random(1000,9999);
      utilities.sendSms(phone, 'Ваш пароль на сайте ' + code).then(data => {
        codeTempRef.push({
          createdAt: helpers.getSysDate(),
          signature: crpt.encrypt(code + phone)
        });

        res.json({status: "OK", data: {code: code}});
      }, err => {
        res.json({status: "ERROR", data: err });
      });
    },

    checkCode: (req, res) => {
      if (!req.body.phone || !req.body.code) {
        return res.status(400).json({status: "INVALID_REQUEST"});
      }

      let jwtToken = '';
      const phone = helpers.stripFirstNumber(helpers.stripSpecialCharsAndSpace(req.body.phone));
      const code = helpers.stripSpecialCharsAndSpace(req.body.code);
      const signature = crpt.encrypt(code + phone);
      const codeTempRef = db.ref().child('/temp_codes');
      let verifySignature = codeTempRef.orderByChild('signature').equalTo(signature).once('value', snapshot => {
        if (_.isNull(snapshot.val())) {
          res.status(403).json({status: "FORBIDDEN"});
        } else {
          // check profile
          const usersRef = db.ref().child('/users');
          usersRef.orderByChild('phone').equalTo(phone).once('value', snapshot => {
            if (_.isNull(snapshot.val())) {
              usersRef.push({
                phone: phone,
                createdDate: helpers.getSysDate(),
                lastVisitedAt: helpers.getSysDate(),
                balance: 450
              }).then(data => {
                jwtToken = jwt.sign({userRefKey: data.getKey(), phone: phone}, SALT);
                res.json({status: "OK", data: { token: jwtToken, ref: data.getKey() }});
              }).catch(err => {
                res.status(500).json(err);
              });
            } else {
              jwtToken = jwt.sign({userRefKey: Object.keys(snapshot.val())[0], phone: snapshot.child(Object.keys(snapshot.val())[0]+'/phone').val() }, SALT);
              res.json({status: "OK", data: { token: jwtToken, ref: Object.keys(snapshot.val())[0] }});
            }

          });
          
        }
        
      });

    }
  }
}