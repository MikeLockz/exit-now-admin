var Deal = require('../models/Deal');

var trigger = {
	'weather': {
		'condition': ['snow', 'rain', 'sunny', 'storm warning']
	},
	'traffic': {
		'condition': ['green', 'yellow', 'red']
	},
	'location': {
		'distance': [5,10,15,25],
		'coordinates': [0,0]
	},
	'event':[true,false],
	'trigger': {
		'name':'',
		'description': '',
		'triggerType':[this.weather, this.location, this.traffic, this.event],
	}
}


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
    'dealData': {
      'name': req.body.name,
      'description': req.body.description
    }
  });
  console.log(req.body.name);

  deal.save(function(err) {
    if (err) return next(err, deal);
    req.flash('success', { msg: 'Deal has been created.' });
    res.redirect('/dashboard');
  });

};