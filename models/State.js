var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var myDate = new Date();

var stateSchema = new mongoose.Schema({
  CalculatedDate: { type: Date, unique: true, default: myDate},
  SegmentId: { type: Number, unique: true, default: 0},
  Conditions: [{
       AverageSpeed: { type: Number, default: 0},
       AverageTrafficFlow: { type: Number, default: 0},
       IsSlowDown: { type: Boolean, default: false},
       RoadCondition: { type: Number, default: 8},
       ExpectedTravelTime: { type: Number, default: 0},
       AverageOccupancy: { type: Number, default: 0},
       AverageVolume: { type: Number, default:0},
  }]
});

module.exports = mongoose.model('State', stateSchema);
