export const faqData = [
  {
    category: 'Account & Security',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click on "Sign Up" in the top navigation. Enter your email, create a password, and fill in your basic information. Verify your email and you\'re all set!'
      },
      {
        q: 'What is two-factor authentication?',
        a: 'Two-factor authentication (2FA) adds an extra layer of security to your account. After entering your password, you\'ll need to verify a code sent to your device.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset instructions sent to your inbox.'
      },
      {
        q: 'Is my personal data safe?',
        a: 'Yes! We use industry-leading encryption and security measures to protect your data. All transactions are secure and PCI-DSS compliant.'
      }
    ]
  },
  {
    category: 'Bookings & Trips',
    questions: [
      {
        q: 'How do I book a destination?',
        a: 'Browse destinations, click on one you like, view details and availability, add it to your trips, and proceed to checkout with your preferred payment method.'
      },
      {
        q: 'Can I modify my booking?',
        a: 'Yes! Visit "My Trips" in your profile, select the booking you want to modify, and adjust dates or preferences. Some changes may incur additional fees.'
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations within 48 hours of booking receive a full refund. Cancellations 7-48 hours prior incur a 20% fee. Cancellations within 7 days are non-refundable.'
      },
      {
        q: 'Can I get travel insurance?',
        a: 'Optional travel insurance can be added during checkout. It covers cancellations, delays, and emergencies for a small additional fee.'
      }
    ]
  },
  {
    category: 'Payments & Billing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit cards (Visa, Mastercard, American Express), debit cards, net banking, and digital wallets like Google Pay and Apple Pay.'
      },
      {
        q: 'Why was my payment declined?',
        a: 'Common reasons include insufficient funds, incorrect card details, or security restrictions. Contact your bank or try a different payment method.'
      },
      {
        q: 'How do I add a payment method?',
        a: 'Go to Settings > Payment Methods, click "Add New", enter your card details, and verify. Your information is encrypted and secure.'
      },
      {
        q: 'Can I get a refund?',
        a: 'Refunds are processed according to our cancellation policy. Approved refunds are issued to the original payment method within 5-7 business days.'
      }
    ]
  },
  {
    category: 'Blogs & Community',
    questions: [
      {
        q: 'How do I write a blog post?',
        a: 'Click "Write Blog" in the navigation menu. Add a title, upload an image, write your content, and publish. You can save drafts before publishing.'
      },
      {
        q: 'Can I edit or delete my posts?',
        a: 'Yes! Visit "My Blogs" in your profile. Click edit to modify or delete to remove your post. Deleted posts cannot be recovered.'
      },
      {
        q: 'How do I get featured?',
        a: 'Our editors review blogs based on quality, engagement, and relevance. Featured blogs are shared on the homepage and newsletter.'
      },
      {
        q: 'Can I link to external websites in my blog?',
        a: 'Yes, you can include links. However, they should be relevant and add value to your content. Spam links will be removed.'
      }
    ]
  },
  {
    category: 'Technical Support',
    questions: [
      {
        q: 'The website is loading slowly. What should I do?',
        a: 'Try clearing your browser cache, disabling extensions, or using a different browser. If the issue persists, contact our support team.'
      },
      {
        q: 'I\'m having trouble with the mobile app',
        a: 'Update to the latest version, clear app cache, or reinstall. If problems continue, reach out to support@traveler.com.'
      },
      {
        q: 'Which browsers are supported?',
        a: 'We support Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser updated for best performance.'
      },
      {
        q: 'How do I report a bug?',
        a: 'Email support@traveler.com with details about the issue, screenshot, and your browser/device info. We\'ll investigate and fix it promptly.'
      }
    ]
  }
];

export const slugifyFaq = (question) =>
  question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const findFaqArticle = (slug) => {
  for (const category of faqData) {
    for (const question of category.questions) {
      if (slugifyFaq(question.q) === slug) {
        return {
          category: category.category,
          question: question.q,
          answer: question.a
        };
      }
    }
  }

  return null;
};
