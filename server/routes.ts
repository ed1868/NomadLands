import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ethers } from "ethers";
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

  const httpServer = createServer(app);
  return httpServer;
}
