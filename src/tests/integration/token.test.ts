import app from '../../app';
import request from 'supertest';
import prismaClient from '../../database/prismaClient';

const user = {
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

describe("Test Token", () => {
  beforeAll(async () => {
    await request(app).post('/users').send(user)
  })

  afterAll(async () => {
    await prismaClient.users.deleteMany({})
  })

  it('Should be returned an error, "invalid user"', async () => {
    const response = await request(app).post('/token').send({
      userIdentification: 'fulano@gmail.com',
      password: 'senhaQualquer'
    })

    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'User invalid, not exist, register fulano@gmail.com to realize login.'
    })
  })

  it('Should be retuned an token', async () => {
    const response = await request(app).post('/token').send({
      userIdentification: 'joao.silva@example.com',
      password: 'senha123'
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      birth_date: "1990-01-01T00:00:00.000Z",
      city: user.city,
      country: user.country,
      email: user.email,
      gender: user.gender,
      id: expect.any(Number),
      name: user.name,
      state: user.state,
      token: expect.any(String),
      username: user.username,
    })
  })
})
