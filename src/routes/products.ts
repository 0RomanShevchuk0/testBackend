import { Response, Router } from "express"
import { ProductViewModel } from "../models/ProductViewModel"
import { QueryProductsModel } from "../models/QueryProductsModel"
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types/types"
import { URIParamProductIdModel } from "../models/URIParamProductIdModel"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { CreateProductModel } from "../models/CreateProductModel"
import { UpdateProductModel } from "../models/UpdateProductModel"
import { DBType, ProductType } from "../db/db"

const getProductViewModel = (dbProduct: ProductType): ProductViewModel => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
  }
}

export const getProductsRoutes = (db: DBType) => {
  const router = Router()

  router.get(
    "/",
    (req: RequestWithQuery<QueryProductsModel>, res: Response<ProductViewModel[]>) => {
      const { title } = req.query

      let filteredProducts = db.products
      if (title) {
        filteredProducts = db.products.filter((p) =>
          p.title.toLocaleLowerCase().includes(title.toString().toLocaleLowerCase())
        )
      }
      res.json(filteredProducts.map(getProductViewModel))
    }
  )
  router.get(
    "/:id",
    (req: RequestWithParams<URIParamProductIdModel>, res: Response<ProductViewModel>) => {
      const foundProduct = db.products.find((p) => p.id === +req.params.id)
      if (!foundProduct) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }
      res.json(getProductViewModel(foundProduct))
    }
  )
  router.post("/", (req: RequestWithBody<CreateProductModel>, res: Response<ProductViewModel>) => {
    const { title } = req.body
    if (!title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const createdProduct: ProductType = { id: +new Date(), title, price: 0 }

    db.products.push(createdProduct)
    res.status(HTTP_STATUSES.CREATED_201).json(getProductViewModel(createdProduct))
  })
  router.patch(
    "/:id",
    (
      req: RequestWithParamsAndBody<URIParamProductIdModel, UpdateProductModel>,
      res: Response<ProductViewModel>
    ) => {
      const { title } = req.body
      if (!title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
      }

      const searchedProduct = db.products.find((p) => p.id === +req.params.id)
      if (!searchedProduct) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      searchedProduct.title = title
      res.json(getProductViewModel(searchedProduct))
    }
  )
  router.delete("/:id", (req: RequestWithParams<URIParamProductIdModel>, res: Response) => {
    const productIndex = db.products.findIndex((p) => p.id === +req.params.id)

    if (productIndex === -1) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const deletedProduct = db.products.splice(productIndex, 1)
    res.json(deletedProduct[0])
  })

  return router
}
