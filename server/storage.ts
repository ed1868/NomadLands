import {
  users,
  agents,
  userPurchases,
  transactions,
  agentTags,
  agentTagRelations,
  agentDeployments,
  agentUsage,
  type User,
  type Agent,
  type UpsertUser,
  type InsertUser,
  type UserPurchase,
  type Transaction,
  type InsertPurchase,
  type InsertTransaction,
  type AgentTag,
  type InsertTag,
  type AgentTagRelation,
  type InsertTagRelation,
  type AgentDeployment,
  type InsertAgentDeployment,
  type AgentUsage,
  type InsertAgentUsage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { ethers } from "ethers";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPhone(userId: string, phoneNumber: string, verificationCode: string, expiry: Date): Promise<void>;
  verifyUserPhone(userId: string, code: string): Promise<boolean>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;
  
  // Agent operations
  getAllAgents(): Promise<Agent[]>;
  getAgentsByCategory(category: string): Promise<Agent[]>;
  getAgentsByTag(tagSlug: string): Promise<Agent[]>;
  getFeaturedAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, updates: Partial<Agent>): Promise<Agent>;
  approveAgent(id: number): Promise<Agent>;
  deployAgent(id: number): Promise<Agent>;
  
  // Tag operations
  getAllTags(): Promise<AgentTag[]>;
  getTag(slug: string): Promise<AgentTag | undefined>;
  createTag(tag: InsertTag): Promise<AgentTag>;
  addTagToAgent(agentId: number, tagId: number): Promise<AgentTagRelation>;
  
  // Purchase operations
  getUserPurchases(userId: string): Promise<(UserPurchase & { agent: Agent })[]>;
  createPurchase(purchase: InsertPurchase): Promise<UserPurchase>;
  hasUserPurchased(userId: string, agentId: number): Promise<boolean>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(transactionHash: string, status: string, blockNumber?: number): Promise<void>;
  getUserTransactions(userId: string): Promise<Transaction[]>;

  // Agent Deployment operations
  createAgentDeployment(deployment: InsertAgentDeployment): Promise<AgentDeployment>;
  getUserAgentDeployments(userId: string): Promise<AgentDeployment[]>;
  getAgentDeployment(id: number): Promise<AgentDeployment | undefined>;
  getAgentDeploymentByEndpoint(endpoint: string): Promise<AgentDeployment | undefined>;
  updateAgentDeployment(id: number, updates: Partial<AgentDeployment>): Promise<AgentDeployment>;
  deleteAgentDeployment(id: number): Promise<void>;
  
  // Agent Usage Analytics operations
  recordAgentUsage(usage: InsertAgentUsage): Promise<AgentUsage>;
  getDeploymentUsage(deploymentId: number, limit?: number): Promise<AgentUsage[]>;
  getDeploymentAnalytics(deploymentId: number, timeframe: 'day' | 'week' | 'month'): Promise<{
    totalCalls: number;
    totalRevenue: number;
    averageResponseTime: number;
    successRate: number;
    uniqueUsers: number;
  }>;
  updateDeploymentStats(deploymentId: number, stats: {
    totalCalls?: number;
    totalRevenue?: number;
    lastUsed?: Date;
    healthStatus?: string;
  }): Promise<void>;
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
        walletAddress: userData.walletAddress ? userData.walletAddress.toLowerCase() : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          ...userData,
          walletAddress: userData.walletAddress ? userData.walletAddress.toLowerCase() : null,
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userId,
      })
      .returning();
    return user;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
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

  async getAgentsByTag(tagSlug: string): Promise<Agent[]> {
    return await db
      .select()
      .from(agents)
      .innerJoin(agentTagRelations, eq(agents.id, agentTagRelations.agentId))
      .innerJoin(agentTags, eq(agentTagRelations.tagId, agentTags.id))
      .where(eq(agentTags.slug, tagSlug))
      .then(results => results.map(row => row.agents));
  }

  // Tag operations
  async getAllTags(): Promise<AgentTag[]> {
    return await db.select().from(agentTags);
  }

  async getTag(slug: string): Promise<AgentTag | undefined> {
    const [tag] = await db.select().from(agentTags).where(eq(agentTags.slug, slug));
    return tag;
  }

  async createTag(tag: InsertTag): Promise<AgentTag> {
    const [newTag] = await db
      .insert(agentTags)
      .values(tag)
      .returning();
    return newTag;
  }

  async addTagToAgent(agentId: number, tagId: number): Promise<AgentTagRelation> {
    const [relation] = await db
      .insert(agentTagRelations)
      .values({ agentId, tagId })
      .returning();
    return relation;
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
    
    // Seed tags after agents
    await this.seedTags();
  }

  async seedTags(): Promise<void> {
    // Check if tags already exist
    const existingTags = await db.select().from(agentTags);
    if (existingTags.length > 0) {
      return;
    }

    // Create tag categories
    const tagCategories = [
      {
        name: "Productivity",
        slug: "productivity",
        description: "Agents that enhance workflow efficiency and task automation",
        color: "#10b981"
      },
      {
        name: "Communications",
        slug: "communications", 
        description: "Email, messaging, and communication workflow agents",
        color: "#3b82f6"
      },
      {
        name: "Business",
        slug: "business",
        description: "Enterprise operations and business process automation",
        color: "#8b5cf6"
      },
      {
        name: "Finance",
        slug: "finance",
        description: "Financial operations, invoicing, and cash flow management",
        color: "#f59e0b"
      },
      {
        name: "Engineering",
        slug: "engineering",
        description: "Development, deployment, and technical infrastructure",
        color: "#ef4444"
      },
      {
        name: "Operations",
        slug: "operations",
        description: "System monitoring, incident response, and operational workflows",
        color: "#06b6d4"
      },
      {
        name: "Marketing",
        slug: "marketing",
        description: "Content creation, social media, and marketing automation",
        color: "#ec4899"
      },
      {
        name: "Analytics",
        slug: "analytics",
        description: "Data analysis, reporting, and business intelligence",
        color: "#84cc16"
      }
    ];

    // Insert tags
    const createdTags = await db.insert(agentTags).values(tagCategories).returning();

    // Map agent names to their appropriate tags
    const agentTagMappings = [
      { agentName: "Jira Project Manager Agent", tags: ["productivity", "engineering", "operations"] },
      { agentName: "GMAIL Data Classification Agent", tags: ["productivity", "communications"] },
      { agentName: "MultiAgent Triage System", tags: ["operations", "business"] },
      { agentName: "InvoiceGenerationAndEmailAgent", tags: ["finance", "business", "communications"] },
      { agentName: "CloudWatch Deployment Agent", tags: ["engineering", "operations"] },
      { agentName: "SocialMediaPostAgent", tags: ["marketing", "communications"] },
      { agentName: "TaskManager AI Agent", tags: ["productivity", "business"] },
      { agentName: "EmailClassificationAgent", tags: ["communications", "productivity"] },
      { agentName: "CustomerSupportAgent", tags: ["communications", "business"] },
      { agentName: "DataAnalysisAgent", tags: ["analytics", "business"] },
      { agentName: "InventoryManagementAgent", tags: ["business", "operations"] },
      { agentName: "ContentCreatorAgent", tags: ["marketing", "communications"] },
      { agentName: "SecurityMonitoringAgent", tags: ["operations", "engineering"] },
      { agentName: "AutomatedVideoEditingAgent", tags: ["marketing", "productivity"] }
    ];

    // Get all agents to map IDs
    const allAgents = await db.select().from(agents);
    const tagLookup = Object.fromEntries(createdTags.map(tag => [tag.slug, tag.id]));

    // Create agent-tag relationships
    const agentTagRelationships = [];
    for (const mapping of agentTagMappings) {
      const agent = allAgents.find(a => a.name === mapping.agentName);
      if (agent) {
        for (const tagSlug of mapping.tags) {
          const tagId = tagLookup[tagSlug];
          if (tagId) {
            agentTagRelationships.push({
              agentId: agent.id,
              tagId: tagId
            });
          }
        }
      }
    }

    if (agentTagRelationships.length > 0) {
      await db.insert(agentTagRelations).values(agentTagRelationships);
    }
  }

  // Agent Deployment operations
  async createAgentDeployment(deployment: InsertAgentDeployment): Promise<AgentDeployment> {
    // Generate unique API endpoint
    const apiEndpoint = `/api/agents/deployed/${deployment.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const [result] = await db
      .insert(agentDeployments)
      .values({
        ...deployment,
        apiEndpoint,
      })
      .returning();
    return result;
  }

  async getUserAgentDeployments(userId: string): Promise<AgentDeployment[]> {
    return await db.select().from(agentDeployments).where(eq(agentDeployments.creatorId, userId));
  }

  async getAgentDeployment(id: number): Promise<AgentDeployment | undefined> {
    const [deployment] = await db.select().from(agentDeployments).where(eq(agentDeployments.id, id));
    return deployment;
  }

  async getAgentDeploymentByEndpoint(endpoint: string): Promise<AgentDeployment | undefined> {
    const [deployment] = await db.select().from(agentDeployments).where(eq(agentDeployments.apiEndpoint, endpoint));
    return deployment;
  }

  async updateAgentDeployment(id: number, updates: Partial<AgentDeployment>): Promise<AgentDeployment> {
    const [result] = await db
      .update(agentDeployments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agentDeployments.id, id))
      .returning();
    return result;
  }

  async deleteAgentDeployment(id: number): Promise<void> {
    await db.delete(agentDeployments).where(eq(agentDeployments.id, id));
  }

  // Agent Usage Analytics operations
  async recordAgentUsage(usage: InsertAgentUsage): Promise<AgentUsage> {
    const [result] = await db.insert(agentUsage).values(usage).returning();
    return result;
  }

  async getDeploymentUsage(deploymentId: number, limit: number = 100): Promise<AgentUsage[]> {
    return await db
      .select()
      .from(agentUsage)
      .where(eq(agentUsage.deploymentId, deploymentId))
      .orderBy(agentUsage.createdAt)
      .limit(limit);
  }

  async getDeploymentAnalytics(deploymentId: number, timeframe: 'day' | 'week' | 'month'): Promise<{
    totalCalls: number;
    totalRevenue: number;
    averageResponseTime: number;
    successRate: number;
    uniqueUsers: number;
  }> {
    // This would typically use SQL aggregation functions
    // For now, implementing basic analytics
    const usage = await db
      .select()
      .from(agentUsage)
      .where(eq(agentUsage.deploymentId, deploymentId));

    const totalCalls = usage.length;
    const successfulCalls = usage.filter(u => u.status === 'success').length;
    const totalRevenue = usage.reduce((sum, u) => sum + parseFloat(u.cost || '0'), 0);
    const averageResponseTime = usage.reduce((sum, u) => sum + (u.responseTime || 0), 0) / totalCalls || 0;
    const uniqueUsers = new Set(usage.map(u => u.userId).filter(Boolean)).size;

    return {
      totalCalls,
      totalRevenue,
      averageResponseTime: Math.round(averageResponseTime),
      successRate: totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0,
      uniqueUsers,
    };
  }

  async updateDeploymentStats(deploymentId: number, stats: {
    totalCalls?: number;
    totalRevenue?: number;
    lastUsed?: Date;
    healthStatus?: string;
  }): Promise<void> {
    await db
      .update(agentDeployments)
      .set({
        ...stats,
        updatedAt: new Date(),
        lastHealthCheck: new Date(),
      })
      .where(eq(agentDeployments.id, deploymentId));
  }
}

export const storage = new DatabaseStorage();