import { db } from "./db";
import { 
  supportTickets, 
  supportMessages, 
  supportCategories, 
  supportAgents, 
  supportKnowledgeBase,
  type SupportTicket,
  type InsertSupportTicket,
  type SupportMessage,
  type InsertSupportMessage,
  type SupportCategory,
  type InsertSupportCategory,
  type SupportAgent,
  type InsertSupportAgent,
  type KnowledgeBaseArticle,
  type InsertKnowledgeBaseArticle
} from "@shared/support-schema";
import { eq, desc, asc, and, or, ilike, sql } from "drizzle-orm";

export class SupportStorage {
  // Ticket operations
  async createTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const [newTicket] = await db
      .insert(supportTickets)
      .values({
        ...ticket,
        ticketNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newTicket;
  }

  async getTicketById(id: number): Promise<SupportTicket | null> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    
    return ticket || null;
  }

  async getTicketByNumber(ticketNumber: string): Promise<SupportTicket | null> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.ticketNumber, ticketNumber));
    
    return ticket || null;
  }

  async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async getTickets(filters: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ tickets: SupportTicket[]; total: number }> {
    const { status, priority, category, assignedTo, page = 1, limit = 20 } = filters;
    
    let query = db.select().from(supportTickets);
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(supportTickets);
    
    const conditions = [];
    
    if (status) conditions.push(eq(supportTickets.status, status));
    if (priority) conditions.push(eq(supportTickets.priority, priority));
    if (category) conditions.push(eq(supportTickets.category, category));
    if (assignedTo) conditions.push(eq(supportTickets.assignedTo, assignedTo));
    
    if (conditions.length > 0) {
      const whereClause = and(...conditions);
      query = query.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [tickets, [{ count }]] = await Promise.all([
      query
        .orderBy(desc(supportTickets.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      countQuery
    ]);
    
    return { tickets, total: count };
  }

  async updateTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const [updated] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    
    return updated || null;
  }

  async assignTicket(ticketId: number, agentId: string): Promise<boolean> {
    const result = await db
      .update(supportTickets)
      .set({ 
        assignedTo: agentId, 
        status: 'in_progress',
        updatedAt: new Date() 
      })
      .where(eq(supportTickets.id, ticketId));
    
    return result.rowCount > 0;
  }

  // Message operations
  async createMessage(message: InsertSupportMessage): Promise<SupportMessage> {
    const [newMessage] = await db
      .insert(supportMessages)
      .values({
        ...message,
        createdAt: new Date()
      })
      .returning();
    
    // Update ticket's last response time
    await db
      .update(supportTickets)
      .set({ 
        lastResponseAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, message.ticketId));
    
    return newMessage;
  }

  async getTicketMessages(ticketId: number): Promise<SupportMessage[]> {
    return await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(asc(supportMessages.createdAt));
  }

  // Category operations
  async getCategories(): Promise<SupportCategory[]> {
    return await db
      .select()
      .from(supportCategories)
      .where(eq(supportCategories.isActive, true))
      .orderBy(asc(supportCategories.sortOrder));
  }

  async createCategory(category: InsertSupportCategory): Promise<SupportCategory> {
    const [newCategory] = await db
      .insert(supportCategories)
      .values({
        ...category,
        createdAt: new Date()
      })
      .returning();
    
    return newCategory;
  }

  // Agent operations
  async getAgents(): Promise<SupportAgent[]> {
    return await db
      .select()
      .from(supportAgents)
      .where(eq(supportAgents.isActive, true))
      .orderBy(asc(supportAgents.name));
  }

  async createAgent(agent: InsertSupportAgent): Promise<SupportAgent> {
    const [newAgent] = await db
      .insert(supportAgents)
      .values({
        ...agent,
        createdAt: new Date()
      })
      .returning();
    
    return newAgent;
  }

  async getAgentById(userId: string): Promise<SupportAgent | null> {
    const [agent] = await db
      .select()
      .from(supportAgents)
      .where(eq(supportAgents.userId, userId));
    
    return agent || null;
  }

  // Knowledge Base operations
  async searchKnowledgeBase(query: string): Promise<KnowledgeBaseArticle[]> {
    return await db
      .select()
      .from(supportKnowledgeBase)
      .where(
        and(
          eq(supportKnowledgeBase.isPublic, true),
          or(
            ilike(supportKnowledgeBase.title, `%${query}%`),
            ilike(supportKnowledgeBase.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(supportKnowledgeBase.viewCount));
  }

  async getKnowledgeBaseByCategory(category: string): Promise<KnowledgeBaseArticle[]> {
    return await db
      .select()
      .from(supportKnowledgeBase)
      .where(
        and(
          eq(supportKnowledgeBase.isPublic, true),
          eq(supportKnowledgeBase.category, category)
        )
      )
      .orderBy(desc(supportKnowledgeBase.viewCount));
  }

  async createKnowledgeBaseArticle(article: InsertKnowledgeBaseArticle): Promise<KnowledgeBaseArticle> {
    const [newArticle] = await db
      .insert(supportKnowledgeBase)
      .values({
        ...article,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newArticle;
  }

  async incrementArticleView(id: number): Promise<void> {
    await db
      .update(supportKnowledgeBase)
      .set({ viewCount: sql`${supportKnowledgeBase.viewCount} + 1` })
      .where(eq(supportKnowledgeBase.id, id));
  }

  // Statistics
  async getTicketStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseTime: number;
  }> {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        open: sql<number>`count(case when status = 'open' then 1 end)`,
        inProgress: sql<number>`count(case when status = 'in_progress' then 1 end)`,
        resolved: sql<number>`count(case when status = 'resolved' then 1 end)`,
        avgResponseTime: sql<number>`avg(extract(epoch from (last_response_at - created_at))/60)`
      })
      .from(supportTickets);
    
    return {
      total: stats.total,
      open: stats.open,
      inProgress: stats.inProgress,
      resolved: stats.resolved,
      avgResponseTime: Math.round(stats.avgResponseTime || 0)
    };
  }
}

export const supportStorage = new SupportStorage();