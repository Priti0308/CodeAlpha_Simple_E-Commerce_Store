document.addEventListener('DOMContentLoaded', () => {
  requireAuth(); // Must be logged in

  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;

  renderOrderReview();
  checkoutForm.addEventListener('submit', handleOrderSubmit);
});

// Load the checkout price summaries from memory
function getOrderTotals() {
  const totals = JSON.parse(sessionStorage.getItem('orderTotals'));
  if (totals) return totals;

  // Fallback calculation if session is missing
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}

// Display order details prior to booking
function renderOrderReview() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const reviewContainer = document.getElementById('checkout-items-review');
  const totals = getOrderTotals();

  if (!reviewContainer) return;

  if (cartItems.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  reviewContainer.innerHTML = '';
  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.marginBottom = '10px';
    div.style.fontSize = '0.9rem';
    div.innerHTML = `
      <span>${item.quantity}x ${item.name}</span>
      <span style="color: var(--text-primary); font-weight:600;">${formatPrice(item.price * item.quantity)}</span>
    `;
    reviewContainer.appendChild(div);
  });

  // Load prices in summary panel
  document.getElementById('checkout-subtotal').textContent = formatPrice(totals.itemsPrice);
  document.getElementById('checkout-shipping').textContent = totals.shippingPrice === 0 ? 'Free' : formatPrice(totals.shippingPrice);
  document.getElementById('checkout-tax').textContent = formatPrice(totals.taxPrice);
  document.getElementById('checkout-total').textContent = formatPrice(totals.totalPrice);
}

// Handle form submit
async function handleOrderSubmit(e) {
  e.preventDefault();
  clearInlineErrors();

  const addressField = document.getElementById('address');
  const cityField = document.getElementById('city');
  const postalCodeField = document.getElementById('postalCode');
  const countryField = document.getElementById('country');

  const address = addressField.value.trim();
  const city = cityField.value.trim();
  const postalCode = postalCodeField.value.trim();
  const country = countryField.value.trim();

  let isValid = true;

  if (!address) {
    showInlineError('address', 'Street address is required');
    isValid = false;
  }
  if (!city) {
    showInlineError('city', 'City is required');
    isValid = false;
  }
  if (!postalCode) {
    showInlineError('postalCode', 'Postal code is required');
    isValid = false;
  }
  if (!country) {
    showInlineError('country', 'Country is required');
    isValid = false;
  }

  if (!isValid) return;

  const btnId = 'checkout-submit-btn';
  setButtonLoading(btnId, true, '🔒 Place Order & Pay');

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totals = getOrderTotals();

  const orderData = {
    orderItems: cartItems.map(item => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: item.price,
      product: item.product,
    })),
    shippingAddress: { address, city, postalCode, country },
    paymentMethod: 'Credit Card',
    itemsPrice: totals.itemsPrice,
    shippingPrice: totals.shippingPrice,
    taxPrice: totals.taxPrice,
    totalPrice: totals.totalPrice,
  };

  try {
    // Post Order
    const createdOrder = await API.post('/orders', orderData);
    
    // Simulate instant payment
    await API.put(`/orders/${createdOrder._id}/pay`, {
      status: 'COMPLETED',
      email_address: JSON.parse(localStorage.getItem('userInfo')).email
    });

    // Clear cart from local state & backend database
    localStorage.removeItem('cartItems');
    sessionStorage.removeItem('orderTotals');
    updateCartBadge();
    
    try {
      await API.delete('/cart');
    } catch (dbErr) {
      console.warn('Could not clear cart database record:', dbErr.message);
    }

    showToast('Order placed and paid successfully! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1500);
  } catch (error) {
    setButtonLoading(btnId, false, '🔒 Place Order & Pay');
    const msg = error.errors ? error.errors.join(', ') : error.message;
    showToast(msg || 'Checkout failed. Please try again.', 'error');
  }
}
