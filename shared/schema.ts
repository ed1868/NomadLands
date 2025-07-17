import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
  index,
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

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash").notNull(),
  walletAddress: varchar("wallet_address"),
  phoneNumber: varchar("phone_number"),
  phoneVerificationCode: varchar("phone_verification_code"),
  phoneVerificationExpiry: timestamp("phone_verification_expiry"),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  subcategory: varchar("subcategory"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.05"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalPurchases: integer("total_purchases").default(0),
  imageUrl: varchar("image_url"),
  features: text("features").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  styling: jsonb("styling"),
  // Enhanced fields for comprehensive agent configuration
  creatorId: varchar("creator_id").references(() => users.id),
  aiModel: varchar("ai_model").default("gpt-4o"),
  systemPrompt: text("system_prompt"),
  accessType: varchar("access_type").default("public"), // public, private, enterprise
  tools: text("tools").array().default([]),
  responseTime: varchar("response_time"), // instant, fast, standard, batch
  usageVolume: varchar("usage_volume"), // low, medium, high, enterprise
  errorHandling: varchar("error_handling"), // retry, fallback, human, queue
  availability: varchar("availability"), // 24x7, business, scheduled, on-demand
  deploymentStatus: varchar("deployment_status").default("pending"), // pending, approved, deployed, rejected
  approvedAt: timestamp("approved_at"),
  deployedAt: timestamp("deployed_at"),
});

// Agent deployments table for tracking live agent instances
export const agentDeployments = pgTable("agent_deployments", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").references(() => agents.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  endpoint: varchar("endpoint").unique().notNull(),
  status: varchar("status").default("active"), // active, paused, stopped
  totalCalls: integer("total_calls").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  lastUsed: timestamp("last_used"),
  healthStatus: varchar("health_status").default("healthy"), // healthy, warning, error
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent usage analytics
export const agentUsage = pgTable("agent_usage", {
  id: serial("id").primaryKey(),
  deploymentId: integer("deployment_id").references(() => agentDeployments.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  requestId: varchar("request_id").notNull(),
  responseTime: integer("response_time"), // in milliseconds
  success: boolean("success").default(true),
  errorMessage: text("error_message"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  cost: decimal("cost", { precision: 8, scale: 4 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPurchases = pgTable("user_purchases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull(),
  blockNumber: integer("block_number"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

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

export const agentTags = pgTable("agent_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#10b981"), // emerald-500 default
  createdAt: timestamp("created_at").defaultNow(),
});

export const agentTagRelations = pgTable("agent_tag_relations", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  tagId: integer("tag_id").notNull().references(() => agentTags.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_agent_tag_agent").on(table.agentId),
  index("idx_agent_tag_tag").on(table.tagId),
]);

export const waitlistUsers = pgTable("waitlist_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isEngineer: boolean("is_engineer").default(false),
  hasPaidRush: boolean("has_paid_rush").default(false),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  rushPaymentAmount: integer("rush_payment_amount").default(0),
  position: integer("position"),
  effectivePosition: integer("effective_position"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// N8N Workflow Deployments table
export const n8nWorkflows = pgTable("n8n_workflows", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  agentId: integer("agent_id").references(() => agents.id),
  
  // N8N specific data
  n8nWorkflowId: varchar("n8n_workflow_id").notNull(), // WkJZNfito1pSxrQU
  workflowName: varchar("workflow_name").notNull(),
  webhookUrl: varchar("webhook_url"),
  webhookPath: varchar("webhook_path"),
  
  // Workflow configuration
  nodes: jsonb("nodes").notNull(), // Full nodes array
  connections: jsonb("connections").notNull(), // Node connections
  settings: jsonb("settings"), // Workflow settings
  
  // Status and metadata
  isActive: boolean("is_active").default(false),
  isArchived: boolean("is_archived").default(false),
  versionId: varchar("version_id"),
  triggerCount: integer("trigger_count").default(0),
  
  // Performance metrics
  totalRuns: integer("total_runs").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0.00"),
  averageRunTime: integer("average_run_time"), // milliseconds
  lastRunAt: timestamp("last_run_at"),
  
  // Revenue tracking
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0.00"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("unique_n8n_workflow_id").on(table.n8nWorkflowId),
  index("idx_n8n_workflows_user_id").on(table.userId),
  index("idx_n8n_workflows_agent_id").on(table.agentId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(userPurchases),
  transactions: many(transactions),
  createdAgents: many(agents),
  deployments: many(agentDeployments),
  usageRecords: many(agentUsage),
  n8nWorkflows: many(n8nWorkflows),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  creator: one(users, {
    fields: [agents.creatorId],
    references: [users.id],
  }),
  purchases: many(userPurchases),
  tagRelations: many(agentTagRelations),
  deployments: many(agentDeployments),
  n8nWorkflows: many(n8nWorkflows),
}));

export const agentDeploymentsRelations = relations(agentDeployments, ({ one, many }) => ({
  agent: one(agents, {
    fields: [agentDeployments.agentId],
    references: [agents.id],
  }),
  user: one(users, {
    fields: [agentDeployments.userId],
    references: [users.id],
  }),
  usageRecords: many(agentUsage),
}));

export const agentUsageRelations = relations(agentUsage, ({ one }) => ({
  deployment: one(agentDeployments, {
    fields: [agentUsage.deploymentId],
    references: [agentDeployments.id],
  }),
  user: one(users, {
    fields: [agentUsage.userId],
    references: [users.id],
  }),
}));

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

export const n8nWorkflowsRelations = relations(n8nWorkflows, ({ one }) => ({
  user: one(users, {
    fields: [n8nWorkflows.userId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [n8nWorkflows.agentId],
    references: [agents.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedAt: true,
  deployedAt: true,
});

export const insertAgentDeploymentSchema = createInsertSchema(agentDeployments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentUsageSchema = createInsertSchema(agentUsage).omit({
  id: true,
  createdAt: true,
});

export const insertTagSchema = createInsertSchema(agentTags).omit({
  id: true,
});

export const insertPurchaseSchema = createInsertSchema(userPurchases).omit({
  id: true,
  purchasedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertN8nWorkflowSchema = createInsertSchema(n8nWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type WaitlistUser = typeof waitlistUsers.$inferSelect;
export type InsertWaitlistUser = z.infer<typeof insertWaitlistUserSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type AgentDeployment = typeof agentDeployments.$inferSelect;
export type InsertAgentDeployment = z.infer<typeof insertAgentDeploymentSchema>;

export type AgentUsage = typeof agentUsage.$inferSelect;
export type InsertAgentUsage = z.infer<typeof insertAgentUsageSchema>;

export type AgentTag = typeof agentTags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type AgentTagRelation = typeof agentTagRelations.$inferSelect;

export type UserPurchase = typeof userPurchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type N8nWorkflow = typeof n8nWorkflows.$inferSelect;
export type InsertN8nWorkflow = z.infer<typeof insertN8nWorkflowSchema>;