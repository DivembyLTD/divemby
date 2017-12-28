'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const helpers = require('./../lib/helpers');

module.exports = () => {
  return {
  	setOrder: (req, res) => {
      let ordersRef = db.ref().child('/orders');
      let newOrderRef = ordersRef.push();
      newOrderRef.set({
			  user: req.decoded.userRefKey,
			  desc: req.body.desc,
			  ds: req.body.ds,
			  de: req.body.de,
			  pets_ids: req.body.pets,
			  createdDate: helpers.getSysDate(),
			}).then(data => {
				res.json({status: "OK"});
			}).catch(err => {
				res.status(500).json({status: "ERROR", msg: err});
			});
  	},

  	updateOrder: (req, res) => {
  	},

  	getSittersByGeo: (req, res) => {
  	},

  	getOrders: (req, res) => {
  		res.json({status: "OK", data: []});
  	}
  }
}