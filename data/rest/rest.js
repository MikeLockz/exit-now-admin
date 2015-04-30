
var express = require('express');
var app     = express();

// Login
app.post( '/login', function (req, res) {
    res.send('destination.json'); } );

// User enters destination
app.post( '/destination', function (req, res) {
    res.send('forecast.json'); } );

app.get('/speeds', function (req, res) {
    res.send('speeds.json'); } );

app.get('/conditions', function (req, res) {
    res.send('conditiion.json'); } );

app.get('/gonogo', function (req, res) {
    res.send('gonogo.json'); } );

// User updates threshold
app.post( '/threshold', function (req, res) {
    res.send('sppeds.json'); } );

// Deals
app.get('/deals', function (req, res) {   // by geo fence
    res.send('deals.json'); } );

app.get('/deals', function (req, res) {  // By User Request
    res.send('deals.json'); } );

app.get('/deals', function (req, res) {  // By a Down the Road Locastion
    res.send('deals.json'); } );

// Post Analytice profile
app.post( '/profiles', function (req, res) {
    res.send('xxx.json'); } );

// Quit
app.post( '/quit', function (req, res) {
    res.send('quit.json'); } );

// ---- Socket.io Pushes -----

// Speeds

// Conditions

// Deals
//   - delete deal
//   - post new hot deal
//   - post new deal for congestion

