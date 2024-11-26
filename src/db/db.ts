export type ProductType = {
  id: number
  title: string
  price: number
}
export type DBType = { products: ProductType[] }

export const db: DBType = {
  products: [
    { id: 1, title: "Wireless Bluetooth Headphones", price: 10 },
    { id: 2, title: "Portable Power Bank", price: 10 },
    { id: 3, title: "Wireless Mouse", price: 10 },
    { id: 4, title: "USB-C Charging Cable", price: 10 },
    { id: 5, title: "Laptop Stand", price: 10 },
  ],
}
