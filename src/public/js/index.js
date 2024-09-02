const inputEmail = document.getElementById('email')
const btnSubmit = document.getElementById('btnSubmit')

btnSubmit.addEventListener('click', async (e) => {
  e.preventDefault()

  const email = inputEmail.value.trim()
  if (!email) {
    alert('Complete email...!!!')
  }

  const respuesta = await fetch('/api/users/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  const datos = await respuesta.json()
  console.log(datos, respuesta.status)
  if (respuesta.status === 200) {
    location.href = `/products?id=${datos.user.id}&cartID=${datos.user.cartID}`
  } else {
    alert(datos.error)
  }
})
