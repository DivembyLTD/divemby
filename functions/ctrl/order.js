'use strict';

const errorHandler = require('strong-error-handler');
const db = require('./../lib/firebase');
const helpers = require('./../lib/helpers');

module.exports = () => {
  return {
  	setOrder: (req, res) => {
      let ordersRef = db.ref().child('/orders/' + req.decoded.userRefKey);
      let newOrderRef = ordersRef.push();
      newOrderRef.set({
			  user: req.decoded.userRefKey,
			  desc: req.body.desc,
			  ds: req.body.ds,
			  de: req.body.de,
			  pets_ids: req.body.pets_ids,
			  createdDate: helpers.getSysDate(),
			}).then(data => {
				res.json({status: "OK"});
			}).catch(err => {
				res.status(500).json({status: "ERROR", msg: err});
			});
  	},

  	updateOrder: (req, res) => {
  		let opts = req.body;

      if (!opts.order_key) { return res.status(400).json({status: "INVALID_REQUEST", msg: "order_key is empty"}); }

      let ordersRef = db.ref().child('/orders/' + req.decoded.userRefKey + '/' + req.body.order_key);

      ordersRef.once("value").then(snapshot => {
        if (snapshot.exists()) {
          ordersRef.update(_.pick(opts,['desc','ds','de','pets_ids'])).then(data => {
            res.json({status: 'OK'});
          }).catch(err => {
            res.status(500).json({status:'ERROR'});
          });
        } else {
          res.status(404).json({status:'NOT FOUND'});
        }
      });

      res.json({status: "OK"});
  	},

  	getSittersByGeo: (req, res) => {
  		res.json({status: "OK"});
  	},

  	getOrders: (req, res) => {
  		let ordersRef = db.ref().child('/orders/' + req.decoded.userRefKey);
  		ordersRef.on("value", snapshot => {
        let orders = [];
        snapshot.forEach(data => {
          orders.push({order_key: data.key, order_data: data.val()});

			  });
        res.json({status: "OK", data: orders});
  		});
  	}
  }
}