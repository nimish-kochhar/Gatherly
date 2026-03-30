import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { registerSchema, loginSchema } from './auth.validator.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.json(result);
  } catch (err) {
    next(err); // pass to error middleware
  }
});
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
