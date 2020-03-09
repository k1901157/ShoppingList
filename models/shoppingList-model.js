const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoppingList_schema = new Schema({
    text: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        req: true
    }]
});
const shoppingList_model = new mongoose.model('shoppingList', shoppingList_schema);

module.exports = shoppingList_model;