import { Router } from 'express'

//Controllers
import TokenController from '../controllers/tokenController'
//Service
import { TokenServices } from '../services/TokenService'
import prismaClient from '../database/prismaClient'

const tokenServices = new TokenServices(prismaClient)
const tokenController =  new TokenController(tokenServices)

const router = Router()

router.post('/', tokenController.store.bind(tokenController))

export default router
