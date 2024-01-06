import { Router } from 'express'
import UserPhotoController from '../controllers/userPhotoController'
import { UserPhotoService } from '../services/UserPhotoService'

const router = Router()
const userPhotoController = new UserPhotoController(new UserPhotoService())

router.post('/', userPhotoController.store.bind(userPhotoController))

export default router
