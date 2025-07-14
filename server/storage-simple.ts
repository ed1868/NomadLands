import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users,
  agents,
  waitlistUsers,
  contributorApplications,
  type User,
  type UpsertUser,
  type Agent,
  type InsertAgent,
  type WaitlistUser,
  type InsertWaitlistUser,
  type ContributorApplication,
  type InsertContributorApplication,
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
  
  // Waitlist operations
  getWaitlistUserByEmail(email: string): Promise<WaitlistUser | undefined>;
  createWaitlistUser(user: InsertWaitlistUser): Promise<WaitlistUser>;
  updateWaitlistUserRush(email: string, paymentIntentId: string, amount: number): Promise<WaitlistUser>;
  getWaitlistCount(): Promise<number>;
  getWaitlistStats(): Promise<{ totalUsers: number; engineerUsers: number; rushUsers: number; }>;
  
  // Contributor applications
  createContributorApplication(application: InsertContributorApplication): Promise<ContributorApplication>;
  getContributorApplications(): Promise<ContributorApplication[]>;
  
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
    return ["productivity", "marketing", "development", "analytics", "automation"];
  }

  // Initialize database with sample agents
  async seedAgents(): Promise<void> {
    try {
      const existingAgents = await this.getAllAgents();
      if (existingAgents.length > 0) return;

      const seedAgents = [
        {
          name: "Email Classification Agent",
          description: "Automatically categorizes and prioritizes incoming emails using AI-powered natural language processing.",
          category: "productivity",
          price: "15.00",
          features: ["Email categorization", "Priority scoring", "Auto-labeling", "Smart filtering"],
          tools: ["email", "classification", "automation"],
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
          tools: ["aws", "azure", "gcp", "monitoring"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a cloud resource management agent that helps optimize infrastructure costs and performance.",
          tags: ["cloud", "development", "optimization"],
          createdBy: "system",
          isActive: true,
          styling: {
            gradientFrom: "#10b981",
            gradientTo: "#059669"
          }
        }
      ];

      await db.insert(agents).values(seedAgents);
    } catch (error) {
      console.error("Error seeding agents:", error);
    }
  }

  // Waitlist operations
  async getWaitlistUserByEmail(email: string): Promise<WaitlistUser | undefined> {
    try {
      const [user] = await db.select().from(waitlistUsers).where(eq(waitlistUsers.email, email));
      return user;
    } catch (error) {
      console.error('Error fetching waitlist user by email:', error);
      return undefined;
    }
  }

  async createWaitlistUser(user: InsertWaitlistUser): Promise<WaitlistUser> {
    const [newUser] = await db.insert(waitlistUsers).values(user).returning();
    return newUser;
  }

  async updateWaitlistUserRush(email: string, paymentIntentId: string, amount: number): Promise<WaitlistUser> {
    // Calculate effective position (50% reduction for rush users)
    const currentUser = await this.getWaitlistUserByEmail(email);
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    const effectivePosition = Math.ceil(currentUser.position / 2);
    
    const [updatedUser] = await db
      .update(waitlistUsers)
      .set({ 
        hasPaidRush: true,
        stripePaymentIntentId: paymentIntentId,
        rushPaymentAmount: amount,
        effectivePosition,
        updatedAt: new Date()
      })
      .where(eq(waitlistUsers.email, email))
      .returning();
    return updatedUser;
  }

  async getWaitlistCount(): Promise<number> {
    try {
      const result = await db.execute(`SELECT COUNT(*) as count FROM waitlist_users`);
      return parseInt(result.rows[0]?.count as string) || 0;
    } catch (error) {
      console.error('Error getting waitlist count:', error);
      return 0;
    }
  }

  async getWaitlistStats(): Promise<{ totalUsers: number; engineerUsers: number; rushUsers: number; }> {
    try {
      const totalResult = await db.execute(`SELECT COUNT(*) as count FROM waitlist_users`);
      const engineerResult = await db.execute(`SELECT COUNT(*) as count FROM waitlist_users WHERE is_engineer = true`);
      const rushResult = await db.execute(`SELECT COUNT(*) as count FROM waitlist_users WHERE has_paid_rush = true`);
      
      return {
        totalUsers: parseInt(totalResult.rows[0]?.count as string) || 0,
        engineerUsers: parseInt(engineerResult.rows[0]?.count as string) || 0,
        rushUsers: parseInt(rushResult.rows[0]?.count as string) || 0,
      };
    } catch (error) {
      console.error('Error getting waitlist stats:', error);
      return { totalUsers: 0, engineerUsers: 0, rushUsers: 0 };
    }
  }

  async createContributorApplication(application: InsertContributorApplication): Promise<ContributorApplication> {
    const [newApplication] = await db.insert(contributorApplications).values(application).returning();
    return newApplication;
  }

  async getContributorApplications(): Promise<ContributorApplication[]> {
    try {
      const applications = await db.select().from(contributorApplications);
      return applications;
    } catch (error) {
      console.error('Error fetching contributor applications:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();