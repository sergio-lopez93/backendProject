import { Router } from 'express'
import { UsersManager } from '../dao/UsersManager.js'
import { ProductsManager } from '../dao/ProductsManager.js'
import { CartsManager } from '../dao/CartsManager.js'

export const router = Router()

router.get('/', async (req, res) => {
  try {
    const users = await UsersManager.get()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
        detalle: `${error.message}`
      }
    )
  }
})

router.get('/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)
  if (isNaN(id)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Ingrese un id numérico' })
  }

  const users = await UsersManager.get()
  const user = users.find(u => u.id === id)
  if (!user) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `No existe el user con id ${id}` })
  }

  const carts = await CartsManager.get()
  const cart = carts.find(c => c.id === user.cartID)
  if (!cart) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json({ error: 'Error en los datos del usuario' })
  }

  const productsUser = []
  const products = await ProductsManager.get()
  cart.bolsa.forEach(c => {
    const datos = products.find(producto => producto.id === c.productID)
    if (datos) {
      productsUser.push(datos)
    }
  })

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ user, productsUser })
})

router.post('/login', async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete email' })
  }
  const users = await UsersManager.get()
  const user = users.find(u => u.email === email)
  if (!user) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `Error: usuario inexistente con email ${email}` })
  }

  res.setHeader('Content-Type', 'application/json')
  res.status(200).json({ user })
})

router.post('/', async (req, res) => {
  const { nombre, email } = req.body
  if (!nombre || !email) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete nombre / email' })
  }

  try {
    const newUser = await UsersManager.create({ nombre, email })
    res.setHeader('Content-Type', 'application/json')
    return res.status(201).json({ newUser })
  } catch (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    return res.status(500).json(
      {
        error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
        detalle: `${error.message}`
      }
    )
  }
})
