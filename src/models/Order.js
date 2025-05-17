const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true, required: true, index: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  foodItems: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'delivering', 'delivered'], 
    default: 'pending',
    index: true 
  },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Indexes
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);