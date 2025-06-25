import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  agents,
  type User,
  type UpsertUser,
  type Agent,
  type InsertAgent,
} from "@shared/schema-simple";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateLastLogin(userId: string): Promise<void>;
  
  // Agent operations
  getAllAgents(): Promise<Agent[]>;
  getAgentsByCategory(category: string): Promise<Agent[]>;
  getFeaturedAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, updates: Partial<Agent>): Promise<Agent>;
  getUserCreatedAgents(userId: string): Promise<Agent[]>;
  deleteAgent(id: number): Promise<void>;
  
  // Tags operations (placeholder)
  getAllTags?(): Promise<string[]>;
  
  // Seeding
  seedAgents(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      // Fallback to direct SQL query if Drizzle has issues
      try {
        const directResult = await db.execute(`SELECT * FROM users WHERE username = '${username}' LIMIT 1`);
        return directResult.rows[0] as User || undefined;
      } catch (directError) {
        console.error('Direct query also failed:', directError);
        return undefined;
      }
    }
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress.toLowerCase()));
    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await db.update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Agent operations
  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async getAgentsByCategory(category: string): Promise<Agent[]> {
    return await db.select().from(agents).where(eq(agents.category, category));
  }

  async getFeaturedAgents(): Promise<Agent[]> {
    try {
      const agentsResult = await db.select().from(agents).limit(6);
      return agentsResult;
    } catch (error) {
      console.error("Error fetching featured agents:", error);
      return [];
    }
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    try {
      const [agent] = await db.select().from(agents).where(eq(agents.id, id));
      return agent;
    } catch (error) {
      console.error("Error fetching agent:", error);
      return undefined;
    }
  }

  async createAgent(agentData: InsertAgent): Promise<Agent> {
    const [agent] = await db
      .insert(agents)
      .values(agentData)
      .returning();
    return agent;
  }

  async updateAgent(id: number, updates: Partial<Agent>): Promise<Agent> {
    const [agent] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return agent;
  }

  async getUserCreatedAgents(userId: string): Promise<Agent[]> {
    if (!userId) return [];
    
    return await db
      .select()
      .from(agents)
      .where(eq(agents.createdBy, userId))
      .orderBy(agents.createdAt);
  }

  async deleteAgent(id: number): Promise<void> {
    await db.delete(agents).where(eq(agents.id, id));
  }

  // Tags operations placeholder
  async getAllTags(): Promise<string[]> {
    return ["productivity", "marketing", "development", "analytics", "automation", "support", "sales", "finance", "content", "communication"];
  }

  // Initialize database with sample agents
  async seedAgents(): Promise<void> {
    try {
      const existingAgents = await this.getAllAgents();
      if (existingAgents.length > 2) return;

      // Clear existing agents if only 2 exist
      if (existingAgents.length === 2) {
        await db.delete(agents);
      }

      const seedAgents = [
        {
          name: "Email Classification Agent",
          description: "Automatically categorizes and prioritizes incoming emails using AI-powered natural language processing.",
          category: "productivity",
          price: "15.00",
          features: ["Email categorization", "Priority scoring", "Auto-labeling", "Smart filtering"],
          tools: ["gmail", "outlook", "web-search"],
          aiModel: "gpt-4o",
          systemPrompt: "You are an email classification agent that helps users organize and prioritize their emails efficiently.",
          tags: ["email", "productivity", "automation"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#3b82f6",
            gradientTo: "#1d4ed8"
          }
        },
        {
          name: "Cloud Resource Manager", 
          description: "Monitors and optimizes cloud infrastructure costs across AWS, Azure, and Google Cloud platforms.",
          category: "development",
          price: "25.00",
          features: ["Cost optimization", "Resource monitoring", "Auto-scaling", "Multi-cloud support"],
          tools: ["aws", "azure", "github"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a cloud resource management agent that helps optimize infrastructure costs and performance.",
          tags: ["cloud", "development", "optimization"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#10b981",
            gradientTo: "#059669"
          }
        },
        {
          name: "Social Media Scheduler",
          description: "Automates content posting across multiple social media platforms with optimal timing and engagement tracking.",
          category: "marketing",
          price: "20.00",
          features: ["Multi-platform posting", "Optimal timing", "Engagement analytics", "Content optimization"],
          tools: ["twitter", "instagram", "linkedin"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a social media scheduling agent that maximizes engagement through strategic content posting.",
          tags: ["social", "marketing", "automation"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#f59e0b",
            gradientTo: "#d97706"
          }
        },
        {
          name: "Customer Support Bot",
          description: "Provides 24/7 intelligent customer support with escalation to human agents when needed.",
          category: "support",
          price: "30.00",
          features: ["24/7 availability", "Multi-language support", "Smart escalation", "Ticket management"],
          tools: ["slack", "zendesk", "discord"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a customer support agent that provides helpful, empathetic assistance to users.",
          tags: ["support", "automation", "communication"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#8b5cf6",
            gradientTo: "#7c3aed"
          }
        },
        {
          name: "Code Review Assistant",
          description: "Analyzes code quality, suggests improvements, and enforces coding standards across repositories.",
          category: "development",
          price: "35.00",
          features: ["Code quality analysis", "Security scanning", "Best practices", "Automated reviews"],
          tools: ["github", "gitlab", "bitbucket"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a code review assistant that helps maintain high code quality and security standards.",
          tags: ["development", "quality", "security"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#ef4444",
            gradientTo: "#dc2626"
          }
        },
        {
          name: "Meeting Summarizer",
          description: "Automatically generates meeting summaries, action items, and follow-up tasks from recorded conversations.",
          category: "productivity",
          price: "18.00",
          features: ["Auto transcription", "Action item extraction", "Summary generation", "Calendar integration"],
          tools: ["zoom", "teams", "google-meet"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a meeting summarizer that extracts key insights and action items from conversations.",
          tags: ["meetings", "productivity", "transcription"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#06b6d4",
            gradientTo: "#0891b2"
          }
        },
        {
          name: "Finance Tracker",
          description: "Monitors expenses, categorizes transactions, and provides financial insights with budget alerts.",
          category: "analytics",
          price: "22.00",
          features: ["Expense tracking", "Budget monitoring", "Financial insights", "Alert system"],
          tools: ["stripe", "paypal", "quickbooks"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a finance tracking agent that helps users manage their money and spending habits.",
          tags: ["finance", "analytics", "budgeting"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#14b8a6",
            gradientTo: "#0d9488"
          }
        },
        {
          name: "Content Creator",
          description: "Generates engaging blog posts, social media content, and marketing copy tailored to your brand voice.",
          category: "marketing",
          price: "28.00",
          features: ["Brand voice matching", "SEO optimization", "Multi-format content", "Performance tracking"],
          tools: ["wordpress", "medium", "notion"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a content creation agent that produces engaging, brand-consistent content across platforms.",
          tags: ["content", "marketing", "writing"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#f97316",
            gradientTo: "#ea580c"
          }
        },
        {
          name: "Lead Qualification Bot",
          description: "Automatically qualifies sales leads through intelligent conversation and scoring algorithms.",
          category: "sales",
          price: "40.00",
          features: ["Lead scoring", "Automated qualification", "CRM integration", "Pipeline management"],
          tools: ["salesforce", "hubspot", "pipedrive"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a lead qualification agent that identifies high-value prospects for sales teams.",
          tags: ["sales", "leads", "crm"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#ec4899",
            gradientTo: "#db2777"
          }
        },
        {
          name: "Data Analyst",
          description: "Processes large datasets, generates insights, and creates automated reports with visualizations.",
          category: "analytics",
          price: "45.00",
          features: ["Data processing", "Insight generation", "Automated reporting", "Data visualization"],
          tools: ["google-sheets", "tableau", "powerbi"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a data analysis agent that transforms raw data into actionable business insights.",
          tags: ["data", "analytics", "visualization"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#6366f1",
            gradientTo: "#4f46e5"
          }
        }
      ];

      await db.insert(agents).values(seedAgents);
    } catch (error) {
      console.error("Error seeding agents:", error);
    }
  }
}

export const storage = new DatabaseStorage();