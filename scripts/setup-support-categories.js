import { db } from '../server/db.js';
import { supportCategories } from '../shared/schema.js';

async function setupSupportCategories() {
  try {
    console.log('Setting up support categories...');
    
    const categories = [
      {
        name: 'Technical Support',
        description: 'Platform issues, login problems, and technical difficulties',
        color: '#3b82f6',
        sortOrder: 1
      },
      {
        name: 'Trading Support',
        description: 'Questions about trading, orders, and market operations',
        color: '#10b981',
        sortOrder: 2
      },
      {
        name: 'Account & KYC',
        description: 'Account verification, KYC issues, and profile management',
        color: '#f59e0b',
        sortOrder: 3
      },
      {
        name: 'Payments & Deposits',
        description: 'Deposit issues, withdrawal problems, and payment questions',
        color: '#ef4444',
        sortOrder: 4
      },
      {
        name: 'General Inquiry',
        description: 'General questions and platform information',
        color: '#8b5cf6',
        sortOrder: 5
      },
      {
        name: 'Bug Report',
        description: 'Report platform bugs and unexpected behavior',
        color: '#f97316',
        sortOrder: 6
      }
    ];

    for (const category of categories) {
      await db.insert(supportCategories).values(category);
      console.log(`Created category: ${category.name}`);
    }

    console.log('Support categories setup completed successfully!');
  } catch (error) {
    console.error('Error setting up support categories:', error);
  }
}

setupSupportCategories();