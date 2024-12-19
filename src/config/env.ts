import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/",
  DB_NAME: process.env.DB_NAME || "test_db",
}
