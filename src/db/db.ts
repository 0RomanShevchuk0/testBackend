import { MongoClient } from "mongodb"

import { env } from "../config/env"

const mongoUri = env.MONGO_URI
const dbName = env.DB_NAME

if (!mongoUri || !dbName) {
  throw new Error("MongoDB URI or Database Name is missing in environment variables")
}

const client = new MongoClient(mongoUri)
export const database = client.db(dbName)

export const connectToDatabase = async () => {
  try {
    // Connect the client to the server
    await client.connect()
    // Establish and verufy connection
    await client.db(dbName).command({ ping: 1 })
    console.log(`Connected successfully to the database: ${database.databaseName}`)
  } catch (error) {
    console.log(`Can't connect to database: ${database.databaseName}`)
    await client.close()
  }
}
