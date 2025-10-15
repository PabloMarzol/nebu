import { Router } from "express";
import { supportStorage } from "./support-storage";
import { 
  insertSupportTicketSchema, 
  insertSupportMessageSchema,
  insertSupportCategorySchema,
  insertSupportAgentSchema,
  insertKnowledgeBaseSchema
} from "@shared/support-schema";
import { z } from "zod";

const router = Router();

// Public routes (no authentication required)
router.get("/categories", async (req, res) => {
  try {
    const categories = await supportStorage.getCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/knowledge-base/search", async (req, res) => {
  try {
    const { q, category } = req.query;
    
    let articles;
    if (q) {
      articles = await supportStorage.searchKnowledgeBase(q as string);
    } else if (category) {
      articles = await supportStorage.getKnowledgeBaseByCategory(category as string);
    } else {
      return res.status(400).json({ error: "Query or category parameter required" });
    }
    
    res.json(articles);
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    res.status(500).json({ error: "Failed to search knowledge base" });
  }
});

router.post("/knowledge-base/:id/view", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await supportStorage.incrementArticleView(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ error: "Failed to increment view count" });
  }
});

// User routes (basic authentication)
router.post("/tickets", async (req, res) => {
  try {
    const ticketData = insertSupportTicketSchema.parse({
      ...req.body,
      userId: req.body.userId || "guest",
      userEmail: req.body.userEmail || "guest@example.com",
      userName: req.body.userName || "Guest User"
    });
    
    const ticket = await supportStorage.createTicket(ticketData);
    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating ticket:", error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

router.get("/tickets/:ticketNumber", async (req, res) => {
  try {
    const ticket = await supportStorage.getTicketByNumber(req.params.ticketNumber);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    const messages = await supportStorage.getTicketMessages(ticket.id);
    res.json({ ticket, messages });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

router.post("/tickets/:ticketId/messages", async (req, res) => {
  try {
    const ticketId = parseInt(req.params.ticketId);
    const messageData = insertSupportMessageSchema.parse({
      ...req.body,
      ticketId,
      senderId: req.body.senderId || "guest",
      senderName: req.body.senderName || "Guest User",
      senderType: req.body.senderType || "user"
    });
    
    const message = await supportStorage.createMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

router.get("/user/:userId/tickets", async (req, res) => {
  try {
    const tickets = await supportStorage.getUserTickets(req.params.userId);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
});

// Admin routes (enhanced authentication would be added here)
router.get("/admin/tickets", async (req, res) => {
  try {
    const { status, priority, category, assignedTo, page, limit } = req.query;
    
    const result = await supportStorage.getTickets({
      status: status as string,
      priority: priority as string,
      category: category as string,
      assignedTo: assignedTo as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    res.json(result);
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.put("/admin/tickets/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const updated = await supportStorage.updateTicket(id, updates);
    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

router.post("/admin/tickets/:id/assign", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { agentId } = req.body;
    
    const success = await supportStorage.assignTicket(id, agentId);
    if (!success) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    res.status(500).json({ error: "Failed to assign ticket" });
  }
});

router.get("/admin/agents", async (req, res) => {
  try {
    const agents = await supportStorage.getAgents();
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

router.post("/admin/agents", async (req, res) => {
  try {
    const agentData = insertSupportAgentSchema.parse(req.body);
    const agent = await supportStorage.createAgent(agentData);
    res.status(201).json(agent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating agent:", error);
    res.status(500).json({ error: "Failed to create agent" });
  }
});

router.post("/admin/categories", async (req, res) => {
  try {
    const categoryData = insertSupportCategorySchema.parse(req.body);
    const category = await supportStorage.createCategory(categoryData);
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.post("/admin/knowledge-base", async (req, res) => {
  try {
    const articleData = insertKnowledgeBaseSchema.parse(req.body);
    const article = await supportStorage.createKnowledgeBaseArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating knowledge base article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

router.get("/admin/stats", async (req, res) => {
  try {
    const stats = await supportStorage.getTicketStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;