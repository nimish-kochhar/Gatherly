import { Router } from 'express';
import Community from './community.model.js';

const router = Router();

// CREATE COMMUNITY
router.post('/', async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const community = await Community.create({
      name,
      description,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    });

    res.status(201).json(community);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    next(err);
  }
});

export default router;