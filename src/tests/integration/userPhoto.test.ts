import app from '../../app';
import request from 'supertest';
import prismaClient from '../../database/prismaClient';
import { resolve } from 'path';
import { createReadStream } from 'fs'

let server: any
describe("Test' UserPhoto", () => {
  let user = {}
  beforeAll(async () => {
    const port = process.env.PORT ?? 3300

    server = app.listen(port, () => {
      console.log(`Server is running: http://localhost:${port}`)
    })

    // const userData = {
    //   name: "João Silva",
    //   password: "senha123",
    //   email: `joao.silva@example.com`,
    //   birth_date: "1990-01-01",
    //   city: "Campinas",
    //   country: "Brasil",
    //   gender: "male",
    //   state: "SP",
    //   username: `joaosilva`,
    // }
    // user = await request(app).post('/users').send(user)

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

  it('must be returned an error message', async () => {
    const fileDiretory = resolve(__dirname, '..', 'assets', 'img', '1.117kb.jpg')

    const response = await request(app)
      .post('/usersPhoto')
      .set('Content-Type', 'multipart/form-data')
      .attach("userPhoto", fileDiretory)

    console.log(response.body);

    expect(response.status).toBe(400)
    expect(response.body).toBe('Size exceeded, maximum size is 350MB')
  })
})
