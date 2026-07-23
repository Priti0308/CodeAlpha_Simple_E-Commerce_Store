document.addEventListener('DOMContentLoaded', () => {
  requireAuth(); // Must be logged in

  const profileForm = document.getElementById('profile-form');
  if (!profileForm) return;

  prefillProfileForm();
  profileForm.addEventListener('submit', handleProfileUpdate);
});

// Prefill form inputs using active session storage
function prefillProfileForm() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) return;

  document.getElementById('name').value = userInfo.name || '';
  document.getElementById('email').value = userInfo.email || '';
  
  // Also update sidebar text details
  const nameEl = document.querySelector('.profile-name');
  const emailEl = document.querySelector('.profile-email');
  if (nameEl) nameEl.textContent = userInfo.name || 'User Account';
  if (emailEl) emailEl.textContent = userInfo.email || '';
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function validatePassword(pass) {
  if (!pass || pass.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(pass);
  const hasLowerCase = /[a-z]/.test(pass);
  const hasNumbers = /\d/.test(pass);
  const hasNonalphas = /\W/.test(pass);
  return hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
}

// Update profile trigger
async function handleProfileUpdate(e) {
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

  if (password) {
    if (!validatePassword(password)) {
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
  }

  if (!isValid) return;

  const btnId = 'profile-submit-btn';
  setButtonLoading(btnId, true, 'Save Changes');

  const updatePayload = { name, email };
  if (password) {
    updatePayload.password = password;
  }

  try {
    const updatedUser = await API.put('/auth/profile', updatePayload);
    
    // Save updated session parameters (updates token and name)
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    
    // Refresh prefilled entries, greeting, and sidebar
    prefillProfileForm();
    if (typeof initNavbar === 'function') initNavbar();
    if (typeof initProfileSidebar === 'function') initProfileSidebar();

    // Clear password inputs
    passwordField.value = '';
    confirmField.value = '';

    showToast('Profile updated successfully!', 'success');
  } catch (error) {
    const msg = error.errors ? error.errors.join(', ') : error.message;
    showToast(msg || 'Failed to update profile.', 'error');
  } finally {
    setButtonLoading(btnId, false, 'Save Changes');
  }
}
