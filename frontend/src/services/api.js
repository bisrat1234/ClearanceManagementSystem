const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.setToken(this.token);
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Auth
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  logout() {
    this.removeToken();
  }

  // Password Reset
  async requestPasswordReset(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  }

  async verifyResetCode(email, code) {
    return this.request('/auth/verify-reset-code', {
      method: 'POST',
      body: { email, code },
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email, code, newPassword },
    });
  }

  // Requests
  async getRequests() {
    return this.request('/requests');
  }

  async submitRequest(requestData) {
    return this.request('/requests', {
      method: 'POST',
      body: requestData,
    });
  }

  async submitRequestWithFiles(formData) {
    const url = `${API_BASE_URL}/requests/with-files`;
    const config = {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async approveRequest(requestId, approvalData) {
    return this.request(`/requests/${requestId}/approve`, {
      method: 'PUT',
      body: approvalData,
    });
  }

  async getCertificate(requestId) {
    return this.request(`/requests/${requestId}/certificate`);
  }

  async getStats() {
    return this.request('/admin/stats');
  }

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return this.request(url);
  }

  async getPendingRegistrations() {
    return this.request('/admin/registrations');
  }

  async approveRegistration(registrationId, action) {
    return this.request(`/admin/registrations/${registrationId}/approve`, {
      method: 'PUT',
      body: { action },
    });
  }

  async createUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUserStatus(userId, status) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  async changePassword(passwordData) {
    return this.request('/user/password', {
      method: 'PUT',
      body: passwordData,
    });
  }

  async reassignRequest(requestId, newApprover) {
    return this.request(`/admin/requests/${requestId}/reassign`, {
      method: 'PUT',
      body: { newApprover },
    });
  }

  async getSystemSettings() {
    return this.request('/admin/settings');
  }

  async getWorkflows() {
    return this.request('/admin/workflows');
  }

  async getAuditLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/audit-logs?${queryString}`);
  }

  async updateSystemSettings(section, settings) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: { section, settings }
    });
  }

  async updateWorkflow(type, program, sequence) {
    return this.request('/admin/workflows', {
      method: 'PUT',
      body: { type, program, sequence }
    });
  }

  async searchRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/requests?${queryString}`);
  }

  async createBackup() {
    return this.request('/admin/backup', {
      method: 'POST'
    });
  }

  async restoreSystem() {
    return this.request('/admin/restore', {
      method: 'POST'
    });
  }
}

export default new ApiService();