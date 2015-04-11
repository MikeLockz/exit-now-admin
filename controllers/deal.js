var Deal = require('../models/Deal');

/**
 * GET /
 * Deal page.
 */
exports.index = function(req, res) {
  res.render('deal', {
    title: 'deal'
  });
};

/**
 * GET /deal
 * deal page.
 */
exports.getDeal = function(req, res) {
  res.render('deal', {
    title: 'deal'
  });
};

/**
 * POST /deal/new
 * New deal.
 */
exports.postDeal = function(req, res, next) {
  var deal = new Deal({
    'name': req.body.name || ''
  });

  deal.save(function(err) {
    if (err) return next(err);
    req.flash('success', { msg: 'Deal has been created.' });
    res.redirect('/dashboard');
  });

};