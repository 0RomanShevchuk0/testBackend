import { PaginationResponseType } from "./../types/pagination"
import { QueryProductsModel } from "./../models/product/QueryProducts.model"
import { UpdateProductModel } from "../models/product/UpdateProduct.model"
import { getCollection } from "../db/db.utils"
import { Filter } from "mongodb"
import { ProductType } from "../types/product.type"
import { calculateSkipValue, hasNextPrevPage } from "../shared/pagination.utils"

const productsCollection = getCollection<ProductType>("products")

export const productsRepository = {
  async findProducts(params: QueryProductsModel): Promise<PaginationResponseType<ProductType>> {
    const { title } = params
    const pageNumber = params.page ? +params.page : 1
    const pageSize = params.pageSize ? +params.pageSize : 10

    let filter: Filter<ProductType> = {}

    if (title) {
      filter.title = { $regex: title, $options: "i" }
    }

    const skipValue = calculateSkipValue(pageNumber, pageSize)

    const [products, totalCount] = await Promise.all([
      productsCollection.find(filter).skip(skipValue).limit(pageSize).toArray(),
      productsCollection.countDocuments(filter),
    ])

    const { hasNextPage, hasPreviousPage } = hasNextPrevPage({ pageNumber, pageSize }, totalCount)

    const result: PaginationResponseType<ProductType> = {
      hasNextPage,
      hasPreviousPage,
      totalCount,
      pageSize,
      page: pageNumber,
      items: products,
    }
    return result
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
