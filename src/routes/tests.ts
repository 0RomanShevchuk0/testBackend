import { Response, Request, Router } from "express"
import { DBType } from "../db/db"
import { HTTP_STATUSES } from "../constants/httpStatuses"

export const getTestsRoutes = (db: DBType) => {
  const router = Router()

  router.delete("/products", (req: Request, res: Response) => {
    db.products = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}
