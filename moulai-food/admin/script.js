// العناصر العامة
const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
const contentSections = document.querySelectorAll('.content-section');
const viewAllLinks = document.querySelectorAll('.view-all');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modal = document.querySelectorAll('.modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// تغيير القسم النشط
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sectionId = link.getAttribute('data-section');
        
        // إزالة النشاط من جميع الروابط والأقسام
        sidebarLinks.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        // إضافة النشاط للرابط والقسم المحدد
        link.classList.add('active');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        
        // تحديث عنوان الصفحة
        document.getElementById('page-title').textContent = link.querySelector('span').textContent;
    });
});

// عرض الكل
viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        sidebarLinks.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        const targetLink = document.querySelector(`.sidebar-nav li[data-section="${sectionId}"]`);
        targetLink.classList.add('active');
        document.getElementById(`${sectionId}-section`).classList.add('active');
        
        document.getElementById('page-title').textContent = targetLink.querySelector('span').textContent;
    });
});

// التبويبات
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// النوافذ المنبثقة
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// إغلاق النافذة عند النقر خارجها
modal.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// الرسم البياني للإحصائيات
function initCharts() {
    const salesCtx = document.getElementById('sales-chart').getContext('2d');
    
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [{
                label: 'المبيعات',
                data: [5000, 7500, 6200, 8900, 11000, 9500],
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                borderColor: 'rgba(78, 115, 223, 1)',
                pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' ر.س';
                        }
                    }
                }
            }
        }
    });
}

// تحميل البيانات الأولية
async function loadInitialData() {
    try {
        // تحميل الطلبات الحديثة
        const recentOrdersResponse = await fetch('/orders?limit=5&sort=-createdAt');
        const recentOrders = await recentOrdersResponse.json();
        renderRecentOrders(recentOrders.data);
        
        // تحميل الأصناف الغذائية
        const foodsResponse = await fetch('/foods');
        const foods = await foodsResponse.json();
        renderFoodItems(foods.data);
        
        // تحميل جميع الطلبات
        const ordersResponse = await fetch('/orders');
        const orders = await ordersResponse.json();
        renderOrdersTable(orders.data);
        
        // تحميل أكثر الأصناف طلباً
        const topItemsResponse = await fetch('/orders/top-items');
        const topItems = await topItemsResponse.json();
        renderTopItems(topItems.data);
        
        // تهيئة الرسوم البيانية
        initCharts();
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// عرض الطلبات الحديثة
function renderRecentOrders(orders) {
    const tbody = document.getElementById('recent-orders-body');
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>#${order.orderNumber}</td>
            <td>${order.userName}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.totalPrice} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary view-order-btn" data-id="${order._id}">
                    <i class="fas fa-eye"></i> عرض
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // إضافة مستمعين لأزرار عرض الطلب
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const orderId = button.getAttribute('data-id');
            await showOrderDetails(orderId);
        });
    });
}

// نص حالة الطلب
function getStatusText(status) {
    const statusTexts = {
        'pending': 'معلقة',
        'preparing': 'قيد التحضير',
        'delivering': 'قيد التوصيل',
        'delivered': 'تم التوصيل',
        'cancelled': 'ملغاة'
    };
    
    return statusTexts[status] || status;
}

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
});



// العناصر
const ordersTableBody = document.getElementById('orders-table-body');
const orderStatusFilter = document.getElementById('order-status-filter');
const orderDateFilter = document.getElementById('order-date-filter');
const orderModal = document.getElementById('order-modal');
const orderNumberSpan = document.getElementById('order-number');
const orderCustomerSpan = document.getElementById('order-customer');
const orderPhoneSpan = document.getElementById('order-phone');
const orderAddressSpan = document.getElementById('order-address');
const orderDateSpan = document.getElementById('order-date');
const orderStatusSpan = document.getElementById('order-status');
const orderItemsBody = document.getElementById('order-items-body');
const orderSubtotalSpan = document.getElementById('order-subtotal');
const orderDeliverySpan = document.getElementById('order-delivery');
const orderTotalSpan = document.getElementById('order-total');
const orderStatusSelect = document.getElementById('order-status-select');
const updateStatusBtn = document.getElementById('update-status-btn');
const cancelOrderBtn = document.getElementById('cancel-order-btn');

// تصفية الطلبات
orderStatusFilter.addEventListener('change', filterOrders);
orderDateFilter.addEventListener('change', filterOrders);

// عرض جدول الطلبات
function renderOrdersTable(orders) {
    ordersTableBody.innerHTML = '';
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>#${order.orderNumber}</td>
            <td>${order.userName}</td>
            <td>${order.userPhone}</td>
            <td>${order.deliveryAddress.substring(0, 20)}...</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.totalPrice} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary view-order-btn" data-id="${order._id}">
                    <i class="fas fa-eye"></i> عرض
                </button>
            </td>
        `;
        
        ordersTableBody.appendChild(tr);
    });
    
    // إضافة مستمعين لأزرار عرض الطلب
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const orderId = button.getAttribute('data-id');
            await showOrderDetails(orderId);
        });
    });
}

// تصفية الطلبات
async function filterOrders() {
    const status = orderStatusFilter.value;
    const date = orderDateFilter.value;
    
    let url = '/orders?';
    
    if (status !== 'all') {
        url += `status=${status}&`;
    }
    
    if (date) {
        url += `date=${date}&`;
    }
    
    try {
        const response = await fetch(url);
        const orders = await response.json();
        renderOrdersTable(orders.data);
    } catch (error) {
        console.error('Error filtering orders:', error);
        alert('حدث خطأ أثناء تصفية الطلبات');
    }
}

// عرض تفاصيل الطلب
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`/orders/${orderId}`);
        const order = await response.json();
        
        if (response.ok) {
            // تعبئة بيانات الطلب
            orderNumberSpan.textContent = `#${order.data.orderNumber}`;
            orderCustomerSpan.textContent = order.data.userName;
            orderPhoneSpan.textContent = order.data.userPhone;
            orderAddressSpan.textContent = order.data.deliveryAddress;
            orderDateSpan.textContent = new Date(order.data.createdAt).toLocaleString();
            orderStatusSpan.textContent = getStatusText(order.data.status);
            orderStatusSpan.className = `status-badge status-${order.data.status}`;
            
            // تعبئة أصناف الطلب
            orderItemsBody.innerHTML = '';
            let subtotal = 0;
            
            order.data.foodItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.foodId.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} ر.س</td>
                    <td>${item.price * item.quantity} ر.س</td>
                `;
                orderItemsBody.appendChild(tr);
                
                subtotal += item.price * item.quantity;
            });
            
            // تعبئة المجاميع
            orderSubtotalSpan.textContent = `${subtotal} ر.س`;
            orderDeliverySpan.textContent = `${order.data.deliveryPrice} ر.س`;
            orderTotalSpan.textContent = `${order.data.totalPrice} ر.س`;
            
            // تعيين حالة الطلب الحالية
            orderStatusSelect.value = order.data.status;
            
            // إظهار النافذة
            openModal('order-modal');
            
            // تخزين معرف الطلب في الزر
            updateStatusBtn.setAttribute('data-id', order.data._id);
            cancelOrderBtn.setAttribute('data-id', order.data._id);
        } else {
            throw new Error(order.error || 'Failed to fetch order');
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        alert('حدث خطأ أثناء تحميل تفاصيل الطلب: ' + error.message);
    }
}

// تحديث حالة الطلب
updateStatusBtn.addEventListener('click', async () => {
    const orderId = updateStatusBtn.getAttribute('data-id');
    const newStatus = orderStatusSelect.value;
    
    try {
        const response = await fetch(`/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // إعادة تحميل الطلبات
            const ordersResponse = await fetch('/orders');
            const orders = await ordersResponse.json();
            renderOrdersTable(orders.data);
            
            // إغلاق النافذة
            closeModal('order-modal');
            
            // عرض رسالة نجاح
            alert(result.message);
        } else {
            throw new Error(result.error || 'Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('حدث خطأ أثناء تحديث حالة الطلب: ' + error.message);
    }
});

// إلغاء الطلب
cancelOrderBtn.addEventListener('click', async () => {
    const orderId = cancelOrderBtn.getAttribute('data-id');
    
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) return;
    
    try {
        const response = await fetch(`/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'cancelled' })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // إعادة تحميل الطلبات
            const ordersResponse = await fetch('/orders');
            const orders = await ordersResponse.json();
            renderOrdersTable(orders.data);
            
            // إغلاق النافذة
            closeModal('order-modal');
            
            // عرض رسالة نجاح
            alert(result.message);
        } else {
            throw new Error(result.error || 'Failed to cancel order');
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert('حدث خطأ أثناء إلغاء الطلب: ' + error.message);
    }
});

// عرض أكثر الأصناف طلباً
function renderTopItems(items) {
    const topItemsList = document.getElementById('top-items-list');
    topItemsList.innerHTML = '';
    
    items.forEach((item, index) => {
        if (index >= 6) return;
        
        const div = document.createElement('div');
        div.className = 'top-item';
        
        div.innerHTML = `
            <div class="top-item-img">
                <img src="/foods/${item.foodId._id}/image" alt="${item.foodId.name}">
            </div>
            <div class="top-item-info">
                <h4>${item.foodId.name}</h4>
                <p>تم طلبها ${item.count} مرات</p>
            </div>
        `;
        
        topItemsList.appendChild(div);
    });
}