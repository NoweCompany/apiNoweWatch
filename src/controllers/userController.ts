import { Response } from 'express'

import RequestBodyInterface from '../interfaces/RequestBodyInterface'
import { UserRequest } from '../interfaces/UserInterface'
import { AbstractUserService } from '../services/UserServices'

class UserController {
  constructor(private userService: AbstractUserService){}

  public async store(req: RequestBodyInterface<UserRequest>, res: Response) {
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
    } = req.body

    if (!name || name.length < 3) {
      return res
        .status(400)
        .json({ error: 'The name must be at least 3 characters long' })
    }

    if (!password || password.length < 3 || password.length > 16) {
      return res.status(400).json({
        error:
          'The password must be at least 3 characters long and a maximum of 16.',
      })
    }

    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res.status(400).json({ error: 'Invalid Email.' })
    }

    if (!birth_date || !/^\d{4}-\d{2}-\d{2}$/.test(String(birth_date))) {
      return res
        .status(400)
        .json({ error: 'Invalid date of birth. Use yyyy-mm-dd format.' })
    }

    if (!city || city.length < 2) {
      return res
        .status(400)
        .json({ error: 'The city must be at least 2 characters long' })
    }

    if (!country || country.length < 2) {
      return res
        .status(400)
        .json({ error: 'The country must be at least 2 characters long' })
    }

    if (!gender || (gender !== 'male' && gender !== 'female' && gender !== 'other')) {
      return res.status(400).json({
        error: 'Invalid gender. must be "male", "female" or "other".',
      })
    }

    if (!state || state.length < 2) {
      return res
        .status(400)
        .json({ error: 'The state must be at least 2 characters long.' })
    }

    if (!username || username.length < 5) {
      return res
        .status(400)
        .json({ error: 'The username must be at least 5 characters long.' })
    }

    try {
      const user = await this.userService.createUser({
        name,
        email,
        birth_date,
        city,
        country,
        gender,
        state,
        username,
        password,
      })

      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error.',
      })
    }
  }
}

export default UserController
