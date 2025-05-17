// models/database.js
const mongoose = require('mongoose');

// Food schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

// Order schema
const orderSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    foodItems: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending' 
    },
    deliveryAddress: { type: String, required: true },
    deliveryPrice: { type: Number, required: true }
});

// Export models directly
const Food = mongoose.model('Food', foodSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Food, Order };