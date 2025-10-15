import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// Simple authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  // Check if user has a session (simple auth check)
  const authHeader = req.headers.authorization;
  const hasSession = req.session?.user || authHeader;
  
  if (!hasSession) {
    console.log('[API Key Auth] Unauthorized access attempt to API keys endpoint');
    return res.status(401).json({ 
      message: 'Authentication required to access API keys',
      redirect: '/auth/login'
    });
  }
  
  next();
};

// In-memory storage for demo (in production, use database)
const apiKeys = new Map();

// Generate secure API key pair
function generateApiKeyPair() {
  const keyId = 'nbx_' + crypto.randomBytes(16).toString('hex');
  const keySecret = crypto.randomBytes(32).toString('hex');
  return { keyId, keySecret };
}

// Get all API keys for a user
router.get('/api-keys', requireAuth, (req, res) => {
  try {
    // In production, this would filter by authenticated user ID
    const userKeys = Array.from(apiKeys.values()).map(key => ({
      ...key,
      keySecret: key.keySecret // In production, don't return secret after creation
    }));
    
    res.json(userKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  }
});

// Create new API key
router.post('/api-keys', requireAuth, (req, res) => {
  try {
    const { name, permissions = ['read'] } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    const { keyId, keySecret } = generateApiKeyPair();
    const apiKey = {
      id: crypto.randomUUID(),
      name: name.trim(),
      keyId,
      keySecret,
      permissions,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      usageCount: 0,
      userId: 'user-demo' // In production, use actual authenticated user ID
    };

    apiKeys.set(apiKey.id, apiKey);
    
    console.log(`[API Key] Created new API key: ${apiKey.name} (${apiKey.keyId})`);
    
    res.status(201).json(apiKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Failed to create API key' });
  }
});

// Update API key (enable/disable)
router.patch('/api-keys/:keyId', requireAuth, (req, res) => {
  try {
    const { keyId } = req.params;
    const { isActive } = req.body;
    
    const apiKey = apiKeys.get(keyId);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    apiKey.isActive = isActive;
    apiKeys.set(keyId, apiKey);
    
    console.log(`[API Key] ${isActive ? 'Enabled' : 'Disabled'} API key: ${apiKey.name}`);
    
    res.json({ message: 'API key updated successfully' });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ message: 'Failed to update API key' });
  }
});

// Delete API key
router.delete('/api-keys/:keyId', requireAuth, (req, res) => {
  try {
    const { keyId } = req.params;
    
    const apiKey = apiKeys.get(keyId);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    apiKeys.delete(keyId);
    
    console.log(`[API Key] Deleted API key: ${apiKey.name}`);
    
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  }
});

// Validate API key (for API requests)
router.post('/validate', (req, res) => {
  try {
    const { keyId, keySecret } = req.body;
    
    if (!keyId || !keySecret) {
      return res.status(400).json({ message: 'API key ID and secret are required' });
    }

    // Find API key by keyId
    const apiKey = Array.from(apiKeys.values()).find(key => key.keyId === keyId);
    
    if (!apiKey || apiKey.keySecret !== keySecret || !apiKey.isActive) {
      return res.status(401).json({ message: 'Invalid or inactive API key' });
    }

    // Update usage statistics
    apiKey.lastUsed = new Date().toISOString();
    apiKey.usageCount += 1;

    res.json({
      valid: true,
      userId: apiKey.userId,
      permissions: apiKey.permissions,
      keyName: apiKey.name
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ message: 'Failed to validate API key' });
  }
});

// API rate limiting info
router.get('/rate-limits', (req, res) => {
  res.json({
    limits: {
      read: { requests: 1000, period: 'minute' },
      trade: { requests: 100, period: 'minute' },
      withdraw: { requests: 10, period: 'hour' },
      transfer: { requests: 50, period: 'hour' }
    },
    current: {
      read: { used: 45, remaining: 955 },
      trade: { used: 12, remaining: 88 },
      withdraw: { used: 0, remaining: 10 },
      transfer: { used: 3, remaining: 47 }
    }
  });
});

export default router;