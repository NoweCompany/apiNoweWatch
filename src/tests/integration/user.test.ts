import app from '../../app';
import request from 'supertest';
import { randomUUID } from 'crypto';

import prismaClient from '../../database/prismaClient';

describe("Test' User", () => {

  beforeEach(() => {

  })

  afterEach(async () => {
    await prismaClient.users.deleteMany({})
  });

  it('Should creat an user in database', async () => {

    const user = {
      name: "João Silva",
      password: "senha123",
      email: `joao.silva${randomUUID()}@example.com`,
      birth_date: "1990-01-01",
      city: "Campinas",
      country: "Brasil",
      gender: "male",
      state: "SP",
      username: `joaosilva${randomUUID()}`
    }
    const response = await request(app).post('/users').send(user)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: user.name,
      email: user.email,
      username: user.username
    })
  })
})
