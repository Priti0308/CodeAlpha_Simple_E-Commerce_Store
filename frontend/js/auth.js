document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
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
