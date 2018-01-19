var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfectionSchema = new Schema({
    reports: Number,
    isInfected: Boolean,
})

module.exports = mongoose.model('Infection', InfectionSchema);
