import { Router } from 'express';
import { adminService } from '../services/admin-service';

const router = Router();

// CRM Accounts
router.get('/accounts', async (req, res) => {
  try {
    // Return mock data with comprehensive CRM account information
    const mockAccounts = [
      {
        id: 1,
        accountName: 'Genesis Capital',
        accountType: 'otc',
        dealValue: '5000000',
        stage: 'demo',
        priority: 'high',
        contactInfo: {
          primaryContact: 'Sarah Johnson',
          email: 'sarah@genesiscapital.com',
          phone: '+1-555-0123',
          company: 'Genesis Capital LLC'
        },
        createdAt: new Date().toISOString(),
        lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: 2,
        accountName: 'Quantum Hedge Fund',
        accountType: 'vip',
        dealValue: '2500000',
        stage: 'kyc',
        priority: 'medium',
        contactInfo: {
          primaryContact: 'Michael Chen',
          email: 'mchen@quantumhf.com',
          phone: '+1-555-0456',
          company: 'Quantum Hedge Fund'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        accountName: 'Stellar Partners',
        accountType: 'market_maker',
        dealValue: '8000000',
        stage: 'funded',
        priority: 'high',
        contactInfo: {
          primaryContact: 'Emma Rodriguez',
          email: 'emma@stellarpartners.com',
          phone: '+1-555-0789',
          company: 'Stellar Partners Inc'
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        accountName: 'Apex Ventures',
        accountType: 'investor',
        dealValue: '1500000',
        stage: 'new_lead',
        priority: 'medium',
        contactInfo: {
          primaryContact: 'David Kim',
          email: 'dkim@apexventures.com',
          phone: '+1-555-0321',
          company: 'Apex Ventures'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      },
      {
        id: 5,
        accountName: 'Digital Asset Solutions',
        accountType: 'partner',
        dealValue: '12000000',
        stage: 'active',
        priority: 'high',
        contactInfo: {
          primaryContact: 'Lisa Thompson',
          email: 'lisa@digitalsolutions.com',
          phone: '+1-555-0654',
          company: 'Digital Asset Solutions Ltd'
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    ];
    
    res.json(mockAccounts);
  } catch (error) {
    console.error('Error fetching CRM accounts:', error);
    res.status(500).json({ error: 'Failed to fetch CRM accounts' });
  }
});

router.get('/accounts/:stage', async (req, res) => {
  try {
    const { stage } = req.params;
    const accounts = await adminService.getAccountsByStage(stage);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts by stage:', error);
    res.status(500).json({ error: 'Failed to fetch accounts by stage' });
  }
});

router.post('/accounts', async (req, res) => {
  try {
    const accountData = req.body;
    const account = await adminService.createCrmAccount(accountData);
    res.json(account);
  } catch (error) {
    console.error('Error creating CRM account:', error);
    res.status(500).json({ error: 'Failed to create CRM account' });
  }
});

router.put('/accounts/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const account = await adminService.updateAccountStage(parseInt(id), stage);
    res.json(account);
  } catch (error) {
    console.error('Error updating account stage:', error);
    res.status(500).json({ error: 'Failed to update account stage' });
  }
});

// Communications
router.get('/communications', async (req, res) => {
  try {
    // Return mock communication data
    const mockCommunications = [
      {
        id: 1,
        accountId: 1,
        communicationType: 'email',
        subject: 'OTC Partnership Discussion',
        content: 'Discussed volume requirements and fee structure',
        participants: ['sarah@genesiscapital.com', 'sales@nebulax.com'],
        followUpRequired: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        accountId: 2,
        communicationType: 'call',
        subject: 'Discovery Call',
        content: 'Initial discussion about market making services',
        participants: ['mchen@quantumhf.com', 'bd@nebulax.com'],
        followUpRequired: true,
        followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(mockCommunications);
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
});

router.get('/communications/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const communications = await adminService.getCommunicationsByAccount(parseInt(accountId));
    res.json(communications);
  } catch (error) {
    console.error('Error fetching account communications:', error);
    res.status(500).json({ error: 'Failed to fetch account communications' });
  }
});

router.post('/communications', async (req, res) => {
  try {
    const commData = req.body;
    const communication = await adminService.createCommunication(commData);
    res.json(communication);
  } catch (error) {
    console.error('Error creating communication:', error);
    res.status(500).json({ error: 'Failed to create communication' });
  }
});

router.get('/follow-ups', async (req, res) => {
  try {
    const followUps = await adminService.getFollowUpCommunications();
    res.json(followUps);
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ error: 'Failed to fetch follow-ups' });
  }
});

// Regulatory Communications
router.get('/regulatory', async (req, res) => {
  try {
    // Return mock regulatory communication data
    const mockRegulatory = [
      {
        id: 1,
        regulator: 'FCA',
        communicationType: 'filing',
        subject: 'Quarterly Compliance Report',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'compliance@nebulax.com',
        responseRequired: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        regulator: 'VARA',
        communicationType: 'inquiry',
        subject: 'KYC Process Review',
        status: 'responded',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'legal@nebulax.com',
        responseRequired: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(mockRegulatory);
  } catch (error) {
    console.error('Error fetching regulatory communications:', error);
    res.status(500).json({ error: 'Failed to fetch regulatory communications' });
  }
});

router.get('/regulatory/deadlines', async (req, res) => {
  try {
    const deadlines = await adminService.getUpcomingRegulatoryDeadlines();
    res.json(deadlines);
  } catch (error) {
    console.error('Error fetching regulatory deadlines:', error);
    res.status(500).json({ error: 'Failed to fetch regulatory deadlines' });
  }
});

router.post('/regulatory', async (req, res) => {
  try {
    const regulatoryData = req.body;
    const regulatory = await adminService.createRegulatoryComm(regulatoryData);
    res.json(regulatory);
  } catch (error) {
    console.error('Error creating regulatory communication:', error);
    res.status(500).json({ error: 'Failed to create regulatory communication' });
  }
});

// Contract Tracking
router.get('/contracts', async (req, res) => {
  try {
    // Return mock contract data
    const mockContracts = [
      {
        id: 1,
        contractType: 'saft',
        contractName: 'Genesis Capital SAFT Agreement',
        counterparty: 'Genesis Capital LLC',
        accountId: 1,
        status: 'signed',
        contractValue: '5000000',
        currency: 'USD',
        tokenDetails: {
          tokenSymbol: 'NEBX',
          allocation: '5000000',
          vestingSchedule: [
            { date: '2025-07-01', percentage: 25, amount: '1250000' },
            { date: '2025-10-01', percentage: 25, amount: '1250000' },
            { date: '2026-01-01', percentage: 25, amount: '1250000' },
            { date: '2026-04-01', percentage: 25, amount: '1250000' }
          ]
        },
        keyDates: {
          signedDate: '2025-06-15',
          effectiveDate: '2025-07-01',
          expiryDate: '2026-06-30',
          nextVesting: '2025-07-01'
        },
        assignedLegal: 'legal@nebulax.com',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        contractType: 'partnership',
        contractName: 'Digital Asset Solutions Partnership MOU',
        counterparty: 'Digital Asset Solutions Ltd',
        accountId: 5,
        status: 'active',
        contractValue: '12000000',
        currency: 'USD',
        keyDates: {
          signedDate: '2025-05-01',
          effectiveDate: '2025-05-15',
          expiryDate: '2026-05-14',
          nextReview: '2025-11-15'
        },
        assignedLegal: 'partnerships@nebulax.com',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json(mockContracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

router.get('/contracts/vesting', async (req, res) => {
  try {
    const vestingEvents = await adminService.getUpcomingVestingEvents();
    res.json(vestingEvents);
  } catch (error) {
    console.error('Error fetching vesting events:', error);
    res.status(500).json({ error: 'Failed to fetch vesting events' });
  }
});

router.post('/contracts', async (req, res) => {
  try {
    const contractData = req.body;
    const contract = await adminService.createContractTracking(contractData);
    res.json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

export default router;