import { Router } from 'express'
import { ProductsManager } from '../dao/ProductsManager.js'

export const router = Router()

router.get('/', async (req, res) => {
  try {
    const products = await ProductsManager.get()

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ products })
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

router.post('/', async (req, res) => {
  let { descrip, precio } = req.body
  if (!descrip || !precio) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Complete todos los datos descrip / precio' })
  }

  precio = Number(precio)
  if (isNaN(precio)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: 'Precio en formato invalido' })
  }

  try {
    const newProduct = await ProductsManager.create(descrip, precio)
    req.io.emit('newProduct', newProduct)
    res.setHeader('Content-Type', 'application/json')
    return res.status(201).json({ newProduct })
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
