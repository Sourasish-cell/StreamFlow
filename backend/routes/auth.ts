import { Router, Request, Response } from 'express';
const router = Router();

router.post('/login', (req: Request, res: Response) => {
  // TODO: Implement login logic
  res.json({ message: 'Login endpoint' });
});

router.post('/signup', (req: Request, res: Response) => {
  // TODO: Implement signup logic
  res.json({ message: 'Signup endpoint' });
});

export default router; 