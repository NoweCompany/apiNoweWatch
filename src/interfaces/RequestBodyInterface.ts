import { Request } from 'express'

export default interface RequestBodyInterface<T> extends Request {
  body: T
}
