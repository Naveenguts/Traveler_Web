const Stripe = require('stripe');
const speakeasy = require('speakeasy');
const PaymentMethod = require('../models/PaymentMethod');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency } = req.body;
    const normalizedCurrency = String(currency || '').toLowerCase();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!['usd', 'inr'].includes(normalizedCurrency)) {
      return res.status(400).json({ message: 'Invalid currency' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: normalizedCurrency,
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

const ensureCustomer = async (user) => {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name
  });
  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
};

exports.createSetupIntent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const customerId = await ensureCustomer(user);
    const intent = await stripe.setupIntents.create({ customer: customerId });
    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    next(err);
  }
};

exports.addPaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethodId, makeDefault, otp } = req.body;
    const user = await User.findById(req.user.id);
    
    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(403).json({ 
          message: '2FA verification required',
          requires2FA: true,
          twoFAEnabled: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ 
          message: 'Invalid 2FA code',
          requires2FA: true 
        });
      }
    }

    const customerId = await ensureCustomer(user);

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    if (makeDefault) {
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId }
      });
      await PaymentMethod.updateMany({ userId: user.id }, { isDefault: false });
    }

    const pm = await stripe.paymentMethods.retrieve(paymentMethodId);
    const doc = await PaymentMethod.create({
      userId: user.id,
      stripeCustomerId: customerId,
      paymentMethodId,
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: !!makeDefault
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.listPaymentMethods = async (req, res, next) => {
  try {
    const list = await PaymentMethod.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

exports.setDefault = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    const doc = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(403).json({ 
          message: '2FA verification required',
          requires2FA: true,
          twoFAEnabled: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ 
          message: 'Invalid 2FA code',
          requires2FA: true 
        });
      }
    }

    await stripe.customers.update(doc.stripeCustomerId, {
      invoice_settings: { default_payment_method: doc.paymentMethodId }
    });
    await PaymentMethod.updateMany({ userId: req.user.id }, { isDefault: false });
    doc.isDefault = true;
    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.deleteMethod = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    const doc = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // If 2FA is enabled, verify OTP
    if (user.twoFAEnabled) {
      if (!otp) {
        return res.status(403).json({ 
          message: '2FA verification required',
          requires2FA: true,
          twoFAEnabled: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token: otp,
        window: 2
      });

      if (!verified) {
        return res.status(401).json({ 
          message: 'Invalid 2FA code',
          requires2FA: true 
        });
      }
    }

    await stripe.paymentMethods.detach(doc.paymentMethodId);
    await doc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
