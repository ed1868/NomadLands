import {
  users,
  agents,
  userPurchases,
  transactions,
  type User,
  type Agent,
  type UpsertUser,
  type UserPurchase,
  type Transaction,
  type InsertPurchase,
  type InsertTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { ethers } from "ethers";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Agent operations
  getAllAgents(): Promise<Agent[]>;
  getAgentsByCategory(category: string): Promise<Agent[]>;
  getFeaturedAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  
  // Purchase operations
  getUserPurchases(userId: string): Promise<(UserPurchase & { agent: Agent })[]>;
  createPurchase(purchase: InsertPurchase): Promise<UserPurchase>;
  hasUserPurchased(userId: string, agentId: number): Promise<boolean>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(transactionHash: string, status: string, blockNumber?: number): Promise<void>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress.toLowerCase()));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        walletAddress: userData.walletAddress.toLowerCase(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          ...userData,
          walletAddress: userData.walletAddress.toLowerCase(),
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
    return await db.select().from(agents).where(eq(agents.featured, true));
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  // Purchase operations
  async getUserPurchases(userId: string): Promise<(UserPurchase & { agent: Agent })[]> {
    return await db
      .select()
      .from(userPurchases)
      .innerJoin(agents, eq(userPurchases.agentId, agents.id))
      .where(eq(userPurchases.userId, userId))
      .then(results => results.map(row => ({
        ...row.user_purchases,
        agent: row.agents
      })));
  }

  async createPurchase(purchase: InsertPurchase): Promise<UserPurchase> {
    const [newPurchase] = await db
      .insert(userPurchases)
      .values(purchase)
      .returning();
    return newPurchase;
  }

  async hasUserPurchased(userId: string, agentId: number): Promise<boolean> {
    const [purchase] = await db
      .select()
      .from(userPurchases)
      .where(and(eq(userPurchases.userId, userId), eq(userPurchases.agentId, agentId)))
      .limit(1);
    return !!purchase;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateTransactionStatus(transactionHash: string, status: string, blockNumber?: number): Promise<void> {
    await db
      .update(transactions)
      .set({ 
        status, 
        blockNumber,
        updatedAt: new Date()
      })
      .where(eq(transactions.transactionHash, transactionHash));
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.createdAt);
  }

  // Initialize database with sample agents
  async seedAgents(): Promise<void> {
    const existingAgents = await this.getAllAgents();
    if (existingAgents.length > 0) return;

    const seedAgents = [
      {
        name: "Mindful Email Curator",
        description: "Transform your inbox into a personalized news digest with AI-powered email categorization and intelligent priority scoring.",
        category: "Email",
        price: 29,
        priceInWei: ethers.parseEther("0.01").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1001,
        icon: "Mail",
        features: ["Smart categorization", "Priority scoring", "Automated responses", "Calendar integration"],
        gradientFrom: "emerald-600",
        gradientTo: "emerald-400",
        featured: true
      },
      {
        name: "Cloud Resource Optimizer",
        description: "Automatically monitor and optimize your cloud infrastructure costs while maintaining peak performance across all services.",
        category: "Cloud",
        price: 79,
        priceInWei: ethers.parseEther("0.025").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1002,
        icon: "CloudLightning",
        features: ["Cost optimization", "Performance monitoring", "Auto-scaling", "Resource allocation"],
        gradientFrom: "blue-600",
        gradientTo: "blue-400",
        featured: false
      },
      {
        name: "Social Media Strategist",
        description: "Create engaging content calendars and automate your social presence with data-driven insights and trend analysis.",
        category: "Social",
        price: 49,
        priceInWei: ethers.parseEther("0.015").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1003,
        icon: "Users",
        features: ["Content planning", "Trend analysis", "Automated posting", "Analytics dashboard"],
        gradientFrom: "purple-600",
        gradientTo: "purple-400",
        featured: true
      },
      {
        name: "Document Intelligence Engine",
        description: "Extract valuable insights from documents, contracts, and reports using advanced natural language processing.",
        category: "Analytics",
        price: 99,
        priceInWei: ethers.parseEther("0.03").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1004,
        icon: "FileText",
        features: ["Document parsing", "Key extraction", "Sentiment analysis", "Report generation"],
        gradientFrom: "orange-600",
        gradientTo: "orange-400",
        featured: false
      },
      {
        name: "Customer Support Oracle",
        description: "Provide 24/7 intelligent customer support with contextual responses and seamless human handoff capabilities.",
        category: "Support",
        price: 149,
        priceInWei: ethers.parseEther("0.05").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1005,
        icon: "MessageCircle",
        features: ["24/7 availability", "Context awareness", "Human handoff", "Multi-language support"],
        gradientFrom: "green-600",
        gradientTo: "green-400",
        featured: true
      },
      {
        name: "Sales Pipeline Navigator",
        description: "Accelerate your sales process with intelligent lead scoring, automated follow-ups, and predictive analytics.",
        category: "Sales",
        price: 199,
        priceInWei: ethers.parseEther("0.065").toString(),
        contractAddress: "0x1234567890123456789012345678901234567890",
        tokenId: 1006,
        icon: "TrendingUp",
        features: ["Lead scoring", "Automated follow-ups", "Pipeline analytics", "CRM integration"],
        gradientFrom: "red-600",
        gradientTo: "red-400",
        featured: false
      }
    ];

    await db.insert(agents).values(seedAgents);
  }
}

export const storage = new DatabaseStorage();