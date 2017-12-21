'use strict';

const axios = require('axios');
const Promise = require('bluebird'); 
const db = require('./../lib/firebase');
const nodemailer = require('nodemailer');
const helpers = require('./../lib/helpers');

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
  }
}