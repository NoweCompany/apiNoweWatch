import { Response } from 'express'

import RequestBodyInterface from '../interfaces/RequestBodyInterface'
import { UserRequest } from '../interfaces/UserInterface'

import { AbstractUserService } from '../services/UserServices'

import { PrismaClient } from '@prisma/client'
class UserController {
  constructor(private userService: AbstractUserService){}

  public async store(req: RequestBodyInterface<UserRequest>, res: Response) {
    try {
      const validationUserData = this.userService.validateUserData(req.body)

      if(validationUserData !== null) return res.status(400).json({
        error: `Validation error, sent parameters are invalid MESSAGE ERROR: ${validationUserData}`
      })

      const hashedPassword = this.userService.hashingPassword(req.body.password)

      const responseService = await this.userService.createUser({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        birth_date: req.body.birth_date,
        gender: req.body.gender,
        password_hash: hashedPassword,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
      })

      return res.status(200).json(responseService)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }
}

export default UserController
