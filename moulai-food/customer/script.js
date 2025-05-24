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
    const foodDetailsModal = document.getElementById('foodDetailsModal');
    const closeFoodModal = document.getElementById('closeFoodModal');

    // إخفاء جميع النوافذ المنبثقة عند بدء التحميل
    [checkoutModal, thankYouModal, orderStatusModal, foodDetailsModal].forEach(modal => {
        if (modal) modal.style.display = 'none';
    });

    // باقي الكود كما هو...
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

    // Food Details Modal elements
    const detailFoodImage = document.getElementById('detailFoodImage');
    const detailFoodName = document.getElementById('detailFoodName');
    const detailFoodPrice = document.getElementById('detailFoodPrice');
    const detailFoodDescription = document.getElementById('detailFoodDescription');
    const addToCartFromDetail = document.getElementById('addToCartFromDetail');

    // متغيرات الحالة
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const DELIVERY_FEE = 140; // رسوم التوصيل، تتطابق مع قيمتك في Backend

    // --- الدوال الرئيسية عند تحميل الصفحة ---
    loadFoods();
    updateOrderStatusCounts();
    updateCart(); // تحديث واجهة سلة المشتريات

    // إعداد Socket.io للاستماع لتحديثات الطلبات
    const socket = io('https://redox-resto.onrender.com'); // ربط Socket.IO بـ URL الخاص بالـ backend

    socket.on('connect', () => {
        console.log('Socket.IO connected!');
    });

    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected!');
    });

    socket.on('newOrder', (data) => {
        console.log('Socket: New order received!', data);
        updateOrderStatusCounts();
        showToast('لديك طلب جديد!', 'info');
    });

    socket.on('orderUpdate', (data) => {
        console.log('Socket: Order updated:', data);
        updateOrderStatusCounts();
        showToast(`حالة الطلب #${data.orderId} تغيرت إلى: ${data.status}`, 'info');
        if (orderStatusModal.style.display === 'flex' && orderIdDisplay.textContent === `#${data.orderId}`) {
            showOrderStatus(data.orderId);
        }
    });

    socket.on('orderDeleted', (data) => {
        console.log('Socket: Order deleted:', data);
        updateOrderStatusCounts();
        showToast(`تم حذف الطلب #${data.orderId}`, 'error');
        if (orderStatusModal.style.display === 'flex' && orderIdDisplay.textContent === `#${data.orderId}`) {
            orderStatusModal.style.display = 'none';
        }
    });

    // تحديث الأعداد كل 30 ثانية احتياطيًا
    setInterval(updateOrderStatusCounts, 30000);

    // --- وظائف البحث والتفاعل مع الواجهة ---
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

    cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked.');
        let lastOrderId = localStorage.getItem('lastOrderId'); // محاولة جلب آخر رقم طلب

        if (cart.length > 0) {
            document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
        } else if(lastOrderId) {
             // إذا السلة فارغة وهناك طلب سابق، أظهر حالته
            showOrderStatus(lastOrderId);
        } else {
            // إذا السلة فارغة ولا يوجد طلب سابق معروف، يمكن فتح مودال حالة الطلبات العام
            showOrderStatus(); // بدون ID سيتم عرض الحالة العامة أو يتطلب تحديد طلب
            showToast('لا توجد طلبات حديثة لعرض حالتها التفصيلية.', 'info');
        }

        cartIcon.classList.add('pulse');
        setTimeout(() => {
            cartIcon.classList.remove('pulse');
        }, 500);
    });

    // --- وظائف المودال (النوافذ المنبثقة) ---
    checkoutBtn.addEventListener('click', () => {
        console.log('Checkout button clicked.');
        if (cart.length === 0) {
            showToast('سلة المشتريات فارغة', 'error');
            return;
        }
        showCheckoutModal();
    });

    closeModal.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    thankYouCloseBtn.addEventListener('click', () => {
        thankYouModal.style.display = 'none';
    });

    closeStatusModal.addEventListener('click', () => {
        orderStatusModal.style.display = 'none';
    });

    closeFoodModal.addEventListener('click', () => {
        foodDetailsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) checkoutModal.style.display = 'none';
        if (e.target === thankYouModal) thankYouModal.style.display = 'none';
        if (e.target === orderStatusModal) orderStatusModal.style.display = 'none';
        if (e.target === foodDetailsModal) foodDetailsModal.style.display = 'none';
    });

    // --- وظائف التعامل مع الطلبات والـ API ---
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // منع الإرسال التقليدي للنموذج
        console.log('1. Form submission initiated.');

        // محاولة الحصول على زر الإرسال بطريقة أكثر أمانًا
        const submitBtn = orderForm.querySelector('button[type="submit"]');
        if (!submitBtn) {
            console.error('Error: Submit button not found in orderForm!');
            showToast('خطأ: لم يتم العثور على زر الإرسال.', 'error');
            return;
        }

        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جار الإرسال...';
        console.log('2. Submit button disabled and loading state set.');

        const userName = document.getElementById('userName').value;
        const userPhone = document.getElementById('userPhone').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;

        console.log('3. User input:', { userName, userPhone, deliveryAddress });

        // التحقق من أن جميع الحقول المطلوبة مملوءة
        if (!userName || !userPhone || !deliveryAddress) {
            console.warn('4. Validation failed: All fields are required.');
            showToast('الرجاء ملء جميع الحقول المطلوبة.', 'error');
            submitBtn.disabled = false; // إعادة تفعيل الزر
            submitBtn.innerHTML = originalBtnHtml; // استعادة النص الأصلي للزر
            return; // الخروج المبكر من الدالة
        }

        console.log('5. Validation passed. Preparing food items for order.');
        const foodItemsForOrder = cart.map(item => ({
            foodId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
        }));

        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalPrice = subtotalAmount + DELIVERY_FEE;

        const orderPayload = {
            userName,
            foodItems: foodItemsForOrder,
            userPhone,
            totalPrice,
            deliveryAddress,
            deliveryPrice: DELIVERY_FEE
        };

        console.log('6. Order payload prepared:', orderPayload);

        try {
            console.log('7. Attempting to send order to backend...');
            const response = await fetch('https://redox-resto.onrender.com/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            console.log('8. Response received from backend with status:', response.status);
            const responseData = await response.json(); // محاولة قراءة الرد دائمًا
            console.log('9. Parsed response data:', responseData);

            if (response.ok) {
                const orderData = responseData.data; // افترض أن البيانات الفعلية داخل .data
                console.log('10. Order placed successfully:', orderData);
                localStorage.setItem('lastOrderId', orderData.orderNumber || orderData._id);
                showThankYouModal(orderData);
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                checkoutModal.style.display = 'none';
                orderForm.reset();
                loadFoods();
                updateOrderStatusCounts();
                showToast('تم إرسال طلبك بنجاح!', 'success');
                console.log('11. Client-side actions completed after successful order.');
            } else {
                console.error('12. Backend returned an error:', responseData);
                // إذا كان الـ backend يرسل الخطأ في حقل error أو message
                const errorMessage = responseData.error || responseData.message || 'حدث خطأ أثناء إرسال الطلب من السيرفر';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('13. Error submitting order (catch block):', error);
            showToast(`خطأ في إرسال الطلب: ${error.message}`, 'error');
        } finally {
            console.log('14. Restoring submit button state.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml; // استعادة النص الأصلي للزر
        }
    });

    async function updateOrderStatusCounts() {
        try {
            const response = await fetch('https://redox-resto.onrender.com/orders/status-counts');
            const data = await response.json();
            if (response.ok && data.data) {
                pendingCount.textContent = data.data.pending || 0;
                preparingCount.textContent = data.data.preparing || 0;
                deliveringCount.textContent = data.data.delivering || 0;
                deliveredCount.textContent = data.data.delivered || 0;
            } else {
                console.warn('Failed to fetch order status counts:', data.error || 'No data');
                [pendingCount, preparingCount, deliveringCount, deliveredCount].forEach(el => el.textContent = 0);
            }
        } catch (error) {
            console.error('Error fetching order status counts:', error);
            showToast('خطأ في تحميل إحصائيات الطلبات', 'error');
            [pendingCount, preparingCount, deliveringCount, deliveredCount].forEach(el => el.textContent = 0);
        }
    }

    async function loadFoods() {
        console.log('Loading foods...');
        try {
            const response = await fetch('https://redox-resto.onrender.com/foods');
            const data = await response.json();
            if (response.ok && data.data) {
                renderFoods(data.data);
            } else {
                throw new Error(data.error || 'حدث خطأ أثناء جلب البيانات');
            }
        } catch (error) {
            showToast(error.message, 'error');
            console.error('Error loading foods:', error);
            foodItems.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>فشل في تحميل قائمة الطعام.</p></div>`;
        }
    }

    // --- وظائف عرض الواجهة وتحديثها ---
    function renderFoods(foods) {
        foodItems.innerHTML = '';
        if (foods.length === 0) {
            foodItems.innerHTML = `<div class="empty-state"><i class="fas fa-utensils"></i><p>لا توجد أصناف متاحة حالياً</p></div>`;
            return;
        }

        foods.forEach((food, index) => {
            const cartItem = cart.find(item => item.id === food._id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const imageSrc = food._id ? `https://redox-resto.onrender.com/foods/${food._id}/image` : 'https://via.placeholder.com/150?text=No+Image';

            const foodCard = document.createElement('div');
            foodCard.className = 'food-card';
            foodCard.style.animationDelay = `${index * 0.05}s`; // تقليل التأخير لتحميل أسرع
            foodCard.innerHTML = `
                <img src="${imageSrc}" alt="${food.name}" class="food-image" loading="lazy">
                <div class="food-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-price">${food.price} دج</div>
                    <div class="food-actions">
                        ${quantity > 0 ? `
                            <div class="quantity-control">
                                <button class="quantity-btn minus-btn" data-id="${food._id}" 
                                style= "
                                                            background-color:rgb(54, 66, 57); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;

                                "
                                >-</button>
                                <span>${quantity}</span>
                                <button class="quantity-btn plus-btn" data-id="${food._id}" 
                                    style="
                                                                            background-color:rgb(54, 244, 95); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;

                                    " 
                                 >+</button>
                            </div>
                        ` : `
                            <button class="add-to-cart-btn" data-id="${food._id}" style="
                                background-color:rgb(54, 244, 95); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;
                            ">أضف إلى السلة</button>
                        `}
                    </div>
                </div>
            `;
            foodItems.appendChild(foodCard);

            foodCard.addEventListener('click', (e) => {
                if (!e.target.closest('.quantity-control') && !e.target.classList.contains('add-to-cart-btn')) {
                    showFoodDetails(food);
                }
            });
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const foodId = e.currentTarget.getAttribute('data-id');
                const foodData = foods.find(f => f._id === foodId); // Get full food object
                if (foodData) {
                    addToCart(foodData);
                    showToast('تمت إضافة الصنف إلى السلة', 'success');
                } else {
                    showToast('لم يتم العثور على الصنف', 'error');
                }
            });
        });

        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const foodId = e.currentTarget.getAttribute('data-id');
                const isPlus = e.currentTarget.classList.contains('plus-btn');
                updateCartItem(foodId, isPlus ? 1 : -1);
                // showToast(isPlus ? 'تم زيادة الكمية' : 'تم تقليل الكمية', 'success'); // يمكن إزالته لتجنب كثرة الإشعارات
            });
        });
    }

    function addToCart(food) {
        console.log('Adding food to cart:', food.name);
        const existingItem = cart.find(item => item.id === food._id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: food._id, name: food.name, price: food.price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        loadFoods(); // لإعادة رسم زر "أضف للسلة" إلى أزرار الكمية
    }

    // --- وظائف تحديث سلة المشتريات وعناصرها ---
    function updateCart() {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>سلة المشتريات فارغة</p></div>`;
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${item.price} دج</span>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus-btn" data-id="${item.id}" style="
                        background-color: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;
                        
                        ">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-id="${item.id}" style="
                                                background-color:rgb(54, 244, 95); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;

                        ">+</button>
                    </div>
                    <div class="item-total">${item.price * item.quantity} دج</div>
                    <button class="remove-item" data-id="${item.id}" style="
background-color:rgb(244, 54, 54); color: white; border: none; padding: 5px 10px; border-radius: 50px; cursor: pointer;
                    " >&times;</button>
                `;
                cartItems.appendChild(cartItemElement);
            });

            document.querySelectorAll('.cart-item .quantity-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const foodId = e.currentTarget.getAttribute('data-id');
                    const isPlus = e.currentTarget.classList.contains('plus-btn');
                    updateCartItem(foodId, isPlus ? 1 : -1);
                });
            });
            document.querySelectorAll('.cart-item .remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const foodId = e.currentTarget.getAttribute('data-id');
                    updateCartItem(foodId, 0);
                    showToast('تم حذف الصنف من السلة', 'info');
                });
            });
        }

        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalAmount = subtotalAmount + (cart.length > 0 ? DELIVERY_FEE : 0);

        subtotal.textContent = `${subtotalAmount} دج`;
        deliveryFeeElement.textContent = cart.length > 0 ? `${DELIVERY_FEE} دج` : `0 دج`;
        total.textContent = `${totalAmount} دج`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartItem(foodId, change) {
        console.log(`Updating cart item ID: ${foodId}, change: ${change}`);
        const itemIndex = cart.findIndex(item => item.id === foodId);
        if (itemIndex > -1) {
            if (change === 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity += change;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
            }
        }
        updateCart();
        loadFoods(); // تحديث قائمة الطعام الرئيسية لتعكس التغييرات في أزرار الكمية
    }

    // --- وظائف عرض المودالات (النوافذ المنبثقة) ---
    function showFoodDetails(food) {
        console.log('Showing food details for:', food.name);
        detailFoodImage.src = `https://redox-resto.onrender.com/foods/${food._id}/image`;
        detailFoodName.textContent = food.name;
        detailFoodPrice.textContent = `${food.price} دج`;
        detailFoodDescription.textContent = food.description || 'لا يوجد وصف متوفر حاليًا.';

        // استنساخ العنصر لإزالة أي مستمعي أحداث سابقين
        const newAddToCartFromDetail = addToCartFromDetail.cloneNode(true);
        addToCartFromDetail.parentNode.replaceChild(newAddToCartFromDetail, addToCartFromDetail);
        // إعادة تحديد العنصر بعد الاستنساخ
        const currentAddToCartFromDetail = document.getElementById('addToCartFromDetail'); 

        currentAddToCartFromDetail.onclick = () => {
            addToCart(food); // food هنا هو الكائن الكامل للصنف
            showToast(`تمت إضافة ${food.name} إلى السلة`, 'success');
            foodDetailsModal.style.display = 'none';
        };
        foodDetailsModal.style.display = 'flex';
    }

    function showCheckoutModal() {
        console.log('Showing checkout modal.');
        orderSummary.innerHTML = '';
        let currentSubtotal = 0;
        if (cart.length === 0) {
            showToast('سلة المشتريات فارغة. الرجاء إضافة أصناف أولاً.', 'error');
            return;
        }
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `<span>${item.name} (x${item.quantity})</span><span>${item.price * item.quantity} دج</span>`;
            orderSummary.appendChild(itemElement);
            currentSubtotal += item.price * item.quantity;
        });
        const currentTotal = currentSubtotal + (cart.length > 0 ? DELIVERY_FEE : 0);
        orderTotal.textContent = `${currentTotal} دج`;
        checkoutModal.style.display = 'flex';
    }

    function showThankYouModal(orderData) {
        console.log('Showing thank you modal for order:', orderData._id);
        document.getElementById('thankYouOrderId').textContent = `#${orderData.orderNumber || orderData._id}`;
        document.getElementById('thankYouTotal').textContent = `${orderData.totalPrice} دج`;
        thankYouModal.style.display = 'flex';
    }

    async function showOrderStatus(orderId) {
        if (!orderId) {
            orderId = localStorage.getItem('lastOrderId');
            if (!orderId) {
                 // إذا لم يتم العثور على orderId، افتح المودال مع رسالة عامة
                orderIdDisplay.textContent = 'N/A';
                orderStatusItems.innerHTML = '<p style="text-align: center; padding: 20px;">لا يوجد طلب محدد لعرض حالته. قم بإنشاء طلب أولاً أو تحقق من طلباتك السابقة إذا كنت مسجلاً.</p>';
                // إفراغ ملخص الطلب في المودال
                orderStatusSubtotal.textContent = '0 دج';
                orderStatusDelivery.textContent = '0 دج';
                orderStatusTotal.textContent = '0 دج';
                // إفراغ الخط الزمني
                const timeline = orderStatusModal.querySelector('.status-timeline');
                timeline.innerHTML = `
                    <p style="text-align: center; padding: 10px;">
                        لم يتم تحديد طلب.
                    </p>
                `;
                orderStatusModal.style.display = 'flex';
                return;
            }
        }

        console.log(`Showing order status for order ID: ${orderId}`);
        orderIdDisplay.textContent = `#${orderId}`;
        orderStatusItems.innerHTML = '<p style="text-align: center; padding: 20px;">جارٍ تحميل تفاصيل الطلب...</p>'; // رسالة تحميل

        try {
            const response = await fetch(`https://redox-resto.onrender.com/orders/${orderId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'فشل في جلب حالة الطلب');
            }
            const orderData = (await response.json()).data;

            const timeline = orderStatusModal.querySelector('.status-timeline');
            timeline.innerHTML = '';

            const statusesConfig = {
                pending: { title: 'تم استلام الطلب', icon: 'fa-check' },
                preparing: { title: 'قيد التحضير', icon: 'fa-utensils' },
                delivering: { title: 'قيد التوصيل', icon: 'fa-motorcycle' },
                delivered: { title: 'تم التسليم', icon: 'fa-home' },
                cancelled: { title: 'تم إلغاء الطلب', icon: 'fa-times-circle' }
            };

            const orderStatusSequence = ['pending', 'preparing', 'delivering', 'delivered'];
            let currentStatusReached = false;

            // عرض حالة الإلغاء بشكل خاص إذا كان الطلب ملغى
            if (orderData.status === 'cancelled') {
                const statusInfo = statusesConfig['cancelled'];
                const step = document.createElement('div');
                step.className = 'status-step active cancelled'; // يمكنك إضافة تصميم خاص للحالة الملغاة
                const statusTime = orderData.statusHistory && orderData.statusHistory['cancelled'] ?
                                       new Date(orderData.statusHistory['cancelled']).toLocaleString('ar-DZ', { hour12: true, day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' }) :
                                       'تم الإلغاء';
                step.innerHTML = `
                    <div class="status-icon-wrapper"><i class="fas ${statusInfo.icon}"></i></div>
                    <div class="status-details">
                        <div class="status-title">${statusInfo.title}</div>
                        <div class="status-time">${statusTime}</div>
                    </div>`;
                timeline.appendChild(step);
            } else {
                orderStatusSequence.forEach(statusKey => {
                    const statusInfo = statusesConfig[statusKey];
                    const step = document.createElement('div');
                    step.className = 'status-step';

                    let statusTimeText = "لم يبدأ بعد";
                    let isCompleted = false;

                    // تحقق مما إذا كانت هذه المرحلة قد اكتملت (موجودة في statusHistory)
                    if (orderData.statusHistory && orderData.statusHistory[statusKey]) {
                        statusTimeText = new Date(orderData.statusHistory[statusKey]).toLocaleString('ar-DZ', { hour12: true, day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' });
                        isCompleted = true;
                        step.classList.add('completed');
                    }

                    // إذا كانت هذه هي الحالة النشطة الحالية للطلب
                    if (orderData.status === statusKey) {
                        step.classList.add('active');
                        if (!isCompleted) statusTimeText = "قيد التنفيذ حاليًا"; // إذا كانت نشطة ولم تكتمل بعد (لم يسجل وقت في الهيستوري)
                        currentStatusReached = true;
                    } else if (!currentStatusReached && isCompleted) {
                        // هذه مرحلة مكتملة قبل المرحلة النشطة الحالية
                    } else if (currentStatusReached && !isCompleted) {
                        // هذه مرحلة تالية لم تبدأ بعد
                        statusTimeText = "لم يبدأ بعد";
                        step.classList.remove('completed'); // تأكد أنها ليست مكتملة
                    }


                    step.innerHTML = `
                        <div class="status-icon-wrapper"><i class="fas ${statusInfo.icon}"></i></div>
                        <div class="status-details">
                            <div class="status-title">${statusInfo.title}</div>
                            <div class="status-time">${statusTimeText}</div>
                        </div>`;
                    timeline.appendChild(step);
                });
            }


            orderStatusItems.innerHTML = '';
            let subtotalAmount = 0;
            orderData.foodItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'order-status-item';
                itemElement.innerHTML = `<span>${item.name || 'صنف غير معروف'} (x${item.quantity})</span><span>${item.price * item.quantity} دج</span>`;
                orderStatusItems.appendChild(itemElement);
                subtotalAmount += item.price * item.quantity;
            });

            orderStatusSubtotal.textContent = `${subtotalAmount} دج`;
            orderStatusDelivery.textContent = `${orderData.deliveryPrice || DELIVERY_FEE} دج`;
            orderStatusTotal.textContent = `${orderData.totalPrice} دج`;

        } catch (error) {
            showToast(error.message, 'error');
            console.error('Error fetching order status:', error);
            orderStatusItems.innerHTML = `<p style="text-align: center; padding: 20px;">حدث خطأ أثناء تحميل تفاصيل الطلب. (${error.message})</p>`;
            orderStatusSubtotal.textContent = `0 دج`;
            orderStatusDelivery.textContent = `0 دج`;
            orderStatusTotal.textContent = `0 دج`;
            const timeline = orderStatusModal.querySelector('.status-timeline');
            timeline.innerHTML = `<p style="text-align: center; padding: 10px;">لا يمكن عرض حالة الطلب حاليًا.</p>`;
        }
        orderStatusModal.style.display = 'flex';
    }

    // --- وظائف إضافية (مثل الإشعارات) ---
    function showToast(message, type = 'success') {
        console.log(`Showing toast: ${message}, type: ${type}`);
        toastMessage.textContent = message;
        toast.className = 'toast show';
        const icon = toast.querySelector('i');
        if (icon) { // Check if icon exists before trying to manipulate it
            if (type === 'success') {
                icon.className = 'fas fa-check-circle';
                toast.style.backgroundColor = '#28a745';
            } else if (type === 'error') {
                icon.className = 'fas fa-times-circle';
                toast.style.backgroundColor = '#dc3545';
            } else if (type === 'info') {
                icon.className = 'fas fa-info-circle';
                toast.style.backgroundColor = '#17a2b8';
            }
        }
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
});