/**
 * Karma Recalculation Job
 *
 * Safety-net that recomputes every user's karma from scratch.
 * Run on-demand or via cron to correct any drift from incremental updates.
 *
 * Usage (from server code):
 *   import { runKarmaRecalc } from './jobs/karmaRecalc.job.js';
 *   await runKarmaRecalc();          // all users
 *   await runKarmaRecalc([1, 42]);   // specific users
 */

import User from '../features/user/user.model.js';
import { recalculateKarma } from '../features/karma/karma.service.js';

/**
 * Recalculate karma for all users, or a specific set.
 *
 * @param {number[]|null} userIds - If provided, only recalculate these users.
 * @returns {Promise<{ processed: number, errors: number }>}
 */
export async function runKarmaRecalc(userIds = null) {
  let users;

  if (userIds && userIds.length > 0) {
    users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'username', 'karma'],
    });
  } else {
    users = await User.findAll({
      attributes: ['id', 'username', 'karma'],
    });
  }

  console.log(`[KarmaRecalc] Starting recalculation for ${users.length} user(s)...`);

  let processed = 0;
  let errors = 0;

  for (const user of users) {
    try {
      const oldKarma = user.karma;
      const newKarma = await recalculateKarma(user.id);

      if (oldKarma !== newKarma) {
        console.log(`[KarmaRecalc] ${user.username}: ${oldKarma} → ${newKarma} (Δ${newKarma - oldKarma > 0 ? '+' : ''}${newKarma - oldKarma})`);
      }

      processed++;
    } catch (err) {
      console.error(`[KarmaRecalc] Failed for user ${user.id} (${user.username}):`, err.message);
      errors++;
    }
  }

  console.log(`[KarmaRecalc] Done. Processed: ${processed}, Errors: ${errors}`);
  return { processed, errors };
}
