# RestoTemacine


ass the best disigner and frontend devloper send me a html css code for it with profisionel way and make it awsom اجعلها رائعة و ارواع من القديمة /* Base Styles */

:root {

  --primary-color: #ff6b6b;

  --secondary-color: #ffa502;

  --dark-color: #2f3542;

  --light-color: #f1f2f6;

  --success-color: #2ed573;

  --warning-color: #ff7f50;

  --info-color: #1e90ff;

  --danger-color: #ff4757;

  --white: #ffffff;

  --black: #000000;

  --gray: #a4b0be;

  --dark-gray: #747d8c;

  --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  --transition: all 0.3s ease;

}



* {

  margin: 0;

  padding: 0;

  box-sizing: border-box;

}



html {

  scroll-behavior: smooth;

}



body {

  font-family: 'Tajawal', sans-serif;

  background-color: #f9f9f9;

  color: var(--dark-color);

  line-height: 1.6;

  direction: rtl;

}



a {

  text-decoration: none;

  color: inherit;

}



ul {

  list-style: none;

}



img {

  max-width: 100%;

  height: auto;

  display: block;

}



/* Header Styles */

header {

  background-color: var(--white);

  box-shadow: var(--box-shadow);

  position: fixed;

  top: 0;

  right: 0;

  left: 0;

  z-index: 1000;

  padding: 1rem 0;

}



.header-content {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 0 1.5rem;

  max-width: 1200px;

  margin: 0 auto;

}



header h1 {

  color: var(--primary-color);

  font-size: 1.8rem;

  font-weight: 700;

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



.cart-icon {

  position: relative;

  cursor: pointer;

  font-size: 1.5rem;

  color: var(--dark-color);

}



.cart-count {

  position: absolute;

  top: -10px;

  left: -10px;

  background-color: var(--primary-color);

  color: var(--white);

  width: 22px;

  height: 22px;

  border-radius: 50%;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 0.8rem;

  font-weight: bold;

}



/* Orders Status Section */

.orders-status {

  background-color: var(--white);

  margin-top: 80px;

  padding: 1.5rem;

  box-shadow: var(--box-shadow);

}



.orders-status h2 {

  color: var(--dark-color);

  font-size: 1.5rem;

  margin-bottom: 1.5rem;

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



.status-cards {

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  gap: 1rem;

}



.status-card {

  background-color: var(--white);

  border-radius: 10px;

  padding: 1.5rem 1rem;

  text-align: center;

  box-shadow: var(--box-shadow);

  transition: var(--transition);

}



.status-card:hover {

  transform: translateY(-5px);

}



.status-card.pending {

  border-top: 4px solid var(--warning-color);

}



.status-card.preparing {

  border-top: 4px solid var(--info-color);

}



.status-card.delivering {

  border-top: 4px solid var(--secondary-color);

}



.status-card.delivered {

  border-top: 4px solid var(--success-color);

}



.status-icon {

  font-size: 2rem;

  margin-bottom: 0.5rem;

}



.status-card.pending .status-icon {

  color: var(--warning-color);

}



.status-card.preparing .status-icon {

  color: var(--info-color);

}



.status-card.delivering .status-icon {

  color: var(--secondary-color);

}



.status-card.delivered .status-icon {

  color: var(--success-color);

}



.status-title {

  font-weight: 500;

  margin-bottom: 0.5rem;

}



.status-count {

  font-size: 1.5rem;

  font-weight: 700;

}



/* Main Content */

main {

  max-width: 1200px;

  margin: 2rem auto;

  padding: 0 1.5rem;

}



.container {

  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 2rem;

}



.menu h2, .cart h2 {

  color: var(--dark-color);

  font-size: 1.5rem;

  margin-bottom: 1.5rem;

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



/* Search Box */

.search-box {

  position: relative;

  margin-bottom: 1.5rem;

}



.search-box input {

  width: 100%;

  padding: 0.8rem 1rem 0.8rem 2.5rem;

  border: 1px solid #ddd;

  border-radius: 30px;

  font-family: 'Tajawal', sans-serif;

  font-size: 1rem;

  transition: var(--transition);

}



.search-box input:focus {

  outline: none;

  border-color: var(--primary-color);

  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);

}



.search-box i {

  position: absolute;

  left: 1rem;

  top: 50%;

  transform: translateY(-50%);

  color: var(--dark-gray);

}



/* Food Items */

.food-items {

  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  gap: 1.5rem;

}



.food-card {

  background-color: var(--white);

  border-radius: 10px;

  overflow: hidden;

  box-shadow: var(--box-shadow);

  transition: var(--transition);

  cursor: pointer;

  



}



.food-card:hover {

  transform: translateY(-5px);

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

}



.food-image {

  width: 100%;

  height: 180px;

  object-fit: cover;

}



.food-info {

  padding: 1rem;

}



.food-name {

  font-weight: 700;

  margin-bottom: 0.5rem;

  color: var(--dark-color);

}



.food-description {

  color: var(--dark-gray);

  font-size: 0.9rem;

  margin-bottom: 1rem;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}



.food-footer {

  display: flex;

  justify-content: space-between;

  align-items: center;

}



.food-price {

  font-weight: 700;

  color: var(--primary-color);

  font-size: 1.1rem;

}

/* أزرار إضافة إلى السلة */

.add-to-cart-btn {

  background-color: var(--primary-color);

  color: var(--white);

  border: none;

  border-radius: 25px;

  padding: 0.6rem 1.2rem;

  cursor: pointer;

  font-family: 'Tajawal', sans-serif;

  font-weight: 500;

  transition: var(--transition);

  display: flex;

  align-items: center;

  gap: 0.5rem;

  font-size: 0.9rem;

  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  position: relative;

  overflow: hidden;

}



.add-to-cart-btn:hover {

  background-color: #ff5252;

  transform: translateY(-2px);

  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);

}



.add-to-cart-btn:active {

  transform: translateY(0);

}



.add-to-cart-btn i {

  font-size: 0.9rem;

}



/* تأثير عند النقر */

.add-to-cart-btn::after {

  content: '';

  position: absolute;

  top: 50%;

  right: 50%;

  width: 5px;

  height: 5px;

  background: rgba(255, 255, 255, 0.5);

  opacity: 0;

  border-radius: 100%;

  transform: scale(1, 1) translate(-50%, -50%);

  transform-origin: 50% 50%;

}



.add-to-cart-btn:focus:not(:active)::after {

  animation: ripple 0.6s ease-out;

}



@keyframes ripple {

  0% {

    transform: scale(0, 0);

    opacity: 0.5;

  }

  100% {

    transform: scale(20, 20);

    opacity: 0;

  }

}



/* زر الإضافة في صفحة التفاصيل */

#addToCartFromDetail {

  padding: 0.8rem 2rem;

  font-size: 1rem;

  border-radius: 30px;

  margin: 0 auto;

  display: block;

}



/* حالة عدم التمكن من الشراء */

.add-to-cart-btn:disabled {

  background-color: var(--gray);

  cursor: not-allowed;

  transform: none !important;

}

/* Cart Styles */

.cart {

  background-color: var(--white);

  border-radius: 10px;

  padding: 1.5rem;

  box-shadow: var(--box-shadow);

  position: sticky;

  top: 100px;

  height: fit-content;

}



.cart-items {

  margin-bottom: 1.5rem;

  max-height: 400px;

  overflow-y: auto;

}



.empty-state {

  text-align: center;

  padding: 2rem 0;

  color: var(--dark-gray);

}



.empty-state i {

  font-size: 3rem;

  margin-bottom: 1rem;

  color: var(--gray);

}



.cart-item {

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding: 1rem 0;

  border-bottom: 1px solid #eee;

}



.cart-item:last-child {

  border-bottom: none;

}



.cart-item-info {

  display: flex;

  align-items: center;

  gap: 1rem;

}



.cart-item-image {

  width: 60px;

  height: 60px;

  border-radius: 5px;

  object-fit: cover;

}



.cart-item-name {

  font-weight: 500;

  margin-bottom: 0.3rem;

}



.cart-item-price {

  color: var(--primary-color);

  font-weight: 700;

}



.cart-item-actions {

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



.quantity-control {

  display: flex;

  align-items: center;

  border: 1px solid #ddd;

  border-radius: 5px;

  overflow: hidden;

}



.quantity-btn {

  background-color: #f1f2f6;

  border: none;

  width: 30px;

  height: 30px;

  display: flex;

  justify-content: center;

  align-items: center;

  cursor: pointer;

  font-size: 1rem;

  transition: var(--transition);

}



.quantity-btn:hover {

  background-color: #e0e0e0;

}



.quantity {

  width: 40px;

  text-align: center;

  border-left: 1px solid #ddd;

  border-right: 1px solid #ddd;

}



.remove-item {

  color: var(--danger-color);

  background: none;

  border: none;

  font-size: 1.2rem;

  cursor: pointer;

  transition: var(--transition);

}



.remove-item:hover {

  transform: scale(1.1);

}



.cart-summary {

  background-color: #f9f9f9;

  border-radius: 10px;

  padding: 1rem;

  margin-bottom: 1.5rem;

}



.summary-row {

  display: flex;

  justify-content: space-between;

  margin-bottom: 0.8rem;

}



.summary-row.total {

  border-top: 1px solid #ddd;

  padding-top: 0.8rem;

  font-weight: 700;

  font-size: 1.1rem;

}



.checkout-btn {

  width: 100%;

  background-color: var(--success-color);

  color: var(--white);

  border: none;

  border-radius: 5px;

  padding: 1rem;

  font-family: 'Tajawal', sans-serif;

  font-size: 1.1rem;

  font-weight: 500;

  cursor: pointer;

  transition: var(--transition);

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 0.5rem;

}



.checkout-btn:hover {

  background-color: #25c164;

}



.checkout-btn:disabled {

  background-color: var(--gray);

  cursor: not-allowed;

}



/* Modal Styles */

.modal {

  position: fixed;

  top: 0;

  right: 0;

  bottom: 0;

  left: 0;

  background-color: rgba(0, 0, 0, 0.5);

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 2000;

  opacity: 0;

  visibility: hidden;

  transition: var(--transition);

}



.modal.active {

  opacity: 1;

  visibility: visible;

}



.modal-content {

  background-color: var(--white);

  border-radius: 10px;

  width: 90%;

  max-width: 500px;

  max-height: 90vh;

  overflow-y: auto;

  padding: 2rem;

  position: relative;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  animation: modalFadeIn 0.3s ease;

}



@keyframes modalFadeIn {

  from {

    transform: translateY(-50px);

    opacity: 0;

  }

  to {

    transform: translateY(0);

    opacity: 1;

  }

}



.close-btn {

  position: absolute;

  top: 1rem;

  left: 1rem;

  font-size: 1.5rem;

  cursor: pointer;

  color: var(--dark-gray);

  transition: var(--transition);

}



.close-btn:hover {

  color: var(--danger-color);

}



/* Food Details Modal */

.food-details-header {

  text-align: center;

  margin-bottom: 1.5rem;

}



.food-detail-image {

  width: 100%;

  height: 200px;

  object-fit: cover;

  border-radius: 10px;

  margin-bottom: 1rem;

}



.food-detail-price {

  font-size: 1.5rem;

  font-weight: 700;

  color: var(--primary-color);

  margin: 0.5rem 0;

}



.food-detail-description {

  margin-bottom: 2rem;

  line-height: 1.7;

}



.food-detail-actions {

  display: flex;

  justify-content: center;

}



/* Checkout Modal */

.form-group {

  margin-bottom: 1.5rem;

}



.form-group label {

  display: block;

  margin-bottom: 0.5rem;

  font-weight: 500;

}



.form-group input,

.form-group textarea {

  width: 100%;

  padding: 0.8rem 1rem;

  border: 1px solid #ddd;

  border-radius: 5px;

  font-family: 'Tajawal', sans-serif;

  font-size: 1rem;

  transition: var(--transition);

}



.form-group input:focus,

.form-group textarea:focus {

  outline: none;

  border-color: var(--primary-color);

  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);

}



.form-group textarea {

  resize: vertical;

  min-height: 100px;

}



.order-summary {

  background-color: #f9f9f9;

  border-radius: 10px;

  padding: 1rem;

  margin: 1.5rem 0;

}



.order-summary h3 {

  margin-bottom: 1rem;

  font-size: 1.2rem;

}



.order-item {

  display: flex;

  justify-content: space-between;

  margin-bottom: 0.5rem;

  padding-bottom: 0.5rem;

  border-bottom: 1px solid #eee;

}



.order-item:last-child {

  border-bottom: none;

  margin-bottom: 0;

  padding-bottom: 0;

}



.summary-total {

  display: flex;

  justify-content: space-between;

  margin-top: 1rem;

  padding-top: 1rem;

  border-top: 1px solid #ddd;

  font-weight: 700;

  font-size: 1.1rem;

}



/* Thank You Modal */

.thank-you-modal .modal-content {

  text-align: center;

  max-width: 400px;

}



.thank-you-icon {

  font-size: 4rem;

  color: var(--success-color);

  margin-bottom: 1rem;

}



.thank-you-title {

  color: var(--success-color);

  margin-bottom: 1rem;

}



.thank-you-message {

  margin-bottom: 2rem;

  color: var(--dark-gray);

}



.order-details {

  text-align: right;

  margin-bottom: 2rem;

  background-color: #f9f9f9;

  padding: 1rem;

  border-radius: 10px;

}



.order-detail {

  margin-bottom: 0.5rem;

  display: flex;

  justify-content: space-between;

}



.order-detail:last-child {

  margin-bottom: 0;

}



/* Order Status Modal */

.order-status-header {

  text-align: center;

  margin-bottom: 2rem;

}



.order-number {

  background-color: #f1f2f6;

  padding: 0.5rem 1rem;

  border-radius: 20px;

  display: inline-block;

  margin-top: 0.5rem;

  font-weight: 500;

}



.status-timeline {

  position: relative;

  padding-right: 30px;

  margin-bottom: 2rem;

}



.status-timeline::before {

  content: '';

  position: absolute;

  right: 5px;

  top: 0;

  bottom: 0;

  width: 2px;

  background-color: #ddd;

}



.status-step {

  position: relative;

  padding-bottom: 2rem;

}



.status-step:last-child {

  padding-bottom: 0;

}



.status-icon-wrapper {

  position: absolute;

  right: -30px;

  top: 0;

  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: flex;

  justify-content: center;

  align-items: center;

  background-color: var(--white);

  border: 2px solid #ddd;

  z-index: 1;

}



.status-step.completed .status-icon-wrapper {

  background-color: var(--success-color);

  border-color: var(--success-color);

  color: var(--white);

}



.status-step.active .status-icon-wrapper {

  background-color: var(--info-color);

  border-color: var(--info-color);

  color: var(--white);

}



.status-details {

  background-color: #f9f9f9;

  padding: 1rem;

  border-radius: 10px;

}



.status-title {

  font-weight: 500;

  margin-bottom: 0.3rem;

}



.status-time {

  color: var(--dark-gray);

  font-size: 0.9rem;

}



.order-items-list h3 {

  margin-bottom: 1rem;

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



/* Footer */

footer {

  background-color: var(--dark-color);

  color: var(--white);

  padding: 3rem 0 0;

}



.footer-content {

  max-width: 1200px;

  margin: 0 auto;

  padding: 0 1.5rem;

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  gap: 2rem;

}



.footer-section {

  margin-bottom: 2rem;

}



.footer-section h3 {

  font-size: 1.2rem;

  margin-bottom: 1.5rem;

  display: flex;

  align-items: center;

  gap: 0.5rem;

}



.footer-section p {

  margin-bottom: 0.5rem;

  color: #dfe4ea;

}



.footer-bottom {

  text-align: center;

  padding: 1.5rem;

  background-color: rgba(0, 0, 0, 0.1);

  margin-top: 2rem;

}



/* Toast Notification */

.toast {

  position: fixed;

  bottom: 20px;

  right: 20px;

  background-color: var(--success-color);

  color: var(--white);

  padding: 1rem 1.5rem;

  border-radius: 5px;

  box-shadow: var(--box-shadow);

  display: flex;

  align-items: center;

  gap: 0.5rem;

  transform: translateY(100px);

  opacity: 0;

  transition: var(--transition);

  z-index: 3000;

}



.toast.show {

  transform: translateY(0);

  opacity: 1;

}



.toast i {

  font-size: 1.2rem;

}



/* Buttons */

.btn {

  background-color: var(--primary-color);

  color: var(--white);

  border: none;

  border-radius: 5px;

  padding: 0.8rem 1.5rem;

  font-family: 'Tajawal', sans-serif;

  font-size: 1rem;

  font-weight: 500;

  cursor: pointer;

  transition: var(--transition);

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 0.5rem;

}



.btn:hover {

  background-color: #ff5252;

  transform: translateY(-2px);

}



.add-to-cart {

  background-color: var(--success-color);

}



.add-to-cart:hover {

  background-color: #25c164;

}



/* Responsive Design */

@media (max-width: 992px) {

  .container {

    grid-template-columns: 1fr;

  }

  

  .cart {

    position: static;

    margin-top: 2rem;

  }

}



@media (max-width: 768px) {

  .status-cards {

    grid-template-columns: repeat(2, 1fr);

  }

  

  .food-items {

    grid-template-columns: repeat(2, 1fr);

  }

  

  .header-content {

    padding: 0 1rem;

  }

  

  main {

    padding: 0 1rem;

  }

}



@media (max-width: 576px) {

  .status-cards {

    grid-template-columns: 1fr;

  }

  

  .food-items {

    grid-template-columns: 1fr;

  }

  

  .modal-content {

    width: 95%;

    padding: 1.5rem;

  }

  

  .footer-content {

    grid-template-columns: 1fr;

  }

  

  .header-content h1 {

    font-size: 1.5rem;

  }

}

.footer-logo {

  display: flex;

  align-items: center;

  gap: 0.5rem;

}

.footer-logo img {

  width: 40px;

  height: 40px;

  border-radius: 50%;

}

.footer-logo span {

  font-size: 1.5rem;

  font-weight: 700;

  color: var(--white);

}

.footer-logo span::before {

  content: 'Moulai Food';

  color: var(--primary-color);

}

.footer-logo span::after {

  content: ' - Delicious Meals Delivered';

  color: var(--secondary-color);

}

/* Responsive Footer */

@media (max-width: 576px) {

  .footer-content {

    grid-template-columns: 1fr;

  }

  

  .footer-section h3 {

    font-size: 1.2rem;

  }

  

  .footer-bottom {

    font-size: 0.9rem;

  }

}

/* Dark Mode Styles */

body.dark-mode {

  background-color: var(--dark-color);

  color: var(--light-color);

}



.orders-status {

    background-color: #f8f9fa;

    padding: 20px;

    margin: 20px auto;

    border-radius: 10px;

    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    max-width: 1200px;

}



.orders-status h2 {

    color: #333;

    margin-bottom: 20px;

    font-size: 1.5rem;

}



.status-cards {

    display: flex;

    justify-content: space-between;

    flex-wrap: wrap;

    gap: 15px;

}



.status-card {

    flex: 1;

    min-width: 200px;

    background: white;

    border-radius: 8px;

    padding: 15px;

    text-align: center;

    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    transition: transform 0.3s ease;

}



.status-card:hover {

    transform: translateY(-5px);

}



.status-card.pending {

    border-top: 4px solid #ffc107;

}



.status-card.preparing {

    border-top: 4px solid #17a2b8;

}



.status-card.delivering {

    border-top: 4px solid #007bff;

}



.status-card.delivered {

    border-top: 4px solid #28a745;

}



.status-icon {

    font-size: 2rem;

    margin-bottom: 10px;

}



.status-card.pending .status-icon {

    color: #ffc107;

}



.status-card.preparing .status-icon {

    color: #17a2b8;

}



.status-card.delivering .status-icon {

    color: #007bff;

}



.status-card.delivered .status-icon {

    color: #28a745;

}



.status-title {

    font-weight: bold;

    margin-bottom: 5px;

    color: #555;

}



.status-count {

    font-size: 1.5rem;

    font-weight: bold;

    color: #333;

}<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Moulai Food - طلب الطعام</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">

    <link rel="icon" href="assets/redd-removebg-preview.png" type="image/png">

  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>

<script src="مسار/ملفك/الجافاسكريبت.js"></script>

    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

</head>

<body>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>

<script src="مسار/ملفك/الجافاسكريبت.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>



    <header>

        <div class="header-content">

            <h1><i class="fas fa-utensils"></i> TemaFood</h1>

            <div class="cart-icon" id="cartIcon">

                <i class="fas fa-shopping-cart"></i>

                <span class="cart-count" id="cartCount">0</span>

            </div>

        </div>

    </header>

    

    <div class="orders-status">

        <h2><i class="fas fa-clipboard-list"></i> حالة طلباتك</h2>

        <div class="status-cards">

            <div class="status-card pending">

                <div class="status-icon">

                    <i class="fas fa-clock"></i>

                </div>

                <div class="status-title">قيد الانتظار</div>

                <div class="status-count" id="pendingCount">0</div>

            </div>

            <div class="status-card preparing">

                <div class="status-icon">

                    <i class="fas fa-utensils"></i>

                </div>

                <div class="status-title">قيد التحضير</div>

                <div class="status-count" id="preparingCount">0</div>

            </div>

            <div class="status-card delivering">

                <div class="status-icon">

                    <i class="fas fa-motorcycle"></i>

                </div>

                <div class="status-title">قيد التوصيل</div>

                <div class="status-count" id="deliveringCount">0</div>

            </div>

            <div class="status-card delivered">

                <div class="status-icon">

                    <i class="fas fa-check-circle"></i>

                </div>

                <div class="status-title">تم التسليم</div>

                <div class="status-count" id="deliveredCount">0</div>

            </div>

        </div>

    </div>

    

    <main>

        <div class="container">

            <div class="menu" id="menu">

                <h2><i class="fas fa-bars"></i> قائمة الطعام</h2>

                <div class="search-box">

                    <input type="text" id="searchInput" placeholder="ابحث عن الطعام...">

                    <i class="fas fa-search"></i>

                </div>

                <div class="food-items" id="foodItems">

                    <!-- Food items will be loaded here -->

                </div>

            </div>

            

            <div class="cart" id="cart">

                <h2><i class="fas fa-shopping-cart"></i> سلة المشتريات</h2>

                <div class="cart-items" id="cartItems">

                    <div class="empty-state">

                        <i class="fas fa-shopping-cart"></i>

                        <p>سلة المشتريات فارغة</p>

                    </div>

                </div>

                <div class="cart-summary">

                    <div class="summary-row">

                        <span>السعر الإجمالي:</span>

                        <span id="subtotal">0 دج</span>

                    </div>

                    <div class="summary-row">

                        <span>رسوم التوصيل:</span>

                        <span id="deliveryFee">140 دج</span>

                    </div>

                    <div class="summary-row total">

                        <span>المجموع:</span>

                        <span id="total">140 دج</span>

                    </div>

                </div>

                <button class="btn checkout-btn" id="checkoutBtn">

                    <i class="fas fa-check"></i> تأكيد الطلب

                </button>

            </div>

        </div>

    </main>

    

    <!-- Food Details Modal -->

    <div class="modal" id="foodDetailsModal">

        <div class="modal-content">

            <span class="close-btn" id="closeFoodModal">&times;</span>

            <div class="food-details-header">

                <img id="detailFoodImage" src="" alt="Food" class="food-detail-image">

                <h2 id="detailFoodName"></h2>

                <div class="food-detail-price" id="detailFoodPrice"></div>

            </div>

            <div class="food-detail-description">

                <p id="detailFoodDescription">وصف مفصل عن الوجبة والمكونات المستخدمة فيها.</p>

            </div>

            <div class="food-detail-actions">

                <button class="btn add-to-cart" id="addToCartFromDetail">

                    <i class="fas fa-cart-plus"></i> أضف إلى السلة

                </button>

            </div>

        </div>

    </div>

    

    <!-- Checkout Modal -->

    <div class="modal" id="checkoutModal">

        <div class="modal-content">

            <span class="close-btn" id="closeModal">&times;</span>

            <h2><i class="fas fa-receipt"></i> تفاصيل الطلب</h2>

            <form id="orderForm">

                <div class="form-group">

                    <label for="userName">اسمك</label>

                    <input type="text" id="userName" required>

                </div>

                <div class="form-group">

                    <label for="userPhone">رقم الهاتف</label>

                    <input type="text" id="userPhone" required>

                </div>

        

                <div class="form-group">

                    <label for="deliveryAddress">عنوان التوصيل</label>

                    <textarea id="deliveryAddress" rows="3" required></textarea>

                </div>

                

                <div class="order-summary">

                    <h3>ملخص الطلب</h3>

                    <div id="orderSummary"></div>

                    <div class="summary-total">

                        <span>المجموع:</span>

                        <span id="orderTotal">140 دج</span>

                    </div>

                </div>

                

                <button type="submit" class="btn">

                    <i class="fas fa-paper-plane"></i> إرسال الطلب

                </button>

            </form>

        </div>

    </div>

    

    <!-- Thank You Modal -->

    <div class="modal thank-you-modal" id="thankYouModal">

        <div class="modal-content">

            <div class="thank-you-icon">

                <i class="fas fa-check-circle"></i>

            </div>

            <h2 class="thank-you-title">شكراً لطلبك!</h2>

            <p class="thank-you-message">

                تم استلام طلبك بنجاح وسيتم تجهيزه في أسرع وقت ممكن. يمكنك تتبع حالة الطلب من خلال صفحة الطلبات.

            </p>

            <div class="order-details">

                <div class="order-detail"><strong>رقم الطلب:</strong> <span id="thankYouOrderId">#12345</span></div>

                <div class="order-detail"><strong>الوقت المتوقع:</strong> <span id="thankYouTime">30-45 دقيقة</span></div>

                <div class="order-detail"><strong>المجموع:</strong> <span id="thankYouTotal">140 دج</span></div>

            </div>

            <button class="btn" id="thankYouCloseBtn">

                <i class="fas fa-times"></i> إغلاق

            </button>

        </div>

    </div>

    

    <!-- Order Status Modal -->

    <div class="modal order-status-modal" id="orderStatusModal">

        <div class="modal-content">

            <span class="close-btn" id="closeStatusModal">&times;</span>

            <div class="order-status-header">

                <h2><i class="fas fa-clipboard-check"></i> حالة الطلب</h2>

                <div class="order-number">رقم الطلب: <span id="orderIdDisplay">#12345</span></div>

            </div>

            

            <div class="status-timeline">

                <div class="status-step completed">

                    <div class="status-icon-wrapper">

                        <i class="fas fa-check"></i>

                    </div>

                    <div class="status-details">

                        <div class="status-title">تم استلام الطلب</div>

                        <div class="status-time">اليوم، 10:30 ص</div>

                    </div>

                </div>

                

                <div class="status-step active">

                    <div class="status-icon-wrapper">

                        <i class="fas fa-utensils"></i>

                    </div>

                    <div class="status-details">

                        <div class="status-title">قيد التحضير</div>

                        <div class="status-time">قيد التنفيذ</div>

                    </div>

                </div>

                

                <div class="status-step">

                    <div class="status-icon-wrapper">

                        <i class="fas fa-motorcycle"></i>

                    </div>

                    <div class="status-details">

                        <div class="status-title">قيد التوصيل</div>

                        <div class="status-time">لم يبدأ بعد</div>

                    </div>

                </div>

                

                <div class="status-step">

                    <div class="status-icon-wrapper">

                        <i class="fas fa-home"></i>

                    </div>

                    <div class="status-details">

                        <div class="status-title">تم التسليم</div>

                        <div class="status-time">لم يكتمل بعد</div>

                    </div>

                </div>

            </div>

            

            <div class="order-items-list">

                <h3><i class="fas fa-list"></i> تفاصيل الطلب</h3>

                <div id="orderStatusItems">

                    <!-- Order items will be loaded here -->

                </div>

                <div class="order-summary">

                    <div class="summary-row">

                        <span>السعر الإجمالي:</span>

                        <span id="orderStatusSubtotal">0 دج</span>

                    </div>

                    <div class="summary-row">

                        <span>رسوم التوصيل:</span>

                        <span id="orderStatusDelivery">140 دج</span>

                    </div>

                    <div class="summary-row total">

                        <span>المجموع:</span>

                        <span id="orderStatusTotal">140 دج</span>

                    </div>

                </div>

            </div>

        </div>

    </div>



    <!-- Footer -->

    <footer>

        <div class="footer-content">

            <div class="footer-section">

                <h3><i class="fas fa-utensils"></i> Tema Food</h3>

                <p>أفضل تجربة طعام في تماسين</p>

            </div>

            <div class="footer-section">

                <h3><i class="fas fa-map-marker-alt"></i> العنوان</h3>

                <p>تماسين </p>

            </div>

            <div class="footer-section">

                <h3><i class="fas fa-phone"></i> الاتصال</h3>

                <p>+213 (0673703773)</p>

            </div>

            <div class="footer-section">

                <h3><i class="fas fa-code"></i> التطوير</h3>

                <p>تم التطوير بواسطة <strong>Redox</strong></p>

                <img src="assets/redoxw.png" alt="Redox Logo" class="footer-logo">



            </div>

        </div>

        <div class="footer-bottom">

            <p>&copy; 2025 TemaFood. جميع الحقوق محفوظة.</p>

        </div>

    </footer>

    

    <!-- Toast Notification -->

    <div class="toast" id="toast">

        <i class="fas fa-check-circle"></i>

        <span id="toastMessage"></span>

    </div>



    <script src="script.js"></script>



</body>

</html>