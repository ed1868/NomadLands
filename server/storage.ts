import { users, agents, type User, type InsertUser, type Agent, type InsertAgent } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllAgents(): Promise<Agent[]>;
  getAgentsByCategory(category: string): Promise<Agent[]>;
  getFeaturedAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private agents: Map<number, Agent>;
  private currentUserId: number;
  private currentAgentId: number;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.currentUserId = 1;
    this.currentAgentId = 1;
    this.seedAgents();
  }

  private seedAgents() {
    const agentData: Omit<Agent, 'id'>[] = [
      {
        name: "Email Classification Agent",
        description: "Automatically categorize and prioritize your emails using advanced NLP algorithms.",
        category: "communication",
        price: 49,
        icon: "fas fa-envelope",
        features: ["AI Classification", "Smart Filters"],
        gradientFrom: "neon-purple",
        gradientTo: "cyber-cyan",
        featured: true,
      },
      {
        name: "CloudControl Agent",
        description: "Optimize cloud resources and costs with intelligent monitoring and auto-scaling.",
        category: "business",
        price: 99,
        icon: "fas fa-cloud",
        features: ["Auto-scaling", "Cost Optimization"],
        gradientFrom: "cyber-cyan",
        gradientTo: "mint-green",
        featured: true,
      },
      {
        name: "Invoice Generation Agent",
        description: "Automate invoice creation, tracking, and payment reminders for your business.",
        category: "business",
        price: 39,
        icon: "fas fa-receipt",
        features: ["Auto-generation", "Payment Tracking"],
        gradientFrom: "mint-green",
        gradientTo: "electric-blue",
        featured: true,
      },
      {
        name: "Talent Search Agent",
        description: "Find and evaluate top talent using AI-powered candidate matching and screening.",
        category: "business",
        price: 79,
        icon: "fas fa-search",
        features: ["AI Matching", "Skill Analysis"],
        gradientFrom: "electric-blue",
        gradientTo: "neon-purple",
        featured: true,
      },
      {
        name: "Social Manager Agent",
        description: "Automate social media posting, engagement, and analytics across all platforms.",
        category: "communication",
        price: 59,
        icon: "fas fa-share-alt",
        features: ["Auto-posting", "Analytics"],
        gradientFrom: "neon-purple",
        gradientTo: "cyber-cyan",
        featured: true,
      },
      {
        name: "Date Planner Agent",
        description: "Plan perfect dates and events with personalized recommendations and booking automation.",
        category: "lifestyle",
        price: 29,
        icon: "fas fa-calendar",
        features: ["Smart Planning", "Auto-booking"],
        gradientFrom: "cyber-cyan",
        gradientTo: "mint-green",
        featured: false,
      },
      {
        name: "Vector Database Agent",
        description: "Manage and query high-dimensional vector data for AI applications and similarity search.",
        category: "productivity",
        price: 149,
        icon: "fas fa-database",
        features: ["Vector Search", "AI Integration"],
        gradientFrom: "mint-green",
        gradientTo: "electric-blue",
        featured: false,
      },
      {
        name: "Telemedicine Agent",
        description: "Streamline virtual healthcare appointments and patient communication workflows.",
        category: "lifestyle",
        price: 89,
        icon: "fas fa-heartbeat",
        features: ["Scheduling", "Patient Care"],
        gradientFrom: "electric-blue",
        gradientTo: "neon-purple",
        featured: false,
      }
    ];

    agentData.forEach(agent => {
      const id = this.currentAgentId++;
      this.agents.set(id, { ...agent, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgentsByCategory(category: string): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(
      agent => agent.category === category
    );
  }

  async getFeaturedAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter(
      agent => agent.featured
    );
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }
}

export const storage = new MemStorage();
