import { Router } from 'express'

//Controllers
import UserController from '../controllers/userController'
//Service
import { UserServices } from '../services/UserServices'
import prismaClient from '../database/prismaClient'

const userService = new UserServices(prismaClient)
const userController =  new UserController(userService)

const router = Router()

router.get('/', userController.index.bind(userController))
router.post('/', userController.store.bind(userController))
router.put('/:id', userController.update.bind(userController))
router.delete('/:id', userController.delete.bind(userController))

export default router
