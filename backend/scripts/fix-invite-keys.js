// scripts/fix-invite-keys.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const fixInviteKeys = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');

    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

    // Find users without invite keys
    const usersWithoutKeys = await User.find({ 
      $or: [
        { inviteKey: { $exists: false } },
        { inviteKey: null },
        { inviteKey: '' }
      ]
    });

    console.log(`\n🔍 Found ${usersWithoutKeys.length} users without invite keys`);

    if (usersWithoutKeys.length > 0) {
      console.log('\n🔧 Generating invite keys...');

      for (const user of usersWithoutKeys) {
        // Generate invite key
        const inviteKey = user.generateInviteKey();
        const inviteKeyExpiry = new Date();
        inviteKeyExpiry.setDate(inviteKeyExpiry.getDate() + 30); // 30 days expiry

        await User.findByIdAndUpdate(user._id, {
          inviteKey,
          inviteKeyExpiry
        });

        console.log(`   ✅ ${user.name}: ${inviteKey}`);
      }
    }

    // Show all users with their invite keys
    console.log('\n👤 All Users with Invite Keys:');
    const allUsers = await User.find({}).select('name email inviteKey inviteKeyExpiry');
    
    allUsers.forEach((user, index) => {
      const expiryDate = user.inviteKeyExpiry ? user.inviteKeyExpiry.toLocaleDateString() : 'No expiry';
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Invite Key: ${user.inviteKey}`);
      console.log(`      Expires: ${expiryDate}`);
    });

    console.log('\n✅ Invite keys fixed successfully!');

  } catch (error) {
    console.error('❌ Error fixing invite keys:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

fixInviteKeys();