const fs = require('fs');
const path = require('path');
const { db } = require('../database/connection');

async function setupDatabase() {
  console.log('🚀 Setting up database...');

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await new Promise((resolve, reject) => {
          db.run(statement, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    console.log('✅ Database schema created');

    // Check if we need to seed data
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (userCount === 0) {
      console.log('📦 Seeding database with sample data...');
      
      const seedsPath = path.join(__dirname, '../database/seeds.sql');
      const seeds = fs.readFileSync(seedsPath, 'utf8');
      
      const seedStatements = seeds.split(';').filter(stmt => stmt.trim());
      
      for (const statement of seedStatements) {
        if (statement.trim()) {
          await new Promise((resolve, reject) => {
            db.run(statement, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
      
      console.log('✅ Sample data inserted');
    } else {
      console.log('📄 Database already contains data, skipping seed');
    }

    // Create uploads directory
    const uploadsDir = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Uploads directory created');
    }

    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

setupDatabase();