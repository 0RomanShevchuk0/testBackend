import express, { Request, Response } from "express"
import { productsRouter } from "./routes/products-router"
import { testsRouter } from "./routes/tests-router"
import cors, { CorsOptions } from "cors"

export const app = express()

app.use(express.json())

const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  exposedHeaders: "set-cookie",
}
app.use(cors(corsOptions))

app.get("/", async (req: Request, res: Response) => {
  res.json("Home")
})

app.use("/products", productsRouter)
app.use("/__test__", testsRouter)
