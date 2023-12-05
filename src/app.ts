import Express from 'express'

class App {
  public readonly app = Express()
  constructor () {
    this.middleware()
    this.routers()
  }

  private middleware(): void {
    return
  }

  private routers(): void{
    return
  }
}

export default new App().app
