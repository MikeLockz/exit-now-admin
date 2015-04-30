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
 
var dealDef = [{  
  userId: 0,
  dealData: {
    name: '',
    description: '',
    businessName:'',
    triggers: { 
        roadConditions:'',
        traffic: '',
        distance:''
    },
    lat:0,
    lon:0,
    onSegments: [{
      segmentId:31,
    }],
    businessName:''
  },
  maxCoupon:50,
  dateAdded:'',
  dateUpdated:'',
  dateExpires:'',
  itemsPushed:0,
  itemsConverted:0,
  active:1
}];

  Deal.find({})
    .where('userId').equals(req.user.email)
    .exec(function (err, data) {
       deals = data;
         if(!deals[0]){ var deals = dealDef; }
      res.render('dashboard', {
      title: 'Dashboard',
      alerts:alerts,
      deals:deals,
    });
      
  });

};
