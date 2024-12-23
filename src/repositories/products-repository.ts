import { UpdateProductModel } from "../models/product/UpdateProduct.model"
import { getCollection } from "../db/db.utils"
import { Filter } from "mongodb"
import { ProductType } from "../types/product.type"

const productsCollection = getCollection<ProductType>("products")

export const productsRepository = {
  async findProducts(title?: string): Promise<ProductType[]> {
    let filter: Filter<ProductType> = {}

    if (title) {
      filter.title = { $regex: title, $options: "i" }
    }

    return productsCollection.find(filter).toArray()
  },

  async findProductById(id: string): Promise<ProductType | null> {
    return productsCollection.findOne({ id })
  },

  async createProduct(newProduct: ProductType): Promise<ProductType> {
    const result = await productsCollection.insertOne(newProduct)
    return newProduct
  },

  async updateProduct(
    id: string,
    modifiedProduct: UpdateProductModel
  ): Promise<ProductType | null> {
    return productsCollection.findOneAndUpdate(
      { id },
      { $set: modifiedProduct },
      { returnDocument: "after" }
    )
  },

  async deleteProduct(id: string): Promise<boolean> {
    const result = await productsCollection.deleteOne({ id })
    return result.deletedCount === 1
  },

  deleteAllProducts() {},
}
