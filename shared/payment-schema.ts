import { pgTable, varchar, text, decimal, timestamp, boolean, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users, agents } from "./schema";

// Payment methods and transactions
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // stripe_card, paypal, apple_pay, crypto_wallet, bank_account
  provider: varchar("provider").notNull(), // stripe, paypal, apple, metamask, coinbase
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  // Provider-specific identifiers
  stripePaymentMethodId: varchar("stripe_payment_method_id"),
  paypalAccountId: varchar("paypal_account_id"),
  cryptoWalletAddress: varchar("crypto_wallet_address"),
  
  // Card details (last 4 digits, brand, etc. for display)
  cardLast4: varchar("card_last4"),
  cardBrand: varchar("card_brand"),
  cardExpMonth: integer("card_exp_month"),
  cardExpYear: integer("card_exp_year"),
  
  // Metadata
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment transactions for all types
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
  
  // Transaction details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  type: varchar("type").notNull(), // subscription, agent_purchase, contract, crypto_exchange
  status: varchar("status").notNull(), // pending, processing, completed, failed, refunded
  
  // Related entities
  agentId: integer("agent_id").references(() => agents.id),
  subscriptionId: integer("subscription_id"),
  contractId: integer("contract_id"),
  
  // Provider transaction IDs
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  paypalOrderId: varchar("paypal_order_id"),
  cryptoTransactionHash: varchar("crypto_transaction_hash"),
  
  // Fees and revenue sharing
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }),
  creatorRevenue: decimal("creator_revenue", { precision: 10, scale: 2 }),
  processingFee: decimal("processing_fee", { precision: 10, scale: 2 }),
  
  // Metadata and audit
  description: text("description"),
  metadata: jsonb("metadata"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription plans and billing
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(), // trial, nomad, pioneer, sovereign
  description: text("description"),
  
  // Pricing
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }),
  
  // Features and limits
  maxAgents: integer("max_agents"), // null for unlimited
  maxFleets: integer("max_fleets"),
  hasAdvancedAnalytics: boolean("has_advanced_analytics").default(false),
  hasWhiteLabel: boolean("has_white_label").default(false),
  hasPrioritySupport: boolean("has_priority_support").default(false),
  
  // Provider plan IDs
  stripePriceId: varchar("stripe_price_id"),
  stripeYearlyPriceId: varchar("stripe_yearly_price_id"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  
  status: varchar("status").notNull(), // trial, active, past_due, canceled, expired
  billingCycle: varchar("billing_cycle").notNull(), // monthly, yearly
  
  // Billing dates
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  canceledAt: timestamp("canceled_at"),
  
  // Provider subscription IDs
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  
  // Metadata
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent contracts (custom enterprise agreements)
export const agentContracts = pgTable("agent_contracts", {
  id: serial("id").primaryKey(),
  clientUserId: varchar("client_user_id").notNull().references(() => users.id),
  creatorUserId: varchar("creator_user_id").notNull().references(() => users.id),
  agentId: integer("agent_id").references(() => agents.id),
  
  // Contract terms
  title: varchar("title").notNull(),
  description: text("description"),
  contractValue: decimal("contract_value", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  
  // Timeline
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  deliveryDate: timestamp("delivery_date"),
  
  // Status and payment
  status: varchar("status").notNull(), // draft, active, completed, canceled, disputed
  paymentStatus: varchar("payment_status").notNull(), // pending, partial, paid, refunded
  paymentSchedule: varchar("payment_schedule"), // upfront, milestone, monthly
  
  // Smart contract integration
  blockchainContractAddress: varchar("blockchain_contract_address"),
  
  // Terms and conditions
  terms: text("terms"),
  milestones: jsonb("milestones"), // Array of milestone objects
  deliverables: jsonb("deliverables"),
  
  // Metadata
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Crypto exchange rates and transactions
export const cryptoExchanges = pgTable("crypto_exchanges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Exchange details
  fromCurrency: varchar("from_currency").notNull(), // USD, ETH, BTC, etc.
  toCurrency: varchar("to_currency").notNull(),
  fromAmount: decimal("from_amount", { precision: 18, scale: 8 }).notNull(),
  toAmount: decimal("to_amount", { precision: 18, scale: 8 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 18, scale: 8 }).notNull(),
  
  // Transaction details
  status: varchar("status").notNull(), // pending, completed, failed
  transactionHash: varchar("transaction_hash"),
  blockNumber: integer("block_number"),
  
  // Provider details
  provider: varchar("provider"), // coinbase, binance, internal
  providerTransactionId: varchar("provider_transaction_id"),
  
  // Fees
  exchangeFee: decimal("exchange_fee", { precision: 10, scale: 2 }),
  networkFee: decimal("network_fee", { precision: 10, scale: 2 }),
  
  // Metadata
  metadata: jsonb("metadata"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [payments.paymentMethodId],
    references: [paymentMethods.id],
  }),
  agent: one(agents, {
    fields: [payments.agentId],
    references: [agents.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const agentContractsRelations = relations(agentContracts, ({ one }) => ({
  client: one(users, {
    fields: [agentContracts.clientUserId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [agentContracts.creatorUserId],
    references: [users.id],
  }),
  agent: one(agents, {
    fields: [agentContracts.agentId],
    references: [agents.id],
  }),
}));

export const cryptoExchangesRelations = relations(cryptoExchanges, ({ one }) => ({
  user: one(users, {
    fields: [cryptoExchanges.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractSchema = createInsertSchema(agentContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCryptoExchangeSchema = createInsertSchema(cryptoExchanges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type AgentContract = typeof agentContracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type CryptoExchange = typeof cryptoExchanges.$inferSelect;
export type InsertCryptoExchange = z.infer<typeof insertCryptoExchangeSchema>;