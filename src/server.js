const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const NodeCache = require('node-cache');
require('dotenv').config();
const { ObjectId } = mongoose.Types;
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://riyadammmeri:OmGe6UeG1Q0hVJEq@ac-ujqhcf3-shard-00-00.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-01.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-02.7xu8hz3.mongodb.net:27017/?ssl=true&replicaSet=atlas-3anew8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// Create HTTP server and Socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Database models
const Food = require('./models/Food');
const Order = require('./models/Order');

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());

// Configure multer for file uploads (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Database connection with connection pooling
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ New client connected');

  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`Client joined order room: ${orderId}`);
  });

  socket.on('leaveOrderRoom', (orderId) => {
    socket.leave(orderId);
    console.log(`Client left order room: ${orderId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Helper function to emit order updates
const emitOrderUpdate = (orderId, orderData) => {
  io.to(orderId).emit('orderUpdate', {
    orderId,
    status: orderData.status,
    updatedAt: orderData.updatedAt
  });
};

// Routes

app.use(express.static(path.join(__dirname, '../moulai-food/customer')));

// Route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../moulai-food/customer/index.html'));
});

// Food Routes
app.post('/foods', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description || !req.file) {
      return res.status(400).json({ error: 'All fields including image are required' });
    }

    const newFood = new Food({
      name,
      price,
      description,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    const savedFood = await newFood.save();
    const responseFood = savedFood.toObject();
    delete responseFood.image;

    // Clear food cache
    cache.del('allFoods');

    res.status(201).json({
      message: '✅ Food saved successfully',
      data: responseFood
    });
  } catch (error) {
    console.error('❌ Error saving food:', error.message);
    res.status(500).json({ error: 'Error saving food' });
  }
});

app.get('/foods/:id/image', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid food ID' });
    }

    const food = await Food.findById(req.params.id);
    if (!food || !food.image.data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set({
      'Content-Type': food.image.contentType,
      'Cache-Control': 'public, max-age=86400'
    });
    res.send(food.image.data);
  } catch (error) {
    console.error('❌ Error retrieving image:', error.message);
    res.status(500).json({ error: 'Error retrieving image' });
  }
});

app.get('/foods', async (req, res) => {
  try {
    const cacheKey = 'allFoods';
    let foods = cache.get(cacheKey);

    if (!foods) {
      foods = await Food.find().select('-image.data').lean();
      cache.set(cacheKey, foods);
    }

    res.status(200).json({
      message: '✅ Retrieved all foods successfully',
      data: foods
    });
  } catch (error) {
    console.error('❌ Error retrieving foods:', error.message);
    res.status(500).json({ error: 'Error retrieving foods' });
  }
});

app.get('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).select('-image.data').lean();
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.status(200).json({
      message: '✅ Retrieved food successfully',
      data: food
    });
  } catch (error) {
    console.error('❌ Error retrieving food:', error.message);
    res.status(500).json({ error: 'Error retrieving food' });
  }
});

app.put('/foods/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updateData = { name, price, description };

    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-image.data');

    if (!updatedFood) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Clear food cache
    cache.del('allFoods');

    res.status(200).json({
      message: '✅ Food updated successfully',
      data: updatedFood
    });
  } catch (error) {
    console.error('❌ Error updating food:', error.message);
    res.status(500).json({ error: 'Error updating food' });
  }
});

app.delete('/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // Clear food cache
    cache.del('allFoods');

    res.status(200).json({
      message: '✅ Food deleted successfully',
      data: deletedFood
    });
  } catch (error) {
    console.error('❌ Error deleting food:', error.message);
    res.status(500).json({ error: 'Error deleting food' });
  }
});

// Order Routes
app.get('/orders/status-counts', async (req, res) => {
  try {
    const cacheKey = 'statusCounts';
    let statusCounts = cache.get(cacheKey);

    if (!statusCounts) {
      const counts = await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      statusCounts = counts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      cache.set(cacheKey, statusCounts);
    }

    res.status(200).json({
      message: '✅ Retrieved order status counts successfully',
      data: statusCounts
    });
  } catch (error) {
    console.error('❌ Error retrieving order status counts:', error.message);
    res.status(500).json({ error: 'Error retrieving order status counts' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { userName, foodItems, totalPrice, deliveryAddress, deliveryPrice, userPhone } = req.body;

    if (!userName || !foodItems || !totalPrice || !deliveryAddress || !deliveryPrice || !userPhone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const latestOrder = await Order.findOne().sort({ orderNumber: -1 });
    const orderNumber = Number(latestOrder?.orderNumber) + 1 || 1;

    const newOrder = new Order({ 
      userName, 
      foodItems, 
      totalPrice, 
      deliveryAddress, 
      deliveryPrice, 
      userPhone,
      orderNumber,
      status: 'pending'
    });

    const savedOrder = await newOrder.save();
    
    // Emit new order event
    io.emit('newOrder', savedOrder);
    // Clear orders cache
    cache.del('allOrders');

    res.status(201).json({
      message: '✅ Order saved successfully',
      data: savedOrder
    });
  } catch (error) {
    console.error('❌ Error saving order:', error.message);
    res.status(500).json({ error: 'Error saving order' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status && ['pending', 'preparing', 'delivering', 'delivered'].includes(status)) {
      query.status = status;
    }

    const cacheKey = `orders_${status || 'all'}_${page}_${limit}`;
    let result = cache.get(cacheKey);

    if (!result) {
      const orders = await Order.find(query)
        .populate('foodItems.foodId', 'name price')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await Order.countDocuments(query);

      result = {
        data: orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

      cache.set(cacheKey, result);
    }

    res.status(200).json({
      message: '✅ Retrieved orders successfully',
      ...result
    });
  } catch (error) {
    console.error('❌ Error retrieving orders:', error.message);
    res.status(500).json({ error: 'Error retrieving orders' });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const cacheKey = `order_${req.params.id}`;
    let order = cache.get(cacheKey);

    if (!order) {
      order = await Order.findById(req.params.id)
        .populate('foodItems.foodId', 'name price')
        .lean();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      cache.set(cacheKey, order);
    }

    res.status(200).json({
      message: '✅ Retrieved order successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error retrieving order:', error.message);
    res.status(500).json({ error: 'Error retrieving order' });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const { userName, foodItems, totalPrice, deliveryAddress, deliveryPrice } = req.body;

    if (!userName || !foodItems || !totalPrice || !deliveryAddress || !deliveryPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { userName, foodItems, totalPrice, deliveryAddress, deliveryPrice },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Emit update and clear cache
    emitOrderUpdate(req.params.id, updatedOrder);
    cache.del(`order_${req.params.id}`);
    cache.del('allOrders');

    res.status(200).json({
      message: '✅ Order updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('❌ Error updating order:', error.message);
    res.status(500).json({ error: 'Error updating order' });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Emit delete and clear cache
    io.to(req.params.id).emit('orderDeleted', { orderId: req.params.id });
    cache.del(`order_${req.params.id}`);
    cache.del('allOrders');

    res.status(200).json({
      message: '✅ Order deleted successfully',
      data: deletedOrder
    });
  } catch (error) {
    console.error('❌ Error deleting order:', error.message);
    res.status(500).json({ error: 'Error deleting order' });
  }
});

app.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Emit update and clear cache
    emitOrderUpdate(req.params.id, updatedOrder);
    cache.del(`order_${req.params.id}`);
    cache.del('allOrders');

    res.status(200).json({
      message: '✅ Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('❌ Error updating order status:', error.message);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// 404 Not Found handler