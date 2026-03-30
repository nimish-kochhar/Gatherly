import api from './api.js';

export const postService = {
  /**
   * Fetch posts for the feed.
   * @param {Object} params - { sort, limit, offset }
   */
  list: (params = {}) => api.get('/posts', { params }),
};
