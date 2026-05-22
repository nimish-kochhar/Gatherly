import api from './api.js';

export const userService = {
  /**
   * Fetch a user's public profile.
   * @param {string} username
   * @returns {Promise<{ data: { username, bio, createdAt, karma, postCount, commentCount } }>}
   */
  getProfile: (username) => api.get(`/users/${username}`),

  /**
   * Fetch a user's karma breakdown (post karma, comment karma, creation bonuses).
   * @param {string} username
   * @returns {Promise<{ data: { postKarma, commentKarma, creationBonus, total } }>}
   */
  getKarmaBreakdown: (username) => api.get(`/users/${username}/karma`),
};
