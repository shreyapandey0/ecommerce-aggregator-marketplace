import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sellers, sellerProducts, orders } from "@shared/schema";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// Create the storage object that sample-products.ts expects
export const storage = {
  insertInto: (table: any) => ({
    values: (data: any) => ({
      execute: async () => {
        return db.insert(table).values(data).execute();
      },
    }),
  }),
};

// Initialize tables function (same as before)
const createTables = async () => {
  try {
    await client`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        store_name TEXT NOT NULL,
        description TEXT,
        contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS seller_products (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        stock INTEGER NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers (id)
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        seller_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        status TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES sellers (id),
        FOREIGN KEY (product_id) REFERENCES seller_products (id)
      );
    `;

    console.log("✅ Tables created or already exist.");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
};

createTables().catch(console.error);
