import express, { Request, Response } from "express"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const db = {
  products: [
    { id: 1, title: "Wireless Bluetooth Headphones" },
    { id: 2, title: "Portable Power Bank" },
    { id: 3, title: "Wireless Mouse" },
    { id: 4, title: "USB-C Charging Cable" },
    { id: 5, title: "Laptop Stand" },
  ],
}

app.get("/", (req: Request, res: Response) => {
  res.json("home")
})
app.get("/products", (req: Request, res: Response) => {
  const { title } = req.query

  let filteredProducts = db.products
  if (title) {
    console.log("app.get  title:", title)
    filteredProducts = db.products.filter((p) =>
      p.title.toLocaleLowerCase().includes(title.toString().toLocaleLowerCase())
    )
  }
  res.json(filteredProducts)
})
app.get("/products/:id", (req: Request, res: Response) => {
  const foundProduct = db.products.find((p) => p.id === +req.params.id)
  if (!foundProduct) {
    res.sendStatus(404)
    return
  }
  res.json(foundProduct)
})
app.post("/products", (req: Request, res: Response) => {
  const { title } = req.body
  if (!title) {
    res.sendStatus(400)
    return
  }

  const createdProduct = {
    id: +new Date(),
    title: title,
  }

  db.products.push(createdProduct)
  res.status(201).json(createdProduct)
})
app.patch("/products/:id", (req: Request, res: Response) => {
  const { title } = req.body
  if (!title) {
    res.sendStatus(400)
    return
  }

  const serchedProduct = db.products.find((p) => p.id === +req.params.id)
  if (!serchedProduct) {
    res.sendStatus(404)
    return
  }

  serchedProduct.title = title
  res.json(serchedProduct)
})
app.delete("/products/:id", (req: Request, res: Response) => {
  const productIndex = db.products.findIndex((p) => p.id === +req.params.id)

  if (productIndex === -1) {
    res.sendStatus(404)
    return
  }

  const deletedProduct = db.products.splice(productIndex, 1)
  res.json(deletedProduct[0])
})

app.listen(port, () => {
  console.log(`App listening port ${port}`)
})
