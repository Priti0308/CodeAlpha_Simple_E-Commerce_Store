const API_BASE_URL = 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 8000; // 8 seconds timeout

const apiRequest = async (endpoint, method = 'GET', body = null, isAuthRequired = true, timeout = DEFAULT_TIMEOUT) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (isAuthRequired) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const config = {
    method,
    headers,
    signal: controller.signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(id);
    
    const resData = await response.json();

    if (!response.ok) {
      const err = new Error(resData.message || 'API request failed');
      err.errors = resData.errors || [];
      err.status = response.status;
      throw err;
    }

    // Return the inner data object
    return resData.data;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Connection timeout. The server took too long to respond.');
      timeoutErr.errors = ['Network timeout exceeded'];
      throw timeoutErr;
    }
    console.error(`API Error (${method} ${endpoint}):`, error.message);
    throw error;
  }
};

const API = {
  get: (endpoint, isAuth = true, timeout) => apiRequest(endpoint, 'GET', null, isAuth, timeout),
  post: (endpoint, body, isAuth = true, timeout) => apiRequest(endpoint, 'POST', body, isAuth, timeout),
  put: (endpoint, body, isAuth = true, timeout) => apiRequest(endpoint, 'PUT', body, isAuth, timeout),
  delete: (endpoint, isAuth = true, timeout) => apiRequest(endpoint, 'DELETE', null, isAuth, timeout),
};
