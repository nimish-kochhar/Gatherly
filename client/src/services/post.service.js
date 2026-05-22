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

  /**
   * Cast, toggle, or remove a vote on a post.
   * @param {number|string} postId
   * @param {'up'|'down'|null} value - 'up' to upvote, 'down' to downvote, null to remove
   * @returns {Promise<{ data: { upvotes: number, downvotes: number, userVote: string|null } }>}
   */
  vote: (postId, value) => api.put(`/posts/${postId}/vote`, { value }),

  /**
   * Fetch comments for a post.
   * @param {number|string} postId
   * @returns {Promise<{ data: { comments: Array } }>}
   */
  listComments: (postId) => api.get(`/posts/${postId}/comments`),

  /**
   * Create a comment on a post.
   * @param {number|string} postId
   * @param {{ body: string, parentId?: number|null }} data
   * @returns {Promise<{ data: { comment: Object } }>}
   */
  createComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),

  /**
   * Cast, toggle, or remove a vote on a comment.
   * @param {number|string} postId
   * @param {number|string} commentId
   * @param {'up'|'down'|null} value
   * @returns {Promise<{ data: { upvotes: number, downvotes: number, userVote: string|null } }>}
   */
  voteOnComment: (postId, commentId, value) => api.put(`/posts/${postId}/comments/${commentId}/vote`, { value }),
};
