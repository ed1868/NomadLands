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
        name: "The Inbox Dominator",
        description: "Ruthlessly optimize your email flow with zen precision. No mercy for chaos, only mindful conquest.",
        category: "communication",
        price: 69,
        icon: "fas fa-envelope",
        features: ["Ruthless Filtering", "Zen Precision"],
        gradientFrom: "electric-sage",
        gradientTo: "warm-terracotta",
        featured: true,
      },
      {
        name: "Cloud Warrior",
        description: "Aggressively scale your infrastructure while maintaining sustainable harmony with the digital ecosystem.",
        category: "business",
        price: 149,
        icon: "fas fa-cloud",
        features: ["Aggressive Scaling", "Eco Mindfulness"],
        gradientFrom: "forest-green",
        gradientTo: "cosmic-purple",
        featured: true,
      },
      {
        name: "Revenue Beast",
        description: "Unleash unstoppable invoicing power that flows like water yet strikes like lightning.",
        category: "business",
        price: 89,
        icon: "fas fa-receipt",
        features: ["Lightning Speed", "Flowing Power"],
        gradientFrom: "sunset-orange",
        gradientTo: "electric-sage",
        featured: true,
      },
      {
        name: "Talent Magnet",
        description: "Attract extraordinary humans who share your vision while crushing conventional hiring limits.",
        category: "business",
        price: 199,
        icon: "fas fa-search",
        features: ["Magnetic Attraction", "Vision Alignment"],
        gradientFrom: "vibrant-sage",
        gradientTo: "sunset-orange",
        featured: true,
      },
      {
        name: "Social Storm",
        description: "Command social platforms with authentic force, creating waves that matter in the digital ocean.",
        category: "communication",
        price: 119,
        icon: "fas fa-share-alt",
        features: ["Authentic Force", "Digital Waves"],
        gradientFrom: "cosmic-purple",
        gradientTo: "forest-green",
        featured: true,
      },
      {
        name: "Experience Architect",
        description: "Craft legendary events that transform souls while maintaining operational excellence.",
        category: "lifestyle",
        price: 159,
        icon: "fas fa-calendar",
        features: ["Soul Transformation", "Operational Excellence"],
        gradientFrom: "warm-terracotta",
        gradientTo: "vibrant-sage",
        featured: false,
      },
      {
        name: "Knowledge Vault",
        description: "Store infinite wisdom with military precision and spiritual reverence for your intellectual empire.",
        category: "productivity",
        price: 249,
        icon: "fas fa-database",
        features: ["Military Precision", "Spiritual Reverence"],
        gradientFrom: "deep-charcoal",
        gradientTo: "electric-sage",
        featured: false,
      },
      {
        name: "Wellness Commander",
        description: "Lead healing journeys with fierce compassion and unstoppable dedication to human flourishing.",
        category: "wellness",
        price: 179,
        icon: "fas fa-heartbeat",
        features: ["Fierce Compassion", "Unstoppable Dedication"],
        gradientFrom: "sunset-orange",
        gradientTo: "cosmic-purple",
        featured: false,
      },
      {
        name: "Dawn Destroyer",
        description: "Obliterate morning chaos with intentional routines that forge unbreakable daily momentum.",
        category: "lifestyle",
        price: 79,
        icon: "fas fa-sun",
        features: ["Chaos Obliteration", "Unbreakable Momentum"],
        gradientFrom: "vibrant-sage",
        gradientTo: "warm-terracotta",
        featured: false,
      },
      {
        name: "Breath Master",
        description: "Harness respiratory power with AI precision to unlock superhuman presence and focus.",
        category: "wellness",
        price: 99,
        icon: "fas fa-wind",
        features: ["Respiratory Power", "Superhuman Focus"],
        gradientFrom: "electric-sage",
        gradientTo: "forest-green",
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
