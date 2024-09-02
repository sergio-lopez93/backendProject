const socket = io()
socket.on('connect', () => {
  console.log('Conectado al servidor Socket.IO')
})

console.log('Archivo products.js cargado')

const h2User = document.getElementById('user')
const ulProductos = document.getElementById('productos')

const agregarProducto = async (productID) => {
  const cartID = h2User.dataset.cart
  console.log({ productID, cartID })

  const respuesta = await fetch(`/api/carts/${cartID}/producto/${productID}`, {
    method: 'put'
  })
  const datos = await respuesta.json()
  console.log(datos, respuesta.status)
  location.reload()
}

socket.on('productoEliminado', ({ cartID, productID }) => {
  console.log('Evento productoEliminado recibido:', { cartID, productID })
  const productoElemento = document.querySelector(`li[data-product-id="${productID}"]`)
  if (productoElemento) {
    const cantidadElemento = productoElemento.querySelector('.cantidad')
    if (cantidadElemento) {
      const cantidad = parseInt(cantidadElemento.textContent, 10)
      if (cantidad > 1) {
        cantidadElemento.textContent = (cantidad - 1).toString()
      } else {
        productoElemento.remove()
      }
    }
  } else {
    console.error('Elemento del producto no encontrado en el DOM')
  }
})

const eliminarProducto = async (productID) => {
  const cartID = h2User.dataset.cart

  try {
    const respuesta = await fetch(`/api/carts/${cartID}/producto/${productID}`, {
      method: 'delete'
    })
    const datos = await respuesta.json()
    if (respuesta.ok) {
      console.log(datos)
      socket.emit('productoEliminado', { cartID, productID })
    } else {
      console.error('Error al eliminar el producto:', datos.error)
    }
  } catch (error) {
    console.error('Error inesperado:', error)
  }
}
