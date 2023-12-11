import crypto from 'node:crypto'

import { UserRequest, UserReturnDatabase } from '../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'

abstract class AbstractUserService{
  abstract createUser(dataUser: UserRequest): Promise<UserReturnDatabase>
}

class UserServices extends AbstractUserService{
  constructor(private prisma: PrismaClient){
    super()
  }

  async createUser(dataUser: UserRequest): Promise<UserReturnDatabase> {
    console.log('Creating User...')
    try {
      //Verificar se o e-mail já exite no banco
      const password_hash = crypto
        .createHash('sha256')
        .update(dataUser.password)
        .digest('hex')

      const data = {
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

      const User = this.prisma.users.create({
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          password_hash: false,
        },
        data: data,
      })

      return User
    } catch (error) {
      throw new Error('An error occurred while creating the user.')
    }
  }
}

export { UserServices, AbstractUserService }
