import fs from 'fs'

export class CartsManager {
  static path

  static async get () {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }))
    } else {
      return []
    }
  }

  static async create () {
    const carts = await this.get()
    let id = 1
    if (carts.length > 0) {
      id = Math.max(...carts.map(d => d.id)) + 1
    }
    carts.push({
      id,
      bolsa: []
    })
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
    return id
  }

  static async update (id, cart = {}) {
    const carts = await this.get()
    const cartsIndex = carts.findIndex(c => c.id === id)
    if (cartsIndex === -1) {
      throw new Error(`${id} de carrito inexistente`)
    }
    carts[cartsIndex] = cart
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
    return carts[cartsIndex]
  }

  static async delete (cartID, productID) {
    try {
      const carts = await this.get()
      cartID = Number(cartID)
      productID = Number(productID)

      // Buscar el carrito por ID
      const cartIndex = carts.findIndex(c => c.id === cartID)
      if (cartIndex === -1) {
        throw new Error(`Error: No se encontró el carrito con ID ${cartID}`)
      }

      const cart = carts[cartIndex]

      const productIndex = cart.bolsa.findIndex(p => p.productID === productID)
      if (productIndex === -1) {
        throw new Error(`Error: No se encontró el producto con ID ${productID} en el carrito ${cartID}`)
      }

      // Verifica si hay más de una unidad del producto
      if (cart.bolsa[productIndex].cantidad > 1) {
        // Disminuir la cantidad en 1
        cart.bolsa[productIndex].cantidad -= 1
      } else {
        // Eliminar el producto si solo hay una unidad
        cart.bolsa = cart.bolsa.filter(p => p.productID !== productID)
      }

      // Actualizar el carrito en el array de carritos
      carts[cartIndex] = cart
      console.log(`Una unidad del producto con ID ${productID} eliminada del carrito con ID ${cartID}`)

      // Guardar los cambios en el archivo JSON
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
      return cart
    } catch (error) {
      console.error(`Error al eliminar una unidad del producto: ${error.message}`)
      throw error
    }
  }
}
