// TODO: Implement feed controller
import { getFeed } from './feed.service.js';

export async function fetchFeed(req, res, next) {
  try {
    const posts = await getFeed({
      limit: Number(req.query.limit) || 20,
      offset: Number(req.query.offset) || 0
    });

    res.json(posts);
  } catch (err) {
    console.error("FEED ERROR:", err);
    next(err);
  }
}