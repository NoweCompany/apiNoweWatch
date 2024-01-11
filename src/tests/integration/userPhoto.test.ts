import app from '../../app';
import request from 'supertest';
import prismaClient from '../../database/prismaClient';
import { resolve } from 'path';
import { createReadStream } from 'fs'

let server: any
describe("Test' UserPhoto", () => {
  beforeAll(() => {
    const port = process.env.PORT ?? 3300

    server = app.listen(port, () => {
      console.log(`Server is running: http://localhost:${port}`)
    })
  })
  afterAll(() => {
    server.close()
  })

  it('must create a photo linked to a user', async () => {
    const fileDiretory = resolve(__dirname, '..', 'assets', 'img', '96kb.jpg')

    const response = await request(app)
      .post('/usersPhoto')
      .set('Content-Type', 'multipart/form-data')
      .attach("userPhoto", fileDiretory)

    expect(response.status).toBe(200)
  })

  it('must create a photo linked to a user', async () => {
    const fileDiretory = resolve(__dirname, '..', 'assets', 'img', '1.117kb.jpg')

    const response = await request(app)
      .post('/usersPhoto')
      .set('Content-Type', 'multipart/form-data')
      .attach("userPhoto", fileDiretory)

    expect(response.status).toBe(400)
    expect(response.body).toBe('Size exceeded, maximum size is 350MB')
  })
})
