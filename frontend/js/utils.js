// Format prices (e.g. 19.9 -> Rs. 1,592)
const formatPrice = (price) => {
  // Convert standard mock prices (USD) to INR magnitude
  const inrPrice = (price || 0) * 80;
  return `Rs. ${Math.round(inrPrice).toLocaleString('en-IN')}`;
};

// Get category-specific fallback placeholder images if primary load fails
const getCategoryFallbackImage = (category) => {
  const fallbacks = {
    'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    "Men's Wear": 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80',
    "Women's Wear": 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&auto=format&fit=crop&q=80'
  };
  return fallbacks[category] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80';
};

// Format date strings
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Render star ratings using icons or characters
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    '★'.repeat(fullStars) +
    (halfStar ? '½' : '') +
    '☆'.repeat(emptyStars)
  );
};

// Extract query parameters from current URL
const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Inject UI alerts into container divs dynamically
const showAlert = (containerId, message, type = 'danger') => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;

  // Auto-remove after 5 seconds
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
};

// Check if user is logged in
const isUserLoggedIn = () => {
  return localStorage.getItem('userInfo') !== null;
};

// Redirect if logged out
const requireAuth = () => {
  if (!isUserLoggedIn()) {
    window.location.href = 'login.html';
  }
};

// Show a floating toast notification in top-right
const showToast = (message, type = 'success') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `alert alert-${type === 'error' ? 'danger' : type}`;
  toast.style.margin = '0';
  toast.style.minWidth = '280px';
  toast.style.boxShadow = 'var(--shadow-md)';
  toast.style.backdropFilter = 'blur(10px)';
  toast.style.border = '1px solid rgba(255,255,255,0.1)';
  toast.style.borderRadius = 'var(--radius-sm)';
  toast.style.padding = '12px 20px';
  toast.style.animation = 'slideIn 0.3s ease forwards';
  toast.innerHTML = message;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 400);
};

// Disable submit button and add loading spinner
const setButtonLoading = (buttonId, isLoading, originalText = 'Submit') => {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${originalText}...`;
    btn.style.opacity = '0.7';
  } else {
    btn.disabled = false;
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
  }
};

// Clear validation messages
const clearInlineErrors = () => {
  document.querySelectorAll('.inline-error').forEach(el => el.remove());
  document.querySelectorAll('.form-control').forEach(el => {
    el.style.borderColor = 'var(--border-color)';
  });
};

// Inject validation error message under a specific field
const showInlineError = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.style.borderColor = 'var(--danger)';

  const errEl = document.createElement('span');
  errEl.className = 'inline-error';
  errEl.style.color = 'var(--danger)';
  errEl.style.fontSize = '0.8rem';
  errEl.style.marginTop = '4px';
  errEl.style.display = 'block';
  errEl.textContent = message;

  // Insert after the input field
  field.parentNode.appendChild(errEl);
};

// Add standard keyframe animation styles dynamically
const styleNode = document.createElement('style');
styleNode.textContent = `
  @keyframes slideIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    vertical-align: middle;
    margin-right: 5px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleNode);
