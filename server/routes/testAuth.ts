import { Router, Request, Response } from 'express';
import { verifyWalletAuth } from '../middleware/walletAuth';

const router = Router();

/**
 * Protected test endpoint
 */
router.get('/protected', verifyWalletAuth, (req: Request, res: Response) => {
  res.json({
    message: 'Authentication successful!',
    walletAddress: req.walletAddress,
    timestamp: new Date().toISOString(),
  });
});

export default router;