import { defineConfig } from "cypress";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

// Retrieve .env file from the api directory
dotenv.config({ path: path.resolve(__dirname, "../api/.env") });

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env file");
}
const client = new MongoClient(uri);

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async findUserByEmail(email) {
          await client.connect();
          const db = client.db('fsae_job_board');
          const user = await db.collection('Member').findOne({ email });
          return user ? true : false;
        }
      });
    }
  },
});
