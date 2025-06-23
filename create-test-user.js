import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

async function createTestUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Hash the password "testing"
    const hashedPassword = await bcrypt.hash('testing', 10);
    
    // Update existing user or create new one
    const result = await pool.query(`
      INSERT INTO users (id, username, password, email, is_active, created_at, updated_at) 
      VALUES ('test-user-123', 'test', $1, 'test@ainomads.com', true, NOW(), NOW())
      ON CONFLICT (username) DO UPDATE SET 
        password = EXCLUDED.password,
        email = EXCLUDED.email,
        updated_at = NOW()
      RETURNING id, username, email;
    `, [hashedPassword]);
    
    console.log('Test user created/updated:', result.rows[0]);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();