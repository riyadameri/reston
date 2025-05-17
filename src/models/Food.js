const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String
  }
});

// Create text index for search
foodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Food', foodSchema);