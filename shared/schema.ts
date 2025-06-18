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

// Users table with Web3 wallet integration and authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }).unique(),
  email: varchar("email").unique(),
  username: varchar("username").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  phoneVerified: boolean("phone_verified").default(false),
  phoneVerificationCode: varchar("phone_verification_code"),
  phoneVerificationExpiry: timestamp("phone_verification_expiry"),
  password: varchar("password"), // For non-wallet users
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
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

// Agent tags table
export const agentTags = pgTable("agent_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#10b981"), // emerald-500 default
  createdAt: timestamp("created_at").defaultNow(),
});

// Many-to-many relationship between agents and tags
export const agentTagRelations = pgTable("agent_tag_relations", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  tagId: integer("tag_id").notNull().references(() => agentTags.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_agent_tag_agent").on(table.agentId),
  index("idx_agent_tag_tag").on(table.tagId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(userPurchases),
  transactions: many(transactions),
}));

export const agentsRelations = relations(agents, ({ many }) => ({
  purchases: many(userPurchases),
  transactions: many(transactions),
  tagRelations: many(agentTagRelations),
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

// Tag relations
export const agentTagsRelations = relations(agentTags, ({ many }) => ({
  agentRelations: many(agentTagRelations),
}));

export const agentTagRelationsRelations = relations(agentTagRelations, ({ one }) => ({
  agent: one(agents, {
    fields: [agentTagRelations.agentId],
    references: [agents.id],
  }),
  tag: one(agentTags, {
    fields: [agentTagRelations.tagId],
    references: [agentTags.id],
  }),
}));

// Nomad Lands ecosystem tables
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  walletAddress: varchar("wallet_address", { length: 42 }),
  avatar: varchar("avatar"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const nomadAgents = pgTable("nomad_agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  companyId: integer("company_id").references(() => companies.id),
  pricePerRun: integer("price_per_run").notNull(), // in wei
  pricePerHour: integer("price_per_hour"), // in wei
  availability: varchar("availability").default("available"), // available, busy, offline
  skills: text("skills").array(),
  rating: integer("rating").default(5),
  totalRuns: integer("total_runs").default(0),
  icon: varchar("icon"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agentHires = pgTable("agent_hires", {
  id: serial("id").primaryKey(),
  hirerId: varchar("hirer_id").notNull().references(() => users.id),
  agentId: integer("agent_id").notNull().references(() => nomadAgents.id),
  contractId: integer("contract_id").references(() => smartContracts.id),
  hireType: varchar("hire_type").notNull(), // "per_run" | "per_hour"
  amount: integer("amount").notNull(), // in wei
  status: varchar("status").default("pending"), // pending, active, completed, cancelled
  taskDescription: text("task_description"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  transactionHash: varchar("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Smart Contracts marketplace
export const smartContracts = pgTable("smart_contracts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  contractAddress: varchar("contract_address", { length: 42 }),
  abi: text("abi"), // JSON string of contract ABI
  taxPercentage: integer("tax_percentage").default(250), // 2.5% = 250 basis points
  minAmount: integer("min_amount"), // minimum amount in wei
  maxAmount: integer("max_amount"), // maximum amount in wei
  features: text("features").array(),
  gasEstimate: integer("gas_estimate"),
  icon: varchar("icon"),
  verified: boolean("verified").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contractEngagements = pgTable("contract_engagements", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull().references(() => smartContracts.id),
  partyAId: varchar("party_a_id").notNull().references(() => users.id),
  partyBId: varchar("party_b_id").notNull().references(() => users.id),
  partyAWallet: varchar("party_a_wallet", { length: 42 }).notNull(),
  partyBWallet: varchar("party_b_wallet", { length: 42 }).notNull(),
  amount: integer("amount").notNull(), // in wei
  taxAmount: integer("tax_amount").notNull(), // calculated tax in wei
  status: varchar("status").default("pending"), // pending, active, completed, disputed
  terms: text("terms"),
  transactionHash: varchar("transaction_hash"),
  blockNumber: integer("block_number"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User uploads and files
export const userFiles = pgTable("user_files", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type"),
  fileSize: integer("file_size"),
  filePath: varchar("file_path"),
  description: text("description"),
  category: varchar("category"), // agent, contract, document
  associatedAgentId: integer("associated_agent_id").references(() => nomadAgents.id),
  associatedContractId: integer("associated_contract_id").references(() => contractEngagements.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  phoneNumber: true,
  password: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  walletAddress: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  phoneNumber: true,
  password: true,
});

export const signupUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
  password: true,
}).extend({
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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

export const insertTagSchema = createInsertSchema(agentTags).pick({
  name: true,
  slug: true,
  description: true,
  color: true,
});

export const insertTagRelationSchema = createInsertSchema(agentTagRelations).pick({
  agentId: true,
  tagId: true,
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;
export type AgentTag = typeof agentTags.$inferSelect;
export type InsertTagRelation = z.infer<typeof insertTagRelationSchema>;
export type AgentTagRelation = typeof agentTagRelations.$inferSelect;

// Add relations for new tables
export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerId],
    references: [users.id],
  }),
  agents: many(nomadAgents),
}));

export const nomadAgentsRelations = relations(nomadAgents, ({ one, many }) => ({
  owner: one(users, {
    fields: [nomadAgents.ownerId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [nomadAgents.companyId],
    references: [companies.id],
  }),
  hires: many(agentHires),
}));

export const agentHiresRelations = relations(agentHires, ({ one }) => ({
  hirer: one(users, {
    fields: [agentHires.hirerId],
    references: [users.id],
  }),
  agent: one(nomadAgents, {
    fields: [agentHires.agentId],
    references: [nomadAgents.id],
  }),
  contract: one(smartContracts, {
    fields: [agentHires.contractId],
    references: [smartContracts.id],
  }),
}));

export const smartContractsRelations = relations(smartContracts, ({ many }) => ({
  engagements: many(contractEngagements),
  agentHires: many(agentHires),
}));

export const contractEngagementsRelations = relations(contractEngagements, ({ one }) => ({
  contract: one(smartContracts, {
    fields: [contractEngagements.contractId],
    references: [smartContracts.id],
  }),
  partyA: one(users, {
    fields: [contractEngagements.partyAId],
    references: [users.id],
  }),
  partyB: one(users, {
    fields: [contractEngagements.partyBId],
    references: [users.id],
  }),
}));

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(users, {
    fields: [userFiles.userId],
    references: [users.id],
  }),
  nomadAgent: one(nomadAgents, {
    fields: [userFiles.associatedAgentId],
    references: [nomadAgents.id],
  }),
  contractEngagement: one(contractEngagements, {
    fields: [userFiles.associatedContractId],
    references: [contractEngagements.id],
  }),
}));

// New schemas for Nomad Lands ecosystem
export const insertCompanySchema = createInsertSchema(companies).pick({
  name: true,
  description: true,
  ownerId: true,
  walletAddress: true,
  avatar: true,
});

export const insertNomadAgentSchema = createInsertSchema(nomadAgents).pick({
  name: true,
  description: true,
  category: true,
  ownerId: true,
  companyId: true,
  pricePerRun: true,
  pricePerHour: true,
  skills: true,
  icon: true,
});

export const insertAgentHireSchema = createInsertSchema(agentHires).pick({
  hirerId: true,
  agentId: true,
  contractId: true,
  hireType: true,
  amount: true,
  taskDescription: true,
});

export const insertSmartContractSchema = createInsertSchema(smartContracts).pick({
  name: true,
  description: true,
  category: true,
  contractAddress: true,
  abi: true,
  taxPercentage: true,
  minAmount: true,
  maxAmount: true,
  features: true,
  gasEstimate: true,
  icon: true,
});

export const insertContractEngagementSchema = createInsertSchema(contractEngagements).pick({
  contractId: true,
  partyAId: true,
  partyBId: true,
  partyAWallet: true,
  partyBWallet: true,
  amount: true,
  terms: true,
});

export const insertUserFileSchema = createInsertSchema(userFiles).pick({
  userId: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  description: true,
  category: true,
  associatedAgentId: true,
  associatedContractId: true,
});

// New types for Nomad Lands ecosystem
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertNomadAgent = z.infer<typeof insertNomadAgentSchema>;
export type NomadAgent = typeof nomadAgents.$inferSelect;
export type InsertAgentHire = z.infer<typeof insertAgentHireSchema>;
export type AgentHire = typeof agentHires.$inferSelect;
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
export type SmartContract = typeof smartContracts.$inferSelect;
export type InsertContractEngagement = z.infer<typeof insertContractEngagementSchema>;
export type ContractEngagement = typeof contractEngagements.$inferSelect;
export type InsertUserFile = z.infer<typeof insertUserFileSchema>;
export type UserFile = typeof userFiles.$inferSelect;
