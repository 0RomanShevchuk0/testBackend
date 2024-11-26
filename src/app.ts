import express, { Request, Response } from "express"
import { getProductsRoutes } from "./routes/products"
import { db } from "./db/db"
import { getTestsRoutes } from "./routes/tests"

export const app = express()

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.json("Home test")
})

const prosuctsRouter = getProductsRoutes(db)
const testsRouter = getTestsRoutes(db)

app.use("/products", prosuctsRouter)
app.use("/__test__", testsRouter)
