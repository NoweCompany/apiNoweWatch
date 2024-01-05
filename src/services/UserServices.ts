import crypto from 'node:crypto'

import { UserRequest, User, UserReturnedDB, Password_hash } from '../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'
import { BlobOptions } from 'node:buffer'

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
  abstract checkIfKeyExistAndIsValid(data: {[keys: string]: any}): null | string[]
  abstract createUser(dataUser: User & Password_hash): Promise<UserReturnedDB>
  abstract hashingPassword(password: string): string
  abstract listUsers(): Promise<UserReturnedDB[]>
  abstract updatedUser(dataUser: User, id: number): Promise<UserReturnedDB>
  abstract checkKeysAccepted(data: { [keys: string]: any} ): boolean | Partial<User>
  abstract inactiveUser(id: number): Promise<null> | never
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

  async createUser(dataUser: User & Password_hash): Promise<UserReturnedDB> {
    try {
      const userReturnedDatabase = await this.prisma.users.create({data: dataUser})

      const { id, name, email, username, birth_date, city, country, gender, state } = userReturnedDatabase
      return { id, name, email, username, birth_date, city, country, gender, state } as UserReturnedDB
    } catch (error) {
      console.log(error);

      throw new Error('An error occurred while creating the user.')
    }
  }

  async listUsers(): Promise<UserReturnedDB[]>{
    try{
      const users = await this.prisma.users.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          birth_date: true,
          country: true,
          gender: true,
          city: true,
          photo: true,
          state: true,
          password_hash: false,
          active: false
        },
        where: {
          active: true
        }
      }) as UserReturnedDB[]

      return users
    }catch(error){
      throw new Error('An Error ocurred while list users')
    }
  }

  checkIfKeyExistAndIsValid(data: {[keys: string]: any}): null | string[]{
    const keysUserData = Object.keys(data)
    const errors = []

    if (keysUserData.includes('name') && data.name.length < 3) {
      errors.push('The name must be at least 3 characters long');
    }

    if (keysUserData.includes('password') && (data.password.length < 3 || data.password.length > 16)) {
      errors.push('The password must be at least 3 characters long and a maximum of 16.');
    }

    if (keysUserData.includes('email') && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      errors.push('Invalid Email.');
    }

    if (keysUserData.includes('birth_date')) {
      data.birth_date = new Date(data.birth_date)
      if(!/^\d{4}-\d{2}-\d{2}$/.test(String(data.birth_date))){
        errors.push('Invalid date of birth. Use yyyy-mm-dd format.');
      }
    }

    if (keysUserData.includes('city') && data.city.length < 2) {
      errors.push('The city must be at least 2 characters long');
    }

    if (keysUserData.includes('country') && data.country.length < 2) {
      errors.push('The country must be at least 2 characters long');
    }

    if (keysUserData.includes('gender') && (data.gender !== 'male' && data.gender !== 'female' && data.gender !== 'other')) {
      errors.push('Invalid gender. must be "male", "female" or "other".');
    }

    if (keysUserData.includes('state') && data.state.length < 2) {
      errors.push('The state must be at least 2 characters long.');
    }

    if (keysUserData.includes('username') && data.username.length < 5) {
      errors.push('The username must be at least 5 characters long.');
    }

    if(errors.length >= 1) return errors
    return null
  }

  checkKeysAccepted(data: { [keys: string]: any} ): boolean{
    const keysUserData = Object.keys(data)
    const keysAccepted = ['name', 'email', 'username', 'birth_date', 'city', 'country', 'gender', 'state']
    const cbKeysAccepteds = (el: string) => keysAccepted.includes(el)

    if(!keysUserData.every(cbKeysAccepteds)) return false

    return true
  }

  async updatedUser(dataUser: User, id: number): Promise<UserReturnedDB>{
    try{
      console.log(dataUser);

      const userUpdated = await this.prisma.users.update({
        where: {
          id: id
        },
        data: dataUser,
        select: {
          id: true,
          name: true,
          email: true,
          birth_date: true,
          city: true,
          country: true,
          gender: true,
          state: true,
          username: true,
          password_hash: false
        }
      }) as UserReturnedDB

      return userUpdated
    }catch(error){
      console.log(error);
      throw new Error('An Error ocurred while updated user')
    }
  }

  async inactiveUser(id: number): Promise<null> | never{
    try {
      await this.prisma.users.update({
        data: {
          active: false,
        },
        where: { id }
      })

      return null
    } catch (error) {
      console.log(error);
      throw new Error('An Error ocurred while updated user')
    }
  }
}

export { UserServices, AbstractUserService }
