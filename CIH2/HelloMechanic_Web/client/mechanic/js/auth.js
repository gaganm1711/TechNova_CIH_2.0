// auth.js — Universal Auth Handler for HelloMechanic

const API_BASE_URL = "http://localhost:5000"; // Change as per deployment

/**
 * Handle Login for all roles
 * @param {string} email 
 * @param {string} password 
 * @param {string} role - 'customer', 'mechanic', or 'admin'
 */
async function loginUser(email, password, role) {
  const endpoint = `${API_BASE_URL}/api/${role}/login`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", data.userId);

      // Redirect to respective dashboard
      if (role === "customer") window.location.href = "/client/customer/pages/home.html";
      else if (role === "mechanic") window.location.href = "/client/mechanic/pages/dashboard.html";
      else if (role === "admin") window.location.href = "/client/admin/pages/dashboard.html";

    } else {
      alert(`Login Failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong during login.");
  }
}

/**
 * Handle Registration (customer or mechanic)
 * @param {string} role - 'customer' or 'mechanic'
 * @param {Object} userDetails - { name, email, phone, password, ... }
 */
async function registerUser(role, userDetails) {
  const endpoint = `${API_BASE_URL}/api/${role}/register`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      if (role === "customer") window.location.href = "/client/customer/pages/login.html";
      else if (role === "mechanic") window.location.href = "/client/mechanic/pages/login.html";
    } else {
      alert(`Registration Failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong during registration.");
  }
}

/**
 * Logout function for all roles
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");

  // Redirect to role's login page
  const currentRole = window.location.pathname.includes("mechanic") ? "mechanic"
                    : window.location.pathname.includes("admin") ? "admin"
                    : "customer";

  if (currentRole === "customer") window.location.href = "/client/customer/pages/login.html";
  else if (currentRole === "mechanic") window.location.href = "/client/mechanic/pages/login.html";
  else window.location.href = "/client/admin/pages/login.html";
}

/**
 * Check if user is authenticated
 * Redirects to login if not
 */
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please login again.");
    logout();
  }
}

/**
 * Get Auth Headers
 */
function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token")
  };
}