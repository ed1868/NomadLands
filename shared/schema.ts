import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
  index,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with Web3 wallet integration
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }).unique().notNull(),
  email: varchar("email"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  phoneVerified: boolean("phone_verified").default(false),
  phoneVerificationCode: varchar("phone_verification_code"),
  phoneVerificationExpiry: timestamp("phone_verification_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Agents marketplace table
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  priceInWei: varchar("price_in_wei", { length: 100 }).notNull(), // Blockchain price in Wei
  contractAddress: varchar("contract_address", { length: 42 }), // Smart contract address
  tokenId: integer("token_id"), // NFT token ID if applicable
  icon: text("icon").notNull(),
  features: text("features").array().notNull(),
  gradientFrom: text("gradient_from").notNull(),
  gradientTo: text("gradient_to").notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User purchases table to track agent ownership
export const userPurchases = pgTable("user_purchases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull(),
  blockNumber: integer("block_number"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Blockchain transactions table for audit trail
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: integer("agent_id").references(() => agents.id),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull().unique(),
  fromAddress: varchar("from_address", { length: 42 }).notNull(),
  toAddress: varchar("to_address", { length: 42 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(), // Wei amount
  gasUsed: varchar("gas_used", { length: 100 }),
  gasPrice: varchar("gas_price", { length: 100 }),
  blockNumber: integer("block_number"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, confirmed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(userPurchases),
  transactions: many(transactions),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  purchases: many(userPurchases),
  transactions: many(transactions),
}));

export const userPurchasesRelations = relations(userPurchases, ({ one }) => ({
  user: one(users, {
    fields: [userPurchases.userId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [userPurchases.agentId],
    references: [agents.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [transactions.agentId],
    references: [agents.id],
  }),
}));

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  walletAddress: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertAgentSchema = createInsertSchema(agents).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  priceInWei: true,
  contractAddress: true,
  tokenId: true,
  icon: true,
  features: true,
  gradientFrom: true,
  gradientTo: true,
  featured: true,
});

export const insertPurchaseSchema = createInsertSchema(userPurchases).pick({
  userId: true,
  agentId: true,
  transactionHash: true,
  blockNumber: true,
  purchasePrice: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  agentId: true,
  transactionHash: true,
  fromAddress: true,
  toAddress: true,
  value: true,
  gasUsed: true,
  gasPrice: true,
  blockNumber: true,
  status: true,
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
