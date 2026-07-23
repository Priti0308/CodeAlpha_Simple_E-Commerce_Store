document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  updateCartBadge();
  setupProfileDropdown();
  initHeroSlideshow();
  initProfileSidebar();
});

// Update the navigation bar cart badge count
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  
  badge.textContent = totalCount;
  badge.style.display = totalCount > 0 ? 'flex' : 'none';
}

// Populate the navbar with dynamic authentication options (Login vs Profile Dropdown)
function initNavbar() {
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo) {
    authContainer.innerHTML = `
      <div class="profile-dropdown">
        <span class="profile-trigger">Hi, ${userInfo.name} ▼</span>
        <div class="profile-menu">
          <a href="profile.html" class="profile-menu-item">My Profile</a>
          <a href="orders.html" class="profile-menu-item">My Orders</a>
          <a href="#" id="logout-btn" class="profile-menu-item">Log Out</a>
        </div>
      </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-primary btn-auth">Log In</a>
    `;
  }
}

// Setup profile dropdown toggling manually if click-based
function setupProfileDropdown() {
  const trigger = document.querySelector('.profile-trigger');
  const menu = document.querySelector('.profile-menu');

  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });
  }
}

// Perform client-side user logout
function logoutUser() {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems'); // clear local cart copy too
  window.location.href = 'index.html';
}

// Hero banner image fading slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 3500); // Transitions every 3.5s
}

// Populate profile sidebar details dynamically & support profile picture changes
function initProfileSidebar() {
  const sidebar = document.querySelector('.profile-sidebar');
  if (!sidebar) return;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) return;

  const nameEl = sidebar.querySelector('.profile-name');
  const emailEl = sidebar.querySelector('.profile-email');
  const avatarEl = sidebar.querySelector('.profile-avatar');

  if (nameEl) nameEl.textContent = userInfo.name || 'User Account';
  if (emailEl) emailEl.textContent = userInfo.email || '';

  // Load profile picture from localStorage
  if (avatarEl) {
    const avatarUrl = localStorage.getItem('profilePic') || '';
    if (avatarUrl) {
      avatarEl.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      avatarEl.textContent = '👤';
    }

    avatarEl.title = 'Click to change profile picture';
    
    // Create hidden file input if it doesn't exist
    let fileInput = document.getElementById('profile-pic-input');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'profile-pic-input';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            const base64Img = evt.target.result;
            localStorage.setItem('profilePic', base64Img);
            initProfileSidebar();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Toggle file selection click
    avatarEl.onclick = () => {
      fileInput.click();
    };
  }
}
