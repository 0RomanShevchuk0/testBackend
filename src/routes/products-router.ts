import { HTTP_STATUSES } from "./../constants/httpStatuses"
import { Response, Router } from "express"
import { ProductViewModel } from "../models/product/ProductView.model"
import { QueryProductsModel } from "../models/product/QueryProducts.model"
import { URIParamProductIdModel } from "../models/product/URIParamProductId.model"
import { CreateProductModel } from "../models/product/CreateProduct.model"
import { UpdateProductModel } from "../models/product/UpdateProduct.model"
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/request.types"
import { body, Result, ValidationError, checkExact } from "express-validator"
import { inputValidationMiddlevare } from "../middlewares/input-validation-middlevare"
import { ProductType } from "../types/product.type"
import { productsService } from "../domain/products.service"
import { PaginationResponseType } from "../types/pagination"

export const getProductViewModel = (dbProduct: ProductType): ProductViewModel => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    price: dbProduct.price,
  }
}

const productValidation = checkExact(
  [
    body("price").isNumeric({ no_symbols: true }),
    body("title", "Title length should be 3-30 symbols").isString().isLength({ min: 3, max: 30 }),
  ],
  {
    message: "Unknown fields specified",
  }
)

export const productsRouter = Router()

productsRouter.get(
  "/",
  async (
    req: RequestWithQuery<QueryProductsModel>,
    res: Response<PaginationResponseType<ProductViewModel>>
  ) => {
    try {
      // refactor
      const filteredProducts = await productsService.findProducts(req.query)
      const result: PaginationResponseType<ProductViewModel> = {
        page: filteredProducts.page,
        pageSize: filteredProducts.pageSize,
        totalCount: filteredProducts.totalCount,
        hasNextPage: filteredProducts.hasNextPage,
        hasPreviousPage: filteredProducts.hasPreviousPage,
        items: filteredProducts.items.map(getProductViewModel),
      }
      res.json(result)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
    }
  }
)

productsRouter.get(
  "/:id",
  async (req: RequestWithParams<URIParamProductIdModel>, res: Response<ProductViewModel>) => {
    const productId = req.params.id

    try {
      const foundProduct = await productsService.findProductById(productId)
      if (!foundProduct) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }
      res.json(getProductViewModel(foundProduct))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
  }
)

productsRouter.post(
  "/",
  productValidation,
  inputValidationMiddlevare,
  async (
    req: RequestWithBody<CreateProductModel>,
    res: Response<CreateProductModel | Result<ValidationError>>
  ) => {
    try {
      const createdProduct = await productsService.createProduct(req.body)

      res.status(HTTP_STATUSES.CREATED_201).json(getProductViewModel(createdProduct))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
)

productsRouter.patch(
  "/:id",
  productValidation,
  inputValidationMiddlevare,
  async (
    req: RequestWithParamsAndBody<URIParamProductIdModel, UpdateProductModel>,
    res: Response<ProductViewModel | Result<ValidationError>>
  ) => {
    const productId = req.params.id
    try {
      const updatedProduct = await productsService.updateProduct(productId, req.body)

      if (!updatedProduct) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      res.status(HTTP_STATUSES.OK_200).json(getProductViewModel(updatedProduct))
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
)

productsRouter.delete(
  "/:id",
  async (req: RequestWithParams<URIParamProductIdModel>, res: Response) => {
    const productId = req.params.id
    try {
      const isDeleted = await productsService.deleteProduct(productId)
      const resultStatus = isDeleted ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404

      res.sendStatus(resultStatus)
    } catch (error) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
  }
)
