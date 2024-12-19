import express, { Request, Response } from "express"
import { productsRouter } from "./routes/products-router"
import { testsRouter } from "./routes/tests-router"

export const app = express()

app.use(express.json())

app.get("/", async (req: Request, res: Response) => {
  res.json("Home")
})

app.use("/products", productsRouter)
app.use("/__test__", testsRouter)
