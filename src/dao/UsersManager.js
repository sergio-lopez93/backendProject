import fs from 'fs'
import { CartsManager } from './CartsManager.js'

export class UsersManager {
  static path

  static async get () {
    if (fs.existsSync(this.path)) {
      return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }))
    } else {
      return []
    }
  }

  static async create (user = {}) {
    if (!user.email) {
      throw new Error('email es requerido')
    }
    const users = await this.get()
    const existe = users.find(u => u.email === user.email)
    if (existe) {
      throw new Error(`${user.email} ya existe en DB`)
    }
    let id = 1
    if (users.length > 0) {
      id = Math.max(...users.map(d => d.id)) + 1
    }

    const cartID = await CartsManager.create()

    const nuevoUser = {
      id,
      ...user,
      cartID
    }
    users.push(nuevoUser)
    await fs.promises.writeFile(this.path, JSON.stringify(users, null, 5))
    return nuevoUser
  }
}
