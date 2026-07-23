document.addEventListener('DOMContentLoaded', () => {
  const cartWrapper = document.querySelector('.cart-wrapper');
  if (!cartWrapper) return;

  loadCart();
});

// Sync cart from database if logged in, then render
async function loadCart() {
  const localCartBefore = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (isUserLoggedIn()) {
    try {
      const cartData = await API.get('/cart');
      if (cartData && Array.isArray(cartData.items)) {
        const dbCart = cartData.items.map(item => {
          if (!item || !item.product) return null;
          return {
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            category: item.product.category,
            quantity: item.quantity
          };
        }).filter(Boolean);

        // Merge local cart items into database cart items
        const mergedCart = [...dbCart];
        localCartBefore.forEach(localItem => {
          const exists = mergedCart.find(dbItem => dbItem.product === localItem.product);
          if (exists) {
            exists.quantity = Math.max(exists.quantity, localItem.quantity);
          } else {
            mergedCart.push(localItem);
          }
        });

        localStorage.setItem('cartItems', JSON.stringify(mergedCart));
        if (typeof updateCartBadge === 'function') updateCartBadge();

        // If local items were merged and database is out of sync, update the database
        if (localCartBefore.length > 0) {
          syncCartToDatabase(mergedCart);
        }
      }
    } catch (err) {
      console.warn('Could not sync user cart from database:', err.message);
    }
  }
  renderCart();
}


// Primary cart rendering routine
function renderCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const tbody = document.getElementById('cart-items-tbody');
  const cartWrapper = document.querySelector('.cart-wrapper');

  if (!tbody || !cartWrapper) return;

  if (cartItems.length === 0) {
    cartWrapper.innerHTML = `
      <div class="card text-center" style="grid-column: 1/-1; padding: 60px;">
        <h2 style="margin-bottom: 20px;">Your Shopping Cart is Empty</h2>
        <p style="color: var(--text-secondary); margin-bottom: 30px;">Add some premium products to start shopping.</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  tbody.innerHTML = '';
  cartItems.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src=getCategoryFallbackImage('${item.category || 'Footwear'}')">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
          </div>
        </div>
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="qty-selector" style="margin-bottom: 0;">
          <button class="qty-btn btn-minus" data-id="${item.product}">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn btn-plus" data-id="${item.product}">+</button>
        </div>
      </td>
      <td>${formatPrice(item.price * item.quantity)}</td>
      <td>
        <button class="cart-action-btn btn-remove" data-id="${item.product}">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Calculate order totals
  calculateSummary(cartItems);

  // Bind Event Listeners
  document.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(btn.dataset.id, -1));
  });
  document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(btn.dataset.id, 1));
  });
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => removeCartItem(btn.dataset.id));
  });
}

// Adjust cart item count and save changes
function changeQuantity(id, amount) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const item = cartItems.find(x => x.product === id);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + amount);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
  updateCartBadge();
  syncCartToDatabase(cartItems);
}

// Remove item from cart list
function removeCartItem(id) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems = cartItems.filter(x => x.product !== id);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  renderCart();
  updateCartBadge();
  syncCartToDatabase(cartItems);
}

// Compute checkout costs
function calculateSummary(cartItems) {
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  document.getElementById('summary-subtotal').textContent = formatPrice(itemsPrice);
  document.getElementById('summary-shipping').textContent = shippingPrice === 0 ? 'Free' : formatPrice(shippingPrice);
  document.getElementById('summary-tax').textContent = formatPrice(taxPrice);
  document.getElementById('summary-total').textContent = formatPrice(totalPrice);

  // Save totals into session storage for checkout use
  sessionStorage.setItem('orderTotals', JSON.stringify({
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  }));
}

// Helper to push client-side cart adjustments back to DB
function syncCartToDatabase(cartItems) {
  if (isUserLoggedIn()) {
    const dbFormat = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    API.post('/cart', { items: dbFormat }).catch(err => console.error('Database sync failed:', err));
  }
}
