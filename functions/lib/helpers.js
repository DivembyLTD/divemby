'use strict';

const moment = require('moment');

module.exports = {
  stripFirstNumber: (msisdn) => {
    let num = '';
    if (msisdn.length === 10) {
      num = msisdn;
    }
    if (msisdn.length === 11 && (msisdn.substr(0,1) === '8' || msisdn.substr(0,1) === '7')) {
      num = msisdn.substr(1,10);
    }
    return num;
  },
  
  stripSpecialCharsAndSpace: (msisdn) => {
    let updateMsisdn = '';
    if (!msisdn) {
      return updateMsisdn;
    } else {
      updateMsisdn = msisdn.replace(/[&-\/\\#,+()$~%._'":*?!<>{}]/g,'');
      updateMsisdn = updateMsisdn.replace(/\s/g,'');
      return updateMsisdn;
    }
  },

  getSysDate: () => {
    return moment().format();
  },
}