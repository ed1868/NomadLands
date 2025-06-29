import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-simple";
import { ethers } from "ethers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { insertUserSchema, type InsertUser } from "@shared/schema-simple";
import { z } from "zod";
import { PaymentService } from "./payment-service";
import { N8nWorkflowGenerator } from "./n8n-generator";
import { n8nService, N8nAgentRequest } from "./n8n-service";
import { claudeAgentGenerator, type AgentGenerationRequest } from "./claude-agent-generator";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import Stripe from "stripe";

// JWT Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username?: string;
    email?: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize payment service
  const paymentService = new PaymentService();
  
  // Initialize Stripe if available
  const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  }) : null;

  // Seed database with agents on startup
  await storage.seedAgents();

  // Connect wallet and create/update user
  app.post("/api/auth/connect", async (req, res) => {
    try {
      const { walletAddress, email, firstName, lastName } = req.body;
      
      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Valid wallet address required" });
      }

      const user = await storage.upsertUser({
        id: walletAddress.toLowerCase(),
        walletAddress: walletAddress.toLowerCase(),
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        profileImageUrl: null,
      });

      res.json({ user, message: "Wallet connected successfully" });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  // Get user profile
  app.get("/api/auth/user/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { firstName, lastName, email, phoneNumber } = req.body;
      
      // Get current user
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user profile
      const updatedUser = await storage.upsertUser({
        id: user.id,
        walletAddress: user.walletAddress,
        email: email || user.email,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phoneNumber: phoneNumber || user.phoneNumber,
        subscriptionPlan: user.subscriptionPlan,
        paymentMethod: user.paymentMethod
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get all agents (public endpoint for testing)
  app.get("/api/agents", async (req, res) => {
    try {
      // Return mock data for testing since database schema needs adjustment
      const mockAgents = [
        {
          id: 1,
          name: "Email Classification Agent",
          description: "Automatically categorizes and prioritizes incoming emails using AI-powered natural language processing.",
          category: "productivity",
          price: "15.00",
          features: ["Email categorization", "Priority scoring", "Auto-labeling", "Smart filtering"],
          tools: ["gmail", "web-search"],
          aiModel: "gpt-4o",
          systemPrompt: "You are an email classification agent that helps users organize and prioritize their emails efficiently.",
          styling: {
            gradientFrom: "#3b82f6",
            gradientTo: "#1d4ed8"
          }
        },
        {
          id: 2,
          name: "Cloud Resource Manager", 
          description: "Monitors and optimizes cloud infrastructure costs across AWS, Azure, and Google Cloud platforms.",
          category: "development",
          price: "25.00",
          features: ["Cost optimization", "Resource monitoring", "Auto-scaling", "Multi-cloud support"],
          tools: ["web-search", "github"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a cloud resource management agent that helps optimize infrastructure costs and performance.",
          styling: {
            gradientFrom: "#10b981",
            gradientTo: "#059669"
          }
        }
      ];
      res.json(mockAgents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.post("/api/agents", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const agentData = {
        ...req.body,
        creatorId: req.user?.userId
      };
      
      const agent = await storage.createAgent(agentData);
      res.json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ message: "Failed to create agent" });
    }
  });

  // Generate n8n workflow for an agent (no database calls)
  app.post("/api/agents/:id/generate-workflow", async (req, res) => {
    try {
      console.log("Generating workflow for agent", req.params.id, "with body:", req.body);
      
      // Create complete mock agent data without any database dependency
      const mockAgent = {
        id: parseInt(req.params.id),
        name: req.body.name || "Test Email Agent",
        description: req.body.description || "A test agent for email processing",
        category: req.body.category || "productivity",
        tools: req.body.tools || ["gmail", "web-search"],
        aiModel: req.body.aiModel || "gpt-4o",
        systemPrompt: req.body.systemPrompt || "You are an email processing agent",
        features: req.body.features || ["Email processing", "Classification"],
        price: req.body.price || "10.00",
        styling: req.body.styling || { gradientFrom: "#3b82f6", gradientTo: "#1d4ed8" }
      };
      
      console.log("Mock agent created:", mockAgent);
      
      // Generate n8n workflow
      const generator = new N8nWorkflowGenerator();
      const workflow = generator.generateWorkflow(mockAgent);
      
      console.log("Workflow generated successfully, size:", JSON.stringify(workflow).length);
      res.json(workflow);
    } catch (error) {
      console.error("Error generating workflow:", error);
      res.status(500).json({ message: "Failed to generate workflow", error: error.message });
    }
  });

  // Get agents by category
  app.get("/api/agents/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const agents = await storage.getAgentsByCategory(category);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents by category" });
    }
  });

  // Get featured agents
  app.get("/api/agents/featured", async (req, res) => {
    try {
      const agents = await storage.getFeaturedAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured agents" });
    }
  });

  // Get agents by tag
  app.get("/api/agents/tag/:tagSlug", async (req, res) => {
    try {
      const { tagSlug } = req.params;
      const agents = await storage.getAgentsByTag(tagSlug);
      res.json(agents);
    } catch (error) {
      console.error(`Error fetching agents by tag ${req.params.tagSlug}:`, error);
      res.status(500).json({ error: "Failed to fetch agents by tag" });
    }
  });

  // Get all tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  // Get specific agent (no database calls)
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Fetching agent with ID:", id);
      
      // Return mock agent data based on ID without any database calls
      const mockAgents = {
        1: {
          id: 1,
          name: "Email Classification Agent",
          description: "Automatically categorizes and prioritizes incoming emails using AI-powered natural language processing.",
          category: "productivity",
          price: "15.00",
          features: ["Email categorization", "Priority scoring", "Auto-labeling", "Smart filtering"],
          tools: ["gmail", "web-search"],
          aiModel: "gpt-4o",
          systemPrompt: "You are an email classification agent that helps users organize and prioritize their emails efficiently.",
          styling: { gradientFrom: "#3b82f6", gradientTo: "#1d4ed8" }
        },
        2: {
          id: 2,
          name: "Cloud Resource Manager", 
          description: "Monitors and optimizes cloud infrastructure costs across AWS, Azure, and Google Cloud platforms.",
          category: "development",
          price: "25.00",
          features: ["Cost optimization", "Resource monitoring", "Auto-scaling", "Multi-cloud support"],
          tools: ["web-search", "github"],
          aiModel: "gpt-4o",
          systemPrompt: "You are a cloud resource management agent that helps optimize infrastructure costs and performance.",
          styling: { gradientFrom: "#10b981", gradientTo: "#059669" }
        }
      };
      
      const agent = mockAgents[id];
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      console.log("Agent found:", agent.name);
      res.json(agent);
    } catch (error) {
      console.error("Error in agent route:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  // Purchase agent with blockchain transaction
  app.post("/api/purchase", async (req, res) => {
    try {
      const { walletAddress, agentId, transactionHash, blockNumber, purchasePrice } = req.body;
      
      if (!walletAddress || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Valid wallet address required" });
      }

      if (!transactionHash || !ethers.isHexString(transactionHash, 32)) {
        return res.status(400).json({ message: "Valid transaction hash required" });
      }

      // Verify user exists
      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found. Please connect wallet first." });
      }

      // Verify agent exists
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Check if user already owns this agent
      const alreadyPurchased = await storage.hasUserPurchased(user.id, agentId);
      if (alreadyPurchased) {
        return res.status(400).json({ message: "Agent already purchased" });
      }

      // Create purchase record
      const purchase = await storage.createPurchase({
        userId: user.id,
        agentId,
        transactionHash,
        blockNumber: blockNumber || null,
        purchasePrice: purchasePrice.toString(),
      });

      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        agentId,
        transactionHash,
        fromAddress: walletAddress,
        toAddress: agent.contractAddress || "0x0000000000000000000000000000000000000000",
        value: agent.priceInWei,
        gasUsed: null,
        gasPrice: null,
        blockNumber: blockNumber || null,
        status: "confirmed",
      });

      res.json({ purchase, message: "Agent purchased successfully" });
    } catch (error) {
      console.error("Error processing purchase:", error);
      res.status(500).json({ message: "Failed to process purchase" });
    }
  });

  // Get user's purchased agents
  app.get("/api/user/:walletAddress/purchases", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const purchases = await storage.getUserPurchases(user.id);
      res.json(purchases);
    } catch (error) {
      console.error("Error fetching user purchases:", error);
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  // Check if user owns a specific agent
  app.get("/api/user/:walletAddress/owns/:agentId", async (req, res) => {
    try {
      const { walletAddress, agentId } = req.params;
      
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const owns = await storage.hasUserPurchased(user.id, parseInt(agentId));
      res.json({ owns });
    } catch (error) {
      console.error("Error checking ownership:", error);
      res.status(500).json({ message: "Failed to check ownership" });
    }
  });

  // SMS Verification Routes
  app.post("/api/user/:walletAddress/send-verification", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const { phoneNumber } = req.body;
      
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      if (!phoneNumber || !/^\+?[\d\s\-\(\)]+$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Valid phone number required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save verification code to database
      await storage.updateUserPhone(user.id, phoneNumber, verificationCode, expiry);

      // Send SMS via TextBelt
      const textbeltResponse = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `Your AI Nomads verification code is: ${verificationCode}. This code expires in 10 minutes.`,
          key: process.env.TEXTBELT_API_KEY,
        }),
      });

      const result = await textbeltResponse.json();
      
      if (!result.success) {
        console.error("TextBelt error:", result.error);
        return res.status(500).json({ message: "Failed to send verification code" });
      }

      res.json({ 
        message: "Verification code sent successfully",
        quotaRemaining: result.quotaRemaining 
      });
    } catch (error) {
      console.error("Error sending verification:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      if (!validatedData.password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      // Calculate trial end date (3 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);

      // Create user with subscription trial
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        dateOfBirth: validatedData.dateOfBirth,
        password: hashedPassword,
        walletAddress: validatedData.walletAddress || null,
        subscriptionPlan: req.body.selectedPlan || "pioneer",
        subscriptionStatus: "trial",
        trialEndDate: trialEndDate,
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" }
      );
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateLastLogin(user.id);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" }
      );
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Signin endpoint for username-based authentication
  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update last login
      await storage.updateLastLogin(user.id);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" }
      );
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      console.error("Signin error:", error);
      res.status(400).json({ message: error.message || "Signin failed" });
    }
  });

  // Logout endpoint
  app.get("/api/logout", (req, res) => {
    // Since we're using JWT tokens, logout is handled on the client side
    // by removing the token from localStorage. This endpoint confirms logout.
    res.json({ message: "Logged out successfully" });
  });

  app.post("/api/logout", (req, res) => {
    // Alternative POST method for logout
    res.json({ message: "Logged out successfully" });
  });

  // Get current authenticated user
  app.get("/api/auth/user", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Phone verification for new signup system
  app.post("/api/auth/send-verification", async (req, res) => {
    try {
      const { userId, phoneNumber } = req.body;
      
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Update user with verification code
      await storage.updateUserPhone(userId, phoneNumber, verificationCode, expiry);
      
      // Send SMS using TextBelt API
      if (process.env.TEXTBELT_API_KEY) {
        const response = await fetch("https://textbelt.com/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phoneNumber,
            message: `Your AI Nomads verification code is: ${verificationCode}`,
            key: process.env.TEXTBELT_API_KEY,
          }),
        });
        
        const result = await response.json();
        if (!result.success) {
          console.error("SMS sending failed:", result);
          return res.status(500).json({ message: "Failed to send verification code" });
        }
      } else {
        console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);
      }
      
      res.json({ message: "Verification code sent successfully" });
    } catch (error: any) {
      console.error("Send verification error:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { userId, code } = req.body;
      
      const isValid = await storage.verifyUserPhone(userId, code);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      res.json({ message: "Phone verified successfully" });
    } catch (error: any) {
      console.error("Phone verification error:", error);
      res.status(500).json({ message: "Phone verification failed" });
    }
  });

  app.post("/api/user/:walletAddress/verify-phone", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const { code } = req.body;
      
      if (!ethers.isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      if (!code || code.length !== 6) {
        return res.status(400).json({ message: "Valid 6-digit code required" });
      }

      const user = await storage.getUserByWallet(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await storage.verifyUserPhone(user.id, code);
      
      if (isValid) {
        res.json({ message: "Phone number verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification code" });
      }
    } catch (error) {
      console.error("Error verifying phone:", error);
      res.status(500).json({ message: "Failed to verify phone number" });
    }
  });

  // PAYMENT SYSTEM ROUTES

  // Payment Methods
  app.get("/api/payment-methods", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const paymentMethods = await paymentService.getUserPaymentMethods(userId);
      res.json(paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });

  app.post("/api/payment-methods", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { type, provider, providerData } = req.body;
      const paymentMethod = await paymentService.addPaymentMethod(userId, type, provider, providerData);
      res.json(paymentMethod);
    } catch (error) {
      console.error("Error adding payment method:", error);
      res.status(500).json({ message: "Failed to add payment method" });
    }
  });

  app.patch("/api/payment-methods/:id/default", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { id } = req.params;
      await paymentService.setDefaultPaymentMethod(userId, parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error setting default payment method:", error);
      res.status(500).json({ message: "Failed to set default payment method" });
    }
  });

  // Stripe Payment Intent
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      
      const { amount, currency = "usd", paymentMethodTypes = ["card"] } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method_types: paymentMethodTypes,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // PayPal Routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Agent Purchase
  app.post("/api/purchase-agent", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { agentId, paymentMethodId } = req.body;
      const payment = await paymentService.purchaseAgent(userId, agentId, paymentMethodId);
      res.json(payment);
    } catch (error) {
      console.error("Error purchasing agent:", error);
      res.status(500).json({ message: "Failed to purchase agent" });
    }
  });

  // Subscription Management
  app.post("/api/subscriptions", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { planCode, paymentMethodId, billingCycle } = req.body;
      const subscription = await paymentService.createSubscription(userId, planCode, paymentMethodId, billingCycle);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Contract Management
  app.post("/api/contracts", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { creatorUserId, contractData } = req.body;
      const contract = await paymentService.createContract(userId, creatorUserId, contractData);
      res.json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.post("/api/contracts/:id/payment", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { paymentMethodId } = req.body;
      const payment = await paymentService.processContractPayment(parseInt(id), paymentMethodId);
      res.json(payment);
    } catch (error) {
      console.error("Error processing contract payment:", error);
      res.status(500).json({ message: "Failed to process contract payment" });
    }
  });

  // Crypto Exchange
  app.post("/api/crypto/exchange", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const { fromCurrency, toCurrency, fromAmount } = req.body;
      const exchange = await paymentService.exchangeCrypto(userId, fromCurrency, toCurrency, fromAmount);
      res.json(exchange);
    } catch (error) {
      console.error("Error exchanging crypto:", error);
      res.status(500).json({ message: "Failed to exchange crypto" });
    }
  });

  // Agent Deployment endpoints
  app.post("/api/deployments", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const deployment = await storage.createAgentDeployment({
        ...req.body,
        creatorId: userId,
      });
      res.json(deployment);
    } catch (error: any) {
      console.error("Error creating agent deployment:", error);
      res.status(500).json({ message: "Failed to create deployment" });
    }
  });

  app.get("/api/deployments", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      console.log("Fetching deployments for user:", userId);
      
      // Get user's created agents as "deployments"
      const agents = await storage.getAgents();
      console.log("Total agents found:", agents.length);
      
      const userAgents = agents.filter(agent => agent.createdBy === userId);
      console.log("User agents found:", userAgents.length);
      
      // Transform agents into deployment format
      const deployments = userAgents.map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        status: agent.isActive ? 'active' : 'inactive',
        createdAt: agent.createdAt,
        endpoint: agent.webhookUrl || `${process.env.BASE_URL || 'http://localhost:5000'}/api/agents/${agent.id}/execute`,
        agentId: agent.id,
        workflowId: agent.workflowId,
        category: agent.category,
        tools: agent.tools,
        aiModel: agent.aiModel,
        deploymentStatus: agent.deploymentStatus || 'deployed'
      }));
      
      console.log("Deployments prepared:", deployments.length);
      res.json(deployments);
    } catch (error: any) {
      console.error("Error fetching deployments:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ message: "Failed to fetch deployments", error: error.message });
    }
  });

  app.get("/api/deployments/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deployment = await storage.getAgentDeployment(parseInt(req.params.id));
      if (!deployment) {
        return res.status(404).json({ message: "Deployment not found" });
      }
      res.json(deployment);
    } catch (error: any) {
      console.error("Error fetching deployment:", error);
      res.status(500).json({ message: "Failed to fetch deployment" });
    }
  });

  app.patch("/api/deployments/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const deployment = await storage.getAgentDeployment(parseInt(req.params.id));
      
      if (!deployment || deployment.creatorId !== userId) {
        return res.status(404).json({ message: "Deployment not found" });
      }

      const updated = await storage.updateAgentDeployment(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating deployment:", error);
      res.status(500).json({ message: "Failed to update deployment" });
    }
  });

  app.delete("/api/deployments/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const deployment = await storage.getAgentDeployment(parseInt(req.params.id));
      
      if (!deployment || deployment.creatorId !== userId) {
        return res.status(404).json({ message: "Deployment not found" });
      }

      await storage.deleteAgentDeployment(parseInt(req.params.id));
      res.json({ message: "Deployment deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting deployment:", error);
      res.status(500).json({ message: "Failed to delete deployment" });
    }
  });

  app.get("/api/deployments/:id/analytics", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const deployment = await storage.getAgentDeployment(parseInt(req.params.id));
      
      if (!deployment || deployment.creatorId !== userId) {
        return res.status(404).json({ message: "Deployment not found" });
      }

      const timeframe = (req.query.timeframe as 'day' | 'week' | 'month') || 'week';
      const analytics = await storage.getDeploymentAnalytics(parseInt(req.params.id), timeframe);
      res.json(analytics);
    } catch (error: any) {
      console.error("Error fetching deployment analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/deployments/:id/usage", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.userId;
      const deployment = await storage.getAgentDeployment(parseInt(req.params.id));
      
      if (!deployment || deployment.creatorId !== userId) {
        return res.status(404).json({ message: "Deployment not found" });
      }

      const limit = parseInt(req.query.limit as string) || 100;
      const usage = await storage.getDeploymentUsage(parseInt(req.params.id), limit);
      res.json(usage);
    } catch (error: any) {
      console.error("Error fetching deployment usage:", error);
      res.status(500).json({ message: "Failed to fetch usage" });
    }
  });

  // Dynamic agent execution endpoint
  app.post("/api/agents/deployed/:endpoint(*)", async (req, res) => {
    try {
      const endpoint = `/api/agents/deployed/${req.params.endpoint}`;
      const deployment = await storage.getAgentDeploymentByEndpoint(endpoint);
      
      if (!deployment) {
        return res.status(404).json({ message: "Agent not found" });
      }

      if (deployment.status !== 'active') {
        return res.status(503).json({ message: "Agent is not active" });
      }

      // Record usage
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startTime = Date.now();
      
      try {
        // Simulate agent execution (in real implementation, this would call the actual AI model)
        const result = await simulateAgentExecution(deployment, req.body);
        const responseTime = Date.now() - startTime;
        
        // Record successful usage
        await storage.recordAgentUsage({
          deploymentId: deployment.id,
          userId: req.headers.authorization ? (req as any).user?.userId : null,
          requestId,
          inputData: req.body,
          outputData: result,
          responseTime,
          tokensUsed: Math.floor(Math.random() * 1000) + 100, // Mock token usage
          cost: parseFloat(deployment.pricePerCall || '0.01'),
          status: 'success',
          httpStatusCode: 200,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        });

        // Update deployment stats
        await storage.updateDeploymentStats(deployment.id, {
          totalCalls: (deployment.totalCalls || 0) + 1,
          totalRevenue: parseFloat(deployment.totalRevenue || '0') + parseFloat(deployment.pricePerCall || '0.01'),
          lastUsed: new Date(),
          healthStatus: 'healthy',
        });

        res.json(result);
      } catch (executionError: any) {
        const responseTime = Date.now() - startTime;
        
        // Record failed usage
        await storage.recordAgentUsage({
          deploymentId: deployment.id,
          userId: req.headers.authorization ? (req as any).user?.userId : null,
          requestId,
          inputData: req.body,
          outputData: null,
          responseTime,
          tokensUsed: 0,
          cost: 0,
          status: 'error',
          errorMessage: executionError.message,
          httpStatusCode: 500,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        });

        res.status(500).json({ message: "Agent execution failed", error: executionError.message });
      }
    } catch (error: any) {
      console.error("Error executing deployed agent:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Payment History
  app.get("/api/payments/history", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });
      
      const payments = await paymentService.getUserPaymentHistory(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      res.status(500).json({ message: "Failed to fetch payment history" });
    }
  });

  // Stripe Webhooks
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }
      
      const sig = req.headers['stripe-signature'] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        return res.status(500).json({ message: "Webhook secret not configured" });
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.object);
          break;
        case 'invoice.payment_succeeded':
          console.log('Subscription payment succeeded:', event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // Chat agent creation endpoint
  // OpenAI-powered chat endpoints
  app.post("/api/chat/openai", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { openaiChatService } = await import('./openai-chat');
      const result = await openaiChatService.generateAgentResponse(req.body);
      res.json(result);
    } catch (error) {
      console.error('OpenAI chat error:', error);
      res.status(500).json({ message: 'Failed to generate response' });
    }
  });

  app.post("/api/chat/generate-workflow", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { openaiChatService } = await import('./openai-chat');
      const result = await openaiChatService.generateWorkflow(
        req.body.agentData, 
        req.body.tools, 
        req.body.conversationHistory
      );
      res.json(result);
    } catch (error) {
      console.error('Workflow generation error:', error);
      res.status(500).json({ message: 'Failed to generate workflow' });
    }
  });

  app.post("/api/chat/create-agent", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { message, userRequirements } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Chat message is required" });
      }

      // Parse the chat message to extract agent requirements
      let agentRequest: N8nAgentRequest;
      
      if (userRequirements) {
        // If explicit requirements provided, use them
        agentRequest = userRequirements;
      } else {
        // Parse from chat message
        const parsed = n8nService.parseAgentRequest(message);
        if (!parsed) {
          return res.status(400).json({ 
            message: "Could not understand agent requirements from message. Please be more specific." 
          });
        }
        agentRequest = parsed;
      }

      // Create the workflow in n8n
      const workflowResult = await n8nService.createAgentWorkflow(agentRequest);

      // Save agent to database
      const agentData = {
        name: agentRequest.name,
        description: agentRequest.description,
        category: agentRequest.category,
        price: "0", // Free for user-created agents
        featured: false,
        tags: [agentRequest.category, 'user-created', 'n8n'],
        tools: agentRequest.tools,
        aiModel: agentRequest.aiModel,
        systemPrompt: agentRequest.prompt,
        workflowId: workflowResult.workflowId,
        webhookUrl: workflowResult.webhookUrl,
        createdBy: req.user?.userId,
        isActive: true
      };

      const savedAgent = await storage.createAgent(agentData);

      // Generate optimized prompt for recreating the agent
      const generateSingleAgentPrompt = (agentRequest: any, originalMessage: string, systemPrompt: string) => {
        return `Create an AI agent with the following specifications:

**Agent Name:** ${agentRequest.name}
**Description:** ${agentRequest.description}
**Category:** ${agentRequest.category}
**AI Model:** ${agentRequest.aiModel}

**System Prompt:**
${systemPrompt}

**Tools & Integrations:**
${agentRequest.tools.map((tool: string) => `- ${tool}`).join('\n')}

**Original User Request:**
${originalMessage}

**Implementation Notes:**
- Generate n8n workflow for immediate deployment
- Include proper error handling and logging
- Configure webhook endpoints for API access
- Add appropriate authentication and rate limiting
- Provide deployment documentation

This agent should be ready for production deployment in n8n with proper monitoring and alerting capabilities.`;
      };

      const optimizedAgentPrompt = generateSingleAgentPrompt(
        agentRequest, 
        message,
        agentRequest.prompt || `You are ${agentRequest.name}, ${agentRequest.description}`
      );

      // Send webhook notification to n8n
      try {
        const webhookData = {
          event: "agent_created",
          timestamp: new Date().toISOString(),
          agent: {
            id: savedAgent.id,
            name: agentRequest.name,
            description: agentRequest.description,
            category: agentRequest.category,
            tools: agentRequest.tools,
            aiModel: agentRequest.aiModel,
            type: "n8n_only"
          },
          user: {
            id: req.user?.userId || "unknown",
            username: req.user?.username || "unknown"
          },
          implementations: {
            n8n: {
              workflowId: workflowResult.workflowId,
              webhookUrl: workflowResult.webhookUrl
            }
          },
          message: message,
          fromChat: true,
          recreationPrompt: optimizedAgentPrompt
        };

        const webhookResponse = await fetch('https://ainomads.app.n8n.cloud/webhook/2408e72d-67a7-4931-a33a-7974962bf9f7', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        console.log(`Webhook sent: ${webhookResponse.status} - Agent created: ${agentRequest.name}`);
      } catch (webhookError) {
        console.error("Failed to send webhook notification:", webhookError);
        // Continue without failing the agent creation
      }

      res.json({
        success: true,
        agent: savedAgent,
        workflow: {
          id: workflowResult.workflowId,
          webhookUrl: workflowResult.webhookUrl
        },
        message: `Successfully created ${agentRequest.name} and deployed to n8n!`
      });

    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ 
        message: "Failed to create agent", 
        error: error.message 
      });
    }
  });

  // Enhanced agent creation with both n8n and Python implementations
  app.post("/api/chat/create-dual-agent", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { 
        agentData, 
        conversationHistory,
        optimizedPrompt 
      } = req.body;

      if (!agentData || !conversationHistory) {
        return res.status(400).json({ message: "Agent data and conversation history are required" });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }

      // Parse agent request for n8n
      let agentRequest: N8nAgentRequest;
      const messageContent = conversationHistory
        .filter((msg: any) => msg.role === 'user')
        .map((msg: any) => msg.content)
        .join(' ');

      try {
        agentRequest = n8nService.parseAgentRequest(messageContent);
        
        if (!agentRequest) {
          agentRequest = {
            name: agentData.name || "Custom Agent",
            description: agentData.description || "AI Assistant created from conversation",
            category: agentData.category || "general",
            tools: agentData.tools || [],
            aiModel: agentData.aiModel || "gpt-4"
          };
        }
      } catch (parseError) {
        agentRequest = {
          name: agentData.name || "Custom Agent",
          description: agentData.description || "AI Assistant created from conversation",
          category: agentData.category || "general", 
          tools: agentData.tools || [],
          aiModel: agentData.aiModel || "gpt-4"
        };
      }

      // Create n8n workflow
      const workflowResult = await n8nService.createAgentWorkflow(agentRequest);
      
      // Prepare Claude agent generation request
      const claudeRequest: AgentGenerationRequest = {
        userId: userId,
        agentName: agentRequest.name,
        agentDescription: agentRequest.description,
        tools: agentRequest.tools,
        category: agentRequest.category,
        aiModel: agentRequest.aiModel,
        systemPrompt: agentData.systemPrompt || `You are ${agentRequest.name}, ${agentRequest.description}`,
        conversationHistory: conversationHistory,
        optimizedPrompt: optimizedPrompt
      };

      // Generate Python agent with Claude
      const pythonAgent = await claudeAgentGenerator.generatePythonAgent(claudeRequest);

      // Save both implementations to file system
      const savedPaths = await claudeAgentGenerator.saveAgentFiles(
        claudeRequest,
        pythonAgent,
        workflowResult
      );

      // Save agent to database
      const dbAgentData = {
        name: agentRequest.name,
        description: agentRequest.description,
        category: agentRequest.category,
        tools: agentRequest.tools,
        aiModel: agentRequest.aiModel,
        systemPrompt: agentData.systemPrompt || `You are ${agentRequest.name}, ${agentRequest.description}`,
        features: agentData.features || [],
        price: agentData.price || "0",
        styling: agentData.styling || {},
        createdBy: userId,
        workflowId: workflowResult.workflowId,
        webhookUrl: workflowResult.webhookUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        responseTime: null,
        usageVolume: null,
        performanceScore: null,
        lastUsed: null,
        totalExecutions: null,
        errorRate: null,
        avgResponseTime: null,
        deploymentStatus: "deployed",
        deployedAt: new Date(),
        agentType: "dual", // Mark as dual implementation
        pythonPath: savedPaths.pythonPath,
        n8nPath: savedPaths.n8nPath
      };

      const savedAgent = await storage.createAgent(dbAgentData);

      // Generate optimized prompt for recreating the agent
      const generateOptimizedPrompt = (agentRequest: any, conversationHistory: any[], systemPrompt: string) => {
        const userMessages = conversationHistory
          .filter((msg: any) => msg.role === 'user')
          .map((msg: any) => msg.content)
          .join(' ');

        return `Create an AI agent with the following specifications:

**Agent Name:** ${agentRequest.name}
**Description:** ${agentRequest.description}
**Category:** ${agentRequest.category}
**AI Model:** ${agentRequest.aiModel}

**System Prompt:**
${systemPrompt}

**Tools & Integrations:**
${agentRequest.tools.map((tool: string) => `- ${tool}`).join('\n')}

**User Requirements (from conversation):**
${userMessages.substring(0, 500)}...

**Implementation Notes:**
- Generate both n8n workflow and Python implementation
- Include comprehensive error handling and logging
- Provide complete documentation and setup instructions
- Add unit tests for the Python implementation
- Configure with environment variables for API keys

This agent should be production-ready with proper authentication, rate limiting, and monitoring capabilities.`;
      };

      const optimizedAgentPrompt = generateOptimizedPrompt(
        agentRequest, 
        conversationHistory, 
        agentData.systemPrompt || `You are ${agentRequest.name}, ${agentRequest.description}`
      );

      // Send webhook notification to n8n
      try {
        const webhookData = {
          event: "agent_created",
          timestamp: new Date().toISOString(),
          agent: {
            id: savedAgent.id,
            name: agentRequest.name,
            description: agentRequest.description,
            category: agentRequest.category,
            tools: agentRequest.tools,
            aiModel: agentRequest.aiModel,
            type: "dual_implementation"
          },
          user: {
            id: userId,
            username: req.user?.username || "unknown"
          },
          implementations: {
            n8n: {
              workflowId: workflowResult.workflowId,
              webhookUrl: workflowResult.webhookUrl
            },
            python: {
              generated: true,
              filesCreated: 5
            }
          },
          conversationHistory: conversationHistory.length,
          optimizedPrompt: optimizedPrompt ? true : false,
          recreationPrompt: optimizedAgentPrompt
        };

        const webhookResponse = await fetch('https://ainomads.app.n8n.cloud/webhook/2408e72d-67a7-4931-a33a-7974962bf9f7', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        console.log(`Webhook sent: ${webhookResponse.status} - Agent created: ${agentRequest.name}`);
      } catch (webhookError) {
        console.error("Failed to send webhook notification:", webhookError);
        // Continue without failing the agent creation
      }

      res.json({
        success: true,
        agent: savedAgent,
        implementations: {
          n8n: {
            workflowId: workflowResult.workflowId,
            webhookUrl: workflowResult.webhookUrl,
            path: savedPaths.n8nPath
          },
          python: {
            path: savedPaths.pythonPath,
            files: {
              agent: 'agent.py',
              requirements: 'requirements.txt',
              config: 'config.yaml',
              readme: 'README.md',
              tests: 'test_agent.py'
            }
          }
        },
        message: `Successfully created ${agentRequest.name} with both n8n and Python implementations!`
      });

    } catch (error) {
      console.error("Error creating dual agent:", error);
      res.status(500).json({ 
        message: "Failed to create dual agent", 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // List user's agent files
  app.get("/api/chat/user-agents/:userId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.params.userId;
      
      // Verify user can only access their own agents
      if (userId !== req.user?.userId) {
        return res.status(403).json({ message: "Not authorized to access these agents" });
      }

      const agentList = await claudeAgentGenerator.listUserAgents(userId);
      res.json({ agents: agentList });
    } catch (error) {
      console.error("Error listing user agents:", error);
      res.status(500).json({ message: "Failed to list user agents" });
    }
  });

  // Get user's created agents
  app.get("/api/chat/my-agents", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const agents = await storage.getUserCreatedAgents(req.user?.userId);
      res.json(agents);
    } catch (error) {
      console.error("Error fetching user agents:", error);
      res.status(500).json({ message: "Failed to fetch user agents" });
    }
  });

  // Delete user's agent and its n8n workflow
  app.delete("/api/chat/agents/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const agentId = parseInt(req.params.id);
      const agent = await storage.getAgent(agentId);

      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      if (agent.createdBy !== req.user?.userId) {
        return res.status(403).json({ message: "Not authorized to delete this agent" });
      }

      // Delete from n8n if it has a workflow
      if (agent.workflowId) {
        try {
          await n8nService.deleteWorkflow(agent.workflowId);
        } catch (error) {
          console.warn("Failed to delete n8n workflow:", error);
          // Continue with agent deletion even if n8n deletion fails
        }
      }

      // Delete from database
      await storage.deleteAgent(agentId);

      res.json({ success: true, message: "Agent deleted successfully" });
    } catch (error) {
      console.error("Error deleting agent:", error);
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulate agent execution for MVP (replace with actual AI model calls)
async function simulateAgentExecution(deployment: any, input: any) {
  const delay = Math.random() * 2000 + 500; // 500ms to 2.5s delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Mock response based on agent category
  const responses = {
    'productivity': {
      result: 'Task automated successfully',
      confidence: 0.95,
      suggestions: ['Consider scheduling this task', 'Add to your daily routine']
    },
    'analytics': {
      metrics: { accuracy: 0.92, processing_time: '1.2s' },
      insights: ['Data trend is positive', 'Outliers detected in recent data'],
      visualization_url: 'https://charts.example.com/abc123'
    },
    'marketing': {
      content: 'Generated marketing copy based on your input',
      engagement_score: 8.7,
      target_audience: 'Tech professionals aged 25-40'
    },
    'development': {
      code_analysis: 'Code quality score: 85/100',
      recommendations: ['Optimize database queries', 'Add error handling'],
      estimated_improvement: '15% performance boost'
    }
  };

  const category = deployment.category?.toLowerCase() || 'productivity';
  return responses[category as keyof typeof responses] || responses.productivity;
}
