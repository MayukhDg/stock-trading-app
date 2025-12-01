import mongoose from 'mongoose';

// BrokerLink Schema
const BrokerLinkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  accessToken: {
    type: String,
    default: null,
  },
  publicToken: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'brokerLinks',
});

// Holdings Schema
const HoldingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  holdings: {
    type: Array,
    default: [],
  },
  syncedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'holdings',
});

// Subscription Schema
const SubscriptionSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  currentPeriodStart: {
    type: Date,
    required: true,
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'subscriptions',
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  stripeSessionId: {
    type: String,
    required: true,
    unique: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  clerkUserId: {
    type: String,
    required: true,
    index: true,
  },
  amountTotal: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  subscriptionId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'orders',
});

// Prevent model recompilation in development
export const BrokerLink = mongoose.models.BrokerLink || mongoose.model('BrokerLink', BrokerLinkSchema);
export const Holdings = mongoose.models.Holdings || mongoose.model('Holdings', HoldingsSchema);
export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);