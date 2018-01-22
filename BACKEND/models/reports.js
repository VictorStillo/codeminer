var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    totalSurvivors: Number,
    infectedSurvivors: Number,
    nonInfectedSurvivor: Number,
    items: {
        total: Number,
        water: Number,
        food: Number,
        medication: Number,
        ammunition: Number,
    },
})

module.exports = mongoose.model('Report', ReportSchema);