var passport = require('passport');
var Deal = require('../models/Deal');


/**
 * GET /dashboard
 * Dashboard page.
 */
 
var myDate = new Date();
var alerts = {
  'dateDisp': '04/27/2015 9:00am',
  'unique': 4,
}


/**
 * GET /api/deals/current
 * Lists current deals
 */
var Deal = require('../models/Deal');

exports.getDashboard = function(req, res) {
 
  Deal.find({})
    .where('userId').equals(req.user.email)
    .exec(function (err, data) {
      var deals = data;
      res.render('dashboard', {
      title: 'Dashboard',
      alerts:alerts,
      deals:deals,
    });
      
  });

};
