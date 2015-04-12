var Deal = require('../models/Deal');

/**
 * GET /dashboard
 * Dashboard page.
 */
 
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
 * GET /api/deals/current
 * Lists current deals
 */
var Deal = require('../models/Deal');

exports.getDashboard = function(req, res) {
  res.render('dashboard', {
    title: 'Dashboard',
  });
};
