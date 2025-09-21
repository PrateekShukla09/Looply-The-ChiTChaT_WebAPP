// scripts/setup-database.js
// Run this script to set up your database collections and indexes
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

    // Display collection statistics
    console.log('\n📊 Collection Statistics:');
    
    for (const collection of collections) {
      const stats = await db.collection(collection.name).stats();
      console.log(`\n   ${collection.name.toUpperCase()}:`);
      console.log(`     - Documents: ${stats.count || 0}`);
      console.log(`     - Size: ${formatBytes(stats.size || 0)}`);
      console.log(`     - Indexes: ${stats.nindexes || 0}`);
    }

    console.log('\n✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Utility function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to create sample data for testing
const createSampleData = async () => {
  try {
    console.log('\n🌱 Creating sample data...');
    
    await mongoose.connect(process.env.MONGO_URI);

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

  } catch (error) {
    console.error('❌ Sample data creation failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

// Function to clear all data (use with caution!)
const clearDatabase = async () => {
  try {
    console.log('⚠️  Clearing all data from database...');
    
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});

    console.log('✅ Database cleared successfully!');

  } catch (error) {
    console.error('❌ Database clearing failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

// Function to display database schema
const showSchema = () => {
  console.log('\n📋 DATABASE SCHEMA OVERVIEW');
  console.log('=' + '='.repeat(50));

  console.log(`
👥 USERS Collection Schema:
┌─────────────────┬─────────────┬─────────────────────────────────┐
│ Field           │ Type        │ Description                     │
├─────────────────┼─────────────┼─────────────────────────────────┤
│ _id             │ ObjectId    │ Unique identifier               │
│ name            │ String      │ User's display name             │
│ email           │ String      │ Email address (unique)          │
│ phone           │ String      │ Phone number (unique)           │
│ password        │ String      │ Hashed password                 │
│ avatar          │ String      │ Profile picture URL             │
│ status          │ String      │ Status message                  │
│ lastSeen        │ Date        │ Last activity timestamp         │
│ isOnline        │ Boolean     │ Online status                   │
│ inviteKey       │ String      │ Unique invite key               │
│ inviteKeyExpiry │ Date        │ Invite key expiration           │
│ allowInvites    │ Boolean     │ Allow invites setting           │
│ contacts        │ Array       │ User's contact list             │
│ blockedUsers    │ Array       │ Blocked users list              │
│ createdAt       │ Date        │ Account creation date           │
│ updatedAt       │ Date        │ Last update timestamp           │
└─────────────────┴─────────────┴─────────────────────────────────┘

💬 CHATS Collection Schema:
┌─────────────────┬─────────────┬─────────────────────────────────┐
│ Field           │ Type        │ Description                     │
├─────────────────┼─────────────┼─────────────────────────────────┤
│ _id             │ ObjectId    │ Unique identifier               │
│ name            │ String      │ Chat name (for groups)          │
│ isGroupChat     │ Boolean     │ Individual or group chat        │
│ participants    │ Array       │ User IDs in chat                │
│ admins          │ Array       │ Admin user IDs (groups only)    │
│ lastMessage     │ ObjectId    │ Reference to last message       │
│ groupAvatar     │ String      │ Group chat picture URL          │
│ groupDescription│ String      │ Group description               │
│ createdBy       │ ObjectId    │ Group creator ID                │
│ settings        │ Object      │ Chat settings                   │
│ createdAt       │ Date        │ Chat creation date              │
│ updatedAt       │ Date        │ Last message timestamp          │
└─────────────────┴─────────────┴─────────────────────────────────┘

📝 MESSAGES Collection Schema:
┌─────────────────┬─────────────┬─────────────────────────────────┐
│ Field           │ Type        │ Description                     │
├─────────────────┼─────────────┼─────────────────────────────────┤
│ _id             │ ObjectId    │ Unique identifier               │
│ sender          │ ObjectId    │ User ID who sent message        │
│ chat            │ ObjectId    │ Chat ID where message was sent  │
│ content         │ String      │ Message text content            │
│ messageType     │ String      │ text/image/video/audio/document │
│ media           │ Object      │ File information (if applicable)│
│ replyTo         │ ObjectId    │ Reference to replied message    │
│ reactions       │ Array       │ Message reactions               │
│ readBy          │ Array       │ Users who read the message      │
│ deliveredTo     │ Array       │ Users who received the message  │
│ isDeleted       │ Boolean     │ Deletion status                 │
│ deletedFor      │ Array       │ Users who deleted the message   │
│ isEdited        │ Boolean     │ Edit status                     │
│ editHistory     │ Array       │ Message edit history            │
│ createdAt       │ Date        │ Message creation time           │
│ updatedAt       │ Date        │ Last update timestamp           │
└─────────────────┴─────────────┴─────────────────────────────────┘
  `);
};

// Main execution based on command line arguments
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupDatabase();
    break;
  case 'sample':
    createSampleData();
    break;
  case 'clear':
    console.log('⚠️  Are you sure you want to clear all data? This cannot be undone!');
    console.log('   Run: node scripts/setup-database.js clear-confirm');
    break;
  case 'clear-confirm':
    clearDatabase();
    break;
  case 'schema':
    showSchema();
    break;
  default:
    console.log('📚 Database Management Script');
    console.log('Usage: node scripts/setup-database.js [command]');
    console.log('');
    console.log('Commands:');
    console.log('  setup         - Set up database collections and indexes');
    console.log('  sample        - Create sample data for testing');
    console.log('  clear         - Clear all data (requires confirmation)');
    console.log('  schema        - Show database schema overview');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/setup-database.js setup');
    console.log('  node scripts/setup-database.js sample');
    console.log('  node scripts/setup-database.js schema');
}