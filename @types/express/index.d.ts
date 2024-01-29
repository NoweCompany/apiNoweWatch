
declare namespace Express{
  export interface Request{
    userId?: number
    userData: {
      [key: string]: any
    }
  }
}
