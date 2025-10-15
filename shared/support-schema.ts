import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const supportTickets = pgTable("support_tickets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull().default("medium"),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  assignedTo: varchar("assigned_to", { length: 255 }),
  tags: text("tags").array().default([]),
  attachments: jsonb("attachments").default([]),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  lastResponseAt: timestamp("last_response_at"),
});

export const supportMessages = pgTable("support_messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  senderName: varchar("sender_name", { length: 255 }).notNull(),
  senderType: varchar("sender_type", { length: 50 }).notNull(), // 'user' or 'agent'
  message: text("message").notNull(),
  messageType: varchar("message_type", { length: 50 }).default("text"),
  attachments: jsonb("attachments").default([]),
  isInternal: boolean("is_internal").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportCategories = pgTable("support_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 20 }).default("#3b82f6"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportAgents = pgTable("support_agents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }),
  specializations: text("specializations").array().default([]),
  isActive: boolean("is_active").default(true),
  maxTickets: integer("max_tickets").default(20),
  currentTickets: integer("current_tickets").default(0),
  rating: integer("rating").default(5),
  totalResolved: integer("total_resolved").default(0),
  avgResponseTime: integer("avg_response_time").default(0), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportKnowledgeBase = pgTable("support_knowledge_base", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").default(true),
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  authorId: varchar("author_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas
export const insertSupportTicketSchema = createInsertSchema(supportTickets, {
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "pending", "resolved", "closed"]),
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages, {
  message: z.string().min(1, "Message cannot be empty"),
  senderType: z.enum(["user", "agent"]),
  messageType: z.enum(["text", "system", "attachment"]),
});

export const insertSupportCategorySchema = createInsertSchema(supportCategories, {
  name: z.string().min(1, "Category name is required"),
});

export const insertSupportAgentSchema = createInsertSchema(supportAgents, {
  name: z.string().min(1, "Agent name is required"),
  email: z.string().email("Valid email is required"),
});

export const insertKnowledgeBaseSchema = createInsertSchema(supportKnowledgeBase, {
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

// Types
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;
export type SupportCategory = typeof supportCategories.$inferSelect;
export type InsertSupportCategory = z.infer<typeof insertSupportCategorySchema>;
export type SupportAgent = typeof supportAgents.$inferSelect;
export type InsertSupportAgent = z.infer<typeof insertSupportAgentSchema>;
export type KnowledgeBaseArticle = typeof supportKnowledgeBase.$inferSelect;
export type InsertKnowledgeBaseArticle = z.infer<typeof insertKnowledgeBaseSchema>;