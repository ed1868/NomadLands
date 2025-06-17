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
        name: "Mindful Email Curator",
        description: "Thoughtfully organize your digital correspondence with intention and clarity.",
        category: "communication",
        price: 49,
        icon: "fas fa-envelope",
        features: ["Conscious Filtering", "Peaceful Inbox"],
        gradientFrom: "sage-green",
        gradientTo: "ocean-mist",
        featured: true,
      },
      {
        name: "Zen Cloud Harmony",
        description: "Balance your digital resources with sustainable, mindful cloud management.",
        category: "business",
        price: 99,
        icon: "fas fa-cloud",
        features: ["Sustainable Scaling", "Energy Awareness"],
        gradientFrom: "ocean-mist",
        gradientTo: "lavender-grey",
        featured: true,
      },
      {
        name: "Gentle Flow Invoicing",
        description: "Create and manage invoices with grace, mindfulness, and professional ease.",
        category: "business",
        price: 39,
        icon: "fas fa-receipt",
        features: ["Mindful Billing", "Flow Tracking"],
        gradientFrom: "warm-beige",
        gradientTo: "dusty-rose",
        featured: true,
      },
      {
        name: "Intentional Talent Finder",
        description: "Connect with purpose-driven professionals who align with your values and vision.",
        category: "business",
        price: 79,
        icon: "fas fa-search",
        features: ["Values Matching", "Conscious Hiring"],
        gradientFrom: "sage-green",
        gradientTo: "soft-sage",
        featured: true,
      },
      {
        name: "Mindful Social Presence",
        description: "Share your authentic voice across platforms with intention and meaningful engagement.",
        category: "communication",
        price: 59,
        icon: "fas fa-share-alt",
        features: ["Authentic Voice", "Mindful Sharing"],
        gradientFrom: "dusty-rose",
        gradientTo: "lavender-grey",
        featured: true,
      },
      {
        name: "Sacred Space Planner",
        description: "Design meaningful experiences and gatherings that nourish the soul.",
        category: "lifestyle",
        price: 29,
        icon: "fas fa-calendar",
        features: ["Soul Nourishing", "Sacred Timing"],
        gradientFrom: "ocean-mist",
        gradientTo: "warm-beige",
        featured: false,
      },
      {
        name: "Wisdom Keeper Database",
        description: "Store and retrieve your knowledge with the reverence of ancient wisdom keepers.",
        category: "productivity",
        price: 149,
        icon: "fas fa-database",
        features: ["Wisdom Patterns", "Sacred Storage"],
        gradientFrom: "sage-green",
        gradientTo: "charcoal",
        featured: false,
      },
      {
        name: "Healing Touch Coordinator",
        description: "Facilitate wellness journeys with compassionate care and gentle guidance.",
        category: "lifestyle",
        price: 89,
        icon: "fas fa-heartbeat",
        features: ["Compassionate Care", "Healing Flow"],
        gradientFrom: "dusty-rose",
        gradientTo: "soft-sage",
        featured: false,
      },
      {
        name: "Morning Ritual Assistant",
        description: "Begin each day with intention through personalized mindfulness practices.",
        category: "lifestyle",
        price: 35,
        icon: "fas fa-sun",
        features: ["Morning Flow", "Daily Intention"],
        gradientFrom: "warm-beige",
        gradientTo: "sage-green",
        featured: false,
      },
      {
        name: "Breathwork Guide",
        description: "Guide your breathing practice with AI-powered mindfulness and presence.",
        category: "wellness",
        price: 25,
        icon: "fas fa-wind",
        features: ["Breath Awareness", "Present Moment"],
        gradientFrom: "ocean-mist",
        gradientTo: "soft-sage",
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
