import crypto from 'node:crypto'

import { UserRequest } from '../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'

interface User {
  name: string
  username: string
  email: string
  birth_date: Date
  gender: 'female' | 'male' | 'other'
  password_hash: string
  country: string
  state: string
  city: string
}

abstract class AbstractUserService{
  abstract createUser(dataUser: UserRequest): Promise<User>
}

class UserServices extends AbstractUserService{

  async createUser(dataUser: UserRequest): Promise<User> {
    try {
      //Verificar se o e-mail já exite no banco
      const password_hash = crypto
        .createHash('sha256')
        .update(dataUser.password)
        .digest('hex')

      const user = {
        name: dataUser.name,
        username: dataUser.username,
        email: dataUser.email,
        birth_date: new Date(dataUser.birth_date),
        gender: dataUser.gender,
        password_hash,
        country: dataUser.country,
        state: dataUser.state,
        city: dataUser.city
      }

      return user
    } catch (error) {
      throw new Error('An error occurred while creating the user.')
    }
  }
}

export { UserServices, AbstractUserService }
