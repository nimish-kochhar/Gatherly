import api from './api.js';

export const postService = {
  /**
   * Fetch posts for the feed.
   * @param {Object} params - { sort, limit, offset, communityId }
   */
  list: (params = {}) => api.get('/posts', { params }),

  /**
   * Fetch a single post by ID.
   * @param {number|string} id
   */
  getById: (id) => api.get(`/posts/${id}`),

  /**
   * Create a new post (requires authentication).
   * @param {{ title: string, body?: string, communityId: number }} data
   */
  create: (data) => api.post('/posts', data),
};
