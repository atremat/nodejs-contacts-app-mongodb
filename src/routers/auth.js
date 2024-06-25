import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerContactSchema } from '../validation/registerContactSchema.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerContactSchema),
  ctrlWrapper(registerUserController),
);

export default router;
