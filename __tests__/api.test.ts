import request from "supertest"
import { CreateProductModel } from "../src/models/CreateProductModel"
import { UpdateProductModel } from "../src/models/UpdateProductModel"
import { HTTP_STATUSES } from "../src/constants/httpStatuses"
import { app } from "../src/app"
import { ProductViewModel } from "../src/models/ProductViewModel"

describe("products api", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/products")
  })

  it("should return 200 and array of products", async () => {
    await request(app).get("/products").expect(HTTP_STATUSES.OK_200, [])
  })

  it("should return 404 for not existing product", async () => {
    await request(app).get("/products/12").expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it("shouldn't create product with incorrect input data", async () => {
    const data: CreateProductModel = { title: "", price: 10 }

    await request(app).post("/products").send(data).expect(HTTP_STATUSES.BAD_REQUEST_400)
    await request(app).get("/products").expect([])
  })

  let createdProduct: any = null
  it("should create product with correct input data", async () => {
    const data: CreateProductModel = { title: "test product", price: 10 }

    const response = await request(app)
      .post("/products")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct = response.body

    const expectedProduct: ProductViewModel = {
      id: expect.any(Number),
      title: data.title,
      price: data.price,
    }
    expect(createdProduct).toEqual(expectedProduct)

    await request(app).get("/products").expect([createdProduct])
  })

  it("shoudn't update product with incorrect data", async () => {
    const data: UpdateProductModel = { title: "", price: 10 }

    await request(app)
      .patch(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
    await request(app)
      .get(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.OK_200, createdProduct)
  })

  it("shoudn't update product that doesn't exist", async () => {
    const data: UpdateProductModel = { title: "test title", price: 10 }

    await request(app).patch(`/products/-1`).send(data).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it("shoud update product with correct data", async () => {
    const data: UpdateProductModel = { title: "good title", price: 50 }

    await request(app)
      .patch(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdProduct,
        ...data,
      })
  })

  it("shouldn't delete product that doesn't exist", async () => {
    await request(app).delete("/products/-1").expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it("should delete product", async () => {
    await request(app).delete(`/products/${createdProduct.id}`).expect(HTTP_STATUSES.NO_CONTENT_204)
    await request(app).get(`/products/${createdProduct.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })
})
