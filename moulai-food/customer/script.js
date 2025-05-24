document.addEventListener('DOMContentLoaded', () => {
    // تحديد عناصر DOM
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
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const cartIcon = document.getElementById('cartIcon');
    const thankYouModal = document.getElementById('thankYouModal');
    const thankYouCloseBtn = document.getElementById('thankYouCloseBtn');
    const orderStatusModal = document.getElementById('orderStatusModal');
    const closeStatusModal = document.getElementById('closeStatusModal');

    // عناصر عرض حالة الطلبات
    const pendingCount = document.getElementById('pendingCount');
    const preparingCount = document.getElementById('preparingCount');
    const deliveringCount = document.getElementById('deliveringCount');
    const deliveredCount = document.getElementById('deliveredCount');
    const orderIdDisplay = document.getElementById('orderIdDisplay');
    const orderStatusItems = document.getElementById('orderStatusItems');
    const orderStatusSubtotal = document.getElementById('orderStatusSubtotal');
    const orderStatusDelivery = document.getElementById('orderStatusDelivery');
    const orderStatusTotal = document.getElementById('orderStatusTotal');


    // متغيرات الحالة
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const DELIVERY_FEE = 140; // رسوم التوصيل، تتطابق مع قيمتك في Backend

    // --- الدوال الرئيسية عند تحميل الصفحة ---
    // تحميل جميع الأطعمة وحالة الطلبات الأولية
    loadFoods();
    updateOrderStatusCounts(); // استخدام هذه مباشرة بدلاً من loadOrdersStatus لتحديث الأعداد
    // تحديث واجهة سلة المشتريات
    updateCart();

    // إعداد Socket.io للاستماع لتحديثات الطلبات
    // تأكد من أن Socket.io library محمل في ملف HTML الخاص بك:
    // <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    const socket = io('https://redox-resto.onrender.com'); // ربط Socket.IO بـ URL الخاص بالـ backend

    socket.on('connect', () => {
        console.log('Socket.IO connected!');
    });

    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected!');
    });

    socket.on('newOrder', (data) => {
        console.log('Socket: New order received!', data);
        updateOrderStatusCounts(); // تحديث أعداد الطلبات الكلية
        showToast('لديك طلب جديد!', 'info'); // إشعار بطلب جديد
    });

    socket.on('orderUpdate', (data) => {
        console.log('Socket: Order updated:', data);
        updateOrderStatusCounts(); // تحديث أعداد الطلبات الكلية
        showToast(`حالة الطلب #${data.orderId} تغيرت إلى: ${data.status}`, 'info'); // إشعار بتغير الحالة
        // إذا كان المودال مفتوحًا للطلب الذي تم تحديثه، قم بتحديثه
        if (orderStatusModal.style.display === 'flex' && orderIdDisplay.textContent === `#${data.orderId}`) {
            showOrderStatus(data.orderId); // إعادة تحميل تفاصيل الطلب المحدث
        }
    });

    socket.on('orderDeleted', (data) => {
        console.log('Socket: Order deleted:', data);
        updateOrderStatusCounts(); // تحديث أعداد الطلبات الكلية
        showToast(`تم حذف الطلب #${data.orderId}`, 'error'); // إشعار بحذف الطلب
        if (orderStatusModal.style.display === 'flex' && orderIdDisplay.textContent === `#${data.orderId}`) {
            orderStatusModal.style.display = 'none'; // إخفاء المودال إذا كان الطلب المحذوف معروضًا
        }
    });

    // تحديث الأعداد كل 30 ثانية احتياطيًا (في حالة فقدان أحداث السوكت أو تحديث الصفحة)
    setInterval(updateOrderStatusCounts, 30000);


    // --- وظائف البحث والتفاعل مع الواجهة ---

    // وظيفة البحث
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

    // عند النقر على أيقونة السلة لإظهار حالة الطلب
    cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked.');
        if (cart.length > 0) {
            // إذا كانت السلة تحتوي على عناصر، انتقل إلى السلة
            document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
            showToast('سلة المشتريات', 'info');
        } else {
            // إذا كانت السلة فارغة، أظهر حالة الطلبات
            showOrderStatus(); // استدعاء الوظيفة لعرض حالة آخر طلب
        }

        // إضافة تأثير النبض
        cartIcon.classList.add('pulse');
        setTimeout(() => {
            cartIcon.classList.remove('pulse');
        }, 500);
    });

    // --- وظائف المودال (النوافذ المنبثقة) ---

    // عند النقر على زر تأكيد الطلب لفتح نافذة الدفع
    checkoutBtn.addEventListener('click', () => {
        console.log('Checkout button clicked.');
        if (cart.length === 0) {
            showToast('سلة المشتريات فارغة', 'error');
            return;
        }
        showCheckoutModal();
    });

    // إغلاق مودال الدفع
    closeModal.addEventListener('click', () => {
        console.log('Checkout modal closed via X button.');
        checkoutModal.style.display = 'none';
    });

    // إغلاق مودال الشكر
    thankYouCloseBtn.addEventListener('click', () => {
        console.log('Thank you modal closed via X button.');
        thankYouModal.style.display = 'none';
    });

    // إغلاق مودال حالة الطلب
    closeStatusModal.addEventListener('click', () => {
        console.log('Order status modal closed via X button.');
        orderStatusModal.style.display = 'none';
    });

    // إغلاق المودال عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            console.log('Checkout modal closed by clicking outside.');
            checkoutModal.style.display = 'none';
        }
        if (e.target === thankYouModal) {
            console.log('Thank you modal closed by clicking outside.');
            thankYouModal.style.display = 'none';
        }
        if (e.target === orderStatusModal) {
            console.log('Order status modal closed by clicking outside.');
            orderStatusModal.style.display = 'none';
        }
    });

    // --- وظائف التعامل مع الطلبات والـ API ---

    // إرسال نموذج الطلب
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Order form submitted.');

        const userName = document.getElementById('userName').value;
        const userPhone = document.getElementById('userPhone').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;

        // التحقق من أن جميع الحقول المطلوبة مملوءة
        if (!userName || !userPhone || !deliveryAddress) {
            showToast('الرجاء ملء جميع الحقول المطلوبة.', 'error');
            return;
        }

        // تحويل عناصر السلة إلى التنسيق الذي يتوقعه الـ backend
        const foodItemsForOrder = cart.map(item => ({
            foodId: item.id, // Backend يتوقع foodId
            quantity: item.quantity,
            price: item.price,
            name: item.name // إضافة الاسم للراحة، على الرغم من أن الـ backend قد لا يستخدمه مباشرة هنا
        }));

        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalPrice = subtotalAmount + DELIVERY_FEE;

        try {
            const response = await fetch('https://redox-resto.onrender.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName,
                    foodItems: foodItemsForOrder, // استخدام foodItemsForOrder هنا
                    userPhone, // Backend يتوقع userPhone
                    totalPrice,
                    deliveryAddress,
                    deliveryPrice: DELIVERY_FEE // Backend يتوقع deliveryPrice
                })
            });

            if (response.ok) {
                const orderData = await response.json();
                console.log('Order placed successfully:', orderData.data); // استخدام data.data
                showThankYouModal(orderData.data); // عرض مودال الشكر مع بيانات الطلب
                cart = []; // مسح السلة
                localStorage.setItem('cart', JSON.stringify(cart)); // تحديث التخزين المحلي
                updateCart(); // تحديث واجهة السلة
                checkoutModal.style.display = 'none'; // إخفاء مودال الدفع
                orderForm.reset(); // إعادة تعيين النموذج
                loadFoods(); // إعادة تحميل قائمة الطعام لتحديث أزرار الكمية
                updateOrderStatusCounts(); // تحديث أعداد حالة الطلبات بعد طلب جديد
            } else {
                const error = await response.json();
                throw new Error(error.error || 'حدث خطأ أثناء إرسال الطلب');
            }
        } catch (error) {
            showToast(error.message, 'error');
            console.error('Error submitting order:', error);
        }
    });

    // جلب وتحديث عدد الطلبات بناءً على الحالة (للوحة الإحصائيات)
    async function updateOrderStatusCounts() {
        try {
            const response = await fetch('https://redox-resto.onrender.com/orders/status-counts');
            const data = await response.json();

            if (response.ok && data.data) { // التأكد من وجود data.data
                pendingCount.textContent = data.data.pending || 0;
                preparingCount.textContent = data.data.preparing || 0;
                deliveringCount.textContent = data.data.delivering || 0;
                deliveredCount.textContent = data.data.delivered || 0;
                console.log('Order status counts updated:', data.data);
            } else {
                console.warn('Failed to fetch order status counts:', data.error || 'No data or error in response');
                // في حالة الخطأ، تعيين الأعداد إلى صفر لتجنب عرض قيم خاطئة
                pendingCount.textContent = 0;
                preparingCount.textContent = 0;
                deliveringCount.textContent = 0;
                deliveredCount.textContent = 0;
            }
        } catch (error) {
            console.error('Error fetching order status counts:', error);
            showToast('خطأ في تحميل إحصائيات الطلبات', 'error');
            // تعيين الأعداد إلى صفر في حالة وجود خطأ في الشبكة
            pendingCount.textContent = 0;
            preparingCount.textContent = 0;
            deliveringCount.textContent = 0;
            deliveredCount.textContent = 0;
        }
    }

    // جلب قائمة الطعام من الـ API
    async function loadFoods() {
        console.log('Loading foods...');
        try {
            const response = await fetch('https://redox-resto.onrender.com/foods');
            const data = await response.json();

            if (response.ok && data.data) { // التأكد من وجود data.data
                renderFoods(data.data); // تمرير بيانات الأطعمة لإنشائها في الواجهة
                console.log('Foods loaded and rendered successfully.');
            } else {
                throw new Error(data.error || 'حدث خطأ أثناء جلب البيانات');
            }
        } catch (error) {
            showToast(error.message, 'error');
            console.error('Error loading foods:', error);
            foodItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>فشل في تحميل قائمة الطعام. الرجاء المحاولة لاحقًا.</p>
                </div>
            `;
        }
    }

    // --- وظائف عرض الواجهة وتحديثها ---

    // عرض قائمة الطعام في الواجهة
    function renderFoods(foods) {
        console.log('Rendering foods to UI.');
        foodItems.innerHTML = ''; // مسح المحتوى الحالي

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

            let imageSrc;
            // الـ backend الخاص بك يستخدم /foods/:id/image لجلب الصور
            if (food._id) { // تأكد من وجود ID لجلب الصورة
                imageSrc = `https://redox-resto.onrender.com/foods/${food._id}/image`;
            } else {
                imageSrc = 'https://via.placeholder.com/150?text=No+Image'; // صورة احتياطية
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
                            <button class="add-to-cart" data-id="${food._id}" style="
                                background-color: #28a745;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                cursor: pointer;
                            ">أضف إلى السلة</button>
                        `}
                    </div>
                </div>
            `;
            foodItems.appendChild(foodCard);
        });

        // **ربط الأحداث بعد إنشاء جميع عناصر DOM**
        // ربط أحداث النقر لأزرار "أضف إلى السلة"
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const foodId = e.currentTarget.getAttribute('data-id');
                console.log('Add to cart button clicked for ID:', foodId);
                try {
                    const response = await fetch(`https://redox-resto.onrender.com/foods/${foodId}`);
                    const data = await response.json();

                    if (response.ok && data.data) { // التأكد من وجود data.data
                        addToCart(data.data);
                        showToast('تمت إضافة الصنف إلى السلة', 'success');
                    } else {
                        throw new Error(data.error || 'حدث خطأ أثناء جلب بيانات الصنف');
                    }
                } catch (error) {
                    showToast(error.message, 'error');
                    console.error('Error adding to cart:', error);
                }
            });
        });

        // ربط أحداث النقر لأزرار زيادة/تقليل الكمية
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const foodId = e.currentTarget.getAttribute('data-id');
                const isPlus = e.currentTarget.classList.contains('plus-btn');
                console.log('Quantity button clicked for ID:', foodId, 'isPlus:', isPlus);
                updateCartItem(foodId, isPlus ? 1 : -1);
                showToast(isPlus ? 'تم زيادة الكمية' : 'تم تقليل الكمية', 'success');
            });
        });
    }

    // إضافة صنف إلى السلة
    function addToCart(food) {
        console.log('Adding food to cart:', food.name);
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
        updateCart(); // تحديث واجهة السلة
        loadFoods(); // إعادة تحميل قائمة الطعام لعرض تحديث الكميات (التحكم + -)
    }

    // تحديث كمية صنف في السلة
    function updateCartItem(foodId, change) {
        console.log('Updating cart item quantity for ID:', foodId, 'change:', change);
        const itemIndex = cart.findIndex(item => item.id === foodId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // إزالة الصنف إذا كانت الكمية صفر أو أقل
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart(); // تحديث واجهة السلة
            loadFoods(); // إعادة تحميل قائمة الطعام لتحديث أزرار الكمية
        }
    }

    // تحديث واجهة سلة المشتريات
    function updateCart() {
        console.log('Updating cart UI.');
        cartItems.innerHTML = ''; // مسح المحتوى الحالي

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
            deliveryFeeElement.textContent = `${DELIVERY_FEE} دج`; // تحديث رسوم التوصيل
            checkoutBtn.disabled = true; // تعطيل زر الدفع إذا كانت السلة فارغة
            checkoutBtn.classList.add('disabled'); // إضافة كلاس لتأثير مرئي
            return;
        }

        let cartTotal = 0;

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            // التأكد من أن الصورة متاحة بنفس المسار
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="https://redox-resto.onrender.com/foods/${item.id}/image" alt="${item.name}" class="cart-item-image">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} دج</div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="cart-item-remove" data-id="${item.id}" style="
                        background-color: #dc3545;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                    <span>${item.quantity}</span>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        // ربط أحداث النقر لأزرار الإزالة بعد إنشاء عناصر السلة
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const foodId = e.currentTarget.getAttribute('data-id');
                const itemIndex = cart.findIndex(item => item.id === foodId);
                console.log('Remove button clicked for ID:', foodId);

                if (itemIndex !== -1) {
                    cart.splice(itemIndex, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart(); // تحديث واجهة السلة
                    loadFoods(); // إعادة تحميل قائمة الطعام لتحديث أزرار الكمية
                    showToast('تم إزالة الصنف من السلة', 'success');
                }
            });
        });

        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        subtotal.textContent = `${cartTotal} دج`;
        total.textContent = `${cartTotal + DELIVERY_FEE} دج`;
        deliveryFeeElement.textContent = `${DELIVERY_FEE} دج`; // تحديث رسوم التوصيل
        checkoutBtn.disabled = false; // تفعيل زر الدفع
        checkoutBtn.classList.remove('disabled');
    }

    // عرض مودال الدفع
    function showCheckoutModal() {
        console.log('Displaying checkout modal.');
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

    // عرض مودال الشكر بعد إرسال الطلب
    function showThankYouModal(order) {
        console.log('Displaying thank you modal for order:', order.orderNumber);
        document.getElementById('thankYouOrderId').textContent = `#${order.orderNumber}`;
        document.getElementById('thankYouTotal').textContent = `${order.totalPrice} دج`;

        // حساب الوقت المقدر (30-45 دقيقة من الآن)
        const now = new Date();
        const estimatedTime = new Date(now.getTime() + 45 * 60000); // 45 دقيقة من الآن
        const hours = estimatedTime.getHours();
        const minutes = estimatedTime.getMinutes();
        const ampm = hours >= 12 ? 'م' : 'ص';
        const formattedHours = hours % 12 || 12;

        document.getElementById('thankYouTime').textContent =
            `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm} (30-45 دقيقة)`;

        thankYouModal.style.display = 'flex';
    }

    // عرض مودال حالة الطلب الأخير أو طلب معين
    async function showOrderStatus(orderId = null) {
        console.log('Attempting to show order status modal.');
        try {
            let url = 'https://redox-resto.onrender.com/orders/latest'; // جلب آخر طلب
            if (orderId) {
                url = `https://redox-resto.onrender.com/orders/${orderId}`; // جلب طلب محدد
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok && data.data) { // التأكد من وجود data.data
                renderOrderStatus(data.data);
                orderStatusModal.style.display = 'flex';
                console.log('Order status modal displayed for:', orderId ? `ID ${orderId}` : 'latest order');
            } else {
                showToast('لا توجد طلبات سابقة لعرضها', 'error');
                console.log('No previous orders found to display.');
            }
        } catch (error) {
            showToast('حدث خطأ أثناء جلب حالة الطلب', 'error');
            console.error('Error fetching latest order status:', error);
        }
    }

    // عرض حالة الطلب في المودال
    function renderOrderStatus(order) {
        console.log('Rendering order status for order:', order.orderNumber);
        orderIdDisplay.textContent = `#${order.orderNumber}`;

        // تحديث الخط الزمني بناءً على حالة الطلب
        const steps = document.querySelectorAll('.status-step');
        steps.forEach(step => step.classList.remove('completed', 'active'));

        // دائمًا خطوة "قيد الانتظار" تكون مكتملة
        steps[0].classList.add('completed');

        // تحديث بناءً على الحالة
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

        // عرض عناصر الطلب
        orderStatusItems.innerHTML = '';

        if (order.foodItems && order.foodItems.length > 0) {
            order.foodItems.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item-card';
                // تأكد من أن foodId موجود في item لجلب الصورة من الـ backend
                const imageUrl = item.foodId ? `https://redox-resto.onrender.com/foods/${item.foodId}/image` : 'https://via.placeholder.com/100?text=No+Image';
                orderItem.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}" class="order-item-image">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-price">${item.price} دج × ${item.quantity}</div>
                    </div>
                    <div>${item.price * item.quantity} دج</div>
                `;
                orderStatusItems.appendChild(orderItem);
            });
        } else {
            orderStatusItems.innerHTML = `<p>لا توجد تفاصيل أصناف لهذا الطلب.</p>`;
        }


        // تحديث الإجماليات
        const itemsTotal = order.foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderStatusSubtotal.textContent = `${itemsTotal} دج`;
        orderStatusDelivery.textContent = `${order.deliveryPrice} دج`;
        orderStatusTotal.textContent = `${order.totalPrice} دج`;
    }

    // عرض رسائل التنبيه (Toast notifications)
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = `toast ${type}`; // يزيل الفئات السابقة ويضيف الجديدة
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});