import api from './api.js';

export const communityService = {
  /**
   * List communities with optional search and pagination.
   * @param {Object} params - { search, limit, offset }
   */
  list: (params = {}) => api.get('/communities', { params }),

  /**
   * Get a single community by slug.
   * @param {string} slug
   */
  getBySlug: (slug) => api.get(`/communities/${slug}`),

  /**
   * Create a new community.
   * @param {Object} data - { name, description, visibility }
   */
  create: (data) => api.post('/communities', data),

  /**
   * Update a community.
   * @param {number} id
   * @param {Object} data - { name, description, visibility }
   */
  update: (id, data) => api.put(`/communities/${id}`, data),

  /**
   * Delete a community.
   * @param {number} id
   */
  remove: (id) => api.delete(`/communities/${id}`),

  /**
   * Join a community.
   * @param {number} id
   */
  join: (id) => api.post(`/communities/${id}/join`),

  /**
   * Leave a community.
   * @param {number} id
   */
  leave: (id) => api.delete(`/communities/${id}/join`),

  /**
   * Check current user's membership in a community.
   * @param {number} id
   */
  checkMembership: (id) => api.get(`/communities/${id}/membership`),

  /**
   * Get communities the current user has joined.
   */
  myJoined: () => api.get('/communities/me/joined'),
};
