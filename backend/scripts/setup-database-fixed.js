// scripts/setup-database-fixed.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import your models
const User = require('../src/models/User');
const Chat = require('../src/models/Chat');
const Message = require('../src/models/Message');

const setupDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');

    // Get database instance
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`\n📊 Database: ${dbName}`);
    console.log('=' + '='.repeat(50));

    // Create collections (they'll be created when first document is inserted)
    console.log('\n🏗️  Setting up collections...');

    // 1. USERS COLLECTION
    console.log('\n👥 USERS Collection:');
    console.log('   - Stores user profiles, authentication, contacts');
    console.log('   - Fields: name, email, phone, password, avatar, status, contacts, inviteKey, etc.');
    
    // Create indexes for users collection
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ phone: 1 }, { unique: true });
    await User.collection.createIndex({ inviteKey: 1 }, { unique: true, sparse: true });
    console.log('   ✅ Created indexes: email, phone, inviteKey');

    // 2. CHATS COLLECTION
    console.log('\n💬 CHATS Collection:');
    console.log('   - Stores chat rooms (individual and group chats)');
    console.log('   - Fields: participants, isGroupChat, name, admins, lastMessage, etc.');
    
    // Create indexes for chats collection
    await Chat.collection.createIndex({ participants: 1 });
    await Chat.collection.createIndex({ lastMessage: 1 });
    await Chat.collection.createIndex({ updatedAt: -1 });
    console.log('   ✅ Created indexes: participants, lastMessage, updatedAt');

    // 3. MESSAGES COLLECTION
    console.log('\n📝 MESSAGES Collection:');
    console.log('   - Stores all messages, media, reactions, replies');
    console.log('   - Fields: sender, chat, content, messageType, media, reactions, etc.');
    
    // Create indexes for messages collection
    await Message.collection.createIndex({ chat: 1, createdAt: -1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ createdAt: -1 });
    console.log('   ✅ Created indexes: chat+createdAt, sender, createdAt');

    // Display current collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Current Collections in Database:');
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });

    // Display collection statistics (fixed version)
    console.log('\n📊 Collection Statistics:');
    
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        const indexes = await db.collection(collection.name).indexes();
        console.log(`\n   ${collection.name.toUpperCase()}:`);
        console.log(`     - Documents: ${count}`);
        console.log(`     - Indexes: ${indexes.length}`);
        
        // List index names
        const indexNames = indexes.map(idx => idx.name).filter(name => name !== '_id_');
        if (indexNames.length > 0) {
          console.log(`     - Custom Indexes: ${indexNames.join(', ')}`);
        }
      } catch (error) {
        console.log(`   ${collection.name.toUpperCase()}: Error getting stats`);
      }
    }

    console.log('\n✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Function to create sample data for testing
const createSampleData = async () => {
  try {
    console.log('\n🌱 Creating sample data...');
    
    await mongoose.connect(process.env.MONGO_URI);

    // Check if sample data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('⚠️  Sample data already exists. Skipping...');
      return;
    }

    // Create sample users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      password: 'password123',
      status: 'Hey there! I am using WhatsApp.'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      password: 'password123',
      status: 'Available for chat!'
    });

    console.log(`✅ Created users: ${user1.name}, ${user2.name}`);
    console.log(`   - ${user1.name}'s invite key: ${user1.inviteKey}`);
    console.log(`   - ${user2.name}'s invite key: ${user2.inviteKey}`);

    // Create a sample chat
    const chat = await Chat.create({
      participants: [user1._id, user2._id],
      isGroupChat: false
    });

    console.log(`✅ Created chat between ${user1.name} and ${user2.name}`);

    // Create sample messages
    const message1 = await Message.create({
      sender: user1._id,
      chat: chat._id,
      content: 'Hello! How are you?',
      messageType: 'text'
    });

    const message2 = await Message.create({
      sender: user2._id,
      chat: chat._id,
      content: 'Hi! I am doing well, thanks!',
      messageType: 'text'
    });

    console.log(`✅ Created ${2} sample messages`);

    // Update chat with last message
    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: message2._id
    });

    console.log('✅ Sample data created successfully!');
    console.log('\n📝 You can now test your API with:');
    console.log(`   Email: john@example.com | Password: password123`);
    console.log(`   Email: jane@example.com | Password: password123`);

  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Sample users already exist. Skipping sample data creation...');
    } else {
      console.error('❌ Sample data creation failed:', error.message);
    }
  } finally {
    await mongoose.connection.close();
  }
};

// Function to view database status
const showStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    console.log(`📊 Database: ${db.databaseName}`);
    console.log('=' + '='.repeat(30));

    const userCount = await User.countDocuments();
    const chatCount = await Chat.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log(`👥 Users: ${userCount}`);
    console.log(`💬 Chats: ${chatCount}`);
    console.log(`📝 Messages: ${messageCount}`);

    if (userCount > 0) {
      console.log('\n👤 Recent Users:');
      const recentUsers = await User.find({}).limit(5).select('name email inviteKey');
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Key: ${user.inviteKey}`);
      });
    }

  } catch (error) {
    console.error('❌ Status check failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

// Main execution
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'sample':
    createSampleData();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('📚 Database Management Script');
    console.log('Usage: node scripts/setup-database-fixed.js [command]');
    console.log('');
    console.log('Commands:');
    console.log('  setup   - Set up database collections and indexes');
    console.log('  sample  - Create sample data for testing');
    console.log('  status  - Show database status and contents');
}