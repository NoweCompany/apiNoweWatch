import { Router } from 'express'

//Controllers
import UserController from '../controllers/userController'
//Service
import { UserServices } from '../services/UserServices'
import prismaClient from '../database/prismaClient'

const userService = new UserServices()
const userController =  new UserController(userService, prismaClient)

const router = Router()

router.get('/', (req, res) => {
  res.json('Olá mundo')
})

router.post('/', userController.store.bind(userController))

export default router
