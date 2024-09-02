import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

import { router as usersRouter } from './router/users.router.js'
import { router as cartsRouter } from './router/carts.router.js'
import { router as productsRouter } from './router/products.router.js'
import { router as vistasRouter } from './router/vistas.router.js'

import { UsersManager } from './dao/UsersManager.js'
import { ProductsManager } from './dao/ProductsManager.js'
import { CartsManager } from './dao/CartsManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

UsersManager.path = './data/users.json'
ProductsManager.path = './data/products.json'
CartsManager.path = './data/carts.json'

const app = express()
const PORT = 8080

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`)
})

const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use('/api/users', usersRouter)

app.use('/api/carts', (req, res, next) => {
  req.io = io
  next()
}, cartsRouter)

app.use('/api/products', (req, res, next) => {
  req.io = io
  next()
}, productsRouter)

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('newProduct', (newProduct) => {
    console.log('Nuevo producto emitido:', newProduct)
    io.emit('newProduct', newProduct)
  })
})

app.use('/', vistasRouter)
app.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts')
})

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send('OK')
})
