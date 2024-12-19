import { UpdateProductModel } from "../models/product/UpdateProduct.model"
import { CreateProductModel } from "../models/product/CreateProduct.model"
import { getCollection } from "../db/db.utils"
import { Filter } from "mongodb"
import { ProductType } from "../types/product.type"
import { v4 as uuidv4 } from "uuid"

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

  async createProduct(newProduct: CreateProductModel): Promise<ProductType> {
    const createdProduct: ProductType = {
      id: uuidv4(),
      title: newProduct.title,
      price: newProduct.price,
    }

    const result = await productsCollection.insertOne(createdProduct)
    return createdProduct
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
