import { database } from "./db"
import { Collection, Document } from "mongodb"

export type collectionNameType = "products" | "test_collection"

export const getCollection = <T extends Document>(
  collectionName: collectionNameType
): Collection<T> => {
  return database.collection<T>(collectionName)
}
