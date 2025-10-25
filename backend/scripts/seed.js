const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('../models/User');
const VastuRule = require('../models/VastuRule');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample Vastu rules data
const vastuRulesData = [
  {
    name: 'Main Door Direction',
    category: 'entrance',
    description: 'The main door should face north, east, or northeast for positive energy flow.',
    detailedExplanation: 'The main entrance is considered the mouth of the house in Vastu. It should be in the north, east, or northeast direction to allow positive energy to enter.',
    direction: 'north',
    roomType: 'entrance',
    element: 'air',
    importance: 'critical',
    impact: 'positive',
    benefits: ['Positive energy flow', 'Good fortune', 'Harmony in family'],
    consequences: ['Negative energy', 'Financial problems', 'Health issues'],
    remedies: [
      {
        type: 'placement',
        description: 'Ensure main door faces north, east, or northeast',
        cost: 'high',
        difficulty: 'hard',
        timeRequired: 'Construction work required'
      }
    ],
    tags: ['entrance', 'main-door', 'energy-flow']
  },
  {
    name: 'Kitchen Placement',
    category: 'kitchen',
    description: 'Kitchen should be in the southeast corner of the house.',
    detailedExplanation: 'The kitchen represents the fire element and should be placed in the southeast direction, which is ruled by Agni (fire god).',
    direction: 'southeast',
    roomType: 'kitchen',
    element: 'fire',
    importance: 'high',
    impact: 'positive',
    benefits: ['Good health', 'Harmony in family', 'Proper digestion'],
    consequences: ['Health problems', 'Family disputes', 'Financial issues'],
    remedies: [
      {
        type: 'placement',
        description: 'Move kitchen to southeast corner',
        cost: 'high',
        difficulty: 'hard',
        timeRequired: 'Major renovation required'
      },
      {
        type: 'color',
        description: 'Use red, orange, or yellow colors in kitchen',
        cost: 'low',
        difficulty: 'easy',
        timeRequired: '1-2 days'
      }
    ],
    tags: ['kitchen', 'fire-element', 'southeast']
  },
  {
    name: 'Bedroom Direction',
    category: 'bedroom',
    description: 'Master bedroom should be in the southwest corner.',
    detailedExplanation: 'The master bedroom should be in the southwest direction as it represents stability and relationships.',
    direction: 'southwest',
    roomType: 'bedroom',
    element: 'earth',
    importance: 'high',
    impact: 'positive',
    benefits: ['Stable relationships', 'Good health', 'Peaceful sleep'],
    consequences: ['Relationship problems', 'Sleep issues', 'Health problems'],
    remedies: [
      {
        type: 'placement',
        description: 'Move master bedroom to southwest',
        cost: 'high',
        difficulty: 'hard',
        timeRequired: 'Major renovation required'
      },
      {
        type: 'color',
        description: 'Use earth colors like brown, beige, or yellow',
        cost: 'low',
        difficulty: 'easy',
        timeRequired: '1-2 days'
      }
    ],
    tags: ['bedroom', 'master-bedroom', 'southwest', 'earth-element']
  },
  {
    name: 'Bathroom Placement',
    category: 'bathroom',
    description: 'Bathroom should not be in the northeast corner.',
    detailedExplanation: 'The northeast corner is considered sacred and should not have a bathroom as it can cause negative energy.',
    direction: 'northeast',
    roomType: 'bathroom',
    element: 'water',
    importance: 'critical',
    impact: 'negative',
    benefits: [],
    consequences: ['Financial problems', 'Health issues', 'Spiritual problems'],
    remedies: [
      {
        type: 'placement',
        description: 'Move bathroom away from northeast corner',
        cost: 'high',
        difficulty: 'hard',
        timeRequired: 'Major renovation required'
      },
      {
        type: 'decoration',
        description: 'Use white or light blue colors to minimize negative effects',
        cost: 'low',
        difficulty: 'easy',
        timeRequired: '1 day'
      }
    ],
    tags: ['bathroom', 'northeast', 'water-element', 'sacred-corner']
  },
  {
    name: 'Puja Room Location',
    category: 'puja-room',
    description: 'Puja room should be in the northeast corner.',
    detailedExplanation: 'The northeast corner is considered the most sacred direction and is ideal for prayer and meditation.',
    direction: 'northeast',
    roomType: 'puja-room',
    element: 'water',
    importance: 'high',
    impact: 'positive',
    benefits: ['Spiritual growth', 'Peace of mind', 'Positive energy'],
    consequences: ['Spiritual problems', 'Lack of peace', 'Negative energy'],
    remedies: [
      {
        type: 'placement',
        description: 'Create puja room in northeast corner',
        cost: 'medium',
        difficulty: 'medium',
        timeRequired: '1-2 weeks'
      },
      {
        type: 'decoration',
        description: 'Keep the area clean and use white or light colors',
        cost: 'low',
        difficulty: 'easy',
        timeRequired: '1 day'
      }
    ],
    tags: ['puja-room', 'northeast', 'sacred', 'spiritual']
  }
];

// Sample admin user data
const adminUserData = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@vastuvision.com',
  phone: '9876543210',
  gender: 'male',
  password: 'Admin@123',
  role: 'admin',
  isEmailVerified: true,
  isPhoneVerified: true,
  subscription: {
    plan: 'expert',
    isActive: true
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await VastuRule.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create(adminUserData);
    console.log('👤 Created admin user:', adminUser.email);

    // Create Vastu rules
    const vastuRules = await VastuRule.insertMany(vastuRulesData);
    console.log('📜 Created Vastu rules:', vastuRules.length);

    // Create sample regular user
    const sampleUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '9876543211',
      gender: 'male',
      password: 'Password@123',
      isEmailVerified: true,
      subscription: {
        plan: 'free',
        isActive: true
      }
    });
    console.log('👤 Created sample user:', sampleUser.email);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample credentials:');
    console.log('Admin: admin@vastuvision.com / Admin@123');
    console.log('User: john@example.com / Password@123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
