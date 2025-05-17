const mongoose = require('mongoose');
const { Food, Order } = require('./models/database');

// Test connection
async function testConnection() {
  try {
    await mongoose.connect('mongodb+srv://riyadammmeri:OmGe6UeG1Q0hVJEq@cluster0.7xu8hz3.mongodb.net/foodDelivery?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

// Test Food CRUD operations
async function testFoodOperations() {
  console.log('\n=== Testing Food Model ===');
  
  // Create
  const pizza = await Food.create({
    name: 'Margherita Pizza',
    price: 12.99,
    description: 'Classic pizza with tomato sauce and mozzarella',
    imageUrl: 'https://example.com/pizza.jpg'
  });
  console.log('✅ Created food:', pizza);

  // Read
  const foundFood = await Food.findById(pizza._id);
  console.log('✅ Found food:', foundFood);

  // Update
  const updatedFood = await Food.findByIdAndUpdate(
    pizza._id,
    { price: 14.99 },
    { new: true }
  );
  console.log('✅ Updated food price:', updatedFood.price);

  // Delete
  await Food.deleteOne({ _id: pizza._id });
  console.log('✅ Deleted food item');
}

// Test Order operations
async function testOrderOperations() {
  console.log('\n=== Testing Order Model ===');
  
  // First create a food item for the order
  const burger = await Food.create({
    name: 'Cheeseburger',
    price: 8.99,
    description: 'Juicy beef patty with cheese',
    imageUrl: 'https://example.com/burger.jpg'
  });

  // Create order
  const order = await Order.create({
    userName: 'John Doe',
    foodItems: [{
      foodId: burger._id,
      quantity: 2
    }],
    totalPrice: 17.98,
    deliveryAddress: '123 Main St',
    deliveryPrice: 3.00
  });
  console.log('✅ Created order:', order);

  // Read order
  const foundOrder = await Order.findById(order._id).populate('foodItems.foodId');
  console.log('✅ Found order with populated food:', foundOrder);

  // Cleanup
  await Order.deleteOne({ _id: order._id });
  await Food.deleteOne({ _id: burger._id });
  console.log('✅ Cleaned up test data');
}

// Run all tests
async function runTests() {
  if (!await testConnection()) return;
  
  try {
    await testFoodOperations();
    await testOrderOperations();
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

runTests();