// Simple script to create a test user for signin testing
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  
  console.log('Test user credentials:');
  console.log('Username: testuser');
  console.log('Password: testpassword');
  console.log('Hashed password:', hashedPassword);
  
  console.log('\nSQL to insert test user:');
  console.log(`INSERT INTO users (id, username, email, password, first_name, last_name, subscription_plan, subscription_status, trial_start_date, trial_end_date) VALUES ('test-user-001', 'testuser', 'test@example.com', '${hashedPassword}', 'Test', 'User', 'trial', 'trial', NOW(), NOW() + INTERVAL '14 days');`);
}

createTestUser().catch(console.error);