import Express from 'express'

//Routers
import userRouter from './routes/userRouter'

class App {
  public readonly app = Express()
  constructor() {
    this.middleware()
    this.routers()
  }

  private middleware(): void {
    this.app.use(Express.urlencoded())
    this.app.use(Express.json())
    return
  }

  private routers(): void {
    this.app.use('/users', userRouter)

    return
  }
}

export default new App().app
