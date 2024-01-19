import { Router } from 'express'
import UserPhotoController from '../controllers/userPhotoController'
import { UserPhotoService } from '../services/UserPhotoService'
import prismaClient from '../database/prismaClient'

const router = Router()
const userPhotoController = new UserPhotoController(new UserPhotoService(prismaClient))

router.post('/', userPhotoController.store.bind(userPhotoController))

export default router
