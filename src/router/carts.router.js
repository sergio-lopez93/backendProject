import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'

export const router = Router()

router.put('/:cartID/producto/:productID', async (req, res) => {
  let { cartID, productID } = req.params
  cartID = Number(cartID)
  productID = Number(productID)
  if (isNaN(cartID) || isNaN(productID)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Los id\'s deben ser numéricos...!!!' })
  }

  const carts = await CartsManager.get()
  let cart = carts.find(c => c.id === cartID)
  if (!cart) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Carrito inexistente ${cartID}` })
  }

  const products = await ProductsManager.get()
  const existe = products.find(p => p.id === productID)
  if (!existe) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Producto ${productID} inexistente...!!!` })
  }

  const productIndex = cart.bolsa.findIndex(c => c.productID === productID)
  if (productIndex !== -1) {
    cart.bolsa[productIndex].cantidad++
  } else {
    cart.bolsa.push({
      productID, cantidad: 1
    })
  }

  cart = await CartsManager.update(cartID, cart)

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ cart })
})

router.delete('/:cartID/producto/:productID', async (req, res) => {
  let { cartID, productID } = req.params
  cartID = Number(cartID)
  productID = Number(productID)
  if (isNaN(cartID) || isNaN(productID)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Los id\'s deben ser numéricos...!!!' })
  }

  try {
    const resultado = await CartsManager.delete(cartID, productID)
    req.io.emit('productoEliminado', { cartID, productID })
    if (resultado) {
      return res.status(201).json({ payload: 'Producto eliminado' })
    } else {
      return res.status(500).json({ error: 'Error al expulsar' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', details: error.message })
  }
})
