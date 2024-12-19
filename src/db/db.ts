import { MongoClient } from "mongodb"

import { env } from "../config/env"

const mongoUri = env.MONGO_URI

const client = new MongoClient(mongoUri)
export const database = client.db(env.DB_NAME)

export const connectToDatabase = async () => {
  try {
    // Connect the client to the server
    await client.connect()
    // Establish and verufy connection
    await client.db(env.DB_NAME).command({ ping: 1 })
    console.log(`Connected successfully to the database: ${database.databaseName}`)
  } catch (error) {
    console.log(`Can't connect to database: ${database.databaseName}`)
    await client.close()
  }
}
