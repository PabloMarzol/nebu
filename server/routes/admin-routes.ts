import { Router } from 'express';
import { adminService } from '../services/admin-service';

const router = Router();

// Dashboard Stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// User Forensics
router.get('/user-forensics', async (req, res) => {
  try {
    // Return mock data for now - replace with actual implementation
    const mockForensics = [
      {
        id: 1,
        userId: 'user1',
        loginHistory: [],
        walletLinks: [],
        activityTimeline: [],
        riskScore: '75.5',
        behaviorPatterns: { structuring: false, rapidMovements: true, suspiciousPatterns: [] },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    res.json(mockForensics);
  } catch (error) {
    console.error('Error fetching user forensics:', error);
    res.status(500).json({ error: 'Failed to fetch user forensics' });
  }
});

router.get('/user-forensics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const forensics = await adminService.getUserForensics(userId);
    if (!forensics) {
      return res.status(404).json({ error: 'User forensics not found' });
    }
    res.json(forensics);
  } catch (error) {
    console.error('Error fetching user forensics:', error);
    res.status(500).json({ error: 'Failed to fetch user forensics' });
  }
});

// AML Risk Profiles
router.get('/high-risk-users', async (req, res) => {
  try {
    const highRiskUsers = await adminService.getAllHighRiskUsers();
    res.json(highRiskUsers);
  } catch (error) {
    console.error('Error fetching high risk users:', error);
    res.status(500).json({ error: 'Failed to fetch high risk users' });
  }
});

router.get('/aml-risk/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const riskProfile = await adminService.getAmlRiskProfile(userId);
    if (!riskProfile) {
      return res.status(404).json({ error: 'Risk profile not found' });
    }
    res.json(riskProfile);
  } catch (error) {
    console.error('Error fetching risk profile:', error);
    res.status(500).json({ error: 'Failed to fetch risk profile' });
  }
});

router.put('/aml-risk/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { score, flags } = req.body;
    const updatedProfile = await adminService.updateRiskScore(userId, score, flags);
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating risk score:', error);
    res.status(500).json({ error: 'Failed to update risk score' });
  }
});

// Transaction Monitoring
router.get('/flagged-transactions', async (req, res) => {
  try {
    const flaggedTransactions = await adminService.getFlaggedTransactions();
    res.json(flaggedTransactions);
  } catch (error) {
    console.error('Error fetching flagged transactions:', error);
    res.status(500).json({ error: 'Failed to fetch flagged transactions' });
  }
});

router.get('/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await adminService.getTransactionsByUser(userId);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ error: 'Failed to fetch user transactions' });
  }
});

router.put('/transactions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const transaction = await adminService.approveTransaction(parseInt(id), approvedBy);
    res.json(transaction);
  } catch (error) {
    console.error('Error approving transaction:', error);
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

router.put('/transactions/:id/flag', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, reviewedBy } = req.body;
    const transaction = await adminService.flagTransaction(parseInt(id), reason, reviewedBy);
    res.json(transaction);
  } catch (error) {
    console.error('Error flagging transaction:', error);
    res.status(500).json({ error: 'Failed to flag transaction' });
  }
});

// Compliance Reports
router.get('/compliance-reports', async (req, res) => {
  try {
    const reports = await adminService.getComplianceReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching compliance reports:', error);
    res.status(500).json({ error: 'Failed to fetch compliance reports' });
  }
});

router.post('/compliance-reports', async (req, res) => {
  try {
    const reportData = req.body;
    const report = await adminService.createComplianceReport(reportData);
    res.json(report);
  } catch (error) {
    console.error('Error creating compliance report:', error);
    res.status(500).json({ error: 'Failed to create compliance report' });
  }
});

router.post('/compliance-reports/:id/generate-pack', async (req, res) => {
  try {
    const { id } = req.params;
    const packPath = await adminService.generateCompliancePack(parseInt(id));
    res.json({ packPath });
  } catch (error) {
    console.error('Error generating compliance pack:', error);
    res.status(500).json({ error: 'Failed to generate compliance pack' });
  }
});

// Wallet Operations
router.get('/wallet-operations', async (req, res) => {
  try {
    const operations = await adminService.getWalletOperations();
    res.json(operations);
  } catch (error) {
    console.error('Error fetching wallet operations:', error);
    res.status(500).json({ error: 'Failed to fetch wallet operations' });
  }
});

router.get('/pending-approvals', async (req, res) => {
  try {
    const pendingApprovals = await adminService.getPendingApprovals();
    res.json(pendingApprovals);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

router.put('/wallet-operations/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    const operation = await adminService.approveWalletOperation(parseInt(id), approvedBy);
    res.json(operation);
  } catch (error) {
    console.error('Error approving wallet operation:', error);
    res.status(500).json({ error: 'Failed to approve wallet operation' });
  }
});

// Support Tickets
router.get('/support-tickets', async (req, res) => {
  try {
    const tickets = await adminService.getSupportTickets();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Failed to fetch support tickets' });
  }
});

router.get('/support-tickets/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const tickets = await adminService.getTicketsByCategory(category);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets by category:', error);
    res.status(500).json({ error: 'Failed to fetch tickets by category' });
  }
});

router.post('/support-tickets', async (req, res) => {
  try {
    const ticketData = req.body;
    const ticket = await adminService.createSupportTicket(ticketData);
    res.json(ticket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

router.put('/support-tickets/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const ticket = await adminService.assignTicket(parseInt(id), assignedTo);
    res.json(ticket);
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
});

router.put('/support-tickets/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const ticket = await adminService.resolveTicket(parseInt(id), resolutionNotes);
    res.json(ticket);
  } catch (error) {
    console.error('Error resolving ticket:', error);
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
});

// System Health
router.get('/system-health', async (req, res) => {
  try {
    const metrics = await adminService.getSystemHealthMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ error: 'Failed to fetch system health metrics' });
  }
});

router.get('/critical-alerts', async (req, res) => {
  try {
    const alerts = await adminService.getCriticalAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching critical alerts:', error);
    res.status(500).json({ error: 'Failed to fetch critical alerts' });
  }
});

router.put('/alerts/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;
    const alert = await adminService.acknowledgeAlert(parseInt(id), acknowledgedBy);
    res.json(alert);
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

export default router;