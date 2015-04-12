var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var myDate = new Date();

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


var dealSchema = new mongoose.Schema({
  userId: { type: String,lowercase: true },
  dealData: {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    triggers: { 
        roadConditions: { type: String, default:''},
        traffic: { type: String, default:''},
        distance: { type: String, default:''}
    },
    lat:{ type: Number},
    lon:{ type: Number},
  },
  maxCoupon:{ type: Number, default:50 },
  dateAdded:{ type: Date, default: myDate},
  dateUpdated:{ type: Date, default: myDate},
  dateExpires:{ type: Date},
  active:{type: Boolean, default: true}
});


/**
 * Helper method for getting user's gravatar.
 */
dealSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('Deal', dealSchema);
