import Express from 'express'

import 'dotenv/config'
//Routers
import userRouter from './routes/userRouter'
import userPhotoRouter from './routes/userphotoRouter'
import tokenRouter from './routes/tokenRouter'
import { resolve } from 'path'


class App {
  public readonly app = Express()
  constructor() {
    this.middleware()
    this.routers()
  }

  private middleware(): void {
    this.app.use(Express.urlencoded({extended: true}))
    this.app.use(Express.static(resolve(__dirname, 'uploads', 'usersPhotos')))
    this.app.use(Express.json())
    return
  }

  private routers(): void {
    this.app.use('/users', userRouter)
    this.app.use('/usersPhoto', userPhotoRouter)
    this.app.use('/token', tokenRouter)

    return
  }
}

export default new App().app
