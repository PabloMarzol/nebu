import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { supportTickets, supportMessages, supportCategories } from '@shared/schema';
import { eq, desc, sql } from 'drizzle-orm';

const router = Router();

// Get all support tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Failed to fetch support tickets' });
  }
});

// Get single support ticket with messages
router.get('/tickets/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, ticketId));
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const messages = await db.select().from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(supportMessages.createdAt);
    
    res.json({ ticket, messages });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ error: 'Failed to fetch support ticket' });
  }
});

// Create new support ticket
router.post('/tickets', async (req, res) => {
  try {
    const { subject, description, category, priority, userEmail, userName } = req.body;
    
    const validation = z.object({
      subject: z.string().min(1).max(500),
      description: z.string().min(1),
      category: z.string().min(1).max(100),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      userEmail: z.string().email(),
      userName: z.string().min(1).max(255)
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.errors });
    }
    
    const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;
    const userId = req.user?.id || 'guest';
    
    const [ticket] = await db.insert(supportTickets).values({
      ticketNumber,
      userId,
      userEmail,
      userName,
      subject,
      description,
      category,
      priority,
      status: 'open'
    }).returning();
    
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

// Add message to ticket
router.post('/tickets/:id/messages', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const { message, senderType = 'user' } = req.body;
    
    const validation = z.object({
      message: z.string().min(1),
      senderType: z.enum(['user', 'agent', 'system']).default('user')
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.errors });
    }
    
    const senderId = req.user?.id || 'guest';
    const senderName = req.user?.name || 'Guest User';
    
    const [newMessage] = await db.insert(supportMessages).values({
      ticketId,
      senderId,
      senderName,
      senderType,
      message
    }).returning();
    
    // Update ticket's last response time
    await db.update(supportTickets)
      .set({ lastResponseAt: new Date() })
      .where(eq(supportTickets.id, ticketId));
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update ticket status
router.patch('/tickets/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const { status, assignedTo } = req.body;
    
    const validation = z.object({
      status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
      assignedTo: z.string().optional()
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.errors });
    }
    
    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (status === 'resolved') updateData.resolvedAt = new Date();
    
    const [ticket] = await db.update(supportTickets)
      .set(updateData)
      .where(eq(supportTickets.id, ticketId))
      .returning();
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Create support category
router.post('/categories', async (req, res) => {
  try {
    const { name, description, color, sortOrder } = req.body;
    
    const validation = z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      color: z.string().optional(),
      sortOrder: z.number().optional()
    }).safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.errors });
    }
    
    const [category] = await db.insert(supportCategories).values({
      name,
      description,
      color: color || '#3b82f6',
      sortOrder: sortOrder || 0
    }).returning();
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Get support categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.select().from(supportCategories)
      .where(eq(supportCategories.isActive, true))
      .orderBy(supportCategories.sortOrder);
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get support dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await db.select({
      totalTickets: sql<number>`count(*)`,
      openTickets: sql<number>`count(case when status = 'open' then 1 end)`,
      inProgressTickets: sql<number>`count(case when status = 'in_progress' then 1 end)`,
      resolvedTickets: sql<number>`count(case when status = 'resolved' then 1 end)`,
      closedTickets: sql<number>`count(case when status = 'closed' then 1 end)`
    }).from(supportTickets);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;