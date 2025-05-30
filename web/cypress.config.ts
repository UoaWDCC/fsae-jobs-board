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
    baseUrl: "http://localhost:5173",
    chromeWebSecurity: false,
    testIsolation: false,
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
        async deleteUsersByEmail(email) {
          try {
            const db = client.db('fsae_job_board');
            await db.collection('Member').deleteMany({ email });
            await db.collection('Sponsor').deleteMany({ email });
            await db.collection('Alumni').deleteMany({ email });
            return null;
          } catch (error) {
            return null;
          }
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
            return result.insertedId ? true : false;
          } catch (error) {
            return false;
          }
        },
      });
    }
  },
});
