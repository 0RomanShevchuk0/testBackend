import request from "supertest"
import { CreateProductModel } from "../src/models/CreateProductModel"
import { UpdateProductModel } from "../src/models/UpdateProductModel"
import { HTTP_STATUSES } from "../src/constants/httpStatuses"
import { app } from "../src/app"

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
    const data: CreateProductModel = { title: "" }

    await request(app).post("/products").send(data).expect(HTTP_STATUSES.BAD_REQUEST_400)
    await request(app).get("/products").expect([])
  })

  let createdProduct: any = null
  it("should create product with correct input data", async () => {
    const data: CreateProductModel = { title: "test product" }

    const response = await request(app)
      .post("/products")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct = response.body

    expect(createdProduct).toEqual({
      id: expect.any(Number),
      title: data.title,
    })

    await request(app).get("/products").expect([createdProduct])
  })

  it("shoudn't update product with incorrect data", async () => {
    const data: UpdateProductModel = { title: "" }

    await request(app)
      .patch(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)
    await request(app)
      .get(`/products/${createdProduct.id}`)
      .expect(HTTP_STATUSES.OK_200, createdProduct)
  })

  it("shoudn't update product that doesn't exist", async () => {
    const data: UpdateProductModel = { title: "test title" }

    await request(app).patch(`/products/-1`).send(data).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it("shoud update product with correct data", async () => {
    const data: UpdateProductModel = { title: "good title" }

    await request(app)
      .patch(`/products/${createdProduct.id}`)
      .send(data)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdProduct,
        title: data.title,
      })
  })

  it("shouldn't delete product that doesn't exist", async () => {
    await request(app).delete("/products/-1").expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it("should delete product", async () => {
    await request(app).delete(`/products/${createdProduct.id}`).expect(HTTP_STATUSES.OK_200)
    await request(app).get(`/products/${createdProduct.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
  })
})
