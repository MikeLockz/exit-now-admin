var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var segmentSchema = new mongoose.Schema({
  SegmentId: { type: Number, unique: true, default: 0},
  SegmentName: { type: String, default: ''},
  Line:{
    Type: {type: String, default: 'LineString'},
    Coordinates:[{
      Lat: {type: Number, default:0},
      Lon: {type: Number, default:0}
    }]
  }
});

module.exports = mongoose.model('Segment', segmentSchema);
