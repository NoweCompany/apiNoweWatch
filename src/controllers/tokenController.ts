import { Response } from 'express'

import RequestBodyInterface from '../interfaces/RequestBodyInterface'
import Token from '../interfaces/TokenInterface'

import { AbstractTokenService } from '../services/TokenService'
class TokenController {
  constructor(private tokenService: AbstractTokenService){}

  public async store(req: RequestBodyInterface<Token>, res: Response) {
    try {
      const { userIdentification, password } = req.body

      //validate
      const validationToken = this.tokenService.validationtoken(userIdentification, password)

      if(validationToken !== null) return res.status(400).json({
        error: `Validation error, sent parameters are invalid MESSAGE ERROR: ${validationToken}`
      })

      const authenticateUser = await this.tokenService.authenticateUser(userIdentification, password)
      if(!authenticateUser) return res.status(400).json({
        error: `User invalid, not exist, register ${userIdentification} to realize login.`
      })

      const token = this.tokenService.tokenGenerator(authenticateUser)

      return res.status(200).json({...authenticateUser, token})
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }
}

export default TokenController
