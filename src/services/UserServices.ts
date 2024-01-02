import crypto from 'node:crypto'

import { UserRequest, User } from '../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'

interface UserReturned {
  id: Number,
  name: string,
  username: string,
  email: string
}

abstract class AbstractUserService{
  protected prisma: PrismaClient
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }
  abstract validateUserData(dataUser: UserRequest): string[] | null
  abstract createUser(dataUser: User): Promise<UserReturned>
  abstract hashingPassword(password: string): string
}

class UserServices extends AbstractUserService{
  constructor(prisma: PrismaClient){
    super(prisma)
  }

  validateUserData(dataUser: UserRequest): string[] | null {
    const {
      name,
      email,
      birth_date,
      city,
      country,
      gender,
      state,
      username,
      password,
    } = dataUser

    const errors = []

    if (!name || name.length < 3) {
      errors.push('The name must be at least 3 characters long');
    }

    if (!password || password.length < 3 || password.length > 16) {
      errors.push('The password must be at least 3 characters long and a maximum of 16.');
    }

    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      errors.push('Invalid Email.');
    }

    if (!birth_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(birth_date))) {
      errors.push('Invalid date of birth. Use yyyy-mm-dd format.');
    }

    if (!city || city.length < 2) {
      errors.push('The city must be at least 2 characters long');
    }

    if (!country || country.length < 2) {
      errors.push('The country must be at least 2 characters long');
    }

    if (!gender || (gender !== 'male' && gender !== 'female' && gender !== 'other')) {
      errors.push('Invalid gender. must be "male", "female" or "other".');
    }

    if (!state || state.length < 2) {
      errors.push('The state must be at least 2 characters long.');
    }

    if (!username || username.length < 5) {
      errors.push('The username must be at least 5 characters long.');
    }

    if(errors.length > 0) return errors
    else return null
  }

  hashingPassword(password: string): string{
    const password_hash = crypto
        .createHash('sha256')
        .update(password, 'utf-8')
        .digest('hex')

      return password_hash
  }

  async createUser(dataUser: User): Promise<UserReturned> {
    try {
      const userReturnedDatabase = await this.prisma.users.create({data: dataUser})

      console.log(userReturnedDatabase)

      const { id, name, email, username } = userReturnedDatabase
      return { id, name, email, username }
    } catch (error) {
      console.log(error);

      throw new Error('An error occurred while creating the user.')
    }
  }
}

export { UserServices, AbstractUserService }
