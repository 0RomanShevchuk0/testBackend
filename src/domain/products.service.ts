import { UpdateProductModel } from "../models/product/UpdateProduct.model"
import { CreateProductModel } from "../models/product/CreateProduct.model"
import { ProductType } from "../types/product.type"
import { v4 as uuidv4 } from "uuid"
import { productsRepository } from "../repositories/products-repository"

export const productsService = {
  async findProducts(title?: string): Promise<ProductType[]> {
    return productsRepository.findProducts(title)
  },

  async findProductById(id: string): Promise<ProductType | null> {
    return productsRepository.findProductById(id)
  },

  async createProduct(newProduct: CreateProductModel): Promise<ProductType> {
    const newProductWithId: ProductType = {
      id: uuidv4(),
      title: newProduct.title,
      price: newProduct.price,
    }

    return productsRepository.createProduct(newProductWithId)
  },

  async updateProduct(
    id: string,
    modifiedProduct: UpdateProductModel
  ): Promise<ProductType | null> {
    return productsRepository.updateProduct(id, modifiedProduct)
  },

  async deleteProduct(id: string): Promise<boolean> {
    return productsRepository.deleteProduct(id)
  },

  deleteAllProducts() {},
}
