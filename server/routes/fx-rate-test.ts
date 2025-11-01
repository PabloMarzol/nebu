import { Router } from 'express';
import { fxSwapService } from '../services/fx_swap_service';

const router = Router();

/**
 * Test FX rate fetching with detailed logging
 * GET /api/test/fx-rate?from=GBP&to=USD
 */
router.get('/fx-rate', async (req, res) => {
  try {
    const { from = 'GBP', to = 'USD' } = req.query;
    
    console.log(`[FX Rate Test] Testing rate fetch for ${from} to ${to}`);
    
    // Test each source individually
    const results: any = {};
    
    // Test Chainlink
    try {
