import { defineConfig } from "cypress";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

// retrieve .env file from the api directory
dotenv.config({ path: path.resolve(__dirname, "../api/.env") });

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env file");
}
const client = new MongoClient(uri);

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:run', async () => {
        try {
          await client.connect();
          console.log("Successfully connected to database");
        } catch (err) {
          console.error("Failed to connect to database", err);
          throw err;
        }
      });

      on('after:run', async () => {
        try {
          await client.close();
          console.log("Database connection closed");
        } catch (err) {
          console.error("Failed to close database connection", err);
        }
      });

      on('task', {
        async findUserByEmail(email) {
          const db = client.db('fsae_job_board');
          const user = await db.collection('Member').findOne({ email });
          return user ? true : false;
        },
        async insertTestAdmin({ email, passwordHash }) {
          const db = client.db('fsae_job_board');
          const result = await db.collection('Admin').insertOne({
            email,
            password: passwordHash,
            verified: true,
            firstName: 'Test',
            lastName: 'Admin',
          });
          return result.insertedId ? true : false;
        },
        async insertTestUser({ role, email, passwordHash }) {
          try {
            const db = client.db('fsae_job_board');
            const collectionName = {
              student: 'Member',
              sponsor: 'Sponsor',
              alumni: 'Member'
            }[role];
          
            if (!collectionName) {
              throw new Error(`Unsupported role: ${role}`);
            }
          
            const result = await db.collection(collectionName).insertOne({
              email,
              password: passwordHash,
              verified: true,
              firstName: 'Last',
              lastName: 'First',
              phoneNumber: '1234567890',
              desc: 'testing'
            });
            console.log('User inserted:', result);
            return result.insertedId ? true : false;
          } catch (error) {
            console.error('Error inserting user:', error);
            return false;
          }
        },
        async verifyUserInDB(email) {
          const db = client.db('fsae_job_board');
          const user = await db.collection('Member').findOne({ email });
          return user ? true : false;
        }
      });
    }
  },
});
