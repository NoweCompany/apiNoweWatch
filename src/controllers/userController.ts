import { Response } from 'express'

import RequestBodyInterface from '../interfaces/RequestBodyInterface'
import { UserRequest, User} from '../interfaces/UserInterface'

import { AbstractUserService } from '../services/UserServices'
class UserController {
  constructor(private userService: AbstractUserService){}

  public async store(req: RequestBodyInterface<UserRequest>, res: Response) {
    try {
      const { name, username, email, birth_date, gender, password, country, state, city } = req.body

      const validationUserData = this.userService.validateUserData({ name, username, email, birth_date, gender, password, country, state, city })

      if(validationUserData !== null) return res.status(400).json({
        error: `Validation error, sent parameters are invalid MESSAGE ERROR: ${validationUserData}`
      })

      const hashedPassword = this.userService.hashingPassword(password)

      const responseService = await this.userService.createUser({
        name: name,
        username: username,
        email: email,
        birth_date: new Date(birth_date),
        gender: gender,
        password_hash: hashedPassword,
        country: country,
        state: state,
        city: city
      })

      return res.status(200).json(responseService)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }

  public async index(req: RequestBodyInterface<null>, res: Response){
    try{
      const users = await this.userService.listUsers()

      return res.status(200).json(users)
    }catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }

  public async update(req: RequestBodyInterface<UserRequest>, res: Response){
    try {
      const { id } = req.params
      const userData = req.body

      const keyIsvalid = this.userService.checkKeysAccepted(userData)
      if(!keyIsvalid) return res.status(400).json({
        error: `Validation error, sent parameters are invalid!`
      })
      const userIsValid = this.userService.checkIfKeyExistAndIsValid(userData)
      if(userIsValid !== null) return res.status(400).json({
        error: `Validation error, sent parameters are invalid MESSAGE ERROR: ${userIsValid}`
      })

      const responseService = await this.userService.updatedUser(userData as User, Number(id))

      return res.status(200).json(responseService)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }

  public async delete(req: RequestBodyInterface<null>, res: Response){
    try{
      const { id } = req.params
      const response = await this.userService.inactiveUser(Number(id))

      return res.status(200).json(response)
    }catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }
}

export default UserController
