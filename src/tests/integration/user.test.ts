import app from '../../app';
import request from 'supertest';
import prismaClient from '../../database/prismaClient';

describe("Test' User", () => {
  let userId = 0
  beforeEach(() => {

  })

  afterEach(async () => {
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany({})
  })
  it('Should create a user in database', async () => {

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
    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: user.name,
      email: user.email,
      username: user.username,
      birth_date: "1990-01-01T00:00:00.000Z",
      city: "Campinas",
      country: "Brasil",
      gender: "male",
      state: "SP",
    })

    userId = response.body.id
  })

  it('Should list one users in database', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body).toEqual([{
      id: expect.any(Number),
      name: "João Silva",
      email: `joao.silva@example.com`,
      birth_date: "1990-01-01T00:00:00.000Z",
      city: "Campinas",
      country: "Brasil",
      gender: "male",
      photo: [],
      state: "SP",
      username: `joaosilva`
    }])
  })

  it('Should be retuned 200 and updated user', async () =>{
    const user = {
      name: "Edited",
      email: `Edited@Edited.com`,
    }
    const response = await request(app).put(`/users/${userId}`).send(user)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      name: user.name,
      email: user.email
    })
  })

  it('Shoul be retuned 400 with a message of error', async () =>{
    const user = {
      id: 0,
      name: "Edited",
      email: `Edited@Edited.com`,
    }
    const response = await request(app).put(`/users/${userId}`).send(user)

    expect(response.status).toBe(400)
    expect(response.body).toEqual({error: 'Validation error, sent parameters are invalid!'})
  })

  it('user should be inactved, status 200', async () => {
    const response = await request(app).delete(`/users/${userId}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeNull()
  })

  it('should list only active users', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(0)
    expect(response.body).toEqual([])
  })
})
