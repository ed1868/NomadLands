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
  updateUserPhone(userId: string, phoneNumber: string, verificationCode: string, expiry: Date): Promise<void>;
  verifyUserPhone(userId: string, code: string): Promise<boolean>;
  
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

  async updateUserPhone(userId: string, phoneNumber: string, verificationCode: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({
        phoneNumber,
        phoneVerificationCode: verificationCode,
        phoneVerificationExpiry: expiry,
        phoneVerified: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async verifyUserPhone(userId: string, code: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user || !user.phoneVerificationCode || !user.phoneVerificationExpiry) {
      return false;
    }

    if (new Date() > user.phoneVerificationExpiry) {
      return false;
    }

    if (user.phoneVerificationCode === code) {
      await db
        .update(users)
        .set({
          phoneVerified: true,
          phoneVerificationCode: null,
          phoneVerificationExpiry: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
      return true;
    }

    return false;
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

  // Initialize database with Elite Ops agents
  async seedAgents(): Promise<void> {
    const existingAgents = await this.getAllAgents();
    if (existingAgents.length > 0) return;

    const seedAgents = [
      // Elite Ops & Productivity Agents
      {
        name: "Jira Project Manager Agent",
        description: "The command center for all things Jira—automates ticket creation, updates, and status flows like a pro. Think of it as your personal agile overlord.",
        category: "Productivity",
        price: 149,
        priceInWei: ethers.parseEther("0.065").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000001",
        tokenId: 1001,
        icon: "Database",
        features: ["Ticket Automation", "Status Flows", "Sprint Management", "Agile Overlord", "Team Coordination"],
        gradientFrom: "gray-900",
        gradientTo: "emerald-800",
        featured: true
      },
      {
        name: "GMAIL Data Classification Agent",
        description: "Scans, tags, and classifies emails with surgical precision. Built to filter signal from noise and feed downstream systems with clean, structured intel.",
        category: "Productivity",
        price: 89,
        priceInWei: ethers.parseEther("0.035").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000002",
        tokenId: 1002,
        icon: "Mail",
        features: ["Surgical Precision", "Signal Filtering", "Auto-Tagging", "Data Structuring", "Intelligence Feed"],
        gradientFrom: "emerald-800",
        gradientTo: "gray-600",
        featured: true
      },
      {
        name: "MultiAgent Triage System",
        description: "Your digital war room. Deploys multiple agents to instantly triage tasks, messages, or incidents based on urgency, complexity, or domain. No chaos—just clarity.",
        category: "Operations",
        price: 299,
        priceInWei: ethers.parseEther("0.085").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000003",
        tokenId: 1003,
        icon: "Search",
        features: ["Digital War Room", "Instant Triage", "Multi-Agent Deploy", "Urgency Analysis", "Domain Classification"],
        gradientFrom: "red-900",
        gradientTo: "orange-800",
        featured: true
      },
      {
        name: "InvoiceGenerationAndEmailAgent",
        description: "Fires off polished, accurate invoices and dispatches them like clockwork. Zero errors. Zero delays. Cash flow? Handled.",
        category: "Finance",
        price: 179,
        priceInWei: ethers.parseEther("0.055").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000004",
        tokenId: 1004,
        icon: "Receipt",
        features: ["Zero Errors", "Clockwork Dispatch", "Cash Flow Management", "Auto-Generation", "Polished Output"],
        gradientFrom: "blue-900",
        gradientTo: "purple-800",
        featured: false
      },
      {
        name: "Senior PipeLine Agent",
        description: "Orchestrates complex data and deployment pipelines at scale. This agent doesn't run jobs—it commands the infrastructure like a seasoned general.",
        category: "DevOps",
        price: 249,
        priceInWei: ethers.parseEther("0.075").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000005",
        tokenId: 1005,
        icon: "Cloud",
        features: ["Infrastructure Command", "Pipeline Orchestration", "Scale Management", "Deployment Control", "General-Level Intelligence"],
        gradientFrom: "gray-900",
        gradientTo: "emerald-800",
        featured: true
      },
      {
        name: "Scalable Multi-Agent Chat Using @mentions",
        description: "Turns ordinary chat into mission control. Drop an @mention, summon specialized agents, and coordinate responses like a digital strike team.",
        category: "Communication",
        price: 129,
        priceInWei: ethers.parseEther("0.045").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000006",
        tokenId: 1006,
        icon: "Share",
        features: ["Mission Control", "@mention Summon", "Strike Team Coordination", "Specialized Response", "Chat Intelligence"],
        gradientFrom: "cyan-900",
        gradientTo: "blue-800",
        featured: false
      },
      // High-IQ Learning & Prep Agents
      {
        name: "LeetCode Meta Interview Hack Agent",
        description: "The ultimate LeetCode killer. Trained to prep for Meta-level interviews with tailored problems, walkthroughs, and simulated pressure tests. Step in green, walk out ready to dominate.",
        category: "Learning",
        price: 199,
        priceInWei: ethers.parseEther("0.065").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000007",
        tokenId: 1007,
        icon: "Search",
        features: ["LeetCode Killer", "Meta-Level Prep", "Pressure Testing", "Tailored Problems", "Domination Ready"],
        gradientFrom: "violet-900",
        gradientTo: "purple-800",
        featured: true
      },
      {
        name: "NeuroTune Agent",
        description: "Tunes your mind like a race car engine—think focus hacks, habit reinforcement, brain-training loops. Mental performance? Boosted.",
        category: "Learning",
        price: 159,
        priceInWei: ethers.parseEther("0.05").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000008",
        tokenId: 1008,
        icon: "Heart",
        features: ["Mind Tuning", "Focus Hacks", "Habit Reinforcement", "Brain Training", "Performance Boost"],
        gradientFrom: "pink-900",
        gradientTo: "rose-800",
        featured: false
      },
      // Tactical Scheduling & Utility Agents
      {
        name: "SchedulingAgent",
        description: "Your AI calendar sniper. Manages bookings, resolves conflicts, reschedules like a boss—and always keeps your time sharp.",
        category: "Productivity",
        price: 99,
        priceInWei: ethers.parseEther("0.04").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000009",
        tokenId: 1009,
        icon: "Calendar",
        features: ["Calendar Sniper", "Conflict Resolution", "Boss-Level Rescheduling", "Time Sharpening", "Booking Management"],
        gradientFrom: "emerald-800",
        gradientTo: "teal-700",
        featured: false
      },
      // Experimental & Creative Intelligence Agents
      {
        name: "BRAINWAVE Agent",
        description: "Innovation on demand. This agent sparks next-gen ideas, breaks creative blocks, and ideates across domains like a digital muse on caffeine.",
        category: "Creative",
        price: 219,
        priceInWei: ethers.parseEther("0.07").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000010",
        tokenId: 1010,
        icon: "Wind",
        features: ["Innovation Spark", "Creative Block Breaker", "Cross-Domain Ideation", "Digital Muse", "Caffeine-Level Energy"],
        gradientFrom: "amber-900",
        gradientTo: "yellow-800",
        featured: true
      },
      {
        name: "AI Nomads: SMS Testing Agent",
        description: "Full-spectrum SMS testing unit. Simulates sends, reads, and replies—stress tests your pipeline before it ever hits prod.",
        category: "Testing",
        price: 139,
        priceInWei: ethers.parseEther("0.045").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000011",
        tokenId: 1011,
        icon: "Mail",
        features: ["Full-Spectrum Testing", "Send Simulation", "Reply Testing", "Pipeline Stress Test", "Pre-Prod Validation"],
        gradientFrom: "slate-900",
        gradientTo: "gray-800",
        featured: false
      },
      {
        name: "NOMAD Email Copilot: AI Drafts, You Approve",
        description: "Ghostwriter mode: engaged. This agent drafts email replies that sound just like you—so you stay in control, but save serious time.",
        category: "Productivity",
        price: 119,
        priceInWei: ethers.parseEther("0.04").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000012",
        tokenId: 1012,
        icon: "Mail",
        features: ["Ghostwriter Mode", "Voice Matching", "Control Retention", "Time Saving", "Draft Intelligence"],
        gradientFrom: "gray-900",
        gradientTo: "emerald-800",
        featured: false
      },
      {
        name: "Nomad Social Media Agent",
        description: "Automates content curation, scheduling, and engagement across platforms. Part analyst, part strategist, all hustle.",
        category: "Marketing",
        price: 169,
        priceInWei: ethers.parseEther("0.055").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000013",
        tokenId: 1013,
        icon: "Share",
        features: ["Content Curation", "Multi-Platform", "Auto-Engagement", "Strategic Analysis", "Pure Hustle"],
        gradientFrom: "indigo-900",
        gradientTo: "blue-800",
        featured: true
      },
      {
        name: "Nomad Video Agent",
        description: "From raw scripts to ready-to-publish clips—this agent handles video like a Hollywood post-house. Think auto-editing, captions, and smart exports.",
        category: "Creative",
        price: 259,
        priceInWei: ethers.parseEther("0.08").toString(),
        contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA0000014",
        tokenId: 1014,
        icon: "Database",
        features: ["Hollywood-Level", "Auto-Editing", "Smart Captions", "Export Intelligence", "Post-House Quality"],
        gradientFrom: "red-900",
        gradientTo: "orange-800",
        featured: true
      }
    ];

    await db.insert(agents).values(seedAgents);
  }
}

export const storage = new DatabaseStorage();