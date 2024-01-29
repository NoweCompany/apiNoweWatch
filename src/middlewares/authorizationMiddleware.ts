import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import { UserReturnedDB } from '../interfaces/UserInterface';

import { PrismaClient } from '@prisma/client';

export default class Authorizantion{
  private prisma
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  checkAuthorization(req: Request, res: Response, next: NextFunction){
    try {
      const tokenAuthorizantion = req.headers?.authorization

      if(!tokenAuthorizantion) return res.status(400).json('Login required, user not valid.')

      const token = tokenAuthorizantion.split(' ')[1]
      const userData = jwt.verify(token, String(process.env.TOKEN_SECRET)) as UserReturnedDB

      if(!userData?.id) return res.status(400).json('Login required, user not valid.')

      req.userId = Number(userData.id)
      next()
    } catch (error) {
      console.log(error)
      return res.status(500).json('was not be possible authenticate your token')
    }
  }

  async validUserId(req: Request, res: Response, next: NextFunction){
    try {
      const { userId } = req
      if(!userId) return res.status(400).json('UserId not exist.')

      const existUser = await this.prisma.users.findFirst({
        where: { id: userId,  active: true},
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
          photo: {
            select: {
              file_name: true,
            }
          },
          password_hash: false,
          active: false
        },
      })

      if(!existUser) return res.status(400).json('User not exist in database.')

      req.userData = existUser

      next()
    } catch (error) {
      console.log(error)
      return res.status(500).json('was not be possible authenticate your token')
    }
  }
}
