import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  jsonb,
  decimal,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sessions table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique(),
  password: text("password"),
  walletAddress: varchar("wallet_address").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Simplified agents table to match current database
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  features: text("features").array().default([]),
  tools: text("tools").array().default([]),
  aiModel: varchar("ai_model").default("gpt-4o"),
  systemPrompt: text("system_prompt"),
  responseTime: varchar("response_time"),
  usageVolume: varchar("usage_volume"),
  errorHandling: varchar("error_handling"),
  availability: varchar("availability"),
  styling: jsonb("styling"),
  workflowId: varchar("workflow_id", { length: 255 }),
  webhookUrl: varchar("webhook_url", { length: 500 }),
  createdBy: varchar("created_by", { length: 255 }),
  isActive: boolean("is_active").default(true),
  creatorId: varchar("creator_id"),
  deploymentStatus: varchar("deployment_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Waitlist users table
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

// Contributor applications table
export const contributorApplications = pgTable("contributor_applications", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  githubUsername: varchar("github_username", { length: 255 }).notNull(),
  huggingFaceUrl: varchar("hugging_face_url", { length: 500 }),
  motivation: text("motivation").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
}));

export const agentsRelations = relations(agents, ({ one }) => ({
  creator: one(users, {
    fields: [agents.creatorId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContributorApplicationSchema = createInsertSchema(contributorApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Auth schemas for compatibility
export const signupUserSchema = insertUserSchema.extend({
  username: z.string().min(3),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  subscriptionPlan: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type WaitlistUser = typeof waitlistUsers.$inferSelect;
export type InsertWaitlistUser = z.infer<typeof insertWaitlistUserSchema>;

export type ContributorApplication = typeof contributorApplications.$inferSelect;
export type InsertContributorApplication = z.infer<typeof insertContributorApplicationSchema>;