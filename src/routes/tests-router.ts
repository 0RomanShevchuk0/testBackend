import { Response, Request, Router } from "express"
import { HTTP_STATUSES } from "../constants/httpStatuses"
import { productsRepository } from "../repositories/products-repository"

export const testsRouter = Router()

testsRouter.delete("/products", (req: Request, res: Response) => {
  productsRepository.deleteAllProducts()
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
