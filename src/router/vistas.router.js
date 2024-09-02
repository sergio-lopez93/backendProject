import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'
import { UsersManager } from '../dao/UsersManager.js'
export const router = Router()

router.get('/', async (req, res) => {
  console.log('Renderizando la vista home...')
  try {
    const products = await ProductsManager.get()
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('home', { products })
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).send({
      error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
      detalle: `${error.message}`
    })
  }
})

router.get('/products', async (req, res) => {
  let { id, cartID } = req.query
  if (!id || !cartID) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete id / cartID' })
  }

  id = Number(id)
  cartID = Number(cartID)
  if (isNaN(id) || isNaN(cartID)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Formato argumentos inválido...!!!' })
  }

  const users = await UsersManager.get()
  const user = users.find(u => u.id === id)
  if (!user) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Usuario con id ${id} inexistente` })
  }

  const products = await ProductsManager.get()

  const carts = await CartsManager.get()
  const cart = carts.find(c => c.id === cartID)
  if (!cart) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Problemas con los datos del usuario' })
  }

  cart.bolsa.forEach(producto => {
    const { descrip } = products.find(p => p.id === producto.productID)
    if (!descrip) {
      console.log(`Error con algun producto del usuario ${id}. Id producto: ${producto.productID}`)
    } else {
      producto.descrip = descrip
    }
  })

  console.log(cart)

  res.setHeader('Content-Type', 'text/html')
  res.status(200).render('products', {
    user,
    cart,
    products
  })
})
