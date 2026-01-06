const Stripe = require('stripe');
const PaymentMethod = require('../models/PaymentMethod');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const { paymentMethodId, makeDefault } = req.body;
    const user = await User.findById(req.user.id);
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
    const doc = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Not found' });

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
    const doc = await PaymentMethod.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    await stripe.paymentMethods.detach(doc.paymentMethodId);
    await doc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
