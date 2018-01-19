var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventorySchema = new Schema({
    water: Number,
    food: Number,
    medication: Number,
    ammunition: Number,
})

module.exports = mongoose.model('Inventory', InventorySchema);