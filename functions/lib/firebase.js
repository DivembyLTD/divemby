'use strict';

const firebase = require('firebase')

const config = {
  apiKey: "AIzaSyCoZ6QbTbqsoaXtl0YhFuCb9iDnmbnrgDM",
  authDomain: "divemby-fb.firebaseapp.com",
  databaseURL: "https://divemby-fb.firebaseio.com",
  projectId: "divemby-fb",
  storageBucket: "divemby-fb.appspot.com",
  messagingSenderId: "750365061846"
};

firebase.initializeApp(config);

const fb = firebase.database();


module.exports = fb;