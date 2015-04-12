/**
 * GET /
 * Dashboard page.
 */
exports.index = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard'
  });
};

/**
 * GET /dashboard
 * Dashboard page.
 */
exports.getDashboard = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard'
  });
};


/**
 * GET /api/deals/current
 * Lists current deals

var Deal = require('../models/Deal');

exports.getMyDeals = function(req, res, next) {
  
  // Deal.find({})
  // .where('userId').equals(req.user.email)
  // .exec(function (err, deals) {
  //   res.send(deals);
  // });
};

console.log(exports.getMyDeals());

