import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ethers } from "ethers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signupUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Get all agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
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

  // Get specific agent
  app.get("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
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
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      // Create user
      const user = await storage.createUser({
        email: validatedData.email,
        username: validatedData.username,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        password: hashedPassword,
        walletAddress: validatedData.walletAddress || null,
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

  const httpServer = createServer(app);
  return httpServer;
}
