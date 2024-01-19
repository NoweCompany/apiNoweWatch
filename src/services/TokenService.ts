import { User, UserReturnedDB} from '../interfaces/UserInterface'
import { PrismaClient } from '@prisma/client'
import { UserServices } from './UserServices'

import jwt from 'jsonwebtoken'

type Error = String
type Errors = Error[]

abstract class AbstractTokenService{
  protected prisma: PrismaClient
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  abstract validationtoken(userIdentification: string, password: string ): Errors | null
  abstract authenticateUser(userIdentification: string, password: string ): Promise<false | UserReturnedDB>
  abstract tokenGenerator(userData: UserReturnedDB): string
}

class TokenServices extends AbstractTokenService{
  constructor(prisma: PrismaClient){
    super(prisma)
  }

  validationtoken(userIdentification: string, password: string ): Errors | null {
    let errors = []
    if(!userIdentification.trim() || !password.trim() ){
      errors.push('Parameters invalid.')
    }

    if(errors.length > 0) return errors

    return null
  }

  async authenticateUser(userIdentification: string, password: string): Promise<false| UserReturnedDB> {
    try {
      const hashPassword = (new UserServices(this.prisma)).hashingPassword(password)
      const user = await this.prisma.users.findFirst({
        where: {
          OR: [
            { email: userIdentification},
            { username: userIdentification}
          ],
          AND: {
            password_hash: hashPassword
          }
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          birth_date: true,
          country: true,
          gender: true,
          city: true,
          state: true,
          photo: false,
          password_hash: false,
          active: false
        },
      }) as UserReturnedDB

      if(!user){
        return false
      }

      return user
    } catch (error) {
      console.log(error)
      throw new Error('Error in validating user!')
    }
  }

  tokenGenerator(userData: UserReturnedDB): string {
    try {
      const payload = userData
      const options = { expiresIn: process.env.TOKEN_TIME_EXPIRATION}

      const token = jwt.sign(payload, String(process.env.TOKEN_SECRET), options)

      return token
    } catch (error) {
      throw new Error('An error occured on generate token!' + error)
    }
  }
}

export { TokenServices, AbstractTokenService }
