import { db } from './db';
import { users } from '@shared/schema';
import { hashPassword } from './auth';

async function seedDatabase() {
  console.log('Seeding database...');

  try {
    // Create default users
    const hashedAdminPassword = await hashPassword('admin123');
    const hashedUser1Password = await hashPassword('user1pass');
    const hashedUser2Password = await hashPassword('user2pass');

    // Check if users already exist
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      await db.insert(users).values([
        {
          username: 'admin',
          password: hashedAdminPassword,
          role: 'admin',
          fullName: 'Administrator',
          email: 'admin@vetnest.com',
          isActive: true,
        },
        {
          username: 'vet1',
          password: hashedUser1Password,
          role: 'user',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah@vetnest.com',
          isActive: true,
        },
        {
          username: 'vet2',
          password: hashedUser2Password,
          role: 'user',
          fullName: 'Dr. Michael Chen',
          email: 'michael@vetnest.com',
          isActive: true,
        },
      ]);
      
      console.log('✅ Default users created successfully!');
      console.log('📝 Login credentials:');
      console.log('   Admin: admin / admin123');
      console.log('   User 1: vet1 / user1pass');
      console.log('   User 2: vet2 / user2pass');
    } else {
      console.log('ℹ️ Users already exist, skipping seed data');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seedDatabase().then(() => {
  console.log('🎉 Database seeding completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Database seeding failed:', error);
  process.exit(1);
});