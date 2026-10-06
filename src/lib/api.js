const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const error = new Error((body && body.error) || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  return body;
}

export const api = {
  signUp: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  signIn: (data) => request('/auth/signin', { method: 'POST', body: JSON.stringify(data) }),
  signOut: () => request('/auth/signout', { method: 'POST' }),
  me: () => request('/auth/me'),

  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),

  getExpenses: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/expenses${qs ? `?${qs}` : ''}`);
  },
  getSummary: () => request('/expenses/summary'),
  createExpense: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
};
