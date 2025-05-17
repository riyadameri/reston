        document.addEventListener('DOMContentLoaded', () => {
            const foodItems = document.getElementById('foodItems');
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.getElementById('cartCount');
            const subtotal = document.getElementById('subtotal');
            const total = document.getElementById('total');
            const checkoutBtn = document.getElementById('checkoutBtn');
            const checkoutModal = document.getElementById('checkoutModal');
            const closeModal = document.getElementById('closeModal');
            const orderForm = document.getElementById('orderForm');
            const orderSummary = document.getElementById('orderSummary');
            const orderTotal = document.getElementById('orderTotal');
            const searchInput = document.getElementById('searchInput');
            const deliveryFee = document.getElementById('deliveryFee');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            const cartIcon = document.getElementById('cartIcon');
            const thankYouModal = document.getElementById('thankYouModal');
            const thankYouCloseBtn = document.getElementById('thankYouCloseBtn');
            const orderStatusModal = document.getElementById('orderStatusModal');
            const closeStatusModal = document.getElementById('closeStatusModal');
            
            // Orders status counts
            const pendingCount = document.getElementById('pendingCount');
            const preparingCount = document.getElementById('preparingCount');
            const deliveringCount = document.getElementById('deliveringCount');
            const deliveredCount = document.getElementById('deliveredCount');

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const DELIVERY_FEE = 140; 

            // Load all foods and orders status
            loadFoods();
            loadOrdersStatus();

            // Update cart UI
            updateCart();

            // Search functionality
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const foodCards = document.querySelectorAll('.food-card');
                
                foodCards.forEach(card => {
                    const name = card.querySelector('.food-name').textContent.toLowerCase();
                    if (name.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });

            // Cart icon click to show order status
            cartIcon.addEventListener('click', () => {
                if (cart.length > 0) {
                    // If cart has items, scroll to cart
                    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // If cart is empty, show order status
                    showOrderStatus();
                }
                
                // Add pulse animation
                cartIcon.classList.add('pulse');
                setTimeout(() => {
                    cartIcon.classList.remove('pulse');
                }, 500);
            });

            // Checkout button click
            checkoutBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    showToast('سلة المشتريات فارغة', 'error');
                    return;
                }
                showCheckoutModal();
            });

            // Close modal
            closeModal.addEventListener('click', () => {
                checkoutModal.style.display = 'none';
            });

            // Close thank you modal
            thankYouCloseBtn.addEventListener('click', () => {
                thankYouModal.style.display = 'none';
            });

            // Close status modal
            closeStatusModal.addEventListener('click', () => {
                orderStatusModal.style.display = 'none';
            });

            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === checkoutModal) {
                    checkoutModal.style.display = 'none';
                }
                if (e.target === thankYouModal) {
                    thankYouModal.style.display = 'none';
                }
                if (e.target === orderStatusModal) {
                    orderStatusModal.style.display = 'none';
                }
            });

            // Order form submission
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const userPhone = document.getElementById('userPhone').value;
    const deliveryAddress = document.getElementById('deliveryAddress').value;
    
    const foodItems = cart.map(item => ({
        foodId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name // Make sure to include the name
    }));
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + DELIVERY_FEE;
    
    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                foodItems,
                userPhone,
                totalPrice,
                deliveryAddress,
                deliveryPrice: DELIVERY_FEE
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.data) { // Check if data exists
                showThankYouModal(data.data);
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                checkoutModal.style.display = 'none';
                orderForm.reset();
                loadFoods();
                loadOrdersStatus();
            } else {
                throw new Error('Invalid response from server');
            }
        } else {
            const error = await response.json();
            throw new Error(error.error || 'حدث خطأ أثناء إرسال الطلب');
        }
    } catch (error) {
        showToast(error.message, 'error');
        console.error('Error:', error);
    }
});
            // Load foods function
            async function loadFoods() {
                try {
                    const response = await fetch('http://localhost:3000/foods');
                    const data = await response.json();
                    
                    if (response.ok) {
                        renderFoods(data.data);
                    } else {
                        throw new Error(data.error || 'حدث خطأ أثناء جلب البيانات');
                    }
                } catch (error) {
                    showToast(error.message, 'error');
                    console.error('Error:', error);
                }
            }

            // Load orders status
            async function loadOrdersStatus() {
                try {
                    const response = await fetch('http://localhost:3000/orders/status-counts');
                    const data = await response.json();
                    
                    if (response.ok) {
                        pendingCount.textContent = data.pending || 0;
                        preparingCount.textContent = data.preparing || 0;
                        deliveringCount.textContent = data.delivering || 0;
                        deliveredCount.textContent = data.delivered || 0;
                    } else {
                        throw new Error(data.error || 'حدث خطأ أثناء جلب حالة الطلبات');
                    }
                } catch (error) {
                    console.error('Error loading orders status:', error);
                }
            }

            // Render foods
            function renderFoods(foods) {
                foodItems.innerHTML = '';
                
                if (foods.length === 0) {
                    foodItems.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-utensils"></i>
                            <p>لا توجد أصناف متاحة حالياً</p>
                        </div>
                    `;
                    return;
                }
                
                foods.forEach((food, index) => {
                    const cartItem = cart.find(item => item.id === food._id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    
                    // Handle both image formats
                    let imageSrc;
                    if (food.imageUrl) {
                        imageSrc = food.imageUrl; // External URL
                    } else if (food.image && food.image.contentType) {
                        imageSrc = `http://localhost:3000/foods/${food._id}/image`; // Local stored image
                    } else {
                        imageSrc = 'https://via.placeholder.com/150?text=No+Image'; // Fallback
                    }
                    
                    const foodCard = document.createElement('div');
                    foodCard.className = 'food-card';
                    foodCard.style.animationDelay = `${index * 0.1}s`;
                    foodCard.innerHTML = `
                        <img src="${imageSrc}" alt="${food.name}" class="food-image">
                        <div class="food-info">
                            <div class="food-name">${food.name}</div>
                            <div class="food-price">${food.price} دج</div>
                            <div class="food-actions">
                                ${quantity > 0 ? `
                                    <div class="quantity-control">
                                        <button class="quantity-btn minus-btn" data-id="${food._id}">-</button>
                                        <span>${quantity}</span>
                                        <button class="quantity-btn plus-btn" data-id="${food._id}">+</button>
                                    </div>
                                ` : `
                                    <button class="add-to-cart" data-id="${food._id}">أضف إلى السلة</button>
                                `}
                            </div>
                        </div>
                    `;
                    foodItems.appendChild(foodCard);
                });

                // Add event listeners to add to cart buttons
                document.querySelectorAll('.add-to-cart').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const foodId = e.currentTarget.getAttribute('data-id');
                        try {
                            const response = await fetch(`http://localhost:3000/foods/${foodId}`);
                            const data = await response.json();
                            
                            if (response.ok) {
                                addToCart(data.data);
                                showToast('تمت إضافة الصنف إلى السلة', 'success');
                            } else {
                                throw new Error(data.error || 'حدث خطأ أثناء جلب بيانات الصنف');
                            }
                        } catch (error) {
                            showToast(error.message, 'error');
                            console.error('Error:', error);
                        }
                    });
                });

                // Add event listeners to quantity buttons
                document.querySelectorAll('.quantity-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const foodId = e.currentTarget.getAttribute('data-id');
                        const isPlus = e.currentTarget.classList.contains('plus-btn');
                        updateCartItem(foodId, isPlus ? 1 : -1);
                        showToast(isPlus ? 'تم زيادة الكمية' : 'تم تقليل الكمية', 'success');
                    });
                });
            }

            // Add to cart
            function addToCart(food) {
                const existingItem = cart.find(item => item.id === food._id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: food._id,
                        name: food.name,
                        price: food.price,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                loadFoods(); // Refresh food list to show quantity controls
            }

            // Update cart item quantity
            function updateCartItem(foodId, change) {
                const itemIndex = cart.findIndex(item => item.id === foodId);
                
                if (itemIndex !== -1) {
                    cart[itemIndex].quantity += change;
                    
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1);
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart();
                    loadFoods(); // Refresh food list
                }
            }

            // Update cart UI
            function updateCart() {
                cartItems.innerHTML = '';
                
                if (cart.length === 0) {
                    cartItems.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-shopping-cart"></i>
                            <p>سلة المشتريات فارغة</p>
                        </div>
                    `;
                    cartCount.textContent = '0';
                    subtotal.textContent = '0 دج';
                    total.textContent = `${DELIVERY_FEE} دج`;
                    return;
                }
                
                let cartTotal = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    cartTotal += itemTotal;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.style.animationDelay = `${index * 0.1}s`;
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <img src="http://localhost:3000/foods/${item.id}/image" alt="${item.name}" class="cart-item-image">
                            <div>
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">${item.price} دج</div>
                            </div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="cart-item-remove" data-id="${item.id}">
                                <i class="fas fa-times"></i>
                            </button>
                            <span>${item.quantity}</span>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.cart-item-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const foodId = e.currentTarget.getAttribute('data-id');
                        const itemIndex = cart.findIndex(item => item.id === foodId);
                        
                        if (itemIndex !== -1) {
                            cart.splice(itemIndex, 1);
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCart();
                            loadFoods(); // Refresh food list
                            showToast('تم إزالة الصنف من السلة', 'success');
                        }
                    });
                });
                
                cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
                subtotal.textContent = `${cartTotal} دج`;
                total.textContent = `${cartTotal + DELIVERY_FEE} دج`;
            }

            // Show checkout modal
            function showCheckoutModal() {
                orderSummary.innerHTML = '';
                
                cart.forEach(item => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item';
                    orderItem.innerHTML = `
                        <span>${item.name} (${item.quantity})</span>
                        <span>${item.price * item.quantity} دج</span>
                    `;
                    orderSummary.appendChild(orderItem);
                });
                
                const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                orderTotal.textContent = `${cartTotal + DELIVERY_FEE} دج`;
                
                checkoutModal.style.display = 'flex';
            }

            // Show thank you modal
            function showThankYouModal(order) {
                document.getElementById('thankYouOrderId').textContent = `#${order.orderNumber}`;
                document.getElementById('thankYouTotal').textContent = `${order.totalPrice} دج`;
                
                // Calculate estimated time (30-45 minutes from now)
                const now = new Date();
                const estimatedTime = new Date(now.getTime() + 45 * 60000);
                const hours = estimatedTime.getHours();
                const minutes = estimatedTime.getMinutes();
                const ampm = hours >= 12 ? 'م' : 'ص';
                const formattedHours = hours % 12 || 12;
                
                document.getElementById('thankYouTime').textContent = 
                    `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm} (30-45 دقيقة)`;
                
                thankYouModal.style.display = 'flex';
            }

            // Show order status modal
            async function showOrderStatus() {
                try {
                    const response = await fetch('http://localhost:3000/orders/latest');
                    const data = await response.json();
                    
                    if (response.ok && data.order) {
                        renderOrderStatus(data.order);
                        orderStatusModal.style.display = 'flex';
                    } else {
                        showToast('لا توجد طلبات سابقة لعرضها', 'error');
                    }
                } catch (error) {
                    showToast('حدث خطأ أثناء جلب حالة الطلب', 'error');
                    console.error('Error:', error);
                }
            }

            // Render order status
            function renderOrderStatus(order) {
                document.getElementById('orderIdDisplay').textContent = `#${order.orderNumber}`;
                
                // Update timeline based on order status
                const steps = document.querySelectorAll('.status-step');
                steps.forEach(step => step.classList.remove('completed', 'active'));
                
                // Always mark first step as completed
                steps[0].classList.add('completed');
                
                // Update based on status
                if (order.status === 'preparing') {
                    steps[1].classList.add('active');
                } else if (order.status === 'delivering') {
                    steps[1].classList.add('completed');
                    steps[2].classList.add('active');
                } else if (order.status === 'delivered') {
                    steps[1].classList.add('completed');
                    steps[2].classList.add('completed');
                    steps[3].classList.add('completed');
                }
                
                // Render order items
                const orderItemsContainer = document.getElementById('orderStatusItems');
                orderItemsContainer.innerHTML = '';
                
                order.foodItems.forEach(item => {
                    const orderItem = document.createElement('div');
                    orderItem.className = 'order-item-card';
                    orderItem.innerHTML = `
                        <img src="http://localhost:3000/foods/${item.foodId}/image" alt="${item.name}" class="order-item-image">
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-price">${item.price} دج × ${item.quantity}</div>
                        </div>
                        <div>${item.price * item.quantity} دج</div>
                    `;
                    orderItemsContainer.appendChild(orderItem);
                });
                
                // Update totals
                const itemsTotal = order.foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                document.getElementById('orderStatusSubtotal').textContent = `${itemsTotal} دج`;
                document.getElementById('orderStatusDelivery').textContent = `${order.deliveryPrice} دج`;
                document.getElementById('orderStatusTotal').textContent = `${order.totalPrice} دج`;
            }

            // Show toast notification
            function showToast(message, type = 'success') {
                toastMessage.textContent = message;
                toast.className = `toast ${type}`;
                toast.classList.add('show');
                
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
        }
        );