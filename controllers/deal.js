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
    '12':'Wet',
    '13':'Slushy',
    '14':'Dry'
  },
  'roadConditionsShort':{
    '1':'Closed',
    '5':'Snow',
    '8':'Poor Visibility',
    '11':'Rain',
    '12':'Dry'
  },
  'traffic': {
    '1':'Green - Over 50mph',
    '2':'Yellow - 25-50mph',
    '3':'Red - 15-25mph',
    '4':'Black - 0-15mph'
  },
  'distance': {
    '0':'10 miles',
    '1':'20 miles',
    '2':'30 miles',
    '3':'50 miles',
  },
  'dealTypes':{
    'hotel':{
      '0': '50% Off Hotel Room Tonight!',
      '1': 'Free Dinner with Hotel Stay',
      '2': '2 for 1 Hotel Rooms Tonight',
    },
    'restaurant':{
      '0': 'FREE Coffee with snack purchase',
      '1': 'FREE Pizza!',
      '2': 'FREE Beer',
    }
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
  });
};

/**
 * POST /deal/new
 * New deal.
 */
exports.postDeal = function(req, res, next) {
  var myDate = new Date();
  var expir = new Date();
  var expirDate = expir.setDate(expir.getDate() + 30); //expires in 30 days
  
  //var lat = req.body.lat;
  //var lon = req.body.lon;
  var lat = 1;
  var lon = 1;

  var deal = new Deal({
    'userId': req.body.userId,
    'dealData': {
      'name': req.body.name,
      'description': req.body.description,
      'triggers': {
        'roadConditions': req.body.roadConditions,
        'traffic': req.body.traffic,
        'distance': req.body.distance
      },
     'lat': lat, 
     'lon': lon,
     'businessName': req.body.businessName,
    },
    'dateExpires': req.body.dateExpires,
    'dateAdded': req.body.dateAdded,
    'maxCoupon': req.body.maxCoupon,
    'dateAdded':myDate,
    'dateUpdated':myDate,
    'dateExpires':expirDate,
    'itemsPushed':1,
    'itemsConverted':0,
    'active':true,
  });

  deal.save(function(err) {
    if (err) return next(err, deal);
    req.flash('success', { msg: 'Deal has been created.' });
    res.redirect('/dashboard');
  });

};


/**
 * POST /deal/delete
 * Delete user account.
 */
exports.postDeleteDeal = function(req, res, next) {
 if(req.body.idRef){  
  Deal.remove({ _id: req.body.idRef }, function(err) {
    if (err) return next(err);
    req.flash('success', { msg: 'Deal '+req.body.name+' has been Deleted.' });
    res.redirect('/dashboard');
  });
 }
};
