const socket = io()

document.addEventListener('DOMContentLoaded', () => {
  console.log('Archivo realtimeproducts.js cargado')

  const form = document.getElementById('addProductForm')
  const productsList = document.getElementById('productsList')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const descrip = document.getElementById('descrip').value
    const precio = parseFloat(document.getElementById('precio').value)

    if (!descrip || isNaN(precio)) {
      alert('Por favor, complete todos los campos correctamente.')
      return
    }

    try {
      const respuesta = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descrip, precio })
      })

      const datos = await respuesta.json()
      if (respuesta.ok) {
        console.log('Producto agregado:', datos.newProduct)

        socket.emit('newProduct', datos.newProduct)

        form.reset()
      } else {
        console.error('Error al agregar el producto:', datos.error)
      }
    } catch (error) {
      console.error('Error inesperado:', error)
    }
  })

  socket.on('newProduct', (newProduct) => {
    console.log('Evento newProduct recibido:', newProduct)

    const li = document.createElement('li')
    li.textContent = `${newProduct.descrip} - ${newProduct.precio} USD`
    productsList.appendChild(li)
  })

  const cargarProductos = async () => {
    try {
      const respuesta = await fetch('/api/products')
      const data = await respuesta.json()

      if (data.products && Array.isArray(data.products)) {
        data.products.forEach(producto => {
          const li = document.createElement('li')
          li.textContent = `${producto.descrip} - ${producto.precio} USD`
          productsList.appendChild(li)
          console.log('Producto:', producto)
        })
      } else {
        console.error('Los productos no son un array:', productos)
      }
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  cargarProductos()
})
