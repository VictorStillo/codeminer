var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurvivorSchema   = new Schema({    
    name: { type: String, required: true},
    age: { type: Number, required: true},
    gender: { type: String, required: true},
    latitude: Number,
    longitude: Number,
    inventory: { water: Number,
                 food: Number,
                 medication: Number,
                 ammunition: Number},
    
    infection: {
        reports: Number,
        isInfected: Boolean,
    }
})

module.exports = mongoose.model('Survivor', SurvivorSchema);
