        // API Configuration
        const API_BASE_URL = 'https://redox-resto.onrender.com'; // Change this to your API URL
        
        // Initialize Socket.io connection
        const socket = io('https://redox-resto.onrender.com', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });
        
        // DOM Elements
        const dashboardPage = document.getElementById('dashboard-page');
        const foodsPage = document.getElementById('foods-page');
        const ordersPage = document.getElementById('orders-page');
        
        const dashboardLink = document.getElementById('dashboard-link');
        const foodsLink = document.getElementById('foods-link');
        const ordersLink = document.getElementById('orders-link');
        
        const addFoodBtn = document.getElementById('add-food-btn');
        const foodModal = document.getElementById('food-modal');
        const foodForm = document.getElementById('food-form');
        const foodModalTitle = document.getElementById('food-modal-title');
        const foodIdInput = document.getElementById('food-id');
        const foodNameInput = document.getElementById('food-name');
        const foodPriceInput = document.getElementById('food-price');
        const foodDescriptionInput = document.getElementById('food-description');
        const foodImageInput = document.getElementById('food-image');
        const imagePreview = document.getElementById('image-preview');
        
        const orderModal = document.getElementById('order-modal');
        const orderStatusSelect = document.getElementById('order-status');
        const saveOrderBtn = document.getElementById('save-order-btn');
        
        const confirmModal = document.getElementById('confirm-modal');
        const confirmTitle = document.getElementById('confirm-title');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmActionBtn = document.getElementById('confirm-action-btn');
        
        const closeButtons = document.querySelectorAll('.close, .close-btn');
        
        const notificationBell = document.getElementById('notification-bell');
        const notificationCount = document.getElementById('notification-count');
        const toastNotification = document.getElementById('toast-notification');
        
        // State
        let currentOrderId = null;
        let currentFoodId = null;
        let actionCallback = null;
        let unreadNotifications = 0;
        


        // Add this to your initialization code
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Add event listeners for confirm buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('confirm-order-btn')) {
            const orderId = e.target.getAttribute('data-id');
            confirmAction(
                'Confirm Order',
                'Are you sure you want to confirm this order?',
                () => confirmOrder(orderId)
            );
        }
    });
});

// Add this function for order confirmation
function confirmOrder(orderId) {
    fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'preparing'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showToast(data.message, 'success');
            loadOrders();
            loadDashboardData();
        } else {
            showToast(data.error || 'Failed to confirm order', 'error');
        }
    })
    .catch(error => {
        console.error('Error confirming order:', error);
        showToast('Failed to confirm order', 'error');
    });
}
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {

                document.addEventListener('click', function(e) {
        if (e.target.classList.contains('confirm-order-btn')) {
            const orderId = e.target.getAttribute('data-id');
            confirmAction(
                'Confirm Order',
                'Are you sure you want to confirm this order?',
                () => confirmOrder(orderId)
            );
        }
    });
            // Navigation
            dashboardLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('dashboard');
                loadDashboardData();
            });
            
            foodsLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('foods');
                loadFoods();
            });
            
            ordersLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('orders');
                loadOrders();
            });
            
            // Food Modal
            addFoodBtn.addEventListener('click', function() {
                openFoodModal();
            });
            
            foodImageInput.addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
            
            foodForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveFood();
            });
            
            // Order Modal
            saveOrderBtn.addEventListener('click', function() {
                updateOrderStatus();
            });
            
            // Confirm Modal
            confirmActionBtn.addEventListener('click', function() {
                if (actionCallback) {
                    actionCallback();
                }
                confirmModal.classList.remove('active');
            });
            
            // Close modals
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    foodModal.classList.remove('active');
                    orderModal.classList.remove('active');
                    confirmModal.classList.remove('active');
                });
            });
            
            // Close modals when clicking outside
            document.querySelectorAll('.modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
            });
            
            // Filter orders
            document.getElementById('order-filter').addEventListener('change', function() {
                loadOrders(this.value);
            });
            
            // Search foods
            document.getElementById('food-search').addEventListener('input', function(e) {
                searchFoods(e.target.value);
            });
            
            // Search orders
            document.getElementById('order-search').addEventListener('input', function(e) {
                searchOrders(e.target.value);
            });
            
            // Notification bell click
            notificationBell.addEventListener('click', function() {
                // Reset notification count when clicked
                unreadNotifications = 0;
                updateNotificationBadge();
                
                // Show notifications list (you would implement this)
                showToast('Notifications cleared', 'info');
            });
            
            // Setup Socket.io event listeners
            setupSocketListeners();
            
            // Show dashboard by default
            showPage('dashboard');
            loadDashboardData();
        });
        
        // Setup Socket.io event listeners
// Update the setupSocketListeners function
function setupSocketListeners() {
    socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
        showToast('Connected to real-time updates', 'success');
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Disconnected from WebSocket server');
        showToast('Disconnected from real-time updates', 'error');
    });
    
    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        showToast('WebSocket connection error', 'error');
    });
    
    socket.on('newOrder', (order) => {
        unreadNotifications++;
        updateNotificationBadge();
        showToast(`New order #${order.orderNumber} received`, 'success');
        
        if (dashboardPage.style.display !== 'none') loadDashboardData();
        if (ordersPage.style.display !== 'none') loadOrders();
    });
    
    socket.on('orderUpdate', (data) => {
        showToast(`Order #${data.orderId} updated to ${data.status}`, 'info');
        if (dashboardPage.style.display !== 'none') loadDashboardData();
        if (ordersPage.style.display !== 'none') loadOrders();
    });
    
    socket.on('orderDeleted', (data) => {
        showToast(`Order #${data.orderId} was deleted`, 'warning');
        if (dashboardPage.style.display !== 'none') loadDashboardData();
        if (ordersPage.style.display !== 'none') loadOrders();
    });
}        
        // Update notification badge
        function updateNotificationBadge() {
            notificationCount.textContent = unreadNotifications;
            
            if (unreadNotifications > 0) {
                notificationBell.classList.add('pulse');
                setTimeout(() => {
                    notificationBell.classList.remove('pulse');
                }, 500);
            }
        }
        
        // Show toast notification
        function showToast(message, type = 'info') {
            toastNotification.textContent = message;
            toastNotification.className = 'toast';
            toastNotification.classList.add('show', type);
            
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);
        }
        
        // Show the specified page
        function showPage(page) {
            dashboardPage.style.display = 'none';
            foodsPage.style.display = 'none';
            ordersPage.style.display = 'none';
            
            dashboardLink.classList.remove('active');
            foodsLink.classList.remove('active');
            ordersLink.classList.remove('active');
            
            if (page === 'dashboard') {
                dashboardPage.style.display = 'block';
                dashboardLink.classList.add('active');
            } else if (page === 'foods') {
                foodsPage.style.display = 'block';
                foodsLink.classList.add('active');
            } else if (page === 'orders') {
                ordersPage.style.display = 'block';
                ordersLink.classList.add('active');
            }
        }
        
        // Load dashboard data
        function loadDashboardData() {
            // Load stats
                fetch(`${API_BASE_URL}/orders/status-counts`)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const counts = data.data;
                const totalOrders = (counts.pending || 0) + 
                                  (counts.preparing || 0) + 
                                  (counts.delivering || 0) + 
                                  (counts.delivered || 0);
                
                document.getElementById('total-orders').textContent = totalOrders;
                document.getElementById('delivered-orders').textContent = counts.delivered || 0;
                document.getElementById('pending-orders').textContent = counts.pending || 0;
                
                // Calculate revenue (you might want to get this from the backend instead)
                const revenue = (counts.delivered || 0) * 25; // Assuming $25 average order
                document.getElementById('total-revenue').textContent = `$${revenue.toFixed(2)}`;
            }
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            showToast('Failed to load dashboard statistics', 'error');
        });
    
            
            // Load recent orders
            fetch(`${API_BASE_URL}/orders?limit=5`)
                .then(response => response.json())
                .then(data => {
                    const ordersTable = document.getElementById('recent-orders');
                    ordersTable.innerHTML = '';
                    
                    if (data.data && data.data.length > 0) {
                        data.data.forEach(order => {
                            const itemCount = order.foodItems.reduce((total, item) => total + item.quantity, 0);
                            
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${order.orderNumber}</td>
                                <td>${order.userName}</td>
                                <td>${itemCount}</td>
                                <td>$${order.totalPrice.toFixed(2)}</td>
                                <td><span class="status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                            <td class="actions">
                                <button class="btn btn-primary btn-sm view-order-btn" data-id="${order._id}">View</button>
                                <button class="btn btn-success btn-sm confirm-order-btn" data-id="${order._id}">Confirm</button>
                                <button class="btn btn-danger btn-sm delete-order-btn" data-id="${order._id}">Delete</button>
                            </td>
                            `;
                            ordersTable.appendChild(row);
                        });
                        
                        // Add event listeners to view buttons
                        document.querySelectorAll('.view-order-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                viewOrder(this.getAttribute('data-id'));
                            });
                        });
                    } else {
                        ordersTable.innerHTML = '<tr><td colspan="6" style="text-align: center;">No recent orders found</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Error loading recent orders:', error);
                    showToast('Failed to load recent orders', 'error');
                });
        }
        
        // Load all foods
        function loadFoods() {
            fetch(`${API_BASE_URL}/foods`)
                .then(response => response.json())
                .then(data => {
                    const foodsTable = document.getElementById('foods-table');
                    foodsTable.innerHTML = '';
                    
                    if (data.data && data.data.length > 0) {
                        data.data.forEach(food => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>
                                    <img src="${API_BASE_URL}/foods/${food._id}/image" alt="${food.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                </td>
                                <td>${food.name}</td>
                                <td>${food.description.substring(0, 50)}${food.description.length > 50 ? '...' : ''}</td>
                                <td>$${food.price.toFixed(2)}</td>
                                <td class="actions">
                                    <button class="btn btn-primary btn-sm edit-food-btn" data-id="${food._id}">Edit</button>
                                    <button class="btn btn-danger btn-sm delete-food-btn" data-id="${food._id}">Delete</button>
                                </td>
                            `;
                            foodsTable.appendChild(row);
                        });
                        
                        // Add event listeners to action buttons
                        document.querySelectorAll('.edit-food-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                editFood(this.getAttribute('data-id'));
                            });
                        });
                        
                        document.querySelectorAll('.delete-food-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                confirmAction(
                                    'Delete Food',
                                    'Are you sure you want to delete this food item? This action cannot be undone.',
                                    () => deleteFood(this.getAttribute('data-id'))
                                );
                            });
                        });
                    } else {
                        foodsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">No food items found</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Error loading foods:', error);
                    showToast('Failed to load food items', 'error');
                });
        }
        
        // Search foods
        function searchFoods(query) {
            fetch(`${API_BASE_URL}/foods`)
                .then(response => response.json())
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        const filteredFoods = data.data.filter(food => 
                            food.name.toLowerCase().includes(query.toLowerCase()) || 
                            food.description.toLowerCase().includes(query.toLowerCase())
                        );
                        
                        const foodsTable = document.getElementById('foods-table');
                        foodsTable.innerHTML = '';
                        
                        if (filteredFoods.length > 0) {
                            filteredFoods.forEach(food => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>
                                        <img src="${API_BASE_URL}/foods/${food._id}/image" alt="${food.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                    </td>
                                    <td>${food.name}</td>
                                    <td>${food.description.substring(0, 50)}${food.description.length > 50 ? '...' : ''}</td>
                                    <td>$${food.price.toFixed(2)}</td>
                                    <td class="actions">
                                        <button class="btn btn-primary btn-sm edit-food-btn" data-id="${food._id}">Edit</button>
                                        <button class="btn btn-danger btn-sm delete-food-btn" data-id="${food._id}">Delete</button>
                                    </td>
                                `;
                                foodsTable.appendChild(row);
                            });
                            
                            // Add event listeners to action buttons
                            document.querySelectorAll('.edit-food-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    editFood(this.getAttribute('data-id'));
                                });
                            });
                            
                            document.querySelectorAll('.delete-food-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    confirmAction(
                                        'Delete Food',
                                        'Are you sure you want to delete this food item? This action cannot be undone.',
                                        () => deleteFood(this.getAttribute('data-id'))
                                    );
                                });
                            });
                        } else {
                            foodsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">No matching food items found</td></tr>';
                        }
                    }
                })
                .catch(error => {
                    console.error('Error searching foods:', error);
                    showToast('Error searching foods', 'error');
                });
        }
        
        // Load orders with optional filter
        function loadOrders(filter = 'all') {
            let url = `${API_BASE_URL}/orders`;
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const ordersTable = document.getElementById('orders-table');
                    ordersTable.innerHTML = '';
                    
                    if (data.data && data.data.length > 0) {
                        data.data.forEach(order => {
                            const itemCount = order.foodItems.reduce((total, item) => total + item.quantity, 0);
                            const orderDate = new Date(order.createdAt).toLocaleDateString();
                            
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${order.orderNumber}</td>
                                <td>${order.userName}</td>
                                <td>${order.userPhone}</td>
                                <td>${itemCount}</td>
                                <td>$${order.totalPrice.toFixed(2)}</td>
                                <td><span class="status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                                <td>${orderDate}</td>
                                <td class="actions">
                                    <button class="btn btn-primary btn-sm view-order-btn" data-id="${order._id}">View</button>
                                    <button class="btn btn-danger btn-sm delete-order-btn" data-id="${order._id}">Delete</button>
                                </td>
                            `;
                            ordersTable.appendChild(row);
                        });
                        
                        // Add event listeners to action buttons
                        document.querySelectorAll('.view-order-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                viewOrder(this.getAttribute('data-id'));
                            });
                        });
                        
                        document.querySelectorAll('.delete-order-btn').forEach(button => {
                            button.addEventListener('click', function() {
                                const orderId = this.getAttribute('data-id');
                                confirmAction(
                                    'Delete Order',
                                    'Are you sure you want to delete this order? This action cannot be undone.',
                                    () => deleteOrder(orderId)
                                );
                            });
                        });

                    } else {
                        ordersTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No orders found</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Error loading orders:', error);
                    showToast('Failed to load orders', 'error');
                });
        }
        
        // Search orders
        function searchOrders(query) {
            fetch(`${API_BASE_URL}/orders`)
                .then(response => response.json())
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        const filteredOrders = data.data.filter(order => 
                            order.userName.toLowerCase().includes(query.toLowerCase()) || 
                            order.userPhone.includes(query) ||
                            order.orderNumber.toString().includes(query)
                        );
                        
                        const ordersTable = document.getElementById('orders-table');
                        ordersTable.innerHTML = '';
                        
                        if (filteredOrders.length > 0) {
                            filteredOrders.forEach(order => {
                                const itemCount = order.foodItems.reduce((total, item) => total + item.quantity, 0);
                                const orderDate = new Date(order.createdAt).toLocaleDateString();
                    
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${order.orderNumber}</td>
                                    <td>${order.userName}</td>
                                    <td>${order.userPhone}</td>
                                    <td>${itemCount}</td>
                                    <td>$${order.totalPrice.toFixed(2)}</td>
                                    <td><span class="status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                                    <td>${orderDate}</td>
                                    <td class="actions">
                                        <button class="btn btn-warning btn-sm view-order-btn" data-id="${order._id}">View</button>
                                        <button class="btn btn-danger btn-sm delete-order-btn" data-id="${order._id}">Delete</button>
                                        <button class="btn btn-success btn-sm delete-order-btn" data-id="${order._id}">Confirm</button>
                                    </td>
                                `;
                                ordersTable.appendChild(row);
                            });
                            
                            // Add event listeners to action buttons
                            document.querySelectorAll('.view-order-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    viewOrder(this.getAttribute('data-id'));
                                });
                            });
                            
                            document.querySelectorAll('.delete-order-btn').forEach(button => {
                                button.addEventListener('click', function() {
                                    confirmAction(
                                        'Delete Order',
                                        'Are you sure you want to delete this order? This action cannot be undone.',
                                        () => deleteOrder(this.getAttribute('data-id'))
                                    );
                                });
                            });
                        } else {
                            ordersTable.innerHTML = '<tr><td colspan="8" style="text-align: center;">No matching orders found</td></tr>';
                        }
                    }
                })
                .catch(error => {
                    console.error('Error searching orders:', error);
                    showToast('Error searching orders', 'error');
                });
        }
        
        // Open food modal for adding new food
        function openFoodModal() {
            foodModalTitle.textContent = 'Add New Food';
            foodIdInput.value = '';
            foodNameInput.value = '';
            foodPriceInput.value = '';
            foodDescriptionInput.value = '';
            foodImageInput.value = '';
            imagePreview.innerHTML = '<span>No image selected</span>';
            foodModal.classList.add('active');
        }
        
        // Edit food item
        function editFood(id) {
            fetch(`${API_BASE_URL}/foods/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.data) {
                        const food = data.data;
                        foodModalTitle.textContent = 'Edit Food';
                        foodIdInput.value = food._id;
                        foodNameInput.value = food.name;
                        foodPriceInput.value = food.price;
                        foodDescriptionInput.value = food.description;
                        
                        if (food.image && food.image.contentType) {
                            imagePreview.innerHTML = `<img src="${API_BASE_URL}/foods/${food._id}/image" alt="Preview">`;
                        } else {
                            imagePreview.innerHTML = '<span>No image selected</span>';
                        }
                        
                        foodModal.classList.add('active');
                    } else {
                        showToast('Food item not found', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error loading food:', error);
                    showToast('Failed to load food item', 'error');
                });
        }
        
        // Save food (create or update)
        function saveFood() {
            const id = foodIdInput.value;
            const method = id ? 'PUT' : 'POST';
            const url = id ? `${API_BASE_URL}/foods/${id}` : `${API_BASE_URL}/foods`;
            
            const formData = new FormData();
            formData.append('name', foodNameInput.value);
            formData.append('price', foodPriceInput.value);
            formData.append('description', foodDescriptionInput.value);
            
            if (foodImageInput.files[0]) {
                formData.append('image', foodImageInput.files[0]);
            }
            
            fetch(url, {
                method: method,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    foodModal.classList.remove('active');
                    loadFoods();
                } else {
                    showToast(data.error || 'Failed to save food', 'error');
                }
            })
            .catch(error => {
                console.error('Error saving food:', error);
                showToast('Failed to save food', 'error');
            });
        }
        
        // Delete food item
        function deleteFood(id) {
            fetch(`${API_BASE_URL}/foods/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    loadFoods();
                } else {
                    showToast(data.error || 'Failed to delete food', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting food:', error);
                showToast('Failed to delete food', 'error');
            });
        }
        
        // View order details
        function viewOrder(id) {
            fetch(`${API_BASE_URL}/orders/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.data) {
                        const order = data.data;
                        currentOrderId = order._id;
                        
                        // Join the order room for real-time updates
                        socket.emit('joinOrderRoom', order._id);
                        
                        // Set order information
                        document.getElementById('order-number').textContent = order.orderNumber;
                        document.getElementById('order-date').value = new Date(order.createdAt).toLocaleString();
                        document.getElementById('order-total').value = `$${order.totalPrice.toFixed(2)}`;
                        orderStatusSelect.value = order.status;
                        
                        // Set customer information
                        document.getElementById('customer-name').value = order.userName;
                        document.getElementById('customer-phone').value = order.userPhone;
                        document.getElementById('delivery-address').value = order.deliveryAddress;
                        
                        // Load order items
                        const orderItemsContainer = document.getElementById('order-items');
                        orderItemsContainer.innerHTML = '';
                        
                        let grandTotal = 0;
                        
                        if (order.foodItems && order.foodItems.length > 0) {
                            order.foodItems.forEach(item => {
                                const orderItem = document.createElement('div');
                                orderItem.className = 'order-item';
                                
                                const itemTotal = item.price * item.quantity;
                                grandTotal += itemTotal;
                                
                                orderItem.innerHTML = `
                                    <div class="item-info">
                                        <img src="${API_BASE_URL}/foods/${item.foodId}/image" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                        <div>
                                            <h5>${item.name}</h5>
                                            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                                        </div>
                                    </div>
                                    <div class="item-price">$${itemTotal.toFixed(2)}</div>
                                `;
                                orderItemsContainer.appendChild(orderItem);
                            });
                        }
                        
                        // Set grand total
                        document.getElementById('order-grand-total').textContent = `$${grandTotal.toFixed(2)}`;
                        
                        // Show modal
                        orderModal.classList.add('active');
                    } else {
                        showToast('Order not found', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error loading order:', error);
                    showToast('Failed to load order details', 'error');
                });
        }
        
        // Update order status
// Update the updateOrderStatus function
function updateOrderStatus() {
    if (!currentOrderId) return;
    
    const newStatus = orderStatusSelect.value;
    
    fetch(`${API_BASE_URL}/orders/${currentOrderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            showToast(data.message, 'success');
            orderModal.classList.remove('active');
            loadOrders();
            loadDashboardData();
        } else {
            showToast(data.error || 'Failed to update order', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating order:', error);
        showToast('Failed to update order', 'error');
    });
}
        
        // Delete order
        function deleteOrder(id) {
            fetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showToast(data.message, 'success');
                    loadOrders();
                    loadDashboardData();
                } else {
                    showToast(data.error || 'Failed to delete order', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting order:', error);
                showToast('Failed to delete order', 'error');
            });
        }
        
        // Confirm action
function confirmAction(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    actionCallback = callback;
    confirmModal.classList.add('active');
    
    // Set up the confirm button click handler
    confirmActionBtn.onclick = function() {
        if (typeof callback === 'function') {
            callback();
        }
        confirmModal.classList.remove('active');
    };
}
