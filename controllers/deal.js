var Deal = require('../models/Deal');

var triggers = {
  'roadConditions': {
    '0':'Slide',
    '1':'Closed',
    '2':'Blowing Snow',
    '3':'Icy',
    '4':'Icy Spots',
    '5':'Snow',
    '6':'Snow Packed',
    '7':'Snow Packed Icy Spots',
    '8':'Poor Visibility',
    '9':'High Wind',
    '10':'Scattered Showers',
    '11':'Rain',
    '11':'Wet',
    '11':'Slushy',
    '11':'Dry'
  },
  'traffic': {
    '1':'Green - Over 50mph',
    '2':'Yellow - 25-50mph',
    '3':'Red - 15-25mph',
    '4':'Black - 0-15mph'
  },
  'distance': {
    '0':'1 mile',
    '1':'2 miles',
    '2':'5 miles',
    '3':'10 miles',
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
    title: 'deal',
    triggers: triggers,
    fs: { getChild:function(trigger){
      return trigger.children
    }}
  });
};

/**
 * POST /deal/new
 * New deal.
 */
exports.postDeal = function(req, res, next) {
  console.log(deal);
  var deal = new Deal({
    'userId': req.body.userId,
    'dealData': {
      'name': req.body.name,
      'description': req.body.description,
      'triggers': {
        'roadConditions': req.body.weather,
        'traffic': req.body.traffic,
        'distance': req.body.distance
      },
      'latlon':{
         'lat': req.body.lat, 
         'lon': req.body.lon
      },
    },
    'dateExpires': req.body.dateExpires,
    'dateAdded': req.body.dateAdded,
    'maxCoupon': req.body.maxCoupon
  });
  console.log(deal);

  deal.save(function(err) {
    if (err) return next(err, deal);
    req.flash('success', { msg: 'Deal has been created.' });
    res.redirect('/dashboard');
  });

};