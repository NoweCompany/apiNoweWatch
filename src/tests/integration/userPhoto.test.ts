import app from '../../app';
import prismaClient from '../../database/prismaClient';
import { UserDataBase } from '../../interfaces/UserInterface';

import request from 'supertest';
import { resolve } from 'path';

let server: any

const userData = {
  name: "João Silva",
  password: "senha123",
  email: `joao.silva@example.com`,
  birth_date: "1990-01-01",
  city: "Campinas",
  country: "Brasil",
  gender: "male",
  state: "SP",
  username: `joaosilva`,
}

describe("Test' UserPhoto", () => {
  let user: UserDataBase
  let token = ''
  beforeAll(async () => {
    const port = process.env.PORT ?? 3300

    server = app.listen(port, () => {
      console.log(`Server is running: http://localhost:${port}`)
    })

    const { body: bodyUser } = await request(app).post('/users').send(userData)
    const { body: bodyToken } = await request(app).post('/token').send({
      userIdentification: userData.email,
      password: userData.password
    })
    token = bodyToken.token
    user = bodyUser
  })
  afterAll(async () => {
    await prismaClient.photo.deleteMany({})
    await prismaClient.users.deleteMany({})
    server.close()
  })

  it('must create a photo linked to a user', async () => {
    const fileDiretoryImg = resolve(__dirname, '..', 'assets', 'img', '96kb.jpg')

    const response = await request(app)
      .post('/usersPhoto')
      .set('Content-Type', 'multipart/form-data')
      .set('authorization', `Bearer ${token}`)
      .attach("userPhoto", fileDiretoryImg)


    expect(response.status).toBe(200)
  })

  // it('must be returned an error message', async () => {
  //   const fileDiretory = resolve(__dirname, '..', 'assets', 'img', '1.117kb.jpg')

  //   const response = await request(app)
  //     .post('/usersPhoto')
  //     .set('Content-Type', 'multipart/form-data')
  //     .attach("userPhoto", fileDiretory)

  //   console.log(response.body);

  //   expect(response.status).toBe(400)
  //   expect(response.body).toBe('Size exceeded, maximum size is 350MB')
  // })
})
