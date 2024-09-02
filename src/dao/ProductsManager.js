import fs from 'fs'

export class ProductsManager {
  static path

  static async get () {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }))
    } else {
      return []
    }
  }

  static async create (descrip, precio) {
    const products = await this.get()
    console.log(products)
    const existe = products.find(p => p.descrip.toLowerCase().trim() === descrip.toLowerCase().trim())
    if (existe) {
      throw Error(`Ya existe el producto ${descrip}`)
    }

    let id = 1
    if (products.length > 0) {
      id = Math.max(...products.map(d => d.id)) + 1
    }

    const newProduct = { id, descrip, precio }
    products.push(newProduct)
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
    return newProduct
  }
}
