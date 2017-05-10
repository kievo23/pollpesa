const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PollsSchema = new Schema({
	name: String,
	description: String,
	options: [{
		name: String
	}]
});
const Polls = mongoose.model('poll', PollsSchema);

module.exports = Polls;