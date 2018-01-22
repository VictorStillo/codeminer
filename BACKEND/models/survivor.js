var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SurvivorSchema   = new Schema({    
    name: { type: String, required: true},
    age: { type: Number, required: true},
    gender: { type: String, required: true},
    latitude: Number,
    longitude: Number,
    inventory: { water: {
                    type: Number,
                    default: 0,
                    },

                 food: {
                    type: Number,
                    default: 0,
                    },
                medication: {
                    type: Number,
                    default: 0,
                    },
                 ammunition: {
                    type: Number,
                    default: 0,
                    },
                },
    
    infection: {
        reports: Number,
        isInfected: Boolean,
        reportersId: Array,
    }
})

module.exports = mongoose.model('Survivor', SurvivorSchema);
