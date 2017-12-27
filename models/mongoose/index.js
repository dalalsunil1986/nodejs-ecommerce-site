
// BLUEBIRD
// ----------
const bluebird = require('bluebird');

// MONGOOSE
// ----------
const mongoose = require('mongoose');
mongoose.Promise = bluebird;

var models = {};
// models.User = require('./user');
// models.Message = require('./message');
// models.Post = require('./post');
// models.Comment = require('./comment');
// models.Vote = require('./vote');
// models.UpVote = require('./voteUp');
// models.DownVote = require('./voteDown');


module.exports = models;