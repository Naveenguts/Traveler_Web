const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stripeCustomerId: { type: String, required: true },
  paymentMethodId: { type: String, required: true },
  brand: { type: String },
  last4: { type: String },
  expMonth: { type: Number },
  expYear: { type: Number },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

paymentMethodSchema.index({ userId: 1, isDefault: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
