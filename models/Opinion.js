const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PollOpinionSchema = new Schema({	
		userid: Number,
		pollid: String,
		opinionid: String
});
const opinion = mongoose.model('opinion', PollOpinionSchema);

module.exports = opinion;