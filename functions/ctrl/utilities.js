'use strict';

const turf = require('@turf/turf');
const axios = require('axios');
const Promise = require('bluebird'); 
const db = require('./../lib/firebase');
const nodemailer = require('nodemailer');
const helpers = require('./../lib/helpers');
const _ = require('lodash');
const cities = require('./../dicts/city');
const priceZones = require('./../dicts/price_zones.json');

module.exports = {
  sendSms: (phone = null, msg = '') => {
    const smsUri = 'https://lcab.smsintel.ru/lcabApi/sendSms.php';

    let smsReqObj = {
      login: '79166076906',
      password: '44351969827',
      txt: msg,
      to: 8 + phone,
      channel: '0'
    }
    
    return new Promise((resolve, reject) => {
      if (!phone) { return reject('Phone is empty'); }

      const smsSendLogsRef = db.ref().child('/sms_logs');
      const smsSendLogRef = smsSendLogsRef.push({
        createdAt: helpers.getSysDate(),
        text: 'send sms to ' + phone
      }).then(data => {
        axios.get(smsUri, { params: smsReqObj })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
      }).catch(err => reject(err));

    });

  },

  sendEmail: (to, subject = 'Доброго времени суток') => {
    return new Promise((resolve, reject) => {

      let transporter = nodemailer.createTransport({
          host: 'p444978.mail.ihc.ru',
          port: 587,
          secure: false,
          auth: {
              user: 'noreply@divemby.com',
              pass: '5vwm96SA4d'
          }
      });

      let mailOptions = {
          from: '"Divemby.com" <noreply@divemby.com>',
          to: to,
          subject: subject,
          text: 'Hello world?',
          html: '<b>Hello world?</b>'
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject();
        }
      });

      resolve();
    });
  },

  getSmallerDistance: (geo) => {

    let minDistance = undefined;

    if (geo && cities && _.has(cities,'list') && cities.list.length > 0) {
      let from = turf.point([parseFloat(geo.lat), parseFloat(geo.lng)]);
      let iterate = _.map(cities.list, c => { 
        return { 
          distance: turf.distance(from, turf.point([parseFloat(c.lat), parseFloat(c.lng)])),
          name: c.city,
          icao: c.icao
        };
      });
      minDistance = _.minBy(iterate, i => { return i.distance});
    }
    return minDistance;
  },

  getPriceLevelByRegion: (obj) => {
    if(obj.icao === 'UUBB'){
        if(obj.distance < 35){
            return priceZones['level_1'];
        }
        if(obj.distance < 70){
            return priceZones['level_2'];
        }
    }

    if(obj.icao === 'ULLI'){
        if(obj.distance < 30){
            return priceZones['level_2'];
        }
        if(obj.distance < 60){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'URKK'){
        if(obj.distance < 10){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UNNT'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'USSS'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UWGG'){
        if(obj.distance < 10){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UWSS'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UWWW'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'URRR'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UUOO'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    if(obj.icao === 'UNOO'){
        if(obj.distance < 15){
            return priceZones['level_3'];
        }
    }

    return priceZones['level_4'];
  }
}