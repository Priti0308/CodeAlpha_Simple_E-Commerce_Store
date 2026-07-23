document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Initialize password visibility toggles
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Find the sibling input (which is right before the button in our HTML layout)
      const input = toggle.previousElementSibling;
      if (input && (input.type === 'password' || input.type === 'text')) {
        if (input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        } else {
          input.type = 'password';
          toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
      }
    });
  });
});

// Helper validation rules
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function validatePassword(pass) {
  if (!pass || pass.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(pass);
  const hasLowerCase = /[a-z]/.test(pass);
  const hasNumbers = /\d/.test(pass);
  const hasNonalphas = /\W/.test(pass);
  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
}

// Login Handler
async function handleLogin(e) {
  e.preventDefault();
  clearInlineErrors();
  
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const email = emailField.value.trim();
  const password = passwordField.value;

  let isValid = true;

  if (!email) {
    showInlineError('email', 'Email address is required');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showInlineError('email', 'Please provide a valid email format');
    isValid = false;
  }

  if (!password) {
    showInlineError('password', 'Password is required');
    isValid = false;
  }

  if (!isValid) return;

  const btnId = 'login-submit-btn';
  setButtonLoading(btnId, true, 'Log In');

  try {
    const userInfo = await API.post('/auth/login', { email, password }, false);
    
    // Save info
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // Sync cart
    try {
      const cartData = await API.get('/cart');
      if (cartData && cartData.items) {
        const localCart = cartData.items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        }));
        localStorage.setItem('cartItems', JSON.stringify(localCart));
      }
    } catch (err) {
      console.warn('Could not sync user cart from database:', err.message);
    }
    
    showToast('Logged in successfully! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    setButtonLoading(btnId, false, 'Log In');
    const msg = error.errors ? error.errors.join(', ') : error.message;
    showToast(msg || 'Login failed. Please check credentials.', 'error');
  }
}

// Register Handler
async function handleRegister(e) {
  e.preventDefault();
  clearInlineErrors();

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const confirmField = document.getElementById('confirmPassword');

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const password = passwordField.value;
  const confirmPassword = confirmField.value;

  let isValid = true;

  if (!name) {
    showInlineError('name', 'Full name is required');
    isValid = false;
  }

  if (!email) {
    showInlineError('email', 'Email address is required');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showInlineError('email', 'Please provide a valid email format');
    isValid = false;
  }

  if (!password) {
    showInlineError('password', 'Password is required');
    isValid = false;
  } else if (!validatePassword(password)) {
    showInlineError('password', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    isValid = false;
  }

  if (!confirmPassword) {
    showInlineError('confirmPassword', 'Confirm password is required');
    isValid = false;
  } else if (password !== confirmPassword) {
    showInlineError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }

  if (!isValid) return;

  const btnId = 'register-submit-btn';
  setButtonLoading(btnId, true, 'Sign Up');

  try {
    const userInfo = await API.post('/auth/register', { name, email, password }, false);
    
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    showToast('Registered successfully! Welcome!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    setButtonLoading(btnId, false, 'Sign Up');
    const msg = error.errors ? error.errors.join(', ') : error.message;
    showToast(msg || 'Registration failed. Please try again.', 'error');
  }
}
