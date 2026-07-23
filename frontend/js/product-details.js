document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.querySelector('.details-wrapper');
  if (!detailsContainer) return;

  loadProductDetails();
});

let currentProduct = null;
let currentQuantity = 1;

// Load Product Details by ID
async function loadProductDetails() {
  const productId = getQueryParam('id');
  const detailsContainer = document.querySelector('.details-wrapper');

  if (!productId) {
    detailsContainer.innerHTML = '<h2>No Product Specified.</h2>';
    return;
  }

  detailsContainer.innerHTML = '<h2>Loading Product Details...</h2>';

  try {
    const product = await API.get(`/products/${productId}`, false);
    currentProduct = product;
    renderDetails(product);
  } catch (error) {
    console.warn('API error, retrieving from mock database:', error.message);
    
    // MOCK_PRODUCTS lookup fallback
    // We import or hardcode mock database matching the products list
    const mockDb = typeof MOCK_PRODUCTS !== 'undefined' ? MOCK_PRODUCTS : [];
    const match = mockDb.find(p => p._id === productId);
    if (match) {
      currentProduct = match;
      renderDetails(match);
    } else {
      detailsContainer.innerHTML = '<h2>Product Not Found.</h2>';
    }
  }
}

// Render product details page UI elements
function renderDetails(product) {
  const detailsContainer = document.querySelector('.details-wrapper');
  
  // Build dynamic thumbnails markup if images are present
  let thumbnailsHtml = '';
  const imgList = product.images && product.images.length > 0 ? product.images : [product.image];
  
  if (imgList.length > 1) {
    thumbnailsHtml = `
      <div class="details-thumbnails" style="display: flex; gap: 10px; margin-top: 15px; overflow-x: auto; padding-bottom: 5px;">
        ${imgList.map((img, idx) => `
          <img class="thumbnail-img ${idx === 0 ? 'active' : ''}" 
               src="${img}" 
               alt="${product.name} view ${idx + 1}"
               style="width: 70px; height: 70px; object-fit: cover; border-radius: var(--radius-sm); border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-color)'}; cursor: pointer; transition: var(--transition);"
               onclick="changeDetailImage('${img}', this)">
        `).join('')}
      </div>
    `;
  }

  detailsContainer.innerHTML = `
    <div>
      <div class="details-image-gallery">
        <img id="main-details-img" src="${product.image}" alt="${product.name}" onerror="this.src=getCategoryFallbackImage('${product.category}')">
      </div>
      ${thumbnailsHtml}
    </div>
    <div class="details-content card">
      <span class="product-category" style="margin-bottom: 8px; display:inline-block;">${product.category}</span>
      <h1 class="details-title">${product.name}</h1>
      <div class="details-meta">
        <div class="product-rating" style="margin-bottom:0;">
          ${renderStars(product.rating)}
        </div>
        <span>(${product.numReviews} customer reviews)</span>
      </div>
      <div class="details-price">${formatPrice(product.price)}</div>
      <p class="details-description">${product.description}</p>
      
      <div class="qty-selector">
        <span style="font-weight: 500;">Quantity:</span>
        <button class="qty-btn" id="qty-minus">-</button>
        <span class="qty-val" id="qty-val">1</span>
        <button class="qty-btn" id="qty-plus">+</button>
      </div>

      <button class="btn btn-primary" id="btn-add-to-cart" style="width: 100%;">
        🛒 Add to Cart
      </button>
    </div>
  `;

  // Bind Listeners
  document.getElementById('qty-minus').addEventListener('click', () => adjustQty(-1));
  document.getElementById('qty-plus').addEventListener('click', () => adjustQty(1));
  document.getElementById('btn-add-to-cart').addEventListener('click', handleDetailAddToCart);
}

// Function to handle switching gallery images
window.changeDetailImage = function(imgSrc, element) {
  const mainImg = document.getElementById('main-details-img');
  if (mainImg) {
    mainImg.src = imgSrc;
  }
  
  // Highlight active thumbnail border
  document.querySelectorAll('.thumbnail-img').forEach(el => {
    el.style.borderColor = 'var(--border-color)';
    el.classList.remove('active');
  });
  element.style.borderColor = 'var(--primary)';
  element.classList.add('active');
};

// Adjust local quantity selection counter
function adjustQty(amount) {
  currentQuantity = Math.max(1, currentQuantity + amount);
  const qtyVal = document.getElementById('qty-val');
  if (qtyVal) {
    qtyVal.textContent = currentQuantity;
  }
}

// Main Add to Cart trigger from details page
function handleDetailAddToCart() {
  if (!currentProduct) return;

  const item = {
    product: currentProduct._id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    category: currentProduct.category || 'Footwear',
    quantity: currentQuantity
  };

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const existItem = cartItems.find(x => x.product === item.product);

  if (existItem) {
    existItem.quantity += currentQuantity;
  } else {
    cartItems.push(item);
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCartBadge();

  // Sync to database if logged in
  if (isUserLoggedIn()) {
    const dbFormat = cartItems.map(item => ({
      product: item.product,
      quantity: item.quantity
    }));
    API.post('/cart', { items: dbFormat })
      .catch(err => console.error('Error syncing cart database:', err));
  }

  alert(`${currentQuantity}x ${currentProduct.name} added to cart!`);
}
