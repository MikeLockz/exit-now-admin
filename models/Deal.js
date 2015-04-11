var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var myDate = new Date();

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

var dealSchema = new mongoose.Schema({
  _id: Number, 
  userId: { type: String,lowercase: true },
  dealData: {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    triggers: { type: Array },
    latlon:{ type: Array},
    logoUrl:{ type: String, default: '' }
  },
  maxCoupon:{ type: Number, default:50 },
  dateAdded:{ type: Date, default: myDate},
  dateUpdated:{ type: Date, default: myDate},
  dateExpires:{ type: Date},
  active:{type: Boolean, default: false}
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
