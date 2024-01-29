import { Router } from 'express'
import UserPhotoController from '../controllers/userPhotoController'
import { UserPhotoService } from '../services/UserPhotoService'
import Authorizantion from '../middlewares/authorizationMiddleware'
import prismaClient from '../database/prismaClient'

const router = Router()
const userPhotoController = new UserPhotoController(new UserPhotoService(prismaClient))

const authorizantion = new Authorizantion(prismaClient)

router.post(
  '/',
  authorizantion.checkAuthorization.bind(authorizantion),
  authorizantion.validUserId.bind(authorizantion),
  userPhotoController.store.bind(userPhotoController)
)

export default router
