const API_BASE_URL = 'https://Mahesh45.pythonanywhere.com/api'; 
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("[api.js] handleResponse - Error parsing JSON:", jsonError);
      const textError = await response.text().catch(() => "Could not read error text");
      throw { status: response.status, message: `Server error (invalid JSON): ${textError}`, isNetworkError: false, data: null };
    }
  } else {
    const text = await response.text();
    console.warn("[api.js] handleResponse - Received non-JSON response text:", text);
    if (!response.ok) {
      throw { status: response.status, message: text || response.statusText, isNetworkError: false, data: null };
    }
    return { message: text, status: response.status }; // Should ideally be JSON from backend always
  }

  if (!response.ok) {
    const error = (data && data.error) || (data && data.message) || `An error occurred: ${response.statusText}`;
    console.error("[api.js] handleResponse - Response not OK, throwing error:", { status: response.status, message: error, data });
    throw { status: response.status, message: error, data: data, isNetworkError: false };
  }
  return data;
}

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Signup API error:', error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error during signup.', isNetworkError: true, status: error.status };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Login API error:', error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error during login.', isNetworkError: true, status: error.status };
  }
};

export const fetchMyOrdersAPI = async (token) => {
    if (!token) throw { message: 'Authentication token required to fetch orders.', isNetworkError: false };
    try {
      const response = await fetch(`${API_BASE_URL}/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return handleResponse(response); // Expects an array of order objects (with items nested)
    } catch (error) {
      console.error('Fetch My Orders API error:', error);
      if (error.isNetworkError === false) throw error;
      throw { message: error.message || 'Network error fetching your orders.', isNetworkError: true, status: error.status };
    }
  };

export const cancelOrderAPI = async (orderId, token) => {
  if (!token) throw { message: 'Authentication token required to cancel order.', isNetworkError: false };
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: 'PUT', // Or 'POST' if your backend uses that
      headers: {
        'Content-Type': 'application/json', // Even if no body, good practice
        'Authorization': `Bearer ${token}`,
      },
      // No body needed for this specific PUT request as per current backend
    });
    return handleResponse(response); // Expects { message: "Order ... canceled." }
  } catch (error) {
    console.error(`Cancel Order API error for order ${orderId}:`, error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error canceling order.', isNetworkError: true, status: error.status };
  }
};

export const fetchUserProfileAPI = async (token) => {
  if (!token) throw { message: 'No token provided for profile fetch', isNetworkError: false };
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Fetch Profile API error:', error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error fetching profile.', isNetworkError: true, status: error.status };
  }
};

export const fetchProductsAPI = async () => { 
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Fetch Products API error:', error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error fetching products.', isNetworkError: true, status: error.status };
  }
};

export const createOrderAPI = async (orderData, token) => {
  if (!token) throw { message: 'Authentication token required to create order.', isNetworkError: false };
  try {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Create Order API error:', error);
    if (error.isNetworkError === false) throw error;
    throw { message: error.message || 'Network error creating order.', isNetworkError: true, status: error.status };
  }
};