import Stripe from "stripe";
import { db } from "./db";
import { payments, paymentMethods, subscriptions, subscriptionPlans, agentContracts, cryptoExchanges } from "@shared/payment-schema";
import { users, agents } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Initialize payment providers
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
}) : null;

export class PaymentService {
  
  // Payment Methods Management
  async addPaymentMethod(userId: string, type: string, provider: string, providerData: any) {
    try {
      let paymentMethodData: any = {
        userId,
        type,
        provider,
        isDefault: false,
        isActive: true,
      };

      if (provider === 'stripe' && stripe) {
        // Create Stripe payment method
        const stripePaymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: providerData.card,
        });
        
        paymentMethodData.stripePaymentMethodId = stripePaymentMethod.id;
        paymentMethodData.cardLast4 = stripePaymentMethod.card?.last4;
        paymentMethodData.cardBrand = stripePaymentMethod.card?.brand;
        paymentMethodData.cardExpMonth = stripePaymentMethod.card?.exp_month;
        paymentMethodData.cardExpYear = stripePaymentMethod.card?.exp_year;
      } else if (provider === 'paypal') {
        paymentMethodData.paypalAccountId = providerData.accountId;
      } else if (provider === 'crypto') {
        paymentMethodData.cryptoWalletAddress = providerData.walletAddress;
        paymentMethodData.type = 'crypto_wallet';
      }

      const [newPaymentMethod] = await db.insert(paymentMethods).values(paymentMethodData).returning();
      return newPaymentMethod;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('Failed to add payment method');
    }
  }

  async getUserPaymentMethods(userId: string) {
    return await db.select().from(paymentMethods)
      .where(and(eq(paymentMethods.userId, userId), eq(paymentMethods.isActive, true)));
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: number) {
    // Remove default from all user payment methods
    await db.update(paymentMethods)
      .set({ isDefault: false })
      .where(eq(paymentMethods.userId, userId));

    // Set new default
    await db.update(paymentMethods)
      .set({ isDefault: true })
      .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)));
  }

  // Subscription Management
  async createSubscription(userId: string, planCode: string, paymentMethodId: number, billingCycle: 'monthly' | 'yearly') {
    try {
      // Get subscription plan
      const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.code, planCode));
      if (!plan) throw new Error('Subscription plan not found');

      // Get payment method
      const [paymentMethod] = await db.select().from(paymentMethods)
        .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)));
      if (!paymentMethod) throw new Error('Payment method not found');

      let subscriptionData: any = {
        userId,
        planId: plan.id,
        status: 'active',
        billingCycle,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      };

      if (paymentMethod.provider === 'stripe' && stripe) {
        // Create Stripe subscription
        const price = billingCycle === 'yearly' ? plan.stripeYearlyPriceId : plan.stripePriceId;
        const stripeSubscription = await stripe.subscriptions.create({
          customer: paymentMethod.stripePaymentMethodId!, // Assuming customer ID is stored
          items: [{ price }],
          default_payment_method: paymentMethod.stripePaymentMethodId,
        });

        subscriptionData.stripeSubscriptionId = stripeSubscription.id;
      }

      const [newSubscription] = await db.insert(subscriptions).values(subscriptionData).returning();

      // Create payment record
      const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
      await this.createPaymentRecord({
        userId,
        paymentMethodId,
        amount: amount!,
        currency: 'USD',
        type: 'subscription',
        status: 'completed',
        subscriptionId: newSubscription.id,
        description: `${plan.name} subscription (${billingCycle})`,
      });

      return newSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  // Agent Purchase
  async purchaseAgent(userId: string, agentId: number, paymentMethodId: number) {
    try {
      // Get agent details
      const [agent] = await db.select().from(agents).where(eq(agents.id, agentId));
      if (!agent) throw new Error('Agent not found');

      // Get payment method
      const [paymentMethod] = await db.select().from(paymentMethods)
        .where(and(eq(paymentMethods.id, paymentMethodId), eq(paymentMethods.userId, userId)));
      if (!paymentMethod) throw new Error('Payment method not found');

      let paymentData: any = {
        userId,
        paymentMethodId,
        amount: (agent.price / 100).toString(), // Convert cents to dollars
        currency: 'USD',
        type: 'agent_purchase',
        status: 'pending',
        agentId: agent.id,
        description: `Purchase of ${agent.name}`,
      };

      if (paymentMethod.provider === 'stripe' && stripe) {
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: agent.price, // Price in cents
          currency: 'usd',
          payment_method: paymentMethod.stripePaymentMethodId,
          confirm: true,
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
        });

        paymentData.stripePaymentIntentId = paymentIntent.id;
        paymentData.status = paymentIntent.status === 'succeeded' ? 'completed' : 'processing';
      }

      // Calculate fees and creator revenue (85% to creator, 15% platform)
      const totalAmount = parseFloat(paymentData.amount);
      paymentData.creatorRevenue = (totalAmount * 0.85).toFixed(2);
      paymentData.platformFee = (totalAmount * 0.15).toFixed(2);

      const [payment] = await db.insert(payments).values(paymentData).returning();
      return payment;
    } catch (error) {
      console.error('Error purchasing agent:', error);
      throw new Error('Failed to purchase agent');
    }
  }

  // Contract Management
  async createContract(clientUserId: string, creatorUserId: string, contractData: any) {
    try {
      const contractValues = {
        clientUserId,
        creatorUserId,
        ...contractData,
        status: 'draft',
        paymentStatus: 'pending',
      };

      const [contract] = await db.insert(agentContracts).values(contractValues).returning();
      return contract;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw new Error('Failed to create contract');
    }
  }

  async processContractPayment(contractId: number, paymentMethodId: number) {
    try {
      // Get contract details
      const [contract] = await db.select().from(agentContracts).where(eq(agentContracts.id, contractId));
      if (!contract) throw new Error('Contract not found');

      // Process payment based on payment schedule
      let paymentAmount = contract.contractValue;
      if (contract.paymentSchedule === 'milestone') {
        // Calculate milestone payment (simplified - first milestone)
        const milestones = contract.milestones as any[];
        paymentAmount = milestones[0]?.amount || contract.contractValue;
      }

      const payment = await this.createPaymentRecord({
        userId: contract.clientUserId,
        paymentMethodId,
        amount: paymentAmount!,
        currency: contract.currency,
        type: 'contract',
        status: 'completed',
        contractId: contract.id,
        description: `Contract payment: ${contract.title}`,
      });

      // Update contract status
      await db.update(agentContracts)
        .set({ status: 'active', paymentStatus: 'paid' })
        .where(eq(agentContracts.id, contractId));

      return payment;
    } catch (error) {
      console.error('Error processing contract payment:', error);
      throw new Error('Failed to process contract payment');
    }
  }

  // Crypto Exchange
  async exchangeCrypto(userId: string, fromCurrency: string, toCurrency: string, fromAmount: string) {
    try {
      // Simplified crypto exchange - in production, integrate with actual crypto APIs
      const exchangeRate = await this.getCryptoExchangeRate(fromCurrency, toCurrency);
      const toAmount = (parseFloat(fromAmount) * exchangeRate).toString();

      const exchangeData = {
        userId,
        fromCurrency,
        toCurrency,
        fromAmount,
        toAmount,
        exchangeRate: exchangeRate.toString(),
        status: 'pending',
        provider: 'internal',
        exchangeFee: (parseFloat(fromAmount) * 0.01).toString(), // 1% fee
      };

      const [exchange] = await db.insert(cryptoExchanges).values(exchangeData).returning();

      // Simulate processing
      setTimeout(async () => {
        await db.update(cryptoExchanges)
          .set({ status: 'completed', completedAt: new Date() })
          .where(eq(cryptoExchanges.id, exchange.id));
      }, 5000);

      return exchange;
    } catch (error) {
      console.error('Error exchanging crypto:', error);
      throw new Error('Failed to exchange crypto');
    }
  }

  // Helper Methods
  private async createPaymentRecord(paymentData: any) {
    const [payment] = await db.insert(payments).values({
      ...paymentData,
      processedAt: new Date(),
    }).returning();
    return payment;
  }

  private async getCryptoExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    // Simplified rate - in production, use real crypto APIs like CoinGecko
    const rates: Record<string, Record<string, number>> = {
      'USD': { 'ETH': 0.0004, 'BTC': 0.000023 },
      'ETH': { 'USD': 2500, 'BTC': 0.058 },
      'BTC': { 'USD': 43000, 'ETH': 17.2 },
    };
    
    return rates[fromCurrency]?.[toCurrency] || 1;
  }

  // Payment status updates (webhooks)
  async updatePaymentStatus(paymentId: number, status: string, metadata?: any) {
    await db.update(payments)
      .set({ 
        status, 
        metadata,
        processedAt: status === 'completed' ? new Date() : undefined,
        updatedAt: new Date() 
      })
      .where(eq(payments.id, paymentId));
  }

  // Analytics and reporting
  async getUserPaymentHistory(userId: string) {
    return await db.select({
      payment: payments,
      agent: agents,
    })
    .from(payments)
    .leftJoin(agents, eq(payments.agentId, agents.id))
    .where(eq(payments.userId, userId))
    .orderBy(payments.createdAt);
  }

  async getCreatorEarnings(creatorUserId: string) {
    const earnings = await db.select().from(payments)
      .where(and(
        eq(payments.status, 'completed'),
        eq(payments.type, 'agent_purchase')
      ));

    // Filter earnings for this creator's agents
    // This would need agent ownership tracking in production
    return earnings;
  }
}